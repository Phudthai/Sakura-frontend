'use client'

import { useState, useEffect, type FormEvent } from 'react'
import Image from 'next/image'
import { Link2, User, Send, CheckCircle2, Clock, Loader2, ExternalLink, Timer } from 'lucide-react'

type BidStatus = 'pending' | 'processing' | 'done'

interface BidEntry {
  id: number
  url: string
  name: string
  status: BidStatus
  date: string
  itemName: string
  imageUrl: string
  endsAt?: Date   // only for processing
}

function makeEndsAt(offsetMinutes: number) {
  const d = new Date()
  d.setMinutes(d.getMinutes() + offsetMinutes)
  return d
}

const MOCK_HISTORY: BidEntry[] = [
  {
    id: 1, name: 'คุณสมชาย', status: 'processing', date: '05/03/2026',
    itemName: 'Gundam RG 1/144 RX-78-2',
    imageUrl: 'https://picsum.photos/seed/gun1/120/120',
    url: 'https://page.auctions.yahoo.co.jp/jp/auction/t1234567',
    endsAt: makeEndsAt(73),
  },
  {
    id: 2, name: 'คุณนิดา', status: 'done', date: '04/03/2026',
    itemName: 'One Piece Nami Figure DXF',
    imageUrl: 'https://picsum.photos/seed/fig2/120/120',
    url: 'https://jp.mercari.com/item/m12345678',
  },
  {
    id: 3, name: 'Line: john_doe', status: 'pending', date: '04/03/2026',
    itemName: 'รอตรวจสอบข้อมูล',
    imageUrl: 'https://picsum.photos/seed/pending3/120/120',
    url: 'https://page.auctions.yahoo.co.jp/jp/auction/x9876543',
  },
  {
    id: 4, name: 'คุณมาลี', status: 'done', date: '03/03/2026',
    itemName: 'Vintage Canon AE-1 Film Camera',
    imageUrl: 'https://picsum.photos/seed/cam4/120/120',
    url: 'https://item.rakuten.co.jp/shop/item001',
  },
  {
    id: 5, name: 'คุณวิชัย', status: 'pending', date: '03/03/2026',
    itemName: 'รอตรวจสอบข้อมูล',
    imageUrl: 'https://picsum.photos/seed/pending5/120/120',
    url: 'https://jp.mercari.com/item/m99887766',
  },
  {
    id: 6, name: 'คุณปิยะ', status: 'done', date: '02/03/2026',
    itemName: 'Air Jordan 1 Retro High OG Chicago',
    imageUrl: 'https://picsum.photos/seed/shoe6/120/120',
    url: 'https://page.auctions.yahoo.co.jp/jp/auction/b5551234',
  },
  {
    id: 7, name: 'Line: cherry99', status: 'processing', date: '02/03/2026',
    itemName: 'Pokemon Card Booster Box SV',
    imageUrl: 'https://picsum.photos/seed/poke7/120/120',
    url: 'https://jp.mercari.com/item/m44556677',
    endsAt: makeEndsAt(194),
  },
]

const STATUS_CONFIG: Record<BidStatus, { label: string; icon: React.ReactNode; className: string }> = {
  pending: {
    label: 'รอดำเนินการ',
    icon: <Clock className="w-3 h-3" />,
    className: 'bg-sakura-100 text-sakura-600',
  },
  processing: {
    label: 'กำลังประมูล',
    icon: <Loader2 className="w-3 h-3 animate-spin" />,
    className: 'bg-sakura-800 text-white',
  },
  done: {
    label: 'เสร็จสิ้น',
    icon: <CheckCircle2 className="w-3 h-3" />,
    className: 'bg-sakura-900 text-white',
  },
}

function Countdown({ endsAt }: { endsAt: Date }) {
  const calc = () => Math.max(0, Math.floor((endsAt.getTime() - Date.now()) / 1000))
  const [secs, setSecs] = useState(calc)

  useEffect(() => {
    const id = setInterval(() => setSecs(calc()), 1000)
    return () => clearInterval(id)
  }, [endsAt])

  if (secs === 0) return <span className="text-xs text-muted">หมดเวลา</span>

  const h = Math.floor(secs / 3600)
  const m = Math.floor((secs % 3600) / 60)
  const s = secs % 60
  const display = h > 0
    ? `${h}ช ${String(m).padStart(2, '0')}น ${String(s).padStart(2, '0')}ว`
    : `${String(m).padStart(2, '0')}น ${String(s).padStart(2, '0')}ว`

  return (
    <div className="flex items-center gap-1 text-xs font-mono font-semibold text-sakura-800 whitespace-nowrap">
      <Timer className="w-3 h-3 shrink-0" />
      {display}
    </div>
  )
}

