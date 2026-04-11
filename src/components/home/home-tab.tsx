"use client";

import Link from "next/link";
import {
  ShoppingBag,
  Gavel,
  Package,
  Search,
  CheckCircle,
  ArrowRight,
  Star,
  Tag,
  Truck,
  Users,
  Clock,
  TrendingUp,
  BookOpen,
  RefreshCw,
  Globe,
  Shield,
} from "lucide-react";
import FallingSakura from "@/components/layout/falling-sakura";
import SpaceBackground from "@/components/layout/space-background";

// ─── Mock Data ──────────────────────────────────────────────────────────────

const EXCHANGE_RATES = [
  { from: "JPY", to: "THB", rate: 0.2412, change: +0.003, symbol: "¥" },
  { from: "USD", to: "THB", rate: 34.52, change: -0.15, symbol: "$" },
  { from: "EUR", to: "THB", rate: 37.84, change: +0.22, symbol: "€" },
];

const PLATFORMS = [
  {
    name: "Yahoo Auctions Japan",
    desc: "ประมูลสินค้ามือสองและของสะสมจากญี่ปุ่น ราคาถูก หายาก",
    emoji: "🏷️",
    color: "from-red-500 to-red-700",
    items: "12ล้าน+ รายการ",
  },
  {
    name: "Mercari Japan",
    desc: "ซื้อขายสินค้ามือสองยอดนิยม แฟชั่น อิเล็กทรอนิกส์ ของสะสม",
    emoji: "🛍️",
    color: "from-rose-500 to-pink-600",
    items: "8ล้าน+ รายการ",
  },
  {
    name: "Yahoo Shopping",
    desc: "ห้างสรรพสินค้าออนไลน์ครบครัน สินค้าใหม่ ของแท้ 100%",
    emoji: "🏪",
    color: "from-violet-500 to-purple-700",
    items: "50ล้าน+ รายการ",
  },
  {
    name: "Rakuten Ichiba",
    desc: "ศูนย์รวมแบรนด์ชั้นนำ สินค้าพรีเมียม และ limited edition",
    emoji: "🎌",
    color: "from-orange-500 to-red-600",
    items: "30ล้าน+ รายการ",
  },
];

const SERVICES = [
  {
    icon: Gavel,
    title: "ประมูลสินค้า",
    desc: "ทีมงานประมูลแทนคุณ ในราคาที่คุณกำหนด ไม่เสียโอกาส",
    color: "bg-violet-100 text-violet-600",
  },
  {
    icon: ShoppingBag,
    title: "ซื้อตรง (Buy Now)",
    desc: "สั่งซื้อสินค้าราคาคงที่ ไม่ต้องรอประมูล รวดเร็ว ทันใจ",
    color: "bg-pink-100 text-pink-600",
  },
  {
    icon: Package,
    title: "จัดส่งรวม (Lot)",
    desc: "รวมสินค้าหลายชิ้นเป็น lot เดียว ประหยัดค่าส่ง",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: Search,
    title: "ตรวจสอบสินค้า",
    desc: "ทีมงานตรวจเช็คสภาพสินค้าก่อนส่ง พร้อมถ่ายรูปรายงาน",
    color: "bg-green-100 text-green-600",
  },
];

const HOW_TO_STEPS = [
  { step: 1, title: "สมัครสมาชิก", desc: "สร้างบัญชีฟรี ใช้เวลาไม่ถึง 1 นาที", icon: Users },
  { step: 2, title: "ค้นหาสินค้า", desc: "วางลิงก์สินค้าจาก Yahoo, Mercari หรือค้นหาโดยตรง", icon: Search },
  { step: 3, title: "สั่งซื้อ / ประมูล", desc: "กำหนดราคาสูงสุดแล้วปล่อยให้ทีมงานดูแล", icon: Gavel },
  { step: 4, title: "ชำระเงิน", desc: "เติมเงินกระเป๋าและชำระสินค้าผ่านระบบปลอดภัย", icon: Shield },
  { step: 5, title: "รับสินค้า", desc: "รับสินค้าถึงหน้าบ้าน ทั่วประเทศไทย", icon: Truck },
];

