import type { Product, ProductDetail, BidEntry, FilterGroup } from '@/types/product'
import type {
  UserBid,
  UserOrder,
  UserAddress,
  UserNotification,
} from '@/types/dashboard'

// ---------------------------------------------------------------------------
// Image helpers — using picsum.photos with deterministic seeds
// ---------------------------------------------------------------------------

/** Listing card image (300x300) */
function img(seed: string, size = 300): string {
  return `https://picsum.photos/seed/${seed}/${size}/${size}`
}

/** Generate multiple gallery images for detail page */
function gallery(seed: string, count = 4): string[] {
  return Array.from({ length: count }, (_, i) =>
    `https://picsum.photos/seed/${seed}-${i}/600/600`
  )
}

/**
 * Condition ID to label mapping (Mercari standard)
 */
export const CONDITION_MAP: Record<string, string> = {
  '1': 'Brand New',
  '2': 'Like New',
  '3': 'Good',
  '4': 'Fair',
  '5': 'Poor',
  '6': 'For Parts',
}

/**
 * Emoji fallbacks for products without images
 */
export const EMOJI_FALLBACKS = [
  '📦', '👕', '📱', '🎮', '👟', '📚', '🎵', '🏠', '🚗', '⌚',
]

/**
 * Sidebar filter definitions
 */
export const FILTER_GROUPS: FilterGroup[] = [
  {
    id: 'category',
    label: 'Category',
    options: [
      { label: 'Electronics', value: 'electronics', count: 1240 },
      { label: 'Fashion', value: 'fashion', count: 890 },
      { label: 'Beauty', value: 'beauty', count: 560 },
      { label: 'Home & Living', value: 'home', count: 340 },
      { label: 'Toys & Games', value: 'toys', count: 280 },
      { label: 'Books & Media', value: 'books', count: 190 },
    ],
  },
  {
    id: 'brand',
    label: 'Brand',
    options: [
      { label: 'Nintendo', value: 'nintendo', count: 320 },
      { label: 'Sony', value: 'sony', count: 280 },
      { label: 'Shiseido', value: 'shiseido', count: 150 },
      { label: 'Uniqlo', value: 'uniqlo', count: 120 },
      { label: 'Muji', value: 'muji', count: 95 },
    ],
  },
  {
    id: 'size',
    label: 'Size',
    options: [
      { label: 'S', value: 's' },
      { label: 'M', value: 'm' },
      { label: 'L', value: 'l' },
      { label: 'XL', value: 'xl' },
      { label: 'Free Size', value: 'free' },
    ],
  },
  {
    id: 'condition',
    label: 'Item Condition',
    options: [
      { label: 'Brand New', value: '1' },
      { label: 'Like New', value: '2' },
      { label: 'Good', value: '3' },
      { label: 'Fair', value: '4' },
    ],
  },
  {
    id: 'price',
    label: 'Price',
    options: [
      { label: 'Under ¥1,000', value: '0-1000' },
      { label: '¥1,000 - ¥5,000', value: '1000-5000' },
      { label: '¥5,000 - ¥10,000', value: '5000-10000' },
      { label: '¥10,000 - ¥50,000', value: '10000-50000' },
      { label: 'Over ¥50,000', value: '50000+' },
    ],
  },
  {
    id: 'shipping',
    label: 'Shipping Method',
    options: [
      { label: 'EMS (Express)', value: 'ems' },
      { label: 'SAL (Economy)', value: 'sal' },
      { label: 'Surface (Slow)', value: 'surface' },
    ],
  },
]

// ---------------------------------------------------------------------------
// Helper: generate an endTimeISO relative to "now"
// ---------------------------------------------------------------------------
function hoursFromNow(hours: number): string {
  return new Date(Date.now() + hours * 3600_000).toISOString()
}

/**
 * Mock products for development
 * Most are auction items; a few (id 5, 10, 16, 18) are fixed-price.
 */
