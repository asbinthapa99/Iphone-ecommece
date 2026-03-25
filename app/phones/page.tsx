import type { Metadata } from 'next'
import { PhonesBrowse } from '@/components/phones/PhonesBrowse'
import { MOCK_DEVICES } from '@/lib/mock-data'
import { categoryTitle, categoryDescription, CATEGORY_SEO, SITE_URL } from '@/lib/seo'

const iphoneDevices = MOCK_DEVICES.filter((d) => d.category === 'iphone')

export const metadata: Metadata = {
  title: categoryTitle('iphone', iphoneDevices.length),
  description: categoryDescription('iphone', iphoneDevices),
  keywords: CATEGORY_SEO.iphone.keywords.join(', '),
  alternates: { canonical: `${SITE_URL}/phones` },
  openGraph: {
    title: categoryTitle('iphone', iphoneDevices.length),
    description: categoryDescription('iphone', iphoneDevices),
    url: `${SITE_URL}/phones`,
    siteName: 'Inexa Nepal',
    type: 'website',
    locale: 'en_NP',
  },
  twitter: {
    card: 'summary_large_image',
    title: categoryTitle('iphone', iphoneDevices.length),
    description: categoryDescription('iphone', iphoneDevices),
  },
}

export default function PhonesPage() {
  return (
    <main style={{ background: '#ffffff', minHeight: '100vh' }}>
      <PhonesBrowse />
    </main>
  )
}
