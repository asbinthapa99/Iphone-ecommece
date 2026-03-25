import type { MetadataRoute } from 'next'
import { MOCK_DEVICES } from '@/lib/mock-data'
import { SITE_URL } from '@/lib/seo'

const STATIC_PAGES: { url: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
  { url: '/', priority: 1.0, changeFrequency: 'daily' },
  { url: '/phones', priority: 0.9, changeFrequency: 'daily' },
  { url: '/gadgets', priority: 0.8, changeFrequency: 'weekly' },
  { url: '/gadgets/macbook', priority: 0.8, changeFrequency: 'daily' },
  { url: '/gadgets/ipad', priority: 0.8, changeFrequency: 'daily' },
  { url: '/gadgets/audio', priority: 0.7, changeFrequency: 'daily' },
  { url: '/gadgets/android', priority: 0.7, changeFrequency: 'daily' },
  { url: '/gadgets/windows', priority: 0.7, changeFrequency: 'daily' },
  { url: '/gadgets/consoles', priority: 0.6, changeFrequency: 'weekly' },
  { url: '/gadgets/deals', priority: 0.8, changeFrequency: 'daily' },
  { url: '/sell', priority: 0.6, changeFrequency: 'monthly' },
  { url: '/about', priority: 0.4, changeFrequency: 'monthly' },
  { url: '/contact', priority: 0.4, changeFrequency: 'monthly' },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticEntries: MetadataRoute.Sitemap = STATIC_PAGES.map(({ url, priority, changeFrequency }) => ({
    url: `${SITE_URL}${url}`,
    lastModified: now,
    changeFrequency,
    priority,
  }))

  const productEntries: MetadataRoute.Sitemap = MOCK_DEVICES
    .filter((d) => d.status === 'available')
    .map((d) => ({
      url: `${SITE_URL}/phones/${d.id}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

  return [...staticEntries, ...productEntries]
}