export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'D-UP パーフェクトエクステンションマスカラ ブラック',
    price: 650,
    imageUrl: img('mascara-black'),
    condition: 'Brand New',
    source: 'mercari',
    isAuction: true,
    bidCount: 2,
    endTimeISO: hoursFromNow(18),
  },
  {
    id: '2',
    name: 'D-UPシルキーリキッドアイライナー ブラウン',
    price: 1050,
    imageUrl: img('eyeliner-brown'),
    condition: 'Brand New',
    source: 'mercari',
    isAuction: true,
    bidCount: 1,
    endTimeISO: hoursFromNow(6),
  },
  {
    id: '3',
    name: 'dプログラム スキンケアトライアルセット 16包',
    price: 888,
    imageUrl: img('skincare-trial'),
    condition: 'Brand New',
    source: 'mercari',
    isAuction: true,
    bidCount: 3,
    endTimeISO: hoursFromNow(36),
  },
  {
    id: '4',
    name: 'd programバイタライジングクリーム敏感肌用 クリーム',
    price: 8000,
    imageUrl: img('moisturizer-cream'),
    condition: 'Like New',
    source: 'mercari',
    isAuction: true,
    bidCount: 5,
    endTimeISO: hoursFromNow(0.5),
  },
  {
    id: '5',
    name: 'D-UP ワンダーアイリッドテープ Extra',
    price: 999,
    imageUrl: img('eyelid-tape'),
    condition: 'Brand New',
    source: 'mercari',
    isAuction: false,
  },
  {
    id: '6',
    name: 'd program アレルバリアエッセンス BB N ライト',
    price: 2000,
    imageUrl: img('bb-cream-light'),
    condition: 'Brand New',
    source: 'mercari',
    isAuction: true,
    bidCount: 0,
    endTimeISO: hoursFromNow(48),
  },
  {
    id: '7',
    name: '♥2個♥ D-UP ワンダーアイリッドテープ Extra 120枚',
    price: 2099,
    imageUrl: img('eyelid-tape-pack'),
    condition: 'Brand New',
    source: 'mercari',
    isAuction: true,
    bidCount: 4,
    endTimeISO: hoursFromNow(12),
  },
  {
    id: '8',
    name: 'D-up シルキーリキッドアイライナー ピンクチョコ',
    price: 1690,
    imageUrl: img('eyeliner-pink'),
    condition: 'Like New',
    source: 'mercari',
    isAuction: true,
    bidCount: 2,
    endTimeISO: hoursFromNow(3),
  },
  {
    id: '9',
    name: '新品 dプログラム モイストケア ローション EX 化粧水',
    price: 4799,
    imageUrl: img('lotion-moist'),
    condition: 'Brand New',
    source: 'mercari',
    isAuction: true,
    bidCount: 1,
    endTimeISO: hoursFromNow(24),
  },
  {
    id: '10',
    name: 'd programバイタライジングクリーム敏感肌用 大容量',
    price: 8000,
    imageUrl: img('cream-large'),
    condition: 'Brand New',
    source: 'mercari',
    isAuction: false,
  },
  {
    id: '11',
    name: 'Nintendo Switch OLED ホワイト 本体 新品未使用',
    price: 38000,
    imageUrl: img('nintendo-switch'),
    condition: 'Brand New',
    source: 'mercari',
    isAuction: true,
    bidCount: 7,
    endTimeISO: hoursFromNow(22),
  },
  {
    id: '12',
    name: 'ポケモンカード 151 BOX シュリンク付き',
    price: 12500,
    imageUrl: img('pokemon-cards'),
    condition: 'Brand New',
    source: 'mercari',
    isAuction: true,
    bidCount: 3,
    endTimeISO: hoursFromNow(44),
  },
  {
    id: '13',
    name: 'Dr.G ドクタージー ザモイスチャーバリアDマスク',
    price: 1200,
    imageUrl: img('face-mask-drg'),
    condition: 'Brand New',
    source: 'mercari',
    isAuction: true,
    bidCount: 0,
    endTimeISO: hoursFromNow(72),
  },
  {
    id: '14',
    name: "d'Alba UVエッセンス&ホワイトトリュフマスク",
    price: 2300,
    imageUrl: img('uv-essence'),
    condition: 'Brand New',
    source: 'mercari',
    isAuction: true,
    bidCount: 2,
    endTimeISO: hoursFromNow(9),
  },
  {
    id: '15',
    name: 'スカルプd マスカラ ボリューム ブラック',
    price: 1222,
    imageUrl: img('scalp-mascara'),
    condition: 'Like New',
    source: 'mercari',
    isAuction: true,
    bidCount: 1,
    endTimeISO: hoursFromNow(30),
  },
  {
    id: '16',
    name: 'D&S マルチピーラー 3way 皮むき器',
    price: 980,
    imageUrl: img('kitchen-peeler'),
    condition: 'Brand New',
    source: 'mercari',
    isAuction: false,
  },
  {
    id: '17',
    name: '新品【BOH】プロバイオダーム 3D リフティングマスク',
    price: 1700,
    imageUrl: img('lifting-mask'),
    condition: 'Brand New',
    source: 'mercari',
    isAuction: true,
    bidCount: 0,
    endTimeISO: hoursFromNow(60),
  },
  {
    id: '18',
    name: '9D ホワイトニング シート 7日分 14枚 歯',
    price: 449,
    imageUrl: img('teeth-whitening'),
    condition: 'Brand New',
    source: 'mercari',
    isAuction: false,
  },
  {
    id: '19',
    name: 'ディーアップ マスカラ ルビーブラウン',
    price: 600,
    imageUrl: img('mascara-ruby'),
    condition: 'Good',
    source: 'mercari',
    isAuction: true,
    bidCount: 1,
    endTimeISO: hoursFromNow(15),
  },
  {
    id: '20',
    name: "d'Alba [カバーベージュ] トーンアップサンクリーム",
    price: 2050,
    imageUrl: img('sun-cream'),
    condition: 'Brand New',
    source: 'mercari',
    isAuction: true,
    bidCount: 3,
    endTimeISO: hoursFromNow(8),
  },
  {
    id: '21',
    name: 'dodo ダイヤモンド クラッシュライナー D #01 ピンク',
    price: 1000,
    imageUrl: img('diamond-liner'),
    condition: 'Good',
    source: 'mercari',
    isAuction: true,
    bidCount: 2,
    endTimeISO: hoursFromNow(20),
  },
  {
    id: '22',
    name: 'dプログラム 化粧水と乳液のセット モイストケア',
    price: 4500,
    imageUrl: img('lotion-set'),
    condition: 'Brand New',
    source: 'mercari',
    isAuction: true,
    bidCount: 0,
    endTimeISO: hoursFromNow(40),
  },
  {
    id: '23',
    name: '【新品】d プログラム エッセンスイン クレンジング',
    price: 3300,
    imageUrl: img('cleansing-essence'),
    condition: 'Brand New',
    source: 'mercari',
    isAuction: true,
    bidCount: 6,
    endTimeISO: new Date(Date.now() - 3600_000).toISOString(),
  },
  {
    id: '24',
    name: 'D-UP パーフェクトエクステンションマスカラ ブラウン',
    price: 550,
    imageUrl: img('mascara-brown'),
    condition: 'Good',
    source: 'mercari',
    isAuction: true,
    bidCount: 4,
    endTimeISO: new Date(Date.now() - 7200_000).toISOString(),
  },
]

