"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Ship,
  Plane,
  Check,
  ChevronDown,
  Calendar,
  Upload,
  X,
  Loader2,
} from "lucide-react";
import { formatJPY } from "@/lib/utils";
import { API_ENDUSER_PREFIX } from "@/lib/api-config";

const MAX_SLIP_SIZE_MB = 5;
const ACCEPT_IMAGES = "image/jpeg,image/png,image/gif,image/webp";

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

// Slip status from API
type SlipStatus = {
  status: "PENDING_VERIFICATION" | "CONFIRMED" | "REJECTED";
  slipImageUrl?: string;
  rejectionReason?: string | null;
};

function UploadSlipModal({
  open,
  onClose,
  onSubmit,
  loading,
  error,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (file: File) => void;
  loading: boolean;
  error: string | null;
}) {
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > MAX_SLIP_SIZE_MB * 1024 * 1024) {
      setFile(null);
      return;
    }
    setFile(f);
  };

  const handleSubmit = () => {
    if (file) onSubmit(file);
  };

  const handleClose = () => {
    setFile(null);
    if (inputRef.current) inputRef.current.value = "";
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-sakura-900">
            อัพโหลดสลิปโอนเงิน
          </h3>
          <button
            type="button"
            onClick={handleClose}
            className="p-1 rounded-lg hover:bg-sakura-100 text-muted-dark"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-sm text-muted-dark mb-4">
          เลือกรูปสลิปโอนเงิน (jpg, png, gif, webp สูงสุด 5MB)
        </p>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT_IMAGES}
          capture="environment"
          onChange={handleFileChange}
          className="block w-full text-sm text-sakura-700 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-sakura-100 file:text-sakura-800 file:font-semibold file:cursor-pointer hover:file:bg-sakura-200"
        />
        {file && (
          <p className="mt-2 text-xs text-muted-dark truncate">{file.name}</p>
        )}
        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-sakura-200 text-sakura-800 font-semibold hover:bg-sakura-50"
          >
            ยกเลิก
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!file || loading}
            className="flex-1 px-4 py-2.5 rounded-xl bg-sakura-700 text-white font-semibold hover:bg-sakura-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                กำลังส่ง...
              </>
            ) : (
              "ส่งสลิป"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// Product item - จาก API หรือ mock
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

type CheckStatusData = {
  month: string;
  transportType: string;
  user?: { username: string; customerId: string };
  summary: { totalBaht: number; paid: number; outstanding: number };
  products: CheckStatusProduct[];
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

// Fallback เมื่อ API /months ไม่พร้อม — ใช้ year-month ตามรูปแบบ API
function getDefaultMonths(): string[] {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth() + 1;
  return [`${y}-${m}`];
}
const DEFAULT_MONTHS = getDefaultMonths();

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

function mapApiProduct(p: Record<string, unknown>): CheckStatusProduct {
  return {
    id: String(p.id ?? ""),
    name: String(p.name ?? ""),
    imageUrl: String(p.imageUrl ?? ""),
    yen: Number(p.yen ?? 0),
    baht: Number(p.baht ?? 0),
    grams: Number(p.grams ?? 0),
    shipShippingCost: Number(p.shipShippingCost ?? 0),
    paid: Number(p.paid ?? 0),
    shipRound: p.shipRound != null ? String(p.shipRound) : null,
    arrivedAtJapan: Boolean(p.arrivedAtJapan),
  };
}

export default function CheckStatusTab() {
  const [selectedMonth, setSelectedMonth] = useState<string>(DEFAULT_MONTHS[0]);
  const [transportType, setTransportType] = useState<TransportType>("airplane");
  const [months, setMonths] = useState<string[]>(DEFAULT_MONTHS);
  const [apiData, setApiData] = useState<CheckStatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [slipStatus, setSlipStatus] = useState<SlipStatus | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const fetchMonths = useCallback(async () => {
    try {
      const res = await fetch(`${API_ENDUSER_PREFIX}/check-status/months`);
      const json = await res.json();
      if (res.ok && json.success && Array.isArray(json.data?.months)) {
        const newMonths = json.data.months.map(String);
        setMonths(newMonths);
        if (newMonths.length > 0) {
          setSelectedMonth(newMonths[0]);
        }
      }
    } catch {
      // ใช้ DEFAULT_MONTHS
    }
  }, []);

  const fetchCheckStatus = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        month: selectedMonth,
        transportType,
      });
      const res = await fetch(
        `${API_ENDUSER_PREFIX}/check-status?${params}`
      );
      const json = await res.json();
      if (res.ok && json.success && json.data) {
        const d = json.data;
        const products = Array.isArray(d.products)
          ? d.products.map(mapApiProduct)
          : [];
        const summary = d.summary ?? calcSummary(products);
        setApiData({
          month: String(d.month ?? selectedMonth),
          transportType: String(d.transportType ?? transportType),
          user: d.user,
          summary: {
            totalBaht: Number(summary.totalBaht ?? 0),
            paid: Number(summary.paid ?? 0),
            outstanding: Number(summary.outstanding ?? 0),
          },
          products,
        });
      } else {
        setApiData(null);
      }
    } catch {
      setApiData(null);
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, transportType]);

  useEffect(() => {
    fetchMonths();
  }, [fetchMonths]);

  useEffect(() => {
    fetchCheckStatus();
  }, [fetchCheckStatus]);

  const fallbackProducts =
    transportType === "ship" ? MOCK_PRODUCTS_SHIP : MOCK_PRODUCTS_AIRPLANE;
  const fallbackSummary = calcSummary(fallbackProducts);

  const products = apiData?.products ?? fallbackProducts;
  const totalBaht = apiData?.summary.totalBaht ?? fallbackSummary.totalBaht;
  const paid = apiData?.summary.paid ?? fallbackSummary.paid;
  const outstanding = apiData?.summary.outstanding ?? fallbackSummary.outstanding;
  const user = apiData?.user;

  const fetchSlipStatus = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        month: selectedMonth,
        transportType,
      });
      const res = await fetch(
        `${API_ENDUSER_PREFIX}/check-status/slip-status?${params}`
      );
      const json = await res.json();
      if (res.ok && json.success && json.data?.slipStatus) {
        setSlipStatus(json.data.slipStatus);
      } else {
        setSlipStatus(null);
      }
    } catch {
      setSlipStatus(null);
    }
  }, [selectedMonth, transportType]);

  useEffect(() => {
    if (outstanding > 0) fetchSlipStatus();
  }, [outstanding, fetchSlipStatus]);

  const handleSubmitSlip = async (file: File) => {
    setUploadError(null);
    setUploadLoading(true);
    try {
      const formData = new FormData();
      formData.append("slip", file);
      const params = new URLSearchParams({
        month: selectedMonth,
        transportType,
      });
      const res = await fetch(
        `${API_ENDUSER_PREFIX}/check-status/submit-slip?${params}`,
        {
          method: "POST",
          body: formData,
        }
      );
      const json = await res.json();

      if (res.ok && json.success) {
        setSlipStatus({
          status: json.data?.status ?? "PENDING_VERIFICATION",
          slipImageUrl: json.data?.slipImageUrl,
        });
        setUploadModalOpen(false);
        fetchCheckStatus();
      } else {
        const err = json.error;
        const code = err?.code;
        const msg = err?.message ?? "ส่งสลิปไม่สำเร็จ";
        if (code === "PENDING_EXISTS") {
          setUploadError("คุณได้ส่งสลิปแล้ว รอ Staff ตรวจสอบ");
          setSlipStatus({ status: "PENDING_VERIFICATION" });
        } else if (code === "ALREADY_PAID") {
          setUploadError("ชำระเงินแล้ว");
          fetchSlipStatus();
          fetchCheckStatus();
        } else if (res.status === 401) {
          setUploadError("กรุณาเข้าสู่ระบบ");
        } else {
          setUploadError(msg);
        }
      }
    } catch {
      setUploadError("ไม่สามารถส่งสลิปได้ กรุณาลองใหม่");
    } finally {
      setUploadLoading(false);
    }
  };

  const slipStatusLabel =
    slipStatus?.status === "PENDING_VERIFICATION"
      ? "รอ Staff ตรวจสอบ"
      : slipStatus?.status === "CONFIRMED"
        ? "ชำระแล้ว"
        : slipStatus?.status === "REJECTED"
          ? `ปฏิเสธ${slipStatus.rejectionReason ? `: ${slipStatus.rejectionReason}` : ""}`
          : null;

  return (
    <div className="max-w-[1400px] mx-auto px-3 sm:px-4 md:px-6 pb-6 sm:pb-8 space-y-4 sm:space-y-6">
      {/* มือถือ: แบบเดิม - 2 การ์ดแยก */}
      {/* การ์ด 1: เลือกเดือน + ประเภทการส่ง (มือถือ) - row เดียวกัน แยกกรอบข้างใน */}
      <div className="mt-4 sm:mt-6 md:hidden bg-white rounded-xl sm:rounded-2xl border border-card-border shadow-[0_4px_24px_rgba(0,0,0,0.06)] overflow-visible">
        <div className="flex flex-row gap-3 p-4">
          <div className="rounded-xl border border-sakura-200/80 bg-sakura-50/30 p-4 flex-1 min-w-0 overflow-visible">
            <p className="text-xs font-medium text-muted-dark mb-3">
              1. เลือกเดือน
            </p>
            <div className="flex items-center gap-2 p-2 rounded-xl border border-sakura-200/80 bg-white hover:border-sakura-300/80 transition-colors overflow-visible">
              <Calendar className="w-4 h-4 text-sakura-600 shrink-0" />
              <span className="text-xs font-medium text-sakura-700 shrink-0">
                เลือกเดือน
              </span>
              <MonthSelect
                value={selectedMonth}
                options={months}
                onChange={setSelectedMonth}
              />
            </div>
          </div>
          <div className="rounded-xl border border-sakura-200/80 bg-sakura-50/30 p-4 flex-1 min-w-0">
            <p className="text-xs font-medium text-muted-dark mb-3">
              2. ประเภทการส่ง
            </p>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setTransportType("airplane")}
                className={`flex items-center justify-center gap-2 w-full px-3 py-2 rounded-xl text-sm font-semibold transition-all touch-manipulation
                  ${transportType === "airplane" ? "bg-sakura-700 text-white shadow-md" : "bg-sakura-50 text-muted-dark hover:bg-sakura-100 hover:text-sakura-800 border border-sakura-200/60"}`}
              >
                <Plane className="w-4 h-4 shrink-0" />
                เครื่องบิน
              </button>
              <button
                type="button"
                onClick={() => setTransportType("ship")}
                className={`flex items-center justify-center gap-2 w-full px-3 py-2 rounded-xl text-sm font-semibold transition-all touch-manipulation
                  ${transportType === "ship" ? "bg-sakura-700 text-white shadow-md" : "bg-sakura-50 text-muted-dark hover:bg-sakura-100 hover:text-sakura-800 border border-sakura-200/60"}`}
              >
                <Ship className="w-4 h-4 shrink-0" />
                เรือ
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
            <p className="text-sm sm:text-base font-semibold text-sakura-800 truncate">
              {user?.username ?? "—"}
            </p>
          </div>
          <div className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-white/60 border border-sakura-200/50 min-w-0 flex-1 sm:flex-initial max-w-[200px] text-center">
            <p className="text-xs text-muted-dark mb-0.5">Customer ID</p>
            <p className="text-sm sm:text-base font-semibold text-sakura-800">
              {user?.customerId ?? "—"}
            </p>
          </div>
        </div>
      </div>

      {/* PC: กรอบเดียว - ซ้าย=เลือกเดือน+จัดส่ง | ขวา=ผู้ใช้งาน */}
      <div className="hidden md:block mt-4 sm:mt-6 bg-white rounded-xl sm:rounded-2xl border border-card-border shadow-[0_4px_24px_rgba(0,0,0,0.06)] overflow-visible">
        <div className="flex flex-row md:gap-0 p-4 sm:p-4">
          <div className="flex flex-row gap-3 flex-1 pr-6 border-r border-sakura-200/80">
            <div className="rounded-xl border border-sakura-200/80 bg-sakura-50/30 p-4 flex-1 overflow-visible">
              <p className="text-xs font-medium text-muted-dark mb-3">
                1. เลือกเดือน
              </p>
              <div className="flex items-center gap-3 p-3 rounded-xl border border-sakura-200/80 bg-white hover:border-sakura-300/80 transition-colors overflow-visible">
                <Calendar className="w-5 h-5 text-sakura-600 shrink-0" />
                <span className="text-sm font-medium text-sakura-700 shrink-0">
                  เลือกเดือน
                </span>
                <MonthSelect
                  value={selectedMonth}
                  options={months}
                  onChange={setSelectedMonth}
                />
              </div>
            </div>
            <div className="rounded-xl border border-sakura-200/80 bg-sakura-50/30 p-4 flex-1">
              <p className="text-xs font-medium text-muted-dark mb-3">
                2. ประเภทการส่ง
              </p>
              <div className="flex flex-row gap-2">
                <button
                  type="button"
                  onClick={() => setTransportType("airplane")}
                  className={`flex items-center justify-center gap-2.5 flex-1 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all
              ${transportType === "airplane" ? "bg-sakura-700 text-white shadow-md" : "bg-sakura-50 text-muted-dark hover:bg-sakura-100 hover:text-sakura-800 border border-sakura-200/60"}`}
                >
                  <Plane className="w-5 h-5 shrink-0" />
                  เครื่องบิน
                </button>
                <button
                  type="button"
                  onClick={() => setTransportType("ship")}
                  className={`flex items-center justify-center gap-2.5 flex-1 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all
              ${transportType === "ship" ? "bg-sakura-700 text-white shadow-md" : "bg-sakura-50 text-muted-dark hover:bg-sakura-100 hover:text-sakura-800 border border-sakura-200/60"}`}
                >
                  <Ship className="w-5 h-5 shrink-0" />
                  เรือ
                </button>
              </div>
            </div>
          </div>
          <div className="flex-1 pl-6">
            <div className="rounded-xl border border-sakura-200/80 bg-sakura-50/30 p-4 h-full">
              <p className="text-xs font-medium text-muted-dark mb-3">
                ข้อมูลผู้ใช้งาน
              </p>
              <div className="flex flex-row flex-wrap gap-2 sm:gap-3">
                <div className="px-4 py-3 rounded-lg bg-white/80 border border-sakura-200/60 text-center flex-1 min-w-0">
                  <p className="text-xs text-muted-dark mb-0.5">
                    ชื่อผู้ใช้งาน
                  </p>
                  <p className="text-sm sm:text-base font-semibold text-sakura-800 truncate">
                    {user?.username ?? "—"}
                  </p>
                </div>
                <div className="px-4 py-3 rounded-lg bg-white/80 border border-sakura-200/60 text-center flex-1 min-w-0">
                  <p className="text-xs text-muted-dark mb-0.5">Customer ID</p>
                  <p className="text-sm sm:text-base font-semibold text-sakura-800">
                    {user?.customerId ?? "—"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ส่วนที่ 3: Content Card - layout แนวนอน ซ้าย label ขวา value + wavy pattern */}
      <div className="relative overflow-hidden rounded-xl sm:rounded-2xl border border-card-border bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
        {loading && (
          <div className="absolute inset-0 bg-white/70 z-10 flex items-center justify-center rounded-xl">
            <div className="flex items-center gap-2 text-sakura-700">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm font-medium">กำลังโหลด...</span>
            </div>
          </div>
        )}
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

      {/* ปุ่มอัพโหลดสลิป + สถานะสลิป — แสดงเมื่อยอดค้างชำระ > 0 */}
      {outstanding > 0 && (
        <div className="rounded-xl sm:rounded-2xl border border-card-border bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)] px-4 sm:px-6 md:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {slipStatusLabel && (
              <p
                className={`text-sm font-semibold ${
                  slipStatus?.status === "CONFIRMED"
                    ? "text-emerald-600"
                    : slipStatus?.status === "REJECTED"
                      ? "text-red-600"
                      : "text-amber-600"
                }`}
              >
                สถานะสลิป: {slipStatusLabel}
              </p>
            )}
            <button
              type="button"
              onClick={() => {
                setUploadError(null);
                setUploadModalOpen(true);
              }}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-sakura-700 text-white font-semibold hover:bg-sakura-800 transition-colors"
            >
              <Upload className="w-4 h-4" />
              อัพโหลดสลิปโอนเงิน
            </button>
          </div>
        </div>
      )}

      <UploadSlipModal
        open={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onSubmit={handleSubmitSlip}
        loading={uploadLoading}
        error={uploadError}
      />

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
