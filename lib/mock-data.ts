import { Device, ProductCategory } from '@/types'

type D = Omit<Device, 'imei' | 'imeiStatus' | 'icloudLocked' | 'createdAt'> & {
  imei: string; imeiStatus: 'clean' | 'blocked' | 'stolen' | 'unknown'; icloudLocked: boolean; createdAt: string
}

const img = (name: string) =>
  `https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/${name}`

const placeholder = 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=400&q=80'
const mbPlaceholder = 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80'
const ipadPlaceholder = 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&q=80'
const audioPlaceholder = 'https://images.unsplash.com/photo-1588423771073-b8903fead85b?w=400&q=80'
const androidPlaceholder = 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&q=80'
const laptopPlaceholder = 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80'
const consolePlaceholder = 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&q=80'

function d(id: string, category: ProductCategory, model: string, storage: string, color: string, grade: 'A'|'B'|'C', battery: number, price: number, origPrice: number, photo: string, desc: string): D {
  return {
    id, category, model, storage, color, grade,
    batteryHealth: battery, price, originalPrice: origPrice,
    imei: `35345678${id.padStart(7,'0')}`, imeiStatus: 'clean', icloudLocked: false,
    status: 'available', photos: [photo, placeholder, placeholder],
    description: desc, createdAt: '2024-01-15'
  }
}

