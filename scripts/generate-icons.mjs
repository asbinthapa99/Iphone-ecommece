// Run: node scripts/generate-icons.mjs
import sharp from 'sharp'

function svgIcon(size) {
  const r = Math.round(size * 0.22)
  const cx = size / 2
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${r}" fill="#060d0a"/>
  <text x="${cx}" y="${cx + size * 0.15}" text-anchor="middle" dominant-baseline="middle"
    font-family="Arial, sans-serif" font-weight="900" font-size="${size * 0.38}"
    fill="#1D9E75">Ix</text>
</svg>`)
}

await sharp(svgIcon(192)).png().toFile('public/icon-192.png')
await sharp(svgIcon(512)).png().toFile('public/icon-512.png')
// Apple touch icon (180x180)
await sharp(svgIcon(180)).png().toFile('public/apple-touch-icon.png')

console.log('✅ Icons generated: icon-192.png, icon-512.png, apple-touch-icon.png')
