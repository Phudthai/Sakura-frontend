"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Ship, Plane, Check, ChevronDown, Calendar } from "lucide-react";
import { formatJPY } from "@/lib/utils";

// Custom dropdown แทน native select - ควบคุม styling ได้ ไม่มีช่องว่าง
function MonthSelect({
  value,
  options,
  onChange,
}: {
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative flex-1 min-w-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-2 py-1.5 pr-1 text-sakura-900 text-base font-semibold focus:outline-none focus:ring-2 focus:ring-sakura-300 rounded-lg"
      >
        <span className="flex-1 text-center">{value}</span>
        <ChevronDown
          className={`w-5 h-5 text-sakura-400 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="absolute left-0 right-0 top-full mt-0.5 z-50 rounded-lg border border-sakura-200 bg-white shadow-lg py-1 max-h-48 overflow-y-auto">
          {options.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                onChange(m);
                setOpen(false);
              }}
              className={`w-full px-4 py-2.5 text-left text-sm font-medium transition-colors
                ${value === m ? "bg-sakura-100 text-sakura-800" : "text-sakura-700 hover:bg-sakura-50"}`}
            >
              {m}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ติ๊กถูกแบบ 3D - เห็นชัด
function CheckboxTick({ size = "md" }: { size?: "sm" | "md" }) {
  const s = size === "sm" ? "w-5 h-5" : "w-6 h-6";
  const iconS = size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5";
  return (
    <div
      className={`${s} rounded-md bg-emerald-500 flex items-center justify-center shadow-[0_2px_4px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.3)] shrink-0`}
      title="ถึงบ้านญี่ปุ่นแล้ว"
    >
      <Check className={`${iconS} text-white stroke-[3]`} />
    </div>
  );
}

// Mock product item - ตรงกับ reference design
type CheckStatusProduct = {
  id: string;
  name: string;
  imageUrl: string;
  yen: number;
  baht: number;
  grams: number;
  shipShippingCost: number;
  paid: number;
  shipRound: string | null;
  arrivedAtJapan: boolean;
};

// Mock data จาก reference - เรือ
const MOCK_PRODUCTS_SHIP: CheckStatusProduct[] = [
  {
    id: "s1",
    name: "赤レンガ倉庫ストロベリーフェスティバル",
    imageUrl: "https://picsum.photos/seed/strawberry1/64/64",
    yen: 1700,
    baht: 442,
    grams: 95,
    shipShippingCost: 34,
    paid: 300,
    shipRound: null,
    arrivedAtJapan: false,
  },
  {
    id: "s2",
    name: "赤レンガ倉庫いちごフェス2024",
    imageUrl: "https://picsum.photos/seed/strawberry2/64/64",
    yen: 1999,
    baht: 520,
    grams: 193,
    shipShippingCost: 68,
    paid: 200,
    shipRound: null,
    arrivedAtJapan: false,
  },
  {
    id: "s3",
    name: "(コメント後即日発送可) タンクトップ",
    imageUrl: "https://picsum.photos/seed/tank1/64/64",
    yen: 1055,
    baht: 280,
    grams: 106,
    shipShippingCost: 38,
    paid: 400,
    shipRound: "8 มีนา",
    arrivedAtJapan: true,
  },
  {
    id: "s4",
    name: "ミニパルハートフルリングデザイン",
    imageUrl: "https://picsum.photos/seed/heart1/64/64",
    yen: 1100,
    baht: 292,
    grams: 106,
    shipShippingCost: 38,
    paid: 300,
    shipRound: "8 มีนา",
    arrivedAtJapan: true,
  },
  {
    id: "s5",
    name: "横浜ストロベリーフェスティバル",
    imageUrl: "https://picsum.photos/seed/yokohama1/64/64",
    yen: 300,
    baht: 80,
    grams: 45,
    shipShippingCost: 16,
    paid: 200,
    shipRound: "8 มีนา",
    arrivedAtJapan: true,
  },
  {
    id: "s6",
    name: "硬質ケース デコケース ホイッスル",
    imageUrl: "https://picsum.photos/seed/case1/64/64",
    yen: 2400,
    baht: 624,
    grams: 70,
    shipShippingCost: 25,
    paid: 350,
    shipRound: null,
    arrivedAtJapan: false,
  },
  {
    id: "s7",
    name: "硬質ケース デコケース ホイッスル 2",
    imageUrl: "https://picsum.photos/seed/case2/64/64",
    yen: 2400,
    baht: 624,
    grams: 77,
    shipShippingCost: 27,
    paid: 0,
    shipRound: null,
    arrivedAtJapan: false,
  },
];

// Mock เครื่องบิน - ข้อมูลตัวอย่าง
const MOCK_PRODUCTS_AIRPLANE: CheckStatusProduct[] = [
  {
    id: "a1",
    name: "Sony WH-1000XM5 ヘッドホン",
    imageUrl: "https://picsum.photos/seed/sony1/64/64",
    yen: 25000,
    baht: 6500,
    grams: 250,
    shipShippingCost: 0,
    paid: 6500,
    shipRound: null,
    arrivedAtJapan: true,
  },
  {
    id: "a2",
    name: "フィギュア 初音ミク",
    imageUrl: "https://picsum.photos/seed/fig1/64/64",
    yen: 8500,
    baht: 2210,
    grams: 180,
    shipShippingCost: 0,
    paid: 2210,
    shipRound: null,
    arrivedAtJapan: true,
  },
];

// เลือกเดือน 1, 2, 3, ...
const MOCK_MONTHS = ["1", "2", "3", "4", "5", "6"];

type TransportType = "ship" | "airplane";

function calcSummary(products: CheckStatusProduct[]) {
  const totalBaht = products.reduce(
    (s, p) => s + p.baht + p.shipShippingCost,
    0,
  );
  const paid = products.reduce((s, p) => s + p.paid, 0);
  const outstanding = totalBaht - paid;
  return { totalBaht, paid, outstanding };
}

export default function CheckStatusTab() {
  const [selectedMonth, setSelectedMonth] = useState<string>(MOCK_MONTHS[0]);
  const [transportType, setTransportType] = useState<TransportType>("ship");

  const products =
    transportType === "ship" ? MOCK_PRODUCTS_SHIP : MOCK_PRODUCTS_AIRPLANE;
  const { totalBaht, paid, outstanding } = calcSummary(products);

  return (
    <div className="max-w-[1400px] mx-auto px-3 sm:px-4 md:px-6 pb-6 sm:pb-8 space-y-4 sm:space-y-6">
      {/* มือถือ: แบบเดิม - 2 การ์ดแยก */}
      {/* การ์ด 1: เลือกเดือน + ประเภทการส่ง (มือถือ) - row เดียวกัน แยกกรอบข้างใน */}
      <div className="mt-4 sm:mt-6 md:hidden bg-white rounded-xl sm:rounded-2xl border border-card-border shadow-[0_4px_24px_rgba(0,0,0,0.06)] overflow-visible">
        <div className="flex flex-row gap-3 p-4">
          <div className="rounded-xl border border-sakura-200/80 bg-sakura-50/30 p-4 flex-1 min-w-0 overflow-visible">
            <p className="text-xs font-medium text-muted-dark mb-3">1. เลือกเดือน</p>
            <div className="flex items-center gap-2 p-2 rounded-xl border border-sakura-200/80 bg-white hover:border-sakura-300/80 transition-colors overflow-visible">
              <Calendar className="w-4 h-4 text-sakura-600 shrink-0" />
              <span className="text-xs font-medium text-sakura-700 shrink-0">เลือกเดือน</span>
              <MonthSelect value={selectedMonth} options={MOCK_MONTHS} onChange={setSelectedMonth} />
            </div>
          </div>
          <div className="rounded-xl border border-sakura-200/80 bg-sakura-50/30 p-4 flex-1 min-w-0">
            <p className="text-xs font-medium text-muted-dark mb-3">2. ประเภทการส่ง</p>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setTransportType("ship")}
                className={`flex items-center justify-center gap-2 w-full px-3 py-2 rounded-xl text-sm font-semibold transition-all touch-manipulation
                  ${transportType === "ship" ? "bg-sakura-700 text-white shadow-md" : "bg-sakura-50 text-muted-dark hover:bg-sakura-100 hover:text-sakura-800 border border-sakura-200/60"}`}
              >
                <Ship className="w-4 h-4 shrink-0" />
                เรือ
              </button>
              <button
                type="button"
                onClick={() => setTransportType("airplane")}
                className={`flex items-center justify-center gap-2 w-full px-3 py-2 rounded-xl text-sm font-semibold transition-all touch-manipulation
                  ${transportType === "airplane" ? "bg-sakura-700 text-white shadow-md" : "bg-sakura-50 text-muted-dark hover:bg-sakura-100 hover:text-sakura-800 border border-sakura-200/60"}`}
              >
                <Plane className="w-4 h-4 shrink-0" />
                เครื่องบิน
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* การ์ด 2: ผู้ใช้งาน (มือถือเท่านั้น) */}
      <div className="md:hidden bg-white rounded-xl sm:rounded-2xl border border-card-border shadow-[0_4px_24px_rgba(0,0,0,0.06)] overflow-hidden">
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-4 sm:py-5 bg-gradient-to-r from-sakura-50/80 to-white">
          <div className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-white/60 border border-sakura-200/50 min-w-0 flex-1 sm:flex-initial max-w-[200px] text-center">
            <p className="text-xs text-muted-dark mb-0.5">ชื่อผู้ใช้งาน</p>
            <p className="text-sm sm:text-base font-semibold text-sakura-800 truncate">@meee_sg</p>
          </div>
          <div className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-white/60 border border-sakura-200/50 min-w-0 flex-1 sm:flex-initial max-w-[200px] text-center">
            <p className="text-xs text-muted-dark mb-0.5">Customer ID</p>
            <p className="text-sm sm:text-base font-semibold text-sakura-800">B631</p>
          </div>
        </div>
      </div>

      {/* PC: กรอบเดียว - ซ้าย=เลือกเดือน+จัดส่ง | ขวา=ผู้ใช้งาน */}
      <div className="hidden md:block mt-4 sm:mt-6 bg-white rounded-xl sm:rounded-2xl border border-card-border shadow-[0_4px_24px_rgba(0,0,0,0.06)] overflow-visible">
        <div className="flex flex-row md:gap-0 p-4 sm:p-4">
          <div className="flex flex-row gap-3 flex-1 pr-6 border-r border-sakura-200/80">
          <div className="rounded-xl border border-sakura-200/80 bg-sakura-50/30 p-4 flex-1 overflow-visible">
            <p className="text-xs font-medium text-muted-dark mb-3">1. เลือกเดือน</p>
            <div className="flex items-center gap-3 p-3 rounded-xl border border-sakura-200/80 bg-white hover:border-sakura-300/80 transition-colors overflow-visible">
              <Calendar className="w-5 h-5 text-sakura-600 shrink-0" />
              <span className="text-sm font-medium text-sakura-700 shrink-0">เลือกเดือน</span>
              <MonthSelect value={selectedMonth} options={MOCK_MONTHS} onChange={setSelectedMonth} />
            </div>
          </div>
          <div className="rounded-xl border border-sakura-200/80 bg-sakura-50/30 p-4 flex-1">
            <p className="text-xs font-medium text-muted-dark mb-3">2. ประเภทการส่ง</p>
            <div className="flex flex-row gap-2">
          <button
            type="button"
            onClick={() => setTransportType("ship")}
            className={`flex items-center justify-center gap-2.5 flex-1 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all
              ${transportType === "ship" ? "bg-sakura-700 text-white shadow-md" : "bg-sakura-50 text-muted-dark hover:bg-sakura-100 hover:text-sakura-800 border border-sakura-200/60"}`}
          >
            <Ship className="w-5 h-5 shrink-0" />
            เรือ
          </button>
          <button
            type="button"
            onClick={() => setTransportType("airplane")}
            className={`flex items-center justify-center gap-2.5 flex-1 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all
              ${transportType === "airplane" ? "bg-sakura-700 text-white shadow-md" : "bg-sakura-50 text-muted-dark hover:bg-sakura-100 hover:text-sakura-800 border border-sakura-200/60"}`}
          >
            <Plane className="w-5 h-5 shrink-0" />
            เครื่องบิน
          </button>
            </div>
          </div>
          </div>
          <div className="flex-1 pl-6">
            <div className="rounded-xl border border-sakura-200/80 bg-sakura-50/30 p-4 h-full">
              <p className="text-xs font-medium text-muted-dark mb-3">ข้อมูลผู้ใช้งาน</p>
              <div className="flex flex-row flex-wrap gap-2 sm:gap-3">
                <div className="px-4 py-3 rounded-lg bg-white/80 border border-sakura-200/60 text-center flex-1 min-w-0">
                  <p className="text-xs text-muted-dark mb-0.5">ชื่อผู้ใช้งาน</p>
                  <p className="text-sm sm:text-base font-semibold text-sakura-800 truncate">@meee_sg</p>
                </div>
                <div className="px-4 py-3 rounded-lg bg-white/80 border border-sakura-200/60 text-center flex-1 min-w-0">
                  <p className="text-xs text-muted-dark mb-0.5">Customer ID</p>
                  <p className="text-sm sm:text-base font-semibold text-sakura-800">B631</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ส่วนที่ 3: Content Card - layout แนวนอน ซ้าย label ขวา value + wavy pattern */}
      <div className="relative overflow-hidden rounded-xl sm:rounded-2xl border border-card-border bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-4 sm:px-6 md:px-8 py-4 sm:py-6">
            {/* ซ้าย: Label + Legend */}
            <div className="min-w-0 sm:max-w-md">
              <h3 className="text-base sm:text-lg font-semibold text-sakura-900 mb-1">
                {transportType === "ship"
                  ? "สรุปสินค้าเรือ"
                  : "สรุปสินค้าเครื่องบิน"}
              </h3>
              <div className="flex items-center gap-2 mb-1">
                <CheckboxTick size="sm" />
                <span className="text-xs sm:text-sm text-muted-dark">
                  = ถึงบ้านญี่ปุ่นแล้ว
                </span>
              </div>
              <p className="text-xs text-muted-dark leading-relaxed">
                ถ้า 10 วันแล้วสินค้ายังไม่ถึงบ้านญี่ปุ่นซักที
                ให้ส่งลิ้งให้แอดมินตรวจสอบนะคะ
              </p>
            </div>
            {/* ขวา: ค่าหลัก 3 ตัว - grid บนมือถือ | PC ขยายเต็มความกว้าง */}
            <div className="grid grid-cols-3 sm:flex sm:flex-1 sm:justify-between sm:gap-8 md:gap-12 lg:gap-16 gap-3 min-w-0">
              <div className="min-w-0 text-center sm:flex-1 sm:min-w-[120px]">
                <p className="text-xs sm:text-sm font-medium text-muted-dark uppercase tracking-wider mb-0.5 sm:mb-1">
                  เงินทั้งหมด
                </p>
                <p className="text-3xl font-bold text-sakura-900 tracking-tight break-all">
                  {totalBaht.toLocaleString("th-TH")}
                </p>
              </div>
              <div className="min-w-0 text-center sm:flex-1 sm:min-w-[120px]">
                <p className="text-xs sm:text-sm font-medium text-emerald-700/80 uppercase tracking-wider mb-0.5 sm:mb-1">
                  ชำระเสร็จแล้ว
                </p>
                <p className="text-3xl font-bold text-emerald-700 tracking-tight break-all">
                  {paid.toLocaleString("th-TH")}
                </p>
              </div>
              <div className="min-w-0 text-center sm:flex-1 sm:min-w-[120px]">
                <p className="text-xs sm:text-sm font-medium text-red-600/90 uppercase tracking-wider mb-0.5 sm:mb-1">
                  ยอดค้างชำระ
                </p>
                <p className="text-3xl font-bold text-red-600 tracking-tight break-all">
                  {outstanding.toLocaleString("th-TH")}
                </p>
              </div>
            </div>
          </div>
      </div>

      {/* ส่วนที่ 4: Items - Card บนมือถือ, Table บน desktop */}
      <div className="rounded-xl sm:rounded-2xl border border-card-border bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)] overflow-hidden">
        {/* Mobile: Card layout */}
        <div className="md:hidden">
          <div className="px-4 py-3 border-b border-sakura-100 bg-sakura-50/50">
            <h4 className="text-sm font-semibold text-sakura-800">
              รายการสินค้า ({products.length} รายการ)
            </h4>
          </div>
          <div className="divide-y divide-sakura-100">
          {products.map((p, i) => (
            <div
              key={p.id}
              className={`p-4 flex gap-3 ${
                p.arrivedAtJapan ? "bg-emerald-50/50" : "bg-white"
              }`}
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-sakura-100 relative shrink-0">
                <Image
                  src={p.imageUrl}
                  alt={p.name}
                  fill
                  className="object-cover"
                  sizes="64px"
                  unoptimized
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start gap-2 mb-1">
                  {p.arrivedAtJapan && <CheckboxTick size="sm" />}
                  <span className="text-sm font-medium text-sakura-900 line-clamp-2 flex-1">
                    {p.name}
                  </span>
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-dark">
                  <span>{formatJPY(p.yen)}</span>
                  <span>{p.baht.toLocaleString("th-TH")} บาท</span>
                  <span>{p.grams}g</span>
                  <span>ส่ง {p.shipShippingCost}</span>
                  <span>โอน {p.paid}</span>
                  {p.shipRound && <span>รอบ {p.shipRound}</span>}
                </div>
              </div>
            </div>
          ))}
          </div>
        </div>
        {/* Desktop: Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-sakura-200 bg-sakura-50/70">
                <th className="w-10 px-5 py-4 text-left text-xs font-semibold text-muted-dark uppercase tracking-wider">
                  NO
                </th>
                <th className="w-14 px-5 py-4 text-left text-xs font-semibold text-muted-dark uppercase tracking-wider">
                  IMG
                </th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-muted-dark uppercase tracking-wider">
                  ชื่อสินค้า
                </th>
                <th className="px-5 py-4 text-right text-xs font-semibold text-muted-dark uppercase tracking-wider">
                  เยน
                </th>
                <th className="px-5 py-4 text-right text-xs font-semibold text-muted-dark uppercase tracking-wider">
                  บาท
                </th>
                <th className="px-5 py-4 text-right text-xs font-semibold text-muted-dark uppercase tracking-wider">
                  กีกรัม
                </th>
                <th className="px-5 py-4 text-right text-xs font-semibold text-muted-dark uppercase tracking-wider">
                  ค่าส่งเรือ
                </th>
                <th className="px-5 py-4 text-right text-xs font-semibold text-muted-dark uppercase tracking-wider">
                  โอนมาแล้ว
                </th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-muted-dark uppercase tracking-wider">
                  รอบเรือ
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => (
                <tr
                  key={p.id}
                  className={`border-b border-sakura-100 last:border-b-0 transition-colors ${
                    p.arrivedAtJapan
                      ? "bg-emerald-100/80 hover:bg-emerald-100"
                      : "hover:bg-sakura-50/40"
                  }`}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm text-muted-dark w-4">
                        {i + 1}
                      </span>
                      {p.arrivedAtJapan && <CheckboxTick size="sm" />}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-sakura-100 relative shadow-sm">
                      <Image
                        src={p.imageUrl}
                        alt={p.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                        unoptimized
                      />
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-red-500 mr-1">●</span>
                    <span className="text-sm font-medium text-sakura-900 line-clamp-2">
                      {p.name}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right text-sm text-sakura-800 font-medium">
                    {formatJPY(p.yen)}
                  </td>
                  <td className="px-5 py-4 text-right text-sm text-sakura-800 font-medium">
                    {p.baht.toLocaleString("th-TH")}
                  </td>
                  <td className="px-5 py-4 text-right text-sm text-sakura-800 font-medium">
                    {p.grams}
                  </td>
                  <td className="px-5 py-4 text-right text-sm text-sakura-800 font-medium">
                    {p.shipShippingCost}
                  </td>
                  <td className="px-5 py-4 text-right text-sm text-sakura-800 font-medium">
                    {p.paid}
                  </td>
                  <td className="px-5 py-4 text-sm text-muted-dark font-medium">
                    {p.shipRound ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* End Desktop Table */}
      </div>
    </div>
  );
}
