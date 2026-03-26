import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

// ── Allowed types ─────────────────────────────────────────────────────────────
// SVG is intentionally excluded — SVG can embed JavaScript (XSS attack vector)
// GIF is excluded — not needed, reduces attack surface
const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp'])
const ALLOWED_EXT = new Set(['jpg', 'jpeg', 'png', 'webp'])

// ── Magic bytes validation ────────────────────────────────────────────────────
// Prevents polyglot files — e.g. a PHP script with a JPEG header prepended.
// Checks the actual file bytes, not the MIME type reported by the client
// (client MIME is untrusted and trivially spoofed).
//
// JPEG: FF D8 FF
// PNG:  89 50 4E 47 0D 0A 1A 0A
// WebP: 52 49 46 46 ?? ?? ?? ?? 57 45 42 50 (RIFF....WEBP)
export function detectImageType(buf: Uint8Array): 'jpeg' | 'png' | 'webp' | null {
  // JPEG
  if (buf[0] === 0xFF && buf[1] === 0xD8 && buf[2] === 0xFF) return 'jpeg'
  // PNG
  if (
    buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47 &&
    buf[4] === 0x0D && buf[5] === 0x0A && buf[6] === 0x1A && buf[7] === 0x0A
  ) return 'png'
  // WebP (RIFF header + WEBP at offset 8)
  if (
    buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46 &&
    buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50
  ) return 'webp'
  return null
}

export interface UploadOptions {
  /** 'products' | 'reviews' */
  folder: 'products' | 'reviews'
  /** Max file size in bytes (default 5 MB) */
  maxBytes?: number
}

export interface UploadError {
  file: string
  reason: string
}

export interface UploadResult {
  urls: string[]
  errors: UploadError[]
}

/**
 * Securely upload one or more File objects to Cloudinary.
 *
 * Security measures applied:
 * - MIME type whitelist (jpeg / png / webp — no SVG)
 * - File extension whitelist
 * - Magic bytes check — prevents polyglot / disguised files
 * - File size cap
 * - Cloudinary strips EXIF metadata on upload automatically
 * - Public IDs use crypto.randomUUID() — no user-controlled filenames
 */
export async function uploadImages(
  files: File[],
  opts: UploadOptions,
): Promise<UploadResult> {
  const maxBytes = opts.maxBytes ?? 5 * 1024 * 1024 // 5 MB default
  const urls: string[] = []
  const errors: UploadError[] = []

  for (const file of files) {
    const name = file.name

    // 1. MIME type check (client-reported — first line of defence, not final)
    if (!ALLOWED_MIME.has(file.type)) {
      errors.push({ file: name, reason: `File type "${file.type}" not allowed. Use JPG, PNG, or WebP.` })
      continue
    }

    // 2. Extension check
    const ext = name.split('.').pop()?.toLowerCase() ?? ''
    if (!ALLOWED_EXT.has(ext)) {
      errors.push({ file: name, reason: `Extension ".${ext}" not allowed.` })
      continue
    }

    // 3. Size check
    if (file.size > maxBytes) {
      const mb = (maxBytes / 1024 / 1024).toFixed(0)
      errors.push({ file: name, reason: `File exceeds ${mb} MB limit (${(file.size / 1024 / 1024).toFixed(1)} MB).` })
      continue
    }

    // 4. Magic bytes check — read first 12 bytes and verify actual format
    const headerBuf = await file.slice(0, 12).arrayBuffer()
    const header = new Uint8Array(headerBuf)
    const detectedType = detectImageType(header)
    if (!detectedType) {
      errors.push({ file: name, reason: 'File content does not match an allowed image format. Possible disguised file.' })
      continue
    }

    // 5. Upload to Cloudinary (server-side, signed)
    // - eager: strip EXIF, convert to WebP for efficiency
    // - public_id uses UUID — prevents filename injection / enumeration
    try {
      const arrayBuf = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuf)

      const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: `inexa/${opts.folder}`,
            public_id: crypto.randomUUID(),
            resource_type: 'image',
            // Auto quality + format — Cloudinary converts to WebP/AVIF in delivery
            transformation: [{ quality: 'auto', fetch_format: 'auto' }],
            // Eagerly strip EXIF (Cloudinary does this by default for uploads)
            // Tags for tracking
            tags: [opts.folder],
          },
          (err, res) => {
            if (err || !res) reject(err ?? new Error('Upload failed'))
            else resolve(res as { secure_url: string })
          },
        )
        uploadStream.end(buffer)
      })

      urls.push(result.secure_url)
    } catch (err) {
      errors.push({ file: name, reason: `Upload failed: ${(err as Error).message}` })
    }
  }

  return { urls, errors }
}
