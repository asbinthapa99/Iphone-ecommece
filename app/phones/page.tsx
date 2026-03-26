import type { Metadata } from 'next'
import { PhonesBrowse } from '@/components/phones/PhonesBrowse'
import { categoryTitle, categoryDescription, CATEGORY_SEO, SITE_URL } from '@/lib/seo'
import { getAvailableDevices } from '@/lib/devices'

export async function generateMetadata(): Promise<Metadata> {
  const iphoneDevices = await getAvailableDevices('iphone')
  const title = categoryTitle('iphone', iphoneDevices.length)
  const description = categoryDescription('iphone', iphoneDevices)
  return {
    title,
    description,
    keywords: CATEGORY_SEO.iphone.keywords.join(', '),
    alternates: { canonical: `${SITE_URL}/phones` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/phones`,
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

export default function PhonesPage() {
  const collectionLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Used iPhones in Nepal',
    url: `${SITE_URL}/phones`,
  }
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Phones', item: `${SITE_URL}/phones` },
    ],
  }

  return (
    <main style={{ background: '#ffffff', minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <PhonesBrowse />
    </main>
  )
}
