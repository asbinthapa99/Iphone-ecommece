import type { ProductCategory } from '@/types'

export const CATEGORIES: Array<{ value: ProductCategory; label: string }> = [
  { value: 'iphone',  label: 'iPhone' },
  { value: 'macbook', label: 'MacBook' },
  { value: 'ipad',    label: 'iPad' },
  { value: 'airpods', label: 'AirPods & Audio' },
  { value: 'android', label: 'Android Phone' },
  { value: 'windows', label: 'Windows Laptop' },
  { value: 'console', label: 'Gaming Console' },
  { value: 'other',   label: 'Other' },
]

export const MODELS_BY_CATEGORY: Record<string, string[]> = {
  iphone: [
    'iPhone 16 Pro Max','iPhone 16 Pro','iPhone 16 Plus','iPhone 16',
    'iPhone 15 Pro Max','iPhone 15 Pro','iPhone 15 Plus','iPhone 15',
    'iPhone 14 Pro Max','iPhone 14 Pro','iPhone 14 Plus','iPhone 14',
    'iPhone 13 Pro Max','iPhone 13 Pro','iPhone 13','iPhone 13 mini',
    'iPhone 12 Pro Max','iPhone 12 Pro','iPhone 12','iPhone 12 mini',
    'iPhone 11 Pro Max','iPhone 11 Pro','iPhone 11',
    'iPhone XS Max','iPhone XS','iPhone XR','iPhone X',
    'iPhone 8 Plus','iPhone 8','iPhone 7 Plus','iPhone 7',
    'iPhone SE (3rd gen)','iPhone SE (2nd gen)',
  ],
  macbook: ['MacBook Pro 16"','MacBook Pro 14"','MacBook Pro 13"','MacBook Air 15"','MacBook Air 13"'],
  ipad:    ['iPad Pro 12.9"','iPad Pro 11"','iPad Air','iPad mini','iPad (10th gen)','iPad (9th gen)'],
  airpods: ['AirPods Pro 2nd Gen','AirPods 4th Gen','AirPods 3rd Gen','AirPods Max','AirPods 2nd Gen','Beats Studio Pro','Beats Fit Pro'],
  android: ['Samsung Galaxy S24 Ultra','Samsung Galaxy S24+','Samsung Galaxy S24','Samsung Galaxy S23','Samsung Galaxy A54','Google Pixel 8 Pro','Google Pixel 8','OnePlus 12'],
  windows: ['Dell XPS 13','Dell XPS 15','HP Spectre x360','HP Envy','Lenovo ThinkPad X1','Lenovo IdeaPad','ASUS ZenBook','Microsoft Surface Pro'],
  console: ['PlayStation 5','PlayStation 5 Slim','Xbox Series X','Xbox Series S','Nintendo Switch OLED','Nintendo Switch','Nintendo Switch Lite'],
  other:   [],
}

export const STORAGE_OPTIONS = ['—','32GB','64GB','128GB','256GB','512GB','1TB','2TB SSD','256GB SSD','512GB SSD','1TB SSD']
export const COLORS = ['Black','White','Silver','Space Gray','Midnight','Starlight','Blue','Green','Red','Purple','Gold','Pink','Natural Titanium','Black Titanium']