// ---------------------------------------------------------------------------
// Product Detail mock data
// ---------------------------------------------------------------------------

/** Seed-to-gallery-seeds mapping for richer detail images */
const PRODUCT_IMAGE_SEEDS: Record<string, string> = {
  '1': 'mascara-black',
  '2': 'eyeliner-brown',
  '3': 'skincare-trial',
  '4': 'moisturizer-cream',
  '5': 'eyelid-tape',
  '6': 'bb-cream-light',
  '7': 'eyelid-tape-pack',
  '8': 'eyeliner-pink',
  '9': 'lotion-moist',
  '10': 'cream-large',
  '11': 'nintendo-switch',
  '12': 'pokemon-cards',
  '13': 'face-mask-drg',
  '14': 'uv-essence',
  '15': 'scalp-mascara',
  '16': 'kitchen-peeler',
  '17': 'lifting-mask',
  '18': 'teeth-whitening',
  '19': 'mascara-ruby',
  '20': 'sun-cream',
  '21': 'diamond-liner',
  '22': 'lotion-set',
  '23': 'cleansing-essence',
  '24': 'mascara-brown',
}

function makeBidHistory(count: number, currentPrice: number): BidEntry[] {
  const entries: BidEntry[] = []
  let price = currentPrice
  const names = ['u***4', 'k***7', 's***2', 'm***9', 'a***1', 'n***3', 'j***8']
  const times = ['1 minute ago', '5 minutes ago', '12 minutes ago', '30 minutes ago', '1 hour ago', '3 hours ago', '6 hours ago']

  for (let i = 0; i < count; i++) {
    entries.push({
      id: `bid-${i + 1}`,
      bidderName: names[i % names.length]!,
      amount: price,
      timestamp: times[i] ?? `${i + 1} hours ago`,
      isWinning: i === 0,
    })
    price = Math.max(100, price - Math.floor(Math.random() * 300 + 100))
  }

  return entries
}