export default function SearchLinkTab() {
  const [url, setUrl] = useState('')
  const [name, setName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMsg, setSuccessMsg] = useState(false)
  const [history, setHistory] = useState<BidEntry[]>(MOCK_HISTORY)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise((r) => setTimeout(r, 700))
    const newEntry: BidEntry = {
      id: Date.now(),
      url,
      name: name || 'ไม่ระบุ',
      status: 'pending',
      date: new Date().toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      itemName: 'รอตรวจสอบข้อมูล',
      imageUrl: `https://picsum.photos/seed/new${Date.now()}/120/120`,
    }
    setHistory((prev) => [newEntry, ...prev])
    setUrl('')
    setName('')
    setIsSubmitting(false)
    setSuccessMsg(true)
    setTimeout(() => setSuccessMsg(false), 3000)
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8 items-start">

        {/* ── Left: Form ── */}
        <div className="space-y-4 lg:sticky lg:top-24">
          <div>
            <h2 className="text-xl font-bold text-sakura-900">ประมูลด้วยตนเอง</h2>
            <p className="text-sm text-muted-dark mt-1">วางลิงค์สินค้าที่ต้องการ เราจะติดแท็กและแจ้งกลับให้คุณทราบ</p>
          </div>

          {successMsg && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-sakura-900 text-white text-sm animate-fade-slide-in">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              ส่งลิงค์เรียบร้อยแล้ว ทีมงานจะติดต่อกลับโดยเร็ว
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-white rounded-2xl border border-card-border shadow-card p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-sakura-900 mb-1.5">
                  ลิงค์สินค้า <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <input
                    type="url"
                    required
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-card-border
                               bg-sakura-50/50 text-sakura-900 text-sm placeholder:text-muted
                               focus:outline-none focus:ring-2 focus:ring-sakura-400 focus:border-transparent
                               transition-all"
                  />
                </div>
                <p className="mt-1.5 text-xs text-muted">รองรับ Mercari, Yahoo Auction, Rakuten ฯลฯ</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-sakura-900 mb-1.5">
                  ชื่อ / ช่องทางติดต่อ
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="ชื่อ หรือ Line ID / เบอร์โทร"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-card-border
                               bg-sakura-50/50 text-sakura-900 text-sm placeholder:text-muted
                               focus:outline-none focus:ring-2 focus:ring-sakura-400 focus:border-transparent
                               transition-all"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-gradient w-full flex items-center justify-center gap-2 py-3 text-base"
            >
              {isSubmitting ? (
                <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  ส่งลิงค์สินค้า
                </>
              )}
            </button>
          </form>
        </div>

        {/* ── Right: History ── */}
        <div className="bg-white rounded-2xl border border-card-border shadow-card overflow-hidden">
          <div className="px-5 py-4 border-b border-card-border flex items-center justify-between">
            <h3 className="font-semibold text-sakura-900">ประวัติการประมูลทั้งหมด</h3>
            <span className="text-xs text-muted-dark">{history.length} รายการ</span>
          </div>

          <div className="divide-y divide-card-border overflow-y-auto max-h-[600px]">
            {history.length === 0 ? (
              <p className="text-sm text-muted text-center py-12">ยังไม่มีรายการ</p>
            ) : (
              history.map((entry) => (
                <div key={entry.id} className="px-5 py-6 flex items-center gap-4 hover:bg-sakura-50/50 transition-colors">
                  {/* Image */}
                  <div className="w-24 h-24 rounded-xl overflow-hidden border border-card-border shrink-0 bg-sakura-100">
                    <Image
                      src={entry.imageUrl}
                      alt={entry.itemName}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <p className="text-base font-semibold text-sakura-900 truncate">{entry.itemName}</p>
                    <p className="text-sm text-muted-dark">{entry.name}</p>
                    <a
                      href={entry.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-muted hover:text-sakura-700 hover:underline transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                      {new URL(entry.url).hostname.replace('www.', '')}
                    </a>
                  </div>

                  {/* Right: time */}
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    {entry.status === 'processing' && entry.endsAt ? (
                      <Countdown endsAt={entry.endsAt} />
                    ) : (
                      <span className="text-xs text-muted">{entry.date}</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
