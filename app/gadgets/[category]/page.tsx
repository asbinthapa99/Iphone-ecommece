import type { Metadata } from 'next'
import { CategoryBrowse, SLUG_TO_CATEGORY, CATEGORY_LABELS } from '@/components/gadgets/CategoryBrowse'
import { MOCK_DEVICES } from '@/lib/mock-data'
import { categoryTitle, categoryDescription, CATEGORY_SEO, SITE_URL } from '@/lib/seo'
import type { ProductCategory } from '@/types'

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

  const devices = MOCK_DEVICES.filter((d) => d.category === productCategory)
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
  return <CategoryBrowse slug={slug} />
}