function makeDetail(
  base: Product,
  overrides: Partial<ProductDetail> = {}
): ProductDetail {
  const seed = PRODUCT_IMAGE_SEEDS[base.id] ?? `product-${base.id}`
  const images = gallery(seed, 4)

  const isAuction = base.isAuction ?? false
  const bidCount = base.bidCount ?? 0
  const bidHistory = isAuction && bidCount > 0
    ? makeBidHistory(bidCount, base.price)
    : []

  const auctionEnded = isAuction && base.endTimeISO
    ? new Date(base.endTimeISO).getTime() < Date.now()
    : false

  return {
    ...base,
    images,
    description: `High-quality product from Japan.\n\nThis listing is for: ${base.name}\n\n- Condition: ${base.condition ?? 'N/A'}\n- Source: ${base.source ?? 'mercari'}\n\nThank you for visiting.`,
    categories: ['Home', 'Beauty', 'Skincare'],
    conditionDescription:
      'There are some minor signs of use, scratches and dirt, but they are not noticeable.',
    shippingCost: 'Shipping included (seller pays)',
    shippingMethod: 'Easy Mercari Delivery',
    shippingRegion: 'to be decided',
    shippingDays: 'Ships in 2-3 days',
    likeCount: Math.floor(Math.random() * 10) + 1,
    shareCount: Math.floor(Math.random() * 5) + 1,
    postedAt: '4 minutes ago',
    startingPrice: isAuction ? Math.max(100, base.price - bidCount * 200) : undefined,
    currentBid: isAuction ? base.price : undefined,
    bidHistory,
    endTimeISO: base.endTimeISO,
    auctionEnded,
    ...overrides,
  }
}

/**
 * Full product details keyed by product ID (for the detail page).
 */
export const MOCK_PRODUCT_DETAILS: Record<string, ProductDetail> = Object.fromEntries(
  MOCK_PRODUCTS.map((p) => [p.id, makeDetail(p)])
)

// Enrich specific items with custom details
Object.assign(MOCK_PRODUCT_DETAILS['1'], {
  description:
    'D-UP Perfect Extension Mascara in Black.\n\n- Lengthening & volumizing formula\n- Smudge-proof & waterproof\n- Easy to remove with warm water\n\nBrand new, unopened. Ships from Tokyo.',
  categories: ['Beauty', 'Makeup', 'Mascara'],
  conditionDescription: 'Brand new, sealed in original packaging.',
  likeCount: 5,
  shareCount: 2,
} satisfies Partial<ProductDetail>)

Object.assign(MOCK_PRODUCT_DETAILS['11'], {
  endTime: 'March 7, 2026 18:37',
  description:
    'Nintendo Switch OLED Model - White.\n\n- 7-inch OLED screen\n- Wide adjustable stand\n- 64 GB internal storage\n- Enhanced audio\n\nBrand new, never opened. Original receipt included.',
  categories: ['Electronics', 'Gaming', 'Nintendo'],
  conditionDescription: 'Brand new in sealed box.',
  likeCount: 12,
  shareCount: 4,
} satisfies Partial<ProductDetail>)

Object.assign(MOCK_PRODUCT_DETAILS['12'], {
  endTime: 'March 8, 2026 21:00',
  description:
    'Pokemon Card 151 BOX with shrink wrap intact.\n\n- Card Name: Pokemon 151 Booster BOX\n- Contains 20 packs\n- Shrink wrap sealed\n\nPerfect for collectors. Thank you for visiting.',
  categories: ['Games, toys, and goods', 'Trading Cards', 'Pokemon Card Game'],
  conditionDescription: 'Brand new, factory sealed with shrink wrap.',
  likeCount: 8,
  shareCount: 3,
} satisfies Partial<ProductDetail>)

// Item 23 = auction ended, user WON
Object.assign(MOCK_PRODUCT_DETAILS['23'], {
  auctionEnded: true,
  description:
    'd program Essence-In Cleansing.\n\n- Gentle formula for sensitive skin\n- Removes makeup thoroughly\n- No fragrance, no coloring\n\nBrand new in box.',
  categories: ['Beauty', 'Skincare', 'Cleansing'],
  conditionDescription: 'Brand new, sealed.',
} satisfies Partial<ProductDetail>)

