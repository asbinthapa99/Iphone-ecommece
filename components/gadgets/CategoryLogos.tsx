// Brand & device logos — all using <img> tags pointing to /public/logos/
// SVG files: simpleicons.org (CC0) + custom device outlines

interface LogoProps {
  size?: number
}

/* eslint-disable @next/next/no-img-element */

export function IPhoneLogo({ size = 52 }: LogoProps) {
  return <img src="/logos/iphone.svg" width={size} height={size} alt="iPhone" loading="lazy" style={{ objectFit: 'contain' }} />
}

export function AppleLogo({ size = 52 }: LogoProps) {
  return <img src="/logos/apple.svg" width={size} height={size} alt="Apple" loading="lazy" style={{ objectFit: 'contain' }} />
}

export function MacBookLogo({ size = 52 }: LogoProps) {
  return <img src="/logos/macbook.svg" width={size} height={size} alt="MacBook" loading="lazy" style={{ objectFit: 'contain' }} />
}

export function IPadLogo({ size = 52 }: LogoProps) {
  return <img src="/logos/ipad.svg" width={size} height={size} alt="iPad" loading="lazy" style={{ objectFit: 'contain' }} />
}

export function AndroidLogo({ size = 52 }: LogoProps) {
  return <img src="/logos/android.svg" width={size} height={size} alt="Android" loading="lazy" style={{ objectFit: 'contain' }} />
}

export function WindowsLogo({ size = 52 }: LogoProps) {
  return <img src="/logos/windows.svg" width={size} height={size} alt="Windows" loading="lazy" style={{ objectFit: 'contain' }} />
}

export function PlayStationLogo({ size = 52 }: LogoProps) {
  return <img src="/logos/playstation.svg" width={size} height={size} alt="PlayStation" loading="lazy" style={{ objectFit: 'contain' }} />
}

export function AirPodsLogo({ size = 52 }: LogoProps) {
  return <img src="/logos/airpods.svg" width={size} height={size} alt="AirPods" loading="lazy" style={{ objectFit: 'contain' }} />
}

export function DealsLogo({ size = 52 }: LogoProps) {
  return <img src="/logos/deals.svg" width={size} height={size} alt="Deals" loading="lazy" style={{ objectFit: 'contain' }} />
}
