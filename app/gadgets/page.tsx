import { GadgetCategoryCard } from '@/components/gadgets/GadgetCategoryCard'
import { IPhoneLogo, MacBookLogo, IPadLogo, AndroidLogo, WindowsLogo, PlayStationLogo, AirPodsLogo, DealsLogo } from '@/components/gadgets/CategoryLogos'
import { MOCK_DEVICES } from '@/lib/mock-data'
import { categoryTitle, SITE_URL } from '@/lib/seo'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: categoryTitle('other', 0).replace('Buy Used Gadgets', 'Shop All Gadgets'),
  description: 'Shop verified used iPhones, MacBooks, iPads, AirPods, Android phones, Windows laptops & gaming consoles in Nepal. All inspected, IMEI checked, 6-month warranty.',
  alternates: { canonical: `${SITE_URL}/gadgets` },
  openGraph: { url: `${SITE_URL}/gadgets`, siteName: 'Inexa Nepal', type: 'website', locale: 'en_NP' },
}

function countCategory(category: string) {
  return MOCK_DEVICES.filter((d) => d.category === category).length
}
function countDeals() {
  return MOCK_DEVICES.filter((d) => d.originalPrice != null && d.originalPrice > d.price).length
}

const CATEGORIES = [
  {
    name: 'Great Deals',
    href: '/gadgets/deals',
    logo: <DealsLogo size={52} />,
    count: countDeals(),
  },
  {
    name: 'iPhone',
    href: '/phones',
    logo: <IPhoneLogo size={52} />,
    count: countCategory('iphone'),
  },
  {
    name: 'MacBook',
    href: '/gadgets/macbook',
    logo: <MacBookLogo size={52} />,
    count: countCategory('macbook'),
  },
  {
    name: 'iPad',
    href: '/gadgets/ipad',
    logo: <IPadLogo size={52} />,
    count: countCategory('ipad'),
  },
  {
    name: 'Gaming Consoles',
    href: '/gadgets/consoles',
    logo: <PlayStationLogo size={52} />,
    count: countCategory('console'),
  },
  {
    name: 'Android Phones',
    href: '/gadgets/android',
    logo: <AndroidLogo size={52} />,
    count: countCategory('android'),
  },
  {
    name: 'Windows Laptops',
    href: '/gadgets/windows',
    logo: <WindowsLogo size={52} />,
    count: countCategory('windows'),
  },
  {
    name: 'AirPods & Audio',
    href: '/gadgets/audio',
    logo: <AirPodsLogo size={52} />,
    count: countCategory('airpods'),
  },
]

export default function GadgetsPage() {
  return (
    <main className="min-h-screen pt-6 md:pt-36 pb-24 bg-[#fcfcfc]">
      <div className="max-w-[1200px] mx-auto px-6">
        <h1 className="text-[28px] md:text-[32px] font-medium text-[#060d0a] tracking-tight mb-8">
          Shop our most wanted
        </h1>

        {/* 4x2 Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {CATEGORIES.map((cat) => (
            <GadgetCategoryCard key={cat.name} {...cat} />
          ))}
        </div>
      </div>
    </main>
  )
}