// Item 24 = auction ended, user did NOT win
Object.assign(MOCK_PRODUCT_DETAILS['24'], {
  auctionEnded: true,
  description:
    'D-UP Perfect Extension Mascara in Brown.\n\n- Natural brown color\n- Long-lasting formula\n\nGood condition, used twice.',
  categories: ['Beauty', 'Makeup', 'Mascara'],
} satisfies Partial<ProductDetail>)

// ===========================================================================
// Dashboard Mock Data
// ===========================================================================

/**
 * Mock bids the current user is participating in.
 */
export const MOCK_USER_BIDS: UserBid[] = [
  {
    id: 'bid-u-1',
    productId: '1',
    productName: 'D-UP パーフェクトエクステンションマスカラ ブラック',
    imageUrl: img('mascara-black'),
    myBid: 650,
    currentBid: 650,
    bidCount: 2,
    endTimeISO: hoursFromNow(18),
    auctionEnded: false,
    status: 'winning',
  },
  {
    id: 'bid-u-2',
    productId: '11',
    productName: 'Nintendo Switch OLED ホワイト 本体 新品未使用',
    imageUrl: img('nintendo-switch'),
    myBid: 35000,
    currentBid: 38000,
    bidCount: 7,
    endTimeISO: hoursFromNow(22),
    auctionEnded: false,
    status: 'outbid',
  },
  {
    id: 'bid-u-3',
    productId: '4',
    productName: 'd programバイタライジングクリーム敏感肌用 クリーム',
    imageUrl: img('moisturizer-cream'),
    myBid: 7500,
    currentBid: 8000,
    bidCount: 5,
    endTimeISO: hoursFromNow(0.5),
    auctionEnded: false,
    status: 'outbid',
  },
  {
    id: 'bid-u-4',
    productId: '12',
    productName: 'ポケモンカード 151 BOX シュリンク付き',
    imageUrl: img('pokemon-cards'),
    myBid: 12500,
    currentBid: 12500,
    bidCount: 3,
    endTimeISO: hoursFromNow(44),
    auctionEnded: false,
    status: 'winning',
  },
  {
    id: 'bid-u-5',
    productId: '23',
    productName: '【新品】d プログラム エッセンスイン クレンジング',
    imageUrl: img('cleansing-essence'),
    myBid: 3300,
    currentBid: 3300,
    bidCount: 6,
    endTimeISO: new Date(Date.now() - 3600_000).toISOString(),
    auctionEnded: true,
    status: 'won',
  },
  {
    id: 'bid-u-6',
    productId: '24',
    productName: 'D-UP パーフェクトエクステンションマスカラ ブラウン',
    imageUrl: img('mascara-brown'),
    myBid: 450,
    currentBid: 550,
    bidCount: 4,
    endTimeISO: new Date(Date.now() - 7200_000).toISOString(),
    auctionEnded: true,
    status: 'lost',
  },
]

/**
 * Mock orders for the dashboard.
 */