export const MOCK_DEVICES: Device[] = [
  // ── iPhone 6 series ────────────────────────────────────────────────────────
  d('10','iphone','iPhone 6s','32GB','Space Gray','C',68,11000,49900,placeholder,'Working condition. Minor scratches. Home button works.'),
  d('11','iphone','iPhone 6s Plus','32GB','Gold','C',71,13000,59900,placeholder,'6s Plus in working condition. Battery replaced.'),
  d('12','iphone','iPhone 6s','64GB','Rose Gold','B',76,13500,54900,placeholder,'Good condition, all functions work.'),

  // ── iPhone 7 series ────────────────────────────────────────────────────────
  d('13','iphone','iPhone 7','32GB','Jet Black','B',78,16000,59900,placeholder,'Water resistant. No headphone jack. Good condition.'),
  d('14','iphone','iPhone 7 Plus','32GB','Black','B',75,20000,69900,placeholder,'Dual camera, great portrait mode. Battery at 75%.'),
  d('15','iphone','iPhone 7','128GB','Silver','A',82,18500,64900,placeholder,'Great condition, A10 chip still runs well.'),

  // ── iPhone 8 series ────────────────────────────────────────────────────────
  d('16','iphone','iPhone 8','64GB','Space Gray','B',80,21000,69900,placeholder,'Glass back, wireless charging. Good condition.'),
  d('17','iphone','iPhone 8 Plus','64GB','Gold','A',84,26000,79900,placeholder,'Dual camera, portrait lighting. Excellent condition.'),
  d('18','iphone','iPhone 8','256GB','Silver','A',86,24000,74900,placeholder,'Plenty of storage. Barely used.'),

  // ── iPhone X ──────────────────────────────────────────────────────────────
  d('19','iphone','iPhone X','64GB','Space Gray','B',79,27000,99900,placeholder,'First Face ID iPhone. OLED display. Light wear.'),
  d('20','iphone','iPhone X','256GB','Silver','A',83,31000,109900,placeholder,'256GB X in excellent shape. All sensors work perfectly.'),

  // ── iPhone XS / XR series ─────────────────────────────────────────────────
  d('21','iphone','iPhone XS','64GB','Gold','A',85,34000,109900,placeholder,'Super Retina display, dual camera. Grade A.'),
  d('22','iphone','iPhone XS Max','256GB','Space Gray','A',88,44000,129900,placeholder,'Largest XS display. Excellent condition, full box.'),
  d('23','iphone','iPhone XR','64GB','Coral','B',81,27000,84900,placeholder,'Liquid Retina LCD. Great battery life. Minor scuffs.'),
  d('24','iphone','iPhone XR','128GB','Blue','A',87,30000,89900,placeholder,'Vivid blue. Grade A condition, battery replaced.'),

  // ── iPhone 11 series ──────────────────────────────────────────────────────
  d('25','iphone','iPhone 11','64GB','Purple','A',88,34000,84900,img('iphone-11-purple-select-2019'),'Dual camera, Night Mode. Grade A — no scratches.'),
  d('26','iphone','iPhone 11','128GB','White','B',82,32000,84900,img('iphone-11-white-select-2019'),'Great condition. Minor hairline on back. All functions perfect.'),
  d('27','iphone','iPhone 11 Pro','64GB','Midnight Green','A',86,46000,119900,img('iphone-11-pro-midnight-green-select-2019'),'Triple camera system. ProMotion-ready. Grade A.'),
  d('28','iphone','iPhone 11 Pro Max','256GB','Space Gray','A',89,54000,129900,img('iphone-11-pro-max-space-gray-select-2019'),'Largest 11 display. Excellent battery life. Full box.'),

  // ── iPhone 12 series ──────────────────────────────────────────────────────
  d('5','iphone','iPhone 12','64GB','Product Red','B',82,29000,69900,img('iphone-12-red-select-2020?wid=800'),'Good condition. Light wear on edges. 5G capable.'),
  d('29','iphone','iPhone 12 Mini','64GB','Blue','A',84,27000,64900,img('iphone-12-blue-select-2020?wid=800'),'Compact form factor, 5G. Barely used.'),
  d('30','iphone','iPhone 12 Pro','128GB','Pacific Blue','A',87,52000,109900,img('iphone-12-pro-pacific-blue-select-2020?wid=800'),'Triple camera, LiDAR. Grade A — full accessories.'),
  d('31','iphone','iPhone 12 Pro Max','256GB','Gold','A',91,62000,129900,img('iphone-12-pro-gold-select-2020?wid=800'),'Largest 12 display, sensor-shift OIS. Pristine.'),

  // ── iPhone 13 series ──────────────────────────────────────────────────────
  d('3','iphone','iPhone 13','128GB','Starlight','B',84,38000,79900,img('iphone-13-starlight-select-2021'),'Minor hairline scratches on screen. All functions perfect.'),
  d('32','iphone','iPhone 13 Mini','128GB','Midnight','A',86,36000,74900,img('iphone-13-midnight-select-2021'),'Compact A15 powerhouse. Grade A condition.'),
  d('4','iphone','iPhone 13 Pro','256GB','Sierra Blue','A',89,72000,119900,img('iphone-13-pro-sierablue-select'),'Grade A condition. ProMotion display, triple camera.'),
  d('33','iphone','iPhone 13 Pro Max','256GB','Alpine Green','A',90,84000,134900,img('iphone-13-pro-green-select'),'Biggest 13 screen. Excellent battery. Full box.'),

  // ── iPhone 14 series ──────────────────────────────────────────────────────
  d('2','iphone','iPhone 14','128GB','Midnight','A',91,68000,109900,img('iphone-14-midnight-select-202209?wid=800'),'Like new, no scratches. Used for 4 months.'),
  d('34','iphone','iPhone 14 Plus','128GB','Starlight','A',92,82000,124900,img('iphone-14-plus-starlight-select-202209?wid=800'),'Large display, incredible battery life. Grade A.'),
  d('7','iphone','iPhone 14 Pro','256GB','Deep Purple','A',93,95000,149900,img('iphone-14-pro-deeppurple-select-202209?wid=800'),'Dynamic Island, 48MP camera, ProMotion. Excellent condition.'),
  d('35','iphone','iPhone 14 Pro Max','256GB','Space Black','A',94,110000,164900,img('iphone-14-pro-spaceblack-select-202209?wid=800'),'Top-of-line 14. Space Black titanium. Pristine.'),

  // ── iPhone 15 series ──────────────────────────────────────────────────────
  d('6','iphone','iPhone 15','128GB','Blue','A',99,88000,109900,img('iphone-15-blue-select-202309?wid=800'),'Barely used. USB-C, Dynamic Island.'),
  d('36','iphone','iPhone 15 Plus','128GB','Yellow','A',98,102000,124900,img('iphone-15-yellow-select-202309?wid=800'),'Large display, USB-C. Grade A — like new.'),
  d('1','iphone','iPhone 15 Pro','256GB','Natural Titanium','A',97,128000,149900,img('iphone-15-pro-naturaltitanium-select-202309?wid=800'),'Pristine condition, barely used. Full box with accessories.'),
  d('37','iphone','iPhone 15 Pro Max','256GB','Black Titanium','A',97,148000,174900,img('iphone-15-pro-blacktitanium-select-202309?wid=800'),'5x tetraprism zoom. Top tier. Full accessories.'),

  // ── iPhone 16 series ──────────────────────────────────────────────────────
  d('38','iphone','iPhone 16','128GB','Teal','A',100,112000,119900,placeholder,'Brand new in box. Camera Control button. Sealed.'),
  d('39','iphone','iPhone 16 Plus','128GB','Ultramarine','A',100,126000,134900,placeholder,'Unopened. USB-C, A18 chip. Grade A.'),
  d('40','iphone','iPhone 16 Pro','256GB','Desert Titanium','A',100,148000,159900,placeholder,'A18 Pro, 4K 120fps ProRes. Brand new.'),
  d('41','iphone','iPhone 16 Pro Max','256GB','Black Titanium','A',100,166000,179900,placeholder,'Latest flagship. 5x zoom, A18 Pro. Sealed box.'),

  // ── iPhone SE ─────────────────────────────────────────────────────────────
  d('8','iphone','iPhone SE','64GB','Black','B',80,20000,49900,img('iphone-se-black-select-202203?wid=800'),'Budget-friendly option. Touch ID, A15 chip.'),
  d('42','iphone','iPhone SE (3rd Gen)','128GB','Starlight','A',88,26000,54900,img('iphone-se-starlight-select-202203?wid=800'),'3rd gen SE — 5G, A15 Bionic. Like new.'),

  // ── MacBook ───────────────────────────────────────────────────────────────
  d('mb01','macbook','MacBook Pro 16" M3 Pro','512GB SSD','Space Black','A',95,225000,299900,mbPlaceholder,'M3 Pro chip, 18GB RAM. Barely used. Full box with charger.'),
  d('mb02','macbook','MacBook Pro 14" M3','256GB SSD','Silver','A',92,185000,249900,mbPlaceholder,'M3 chip, 8GB RAM. Grade A — no scratches, perfect screen.'),
  d('mb03','macbook','MacBook Air 15" M2','256GB SSD','Midnight','B',85,118000,169900,mbPlaceholder,'Large display Air. Light wear. All ports working.'),
  d('mb04','macbook','MacBook Air 13" M2','256GB SSD','Starlight','A',90,108000,149900,mbPlaceholder,'Ultra-thin M2 Air. Like new, minimal use.'),
  d('mb05','macbook','MacBook Air 13" M1','256GB SSD','Space Gray','B',78,88000,129900,mbPlaceholder,'M1 chip still blazing fast. Good condition. Battery service recommended.'),
  d('mb06','macbook','MacBook Pro 13" M2','512GB SSD','Space Gray','A',88,148000,199900,mbPlaceholder,'M2 Pro powerhouse. Touch Bar. Grade A condition.'),

  // ── iPad ─────────────────────────────────────────────────────────────────
  d('ip01','ipad','iPad Pro 12.9" M2','256GB','Space Gray','A',95,145000,189900,ipadPlaceholder,'M2 chip, Liquid Retina XDR. Perfect condition. Apple Pencil compatible.'),
  d('ip02','ipad','iPad Pro 11" M4','128GB','Silver','A',98,115000,149900,ipadPlaceholder,'Latest M4 iPad Pro. Ultra Retina XDR. Barely used.'),
  d('ip03','ipad','iPad Air 5th Gen','64GB','Blue','A',92,68000,89900,ipadPlaceholder,'M1 chip Air. Great for work and creativity. Grade A.'),
  d('ip04','ipad','iPad 10th Gen','64GB','Pink','B',88,45000,64900,ipadPlaceholder,'10th generation iPad. Good condition. Minor scratches on back.'),
  d('ip05','ipad','iPad mini 6th Gen','64GB','Purple','A',94,72000,94900,ipadPlaceholder,'Compact powerhouse. USB-C, 5G capable. Like new.'),

  // ── AirPods & Audio ──────────────────────────────────────────────────────
  d('ap01','airpods','AirPods Pro 2nd Gen','—','White','A',100,18000,32900,audioPlaceholder,'Active noise cancellation, Adaptive Audio. Like new in case.'),
  d('ap02','airpods','AirPods 4th Gen','—','White','A',100,14000,22900,audioPlaceholder,'Personalized Spatial Audio. Brand new sealed.'),
  d('ap03','airpods','AirPods 3rd Gen','—','White','B',90,10000,18900,audioPlaceholder,'Spatial Audio, MagSafe case. Good condition.'),
  d('ap04','airpods','AirPods Max','—','Silver','A',95,45000,79900,audioPlaceholder,'Over-ear, Active Noise Cancellation. Excellent condition. All accessories included.'),
  d('ap05','airpods','AirPods 2nd Gen','—','White','C',80,7500,14900,audioPlaceholder,'Classic AirPods. Working great. Minor case wear.'),
  d('ap06','airpods','Beats Studio Pro','—','Black','A',92,24000,44900,audioPlaceholder,'40-hour battery, ANC. Grade A condition.'),

  // ── Android Phones ────────────────────────────────────────────────────────
  d('an01','android','Samsung Galaxy S24 Ultra','256GB','Titanium Black','A',98,82000,109900,androidPlaceholder,'200MP camera, S Pen included. Like new.'),
  d('an02','android','Samsung Galaxy S24','128GB','Cobalt Violet','A',96,62000,84900,androidPlaceholder,'Snapdragon 8 Gen 3, bright display. Grade A.'),
  d('an03','android','Samsung Galaxy S23','128GB','Phantom Black','B',85,45000,69900,androidPlaceholder,'Good condition. Minor wear on edges. All functions perfect.'),
  d('an04','android','Samsung Galaxy A54','128GB','Awesome Violet','A',96,28000,44900,androidPlaceholder,'5G, 50MP OIS camera. Grade A — barely used.'),
  d('an05','android','Google Pixel 8 Pro','256GB','Bay','A',97,95000,124900,androidPlaceholder,'Google AI features, 50MP camera. Like new.'),
  d('an06','android','OnePlus 12','256GB','Flowy Emerald','A',99,75000,94900,androidPlaceholder,'Snapdragon 8 Gen 3, 100W charging. Brand new.'),

  // ── Windows Laptops ──────────────────────────────────────────────────────
  d('wl01','windows','Dell XPS 13','512GB SSD','Platinum Silver','A',90,125000,169900,laptopPlaceholder,'Intel Core i7, 16GB RAM. Grade A condition. Full accessories.'),
  d('wl02','windows','HP Spectre x360 14"','512GB SSD','Natural Silver','B',82,98000,139900,laptopPlaceholder,'2-in-1 touchscreen. Good condition. OLED display.'),
  d('wl03','windows','Lenovo ThinkPad X1 Carbon','512GB SSD','Black','A',88,115000,154900,laptopPlaceholder,'Business powerhouse. Grade A. Lightweight, great keyboard.'),
  d('wl04','windows','ASUS ZenBook 14','256GB SSD','Ponder Blue','A',92,72000,99900,laptopPlaceholder,'OLED display, compact. Like new with original box.'),
  d('wl05','windows','Microsoft Surface Pro 9','256GB SSD','Graphite','B',85,88000,124900,laptopPlaceholder,'2-in-1 tablet-laptop. Good condition. Type cover included.'),

  // ── Gaming Consoles ──────────────────────────────────────────────────────
  d('gc01','console','PlayStation 5','1TB','White','A',100,68000,84900,consolePlaceholder,'Disc edition. Full box with controller and cables. Like new.'),
  d('gc02','console','PlayStation 5 Slim','1TB','White','A',100,58000,74900,consolePlaceholder,'New slim design. Disc edition. Sealed box.'),
  d('gc03','console','Nintendo Switch OLED','64GB','White','A',95,38000,54900,consolePlaceholder,'OLED screen, dock included. Excellent condition. Full box.'),
  d('gc04','console','Nintendo Switch','32GB','Neon Red/Blue','B',88,28000,44900,consolePlaceholder,'Original Switch. Good condition. Joy-cons working perfectly.'),
  d('gc05','console','Xbox Series X','1TB','Black','A',98,62000,79900,consolePlaceholder,'4K gaming, 120fps. Like new. Controller and cables included.'),
  d('gc06','console','Xbox Series S','512GB','White','B',90,38000,54900,consolePlaceholder,'Compact all-digital console. Good condition. Full accessories.'),
]

export const INSPECTION_POINTS = [
  { key: 'imeiNtaCheck', label: 'IMEI + NTA Lookup' },
  { key: 'icloudStatus', label: 'iCloud Lock Status' },
  { key: 'batteryHealth', label: 'Battery Health' },
  { key: 'screenTouch', label: 'Screen Touch Test' },
  { key: 'faceIdTouchId', label: 'Face ID / Touch ID' },
  { key: 'frontCamera', label: 'Front Camera' },
  { key: 'rearCamera', label: 'Rear Camera' },
  { key: 'chargingPort', label: 'Charging Port' },
  { key: 'simTray', label: 'SIM Tray + Cellular' },
  { key: 'wifiBluetooth', label: 'WiFi + Bluetooth' },
  { key: 'physicalGrade', label: 'Physical Condition' },
  { key: 'factoryReset', label: 'Factory Reset Confirmed' },
]