const SHIPPING_TIERS = [
  { weight: "0 – 0.5 kg", sea: "180 ฿", air: "350 ฿" },
  { weight: "0.5 – 1 kg", sea: "280 ฿", air: "550 ฿" },
  { weight: "1 – 2 kg", sea: "420 ฿", air: "850 ฿" },
  { weight: "2 – 5 kg", sea: "680 ฿", air: "1,400 ฿" },
  { weight: "5 – 10 kg", sea: "1,100 ฿", air: "2,600 ฿" },
];

const PROMOTIONS = [
  {
    badge: "HOT",
    badgeColor: "bg-red-500",
    title: "ค่าจัดส่งฟรีครั้งแรก",
    desc: "สำหรับสมาชิกใหม่ ฟรีค่าส่งจากญี่ปุ่น-ไทย lot แรก ไม่มีขั้นต่ำ",
    expires: "30 เม.ย. 2026",
    icon: Truck,
    color: "from-rose-500 to-pink-600",
  },
  {
    badge: "NEW",
    badgeColor: "bg-green-500",
    title: "ส่วนลด 5% ทุกออเดอร์",
    desc: "เติมเงินขั้นต่ำ 3,000 ฿ รับส่วนลด 5% สำหรับออเดอร์ถัดไปทันที",
    expires: "31 พ.ค. 2026",
    icon: Tag,
    color: "from-violet-500 to-purple-700",
  },
  {
    badge: "CASHBACK",
    badgeColor: "bg-amber-500",
    title: "Cashback 3%",
    desc: "สั่ง 5 ออเดอร์ขึ้นไปต่อเดือน รับ cashback 3% กลับเข้ากระเป๋าเงิน",
    expires: "31 มี.ค. 2026",
    icon: TrendingUp,
    color: "from-amber-500 to-orange-600",
  },
];

const ARTICLES = [
  {
    category: "คู่มือการสั่ง",
    categoryColor: "bg-violet-100 text-violet-700",
    title: "วิธีสั่งสินค้าจาก Yahoo Auctions Japan สำหรับมือใหม่",
    excerpt:
      "เรียนรู้ขั้นตอนการประมูลสินค้าจากญี่ปุ่น ตั้งแต่การค้นหา การตั้งราคา จนถึงการรับสินค้า",
    date: "8 เม.ย. 2026",
    readTime: "5 นาที",
  },
  {
    category: "อัตราแลกเปลี่ยน",
    categoryColor: "bg-blue-100 text-blue-700",
    title: "เปรียบเทียบค่าจัดส่งทางเรือ vs ทางอากาศ ควรเลือกแบบไหน?",
    excerpt:
      "ทางเรือประหยัดกว่า แต่ใช้เวลานาน ทางอากาศเร็วกว่า แต่แพงกว่า มาดูว่าควรเลือกแบบไหน",
    date: "3 เม.ย. 2026",
    readTime: "4 นาที",
  },
  {
    category: "รีวิว Platform",
    categoryColor: "bg-pink-100 text-pink-700",
    title: "Mercari Japan vs Yahoo Auction ต่างกันอย่างไร ซื้อที่ไหนดีกว่า?",
    excerpt:
      "รีวิวเปรียบเทียบ 2 platform ยักษ์ใหญ่ของญี่ปุ่น ข้อดีข้อเสีย เหมาะกับสินค้าประเภทไหน",
    date: "28 มี.ค. 2026",
    readTime: "6 นาที",
  },
];

const STATS = [
  { value: "10,000+", label: "ลูกค้าทั่วประเทศ", icon: Users },
  { value: "500,000+", label: "สินค้าที่จัดส่งแล้ว", icon: Package },
  { value: "5+ ปี", label: "ประสบการณ์", icon: Star },
  { value: "98%", label: "ความพึงพอใจ", icon: CheckCircle },
];

// ─── Section Components ──────────────────────────────────────────────────────