export const MOCK_USER_ORDERS: UserOrder[] = [
  {
    id: 'order-1',
    orderNumber: 'KK-2026-00001',
    status: 'COMPLETED',
    totalJPY: 15000,
    totalTHB: 3600,
    exchangeRate: 0.24,
    serviceFee: 540,
    shippingCost: 300,
    discount: 0,
    paidAt: '2026-03-01T10:00:00Z',
    completedAt: '2026-03-05T15:30:00Z',
    createdAt: '2026-03-01T09:00:00Z',
    items: [
      {
        id: 'oi-1',
        productName: 'Nintendo Switch OLED',
        productUrl: 'https://www.amazon.co.jp/dp/B09G9F123X',
        imageUrl: img('nintendo-switch'),
        priceJPY: 10000,
        quantity: 1,
        variant: 'White',
      },
      {
        id: 'oi-2',
        productName: 'Pokemon Game Card',
        productUrl: 'https://www.amazon.co.jp/dp/B08H93ZRK9',
        imageUrl: img('pokemon-cards'),
        priceJPY: 5000,
        quantity: 1,
        variant: 'Standard Edition',
      },
    ],
    tracking: {
      id: 'trk-1',
      status: 'DELIVERED',
      trackingNumber: 'TH123456789JP',
      carrier: 'Japan Post EMS',
      estimatedDelivery: '2026-03-05T00:00:00Z',
      deliveredAt: '2026-03-05T15:30:00Z',
      events: [
        { id: 'te-1-1', status: 'ORDER_PLACED', description: 'Order has been placed', location: 'Bangkok, Thailand', eventAt: '2026-03-01T10:00:00Z' },
        { id: 'te-1-2', status: 'PURCHASED', description: 'Items purchased from Japanese marketplace', location: 'Tokyo, Japan', eventAt: '2026-03-01T18:00:00Z' },
        { id: 'te-1-3', status: 'SHIPPED_FROM_JP', description: 'Package shipped from Japan', location: 'Tokyo International Post Office', eventAt: '2026-03-02T10:00:00Z' },
        { id: 'te-1-4', status: 'IN_TRANSIT', description: 'Package in transit', location: 'Narita Airport, Japan', eventAt: '2026-03-03T08:00:00Z' },
        { id: 'te-1-5', status: 'ARRIVED_WAREHOUSE', description: 'Package arrived at Thailand warehouse', location: 'Bangkok International Airport', eventAt: '2026-03-04T14:00:00Z' },
        { id: 'te-1-6', status: 'OUT_FOR_DELIVERY', description: 'Out for delivery', location: 'Bangkok Distribution Center', eventAt: '2026-03-05T09:00:00Z' },
        { id: 'te-1-7', status: 'DELIVERED', description: 'Package delivered successfully', location: 'Bangkok, Thailand', eventAt: '2026-03-05T15:30:00Z' },
      ],
    },
  },
  {
    id: 'order-2',
    orderNumber: 'KK-2026-00002',
    status: 'SHIPPED_TO_TH',
    totalJPY: 8000,
    totalTHB: 1920,
    exchangeRate: 0.24,
    serviceFee: 288,
    shippingCost: 250,
    discount: 100,
    discountCode: 'WELCOME10',
    paidAt: '2026-03-03T14:00:00Z',
    createdAt: '2026-03-03T12:00:00Z',
    items: [
      {
        id: 'oi-3',
        productName: 'Japanese Manga Set (Vol 1-5)',
        productUrl: 'https://www.amazon.co.jp/dp/B07XYZ123',
        imageUrl: img('manga-set'),
        priceJPY: 8000,
        quantity: 1,
        variant: 'Complete Set',
      },
    ],
    tracking: {
      id: 'trk-2',
      status: 'IN_TRANSIT',
      trackingNumber: 'TH987654321JP',
      carrier: 'Japan Post EMS',
      estimatedDelivery: '2026-03-10T00:00:00Z',
      events: [
        { id: 'te-2-1', status: 'ORDER_PLACED', description: 'Order has been placed', location: 'Bangkok, Thailand', eventAt: '2026-03-03T14:00:00Z' },
        { id: 'te-2-2', status: 'PURCHASED', description: 'Items purchased from Japanese marketplace', location: 'Osaka, Japan', eventAt: '2026-03-04T10:00:00Z' },
        { id: 'te-2-3', status: 'SHIPPED_FROM_JP', description: 'Package shipped from Japan', location: 'Osaka International Post Office', eventAt: '2026-03-05T08:00:00Z' },
      ],
    },
  },
  {
    id: 'order-3',
    orderNumber: 'KK-2026-00003',
    status: 'PENDING_PAYMENT',
    totalJPY: 3500,
    totalTHB: 840,
    exchangeRate: 0.24,
    serviceFee: 126,
    shippingCost: 150,
    discount: 0,
    createdAt: '2026-03-06T08:00:00Z',
    items: [
      {
        id: 'oi-4',
        productName: 'Japanese Snack Box',
        productUrl: 'https://www.amazon.co.jp/dp/B09SNACK1',
        imageUrl: img('snack-box'),
        priceJPY: 3500,
        quantity: 1,
      },
    ],
  },
  {
    id: 'order-4',
    orderNumber: 'KK-2026-00004',
    status: 'PROCESSING',
    totalJPY: 12500,
    totalTHB: 3000,
    exchangeRate: 0.24,
    serviceFee: 450,
    shippingCost: 350,
    discount: 0,
    paidAt: '2026-03-05T16:00:00Z',
    createdAt: '2026-03-05T15:00:00Z',
    items: [
      {
        id: 'oi-5',
        productName: 'ポケモンカード 151 BOX シュリンク付き',
        productUrl: 'https://www.mercari.com/jp/items/pokemon151',
        imageUrl: img('pokemon-cards'),
        priceJPY: 12500,
        quantity: 1,
      },
    ],
    tracking: {
      id: 'trk-4',
      status: 'PROCESSING',
      events: [
        { id: 'te-4-1', status: 'ORDER_PLACED', description: 'Order has been placed', location: 'Bangkok, Thailand', eventAt: '2026-03-05T16:00:00Z' },
        { id: 'te-4-2', status: 'PROCESSING', description: 'Order is being processed', location: 'Sakura Office', eventAt: '2026-03-06T09:00:00Z' },
      ],
    },
  },
  {
    id: 'order-5',
    orderNumber: 'KK-2026-00005',
    status: 'CANCELLED',
    totalJPY: 5000,
    totalTHB: 1200,
    exchangeRate: 0.24,
    serviceFee: 180,
    shippingCost: 200,
    discount: 0,
    cancelledAt: '2026-02-28T12:00:00Z',
    createdAt: '2026-02-27T10:00:00Z',
    items: [
      {
        id: 'oi-6',
        productName: 'Shiseido Ultimune Serum',
        productUrl: 'https://www.amazon.co.jp/dp/SHISEIDO1',
        imageUrl: img('shiseido-serum'),
        priceJPY: 5000,
        quantity: 1,
      },
    ],
  },
]

