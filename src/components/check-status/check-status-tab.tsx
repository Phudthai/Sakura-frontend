"use client";

import { useState } from "react";
import Image from "next/image";
import { Ship, Plane, Check, ChevronDown, Calendar } from "lucide-react";
import { formatJPY } from "@/lib/utils";

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
  const totalBaht = products.reduce((s, p) => s + p.baht + p.shipShippingCost, 0);
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
    <div className="max-w-[1400px] mx-auto px-4 md:px-6 pb-8">
      <div className="mt-6 bg-white rounded-2xl border border-card-border shadow-[0_4px_24px_rgba(0,0,0,0.06)] overflow-hidden">
        {/* แถวบน: เลือกเดือน | Customer ID */}
        <div className="flex items-center justify-between gap-4 px-6 py-5 border-b border-sakura-100 bg-gradient-to-r from-sakura-50/80 to-white">
          <div className="px-5 py-3 rounded-xl bg-sakura-50/70 border border-sakura-300/70 flex items-center gap-3 shadow-sm">
            <Calendar className="w-4 h-4 text-sakura-600 shrink-0" />
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-sakura-700">เลือกเดือน</label>
              <div className="relative">
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2 rounded-lg border border-sakura-200/80 bg-white text-sakura-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-sakura-300/60 min-w-[52px]"
                >
                  {MOCK_MONTHS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-sakura-400 pointer-events-none" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-5 py-3 rounded-xl bg-white/60 border border-sakura-200/50">
              <p className="text-xs text-muted-dark mb-0.5">ชื่อผู้ใช้งาน</p>
              <p className="text-base font-semibold text-sakura-800">@meee_sg</p>
            </div>
            <div className="px-5 py-3 rounded-xl bg-white/60 border border-sakura-200/50 text-right">
              <p className="text-xs text-muted-dark mb-0.5">Customer ID</p>
              <p className="text-base font-semibold text-sakura-800">B631</p>
            </div>
          </div>
        </div>

        {/* Tab เรือ | เครื่องบิน */}
        <div className="flex gap-2 px-6 pt-5 pb-3">
          <button
            type="button"
            onClick={() => setTransportType("ship")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all
              ${
                transportType === "ship"
                  ? "bg-sakura-700 text-white shadow-md"
                  : "bg-sakura-50 text-muted-dark hover:bg-sakura-100 hover:text-sakura-800 border border-sakura-200/60"
              }`}
          >
            <Ship className="w-4 h-4" />
            เรือ
          </button>
          <button
            type="button"
            onClick={() => setTransportType("airplane")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all
              ${
                transportType === "airplane"
                  ? "bg-sakura-700 text-white shadow-md"
                  : "bg-sakura-50 text-muted-dark hover:bg-sakura-100 hover:text-sakura-800 border border-sakura-200/60"
              }`}
          >
            <Plane className="w-4 h-4" />
            เครื่องบิน
          </button>
        </div>

        <div className="px-6 pb-6 pt-1">
            {/* Legend */}
            <div className="flex flex-col gap-2 p-4 rounded-xl bg-emerald-50/50 border border-emerald-100 mb-6">
              <div className="flex items-center gap-2">
                <CheckboxTick size="md" />
                <span className="text-sm font-semibold text-sakura-800">
                   = ถึงบ้านญี่ปุ่นแล้ว
                </span>
              </div>
              <p className="text-xs text-muted-dark pl-7 leading-relaxed">
                ถ้า 10 วันแล้วสินค้ายังไม่ถึงบ้านญี่ปุ่นซักที
                ให้ส่งลิ้งให้แอดมินตรวจสอบนะคะ
              </p>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="rounded-xl border border-sakura-200/80 bg-white p-5 shadow-sm">
                <p className="text-xs font-medium text-muted-dark uppercase tracking-wider mb-2">เงินทั้งหมด</p>
                <p className="text-2xl sm:text-3xl font-bold text-sakura-900 tracking-tight">
                  {totalBaht.toLocaleString("th-TH")}
                </p>
              </div>
              <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/30 p-5 shadow-sm">
                <p className="text-xs font-medium text-emerald-700/80 uppercase tracking-wider mb-2">ชำระเสร็จแล้ว</p>
                <p className="text-2xl sm:text-3xl font-bold text-emerald-700 tracking-tight">
                  {paid.toLocaleString("th-TH")}
                </p>
              </div>
              <div className="rounded-xl border border-amber-200/80 bg-amber-50/30 p-5 shadow-sm">
                <p className="text-xs font-medium text-amber-700/80 uppercase tracking-wider mb-2">ยอดค้างชำระ</p>
                <p
                  className={`text-2xl sm:text-3xl font-bold tracking-tight ${
                    outstanding < 0 ? "text-red-600" : "text-amber-700"
                  }`}
                >
                  {outstanding.toLocaleString("th-TH")}
                </p>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="border-t border-sakura-100 overflow-x-auto">
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
                        {p.arrivedAtJapan && (
                          <CheckboxTick size="sm" />
                        )}
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
        </div>
    </div>
  );
}
