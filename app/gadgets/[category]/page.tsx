import type { Metadata } from 'next'
import { CategoryBrowse, SLUG_TO_CATEGORY, CATEGORY_LABELS } from '@/components/gadgets/CategoryBrowse'
import { categoryTitle, categoryDescription, CATEGORY_SEO, SITE_URL } from '@/lib/seo'
import type { ProductCategory } from '@/types'
import { getAvailableDevices } from '@/lib/devices'

const SLUG_HREFS: Record<string, string> = {
  macbook: '/gadgets/macbook',
  ipad: '/gadgets/ipad',
  audio: '/gadgets/audio',
  android: '/gadgets/android',
  windows: '/gadgets/windows',
  consoles: '/gadgets/consoles',
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>
}): Promise<Metadata> {
  const { category: slug } = await params
  const productCategory = SLUG_TO_CATEGORY[slug]
  const label = CATEGORY_LABELS[slug] ?? slug

  if (!productCategory || productCategory === 'deals') {
    return {
      title: `${label} | Inexa Nepal`,
      description: `Browse verified ${label.toLowerCase()} in Nepal. All inspected, 6-month warranty.`,
    }
  }

  const devices = await getAvailableDevices(productCategory as ProductCategory)
  const title = categoryTitle(productCategory as ProductCategory, devices.length)
  const description = categoryDescription(productCategory as ProductCategory, devices)
  const keywords = CATEGORY_SEO[productCategory as ProductCategory]?.keywords.join(', ') ?? ''
  const url = `${SITE_URL}${SLUG_HREFS[slug] ?? `/gadgets/${slug}`}`

  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Inexa Nepal',
      type: 'website',
      locale: 'en_NP',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export default async function GadgetCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category: slug } = await params
  const label = CATEGORY_LABELS[slug] ?? (slug.charAt(0).toUpperCase() + slug.slice(1))
  const href = SLUG_HREFS[slug] ?? `/gadgets/${slug}`

  const collectionLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${label} in Nepal`,
    url: `${SITE_URL}${href}`,
  }
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Gadgets', item: `${SITE_URL}/gadgets` },
      { '@type': 'ListItem', position: 3, name: label, item: `${SITE_URL}${href}` },
    ],
  }

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <CategoryBrowse slug={slug} />
    </main>
  )
}