/**
 * Mock addresses for the dashboard.
 */
export const MOCK_USER_ADDRESSES: UserAddress[] = [
  {
    id: 'addr-1',
    label: 'Home',
    fullAddress: '123 Sukhumvit Road, Khlong Toei Nuea',
    province: 'Bangkok',
    district: 'Watthana',
    postalCode: '10110',
    phone: '08-3333-3333',
    isDefault: true,
  },
  {
    id: 'addr-2',
    label: 'Office',
    fullAddress: '456 Silom Road, Suriyawong',
    province: 'Bangkok',
    district: 'Bang Rak',
    postalCode: '10500',
    phone: '08-3333-4444',
    isDefault: false,
  },
  {
    id: 'addr-3',
    label: "Parent's House",
    fullAddress: '789 Rama II Road',
    province: 'Samut Sakhon',
    district: 'Muang',
    postalCode: '74000',
    phone: '08-5555-6666',
    isDefault: false,
  },
]

/**
 * Mock notifications for the dashboard.
 */
export const MOCK_USER_NOTIFICATIONS: UserNotification[] = [
  {
    id: 'notif-1',
    type: 'TRACKING_UPDATE',
    title: 'Package Shipped',
    message: 'Your order #KK-2026-00002 has been shipped from Japan via EMS.',
    resourceId: 'order-2',
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 3600_000).toISOString(),
  },
  {
    id: 'notif-2',
    type: 'PAYMENT_UPDATE',
    title: 'Payment Pending',
    message: 'Please complete payment for order #KK-2026-00003. Total: ฿840.',
    resourceId: 'order-3',
    isRead: false,
    createdAt: new Date(Date.now() - 5 * 3600_000).toISOString(),
  },
  {
    id: 'notif-3',
    type: 'ORDER_UPDATE',
    title: 'Order Delivered',
    message: 'Your order #KK-2026-00001 has been delivered successfully.',
    resourceId: 'order-1',
    isRead: true,
    readAt: '2026-03-05T16:00:00Z',
    createdAt: '2026-03-05T15:30:00Z',
  },
  {
    id: 'notif-4',
    type: 'SYSTEM',
    title: 'Welcome to Sakura!',
    message: 'Thank you for creating your account. Start browsing Japanese products now!',
    isRead: true,
    readAt: '2026-03-01T10:00:00Z',
    createdAt: '2026-03-01T09:30:00Z',
  },
  {
    id: 'notif-5',
    type: 'PROMOTION',
    title: 'Spring Sale - 10% Off',
    message: 'Use code SPRING2026 for 10% off your next order. Valid until March 31.',
    isRead: false,
    createdAt: new Date(Date.now() - 24 * 3600_000).toISOString(),
  },
  {
    id: 'notif-6',
    type: 'ORDER_UPDATE',
    title: 'Order Processing',
    message: 'Your order #KK-2026-00004 is now being processed. We are purchasing your items from Japan.',
    resourceId: 'order-4',
    isRead: false,
    createdAt: new Date(Date.now() - 8 * 3600_000).toISOString(),
  },
]