function SectionTitle({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="text-center mb-10">
      <h2 className="text-2xl md:text-3xl font-bold text-sakura-900">{title}</h2>
      {sub && <p className="mt-2 text-sakura-600 text-sm md:text-base">{sub}</p>}
      <div className="mt-3 mx-auto w-12 h-1 rounded-full bg-gradient-to-r from-violet-500 to-pink-500" />
    </div>
  );
}

// ─── Hero ────────────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section className="relative overflow-hidden text-white">
      <SpaceBackground />
      <FallingSakura />
      <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-6 py-20 md:py-32 text-center">
        <span className="inline-block mb-4 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 border border-white/30">
          🌸 บริการนำเข้าจากญี่ปุ่น #1 ในไทย
        </span>
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight drop-shadow-lg">
          สั่งสินค้าจากญี่ปุ่น
          <br />
          <span className="text-pink-200">ง่าย · เร็ว · ปลอดภัย</span>
        </h1>
        <p className="mt-6 text-base md:text-xl text-white/80 max-w-2xl mx-auto">
          เข้าถึงสินค้าหลายล้านรายการจาก Yahoo Auctions, Mercari, Rakuten และอื่นๆ
          พร้อมทีมงานผู้เชี่ยวชาญดูแลทุกขั้นตอน
        </p>
        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          <Link href="/?tab=search_link" className="btn-gradient px-6 py-3 rounded-full text-sm font-semibold flex items-center gap-2">
            เริ่มสั่งสินค้า <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/register" className="px-6 py-3 rounded-full text-sm font-semibold border border-white/50 hover:bg-white/10 transition-colors">
            สมัครสมาชิกฟรี
          </Link>
        </div>

        {/* Quick stats */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {STATS.map(({ value, label, icon: Icon }) => (
            <div key={label} className="bg-white/10 border border-white/20 rounded-2xl p-4">
              <Icon className="w-5 h-5 mx-auto mb-1 text-pink-200" />
              <p className="text-xl font-bold">{value}</p>
              <p className="text-xs text-white/70 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Exchange Rate ────────────────────────────────────────────────────────────

function ExchangeRateSection() {
  return (
    <section className="py-14 bg-white">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6">
        <SectionTitle title="อัตราแลกเปลี่ยน" sub="อัพเดตล่าสุด: วันนี้ 09:00 น. (ข้อมูลอ้างอิงเท่านั้น)" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {EXCHANGE_RATES.map(({ from, to, rate, change, symbol }) => {
            const positive = change >= 0;
            return (
              <div key={from} className="bg-sakura-50 border border-card-border rounded-2xl p-5 shadow-card text-center">
                <p className="text-3xl font-bold mb-1">{symbol}</p>
                <p className="text-sm text-sakura-600 font-medium">{from} → {to}</p>
                <p className="text-2xl font-extrabold text-sakura-900 mt-2">
                  {rate.toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                </p>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full mt-2 inline-block ${positive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {positive ? "▲" : "▼"} {Math.abs(change).toFixed(3)}
                </span>
              </div>
            );
          })}
        </div>
        <p className="text-center text-xs text-sakura-400 mt-4 flex items-center justify-center gap-1">
          <RefreshCw className="w-3 h-3" /> อัตราแลกเปลี่ยนอาจมีการเปลี่ยนแปลงตามตลาด กรุณาตรวจสอบก่อนสั่งซื้อ
        </p>
      </div>
    </section>
  );
}

// ─── Platforms ────────────────────────────────────────────────────────────────

function PlatformsSection() {
  return (
    <section className="py-14 bg-body">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6">
        <SectionTitle
          title="Platform ที่รองรับ"
          sub="เข้าถึงสินค้าหลายสิบล้านรายการจาก 4 แพลตฟอร์มชั้นนำของญี่ปุ่น"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PLATFORMS.map(({ name, desc, emoji, color, items }) => (
            <div
              key={name}
              className="bg-white border border-card-border rounded-2xl shadow-card hover:shadow-card-hover transition-shadow overflow-hidden group"
            >
              <div className={`bg-gradient-to-br ${color} h-24 flex items-center justify-center text-5xl`}>
                {emoji}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-sakura-900 text-sm">{name}</h3>
                <p className="text-xs text-sakura-600 mt-1 leading-relaxed">{desc}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs text-sakura-400">
                  <Globe className="w-3 h-3" /> {items}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Services ─────────────────────────────────────────────────────────────────

function ServicesSection() {
  return (
    <section className="py-14 bg-white">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6">
        <SectionTitle title="บริการของเรา" sub="ครบทุกขั้นตอนตั้งแต่ค้นหาจนถึงหน้าบ้านคุณ" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SERVICES.map(({ icon: Icon, title, desc, color }) => (
            <div
              key={title}
              className="bg-sakura-50 border border-card-border rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-shadow text-center"
            >
              <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mx-auto mb-4`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sakura-900 mb-2">{title}</h3>
              <p className="text-xs text-sakura-600 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── How to Order ─────────────────────────────────────────────────────────────

function HowToOrderSection() {
  return (
    <section className="py-14 bg-body">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6">
        <SectionTitle title="วิธีสั่งสินค้า" sub="เพียง 5 ขั้นตอนง่ายๆ รับสินค้าถึงบ้าน" />
        <div className="relative max-w-4xl mx-auto">
          {/* connector line */}
          <div className="hidden md:block absolute top-8 left-[calc(10%+1rem)] right-[calc(10%+1rem)] h-0.5 bg-gradient-to-r from-violet-300 to-pink-300 z-0" />
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative z-10">
            {HOW_TO_STEPS.map(({ step, title, desc, icon: Icon }) => (
              <div key={step} className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-header text-white flex items-center justify-center shadow-button mb-3 shrink-0">
                  <Icon className="w-7 h-7" />
                </div>
                <span className="text-xs font-bold text-sakura-400 mb-1">ขั้นตอนที่ {step}</span>
                <h3 className="font-bold text-sakura-900 text-sm mb-1">{title}</h3>
                <p className="text-xs text-sakura-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="text-center mt-10">
          <Link href="/register" className="btn-gradient px-8 py-3 rounded-full text-sm font-semibold inline-flex items-center gap-2">
            เริ่มต้นใช้งาน <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── Lot & Shipping ───────────────────────────────────────────────────────────

function LotShippingSection() {
  return (
    <section className="py-14 bg-white">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6">
        <SectionTitle title="Lot & จัดส่งสินค้า" sub="รวมสินค้าหลายชิ้นเพื่อประหยัดค่าจัดส่ง" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Lot Info */}
          <div className="space-y-4">
            <div className="bg-sakura-50 border border-card-border rounded-2xl p-5 shadow-card">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center">
                  <Package className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sakura-900">การรวม Lot คืออะไร?</h3>
              </div>
              <p className="text-sm text-sakura-700 leading-relaxed">
                เมื่อคุณสั่งสินค้าหลายชิ้น เราจะรวบรวมไว้ที่โกดังญี่ปุ่นของเรา
                จากนั้นบรรจุรวมกันในกล่องเดียวแล้วส่งมาไทย
                ช่วยประหยัดค่าจัดส่งได้สูงสุด <strong>40%</strong>
              </p>
            </div>
            <div className="bg-sakura-50 border border-card-border rounded-2xl p-5 shadow-card">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sakura-900">ระยะเวลาจัดส่ง</h3>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="text-center bg-white rounded-xl p-3 border border-card-border">
                  <p className="font-bold text-sakura-900">✈️ ทางอากาศ</p>
                  <p className="text-sakura-600 text-xs mt-1">5–10 วันทำการ</p>
                </div>
                <div className="text-center bg-white rounded-xl p-3 border border-card-border">
                  <p className="font-bold text-sakura-900">🚢 ทางเรือ</p>
                  <p className="text-sakura-600 text-xs mt-1">30–45 วันทำการ</p>
                </div>
              </div>
            </div>
          </div>

          {/* Rate Table */}
          <div className="bg-sakura-50 border border-card-border rounded-2xl shadow-card overflow-hidden">
            <div className="bg-gradient-header text-white px-5 py-3">
              <h3 className="font-bold text-sm">อัตราค่าจัดส่ง (ราคาโดยประมาณ)</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-card-border bg-sakura-100/60">
                    <th className="text-left px-4 py-2.5 font-semibold text-sakura-700 text-xs">น้ำหนัก</th>
                    <th className="text-center px-4 py-2.5 font-semibold text-sakura-700 text-xs">🚢 ทางเรือ</th>
                    <th className="text-center px-4 py-2.5 font-semibold text-sakura-700 text-xs">✈️ ทางอากาศ</th>
                  </tr>
                </thead>
                <tbody>
                  {SHIPPING_TIERS.map(({ weight, sea, air }, i) => (
                    <tr key={weight} className={i % 2 === 0 ? "bg-white" : "bg-sakura-50/50"}>
                      <td className="px-4 py-2.5 text-sakura-800 text-xs font-medium">{weight}</td>
                      <td className="px-4 py-2.5 text-center text-sakura-700 text-xs">{sea}</td>
                      <td className="px-4 py-2.5 text-center text-sakura-700 text-xs">{air}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[10px] text-sakura-400 px-4 py-2 border-t border-card-border">
              * ราคาเป็นค่าประมาณ ไม่รวมภาษีนำเข้าและค่าธรรมเนียมอื่นๆ
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Promotions ───────────────────────────────────────────────────────────────

function PromotionsSection() {
  return (
    <section className="py-14 bg-body">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6">
        <SectionTitle title="โปรโมชั่น" sub="ข้อเสนอพิเศษสำหรับคุณ อัพเดตทุกเดือน" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PROMOTIONS.map(({ badge, badgeColor, title, desc, expires, icon: Icon, color }) => (
            <div
              key={title}
              className="bg-white border border-card-border rounded-2xl shadow-card hover:shadow-card-hover transition-shadow overflow-hidden group"
            >
              <div className={`bg-gradient-to-br ${color} p-5 text-white relative`}>
                <span className={`absolute top-3 right-3 text-[10px] font-extrabold px-2 py-0.5 rounded-full ${badgeColor} text-white`}>
                  {badge}
                </span>
                <Icon className="w-8 h-8 mb-2 opacity-90" />
                <h3 className="font-bold text-base">{title}</h3>
              </div>
              <div className="p-4">
                <p className="text-sm text-sakura-700 leading-relaxed">{desc}</p>
                <p className="text-xs text-sakura-400 mt-3 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> หมดเขต {expires}
                </p>
                <button className="mt-3 w-full text-xs font-semibold text-violet-600 border border-violet-200 rounded-lg py-2 hover:bg-violet-50 transition-colors">
                  รับสิทธิ์
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Articles ─────────────────────────────────────────────────────────────────

function ArticlesSection() {
  return (
    <section className="py-14 bg-white">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6">
        <SectionTitle title="บทความ" sub="ความรู้และเคล็ดลับสำหรับการสั่งสินค้าจากญี่ปุ่น" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {ARTICLES.map(({ category, categoryColor, title, excerpt, date, readTime }) => (
            <div
              key={title}
              className="bg-sakura-50 border border-card-border rounded-2xl shadow-card hover:shadow-card-hover transition-shadow overflow-hidden group cursor-pointer"
            >
              {/* Placeholder image */}
              <div className="bg-gradient-to-br from-sakura-200 to-sakura-300 h-36 flex items-center justify-center">
                <BookOpen className="w-10 h-10 text-sakura-500" />
              </div>
              <div className="p-4">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${categoryColor}`}>
                  {category}
                </span>
                <h3 className="font-bold text-sakura-900 text-sm mt-2 leading-snug group-hover:text-violet-700 transition-colors">
                  {title}
                </h3>
                <p className="text-xs text-sakura-600 mt-2 leading-relaxed line-clamp-2">{excerpt}</p>
                <div className="flex items-center gap-3 mt-3 text-[11px] text-sakura-400">
                  <span>{date}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{readTime}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <button className="px-6 py-2.5 border border-sakura-300 rounded-full text-sm text-sakura-700 hover:bg-sakura-50 transition-colors font-medium">
            ดูบทความทั้งหมด
          </button>
        </div>
      </div>
    </section>
  );
}

// ─── About ────────────────────────────────────────────────────────────────────

function AboutSection() {
  return (
    <section className="py-14 bg-body">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <SectionTitle title="เกี่ยวกับเรา" />
          <p className="text-sakura-700 text-sm md:text-base leading-relaxed">
            <strong className="text-sakura-900">Sakura Buying Service</strong> คือบริการตัวแทนซื้อและนำเข้าสินค้าจากญี่ปุ่น
            ก่อตั้งโดยทีมงานที่มีประสบการณ์มากกว่า 5 ปีในวงการนำเข้าสินค้าญี่ปุ่น
            เราเชี่ยวชาญทั้งการประมูล Yahoo Auctions การซื้อตรงจาก Mercari, Rakuten
            และช้อปปิ้งออนไลน์ญี่ปุ่นทุกประเภท
          </p>
          <p className="mt-4 text-sakura-700 text-sm md:text-base leading-relaxed">
            ด้วยโกดังสินค้าในญี่ปุ่นและทีมงานท้องถิ่น เราสามารถตรวจสอบ จัดเก็บ
            และจัดส่งสินค้าได้อย่างรวดเร็วและปลอดภัย ตอบโจทย์คนไทยที่รักสินค้าญี่ปุ่น
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {[
              { icon: CheckCircle, label: "สินค้าของแท้ 100%" },
              { icon: Shield, label: "ระบบชำระเงินปลอดภัย" },
              { icon: Truck, label: "จัดส่งทั่วประเทศ" },
              { icon: Users, label: "ทีมงานพร้อมช่วยเหลือ" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-sm text-sakura-700 bg-white border border-card-border rounded-full px-4 py-2 shadow-card">
                <Icon className="w-4 h-4 text-violet-500" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="bg-gradient-header text-white">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <h2 className="text-xl font-extrabold tracking-tight mb-3">🌸 Sakura</h2>
            <p className="text-sm text-white/70 leading-relaxed max-w-xs">
              บริการตัวแทนซื้อและนำเข้าสินค้าจากญี่ปุ่น ครบวงจร เชื่อถือได้ ในราคาที่เป็นธรรม
            </p>
            <div className="flex gap-3 mt-5">
              {["f", "ig", "yt", "line"].map((s) => (
                <button
                  key={s}
                  className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-xs font-bold hover:bg-white/20 transition-colors"
                >
                  {s === "f" ? "f" : s === "ig" ? "📸" : s === "yt" ? "▶" : "🟢"}
                </button>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-white/90">บริการ</h3>
            <ul className="space-y-2 text-sm text-white/60">
              {["ประมูลสินค้า", "ซื้อตรง (Buy Now)", "จัดส่งรวม Lot", "ตรวจสอบสินค้า", "คำนวณค่าส่ง"].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-white transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3 text-white/90">ข้อมูล</h3>
            <ul className="space-y-2 text-sm text-white/60">
              {["เกี่ยวกับเรา", "วิธีสั่งสินค้า", "บทความ", "โปรโมชั่น", "ติดต่อเรา"].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-white transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <p>© 2026 Sakura Buying Service. สงวนลิขสิทธิ์ทุกประการ</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white/70 transition-colors">นโยบายความเป็นส่วนตัว</a>
            <a href="#" className="hover:text-white/70 transition-colors">เงื่อนไขการใช้งาน</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export default function HomeTab() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <ExchangeRateSection />
      <PlatformsSection />
      <ServicesSection />
      <HowToOrderSection />
      <LotShippingSection />
      <PromotionsSection />
      <ArticlesSection />
      <AboutSection />
      <Footer />
    </div>
  );
}
