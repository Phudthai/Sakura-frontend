"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Package, Upload } from "lucide-react";
import { API_ENDUSER_PREFIX } from "@/lib/api-config";
import { UploadSlipModal } from "@/components/check-status/upload-slip-modal";

type SlipStatus = {
  status: "PENDING_VERIFICATION" | "CONFIRMED" | "REJECTED";
  slipImageUrl?: string;
  rejectionReason?: string | null;
};

export type DomesticPendingItem = Record<string, unknown>;

export type DomesticPendingData = {
  userId?: string | number;
  userCode?: string;
  username?: string;
  pendingDomesticItemCount?: number;
  domesticPendingBaht?: number;
  items?: DomesticPendingItem[];
};

function pickString(obj: DomesticPendingItem, keys: string[]): string | undefined {
  for (const k of keys) {
    const v = obj[k];
    if (v != null && typeof v === "string" && v.trim() !== "") return v;
  }
  return undefined;
}

function pickNumber(obj: DomesticPendingItem, keys: string[]): number | undefined {
  for (const k of keys) {
    const v = obj[k];
    if (typeof v === "number" && !Number.isNaN(v)) return v;
    if (typeof v === "string" && v.trim() !== "") {
      const n = Number(v);
      if (!Number.isNaN(n)) return n;
    }
  }
  return undefined;
}

function itemDisplayName(it: DomesticPendingItem): string {
  const n = pickString(it, ["name", "productName", "title", "itemName"]);
  if (n) return n;
  const id = it["id"];
  if (id != null && String(id) !== "") return `รายการ ${String(id)}`;
  return "—";
}

function itemImageUrl(it: DomesticPendingItem): string | undefined {
  return pickString(it, ["imageUrl", "image", "thumbnailUrl", "photoUrl"]);
}

function itemLot(it: DomesticPendingItem): string | undefined {
  const lotRaw = it["lot"];
  if (lotRaw != null && typeof lotRaw === "object" && !Array.isArray(lotRaw)) {
    const nested = lotRaw as Record<string, unknown>;
    const code = nested["lotCode"];
    if (typeof code === "string" && code.trim() !== "") return code;
    if (code != null && typeof code !== "object") return String(code);
  }
  const topLotCode = pickString(it, ["lotCode"]);
  if (topLotCode) return topLotCode;
  const s = pickString(it, ["lotNumber", "lotNo", "lotId", "batchLot"]);
  if (s) return s;
  if (typeof lotRaw === "string" && lotRaw.trim() !== "") return lotRaw;
  const n = pickNumber(it, ["lotNumber"]);
  if (n != null) return String(n);
  return undefined;
}

export default function DomesticPendingTab() {
  const [data, setData] = useState<DomesticPendingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slipStatus, setSlipStatus] = useState<SlipStatus | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setUnauthorized(false);
    setError(null);
    try {
      const res = await fetch(
        `${API_ENDUSER_PREFIX}/check-status/domestic-pending-items`
      );
      const json = await res.json();

      if (res.status === 401) {
        setUnauthorized(true);
        setData(null);
        return;
      }

      if (!res.ok || !json.success) {
        const msg =
          json.error?.message ??
          (typeof json.message === "string" ? json.message : "โหลดข้อมูลไม่สำเร็จ");
        setError(msg);
        setData(null);
        return;
      }

      const d = json.data as DomesticPendingData | undefined;
      setData(
        d ?? {
          items: [],
          pendingDomesticItemCount: 0,
          domesticPendingBaht: 0,
        }
      );
    } catch {
      setError("ไม่สามารถเชื่อมต่อได้ กรุณาลองใหม่");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const fetchSlipStatus = useCallback(async () => {
    try {
      const res = await fetch(
        `${API_ENDUSER_PREFIX}/check-status/slip-status?purpose=domestic`
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
  }, []);

  const items = Array.isArray(data?.items) ? data!.items! : [];
  const count = data?.pendingDomesticItemCount ?? items.length;
  const baht = data?.domesticPendingBaht ?? 0;

  useEffect(() => {
    if (!loading && !error && data !== null && baht > 0) {
      fetchSlipStatus();
    }
  }, [loading, error, data, baht, fetchSlipStatus]);

  const handleSubmitSlip = async (file: File) => {
    setUploadError(null);
    setUploadLoading(true);
    try {
      const formData = new FormData();
      formData.append("slip", file);
      const res = await fetch(
        `${API_ENDUSER_PREFIX}/check-status/submit-slip?purpose=domestic`,
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
          rejectionReason: json.data?.rejectionReason ?? null,
        });
        setUploadModalOpen(false);
        load();
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
          load();
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

  if (unauthorized) {
    return (
      <div className="max-w-[1400px] mx-auto px-3 sm:px-4 md:px-6 pb-8 mt-6">
        <div className="rounded-xl border border-card-border bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-8 text-center">
          <p className="text-sakura-900 font-medium mb-4">กรุณาเข้าสู่ระบบเพื่อดูรายการสินค้าที่รอจัดส่งในไทย</p>
          <Link
            href="/login"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-sakura-700 text-white font-semibold hover:bg-sakura-800 transition-colors"
          >
            เข้าสู่ระบบ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-3 sm:px-4 md:px-6 pb-6 sm:pb-8 space-y-4 sm:space-y-6">
      <div className="mt-4 sm:mt-6 rounded-xl sm:rounded-2xl border border-card-border bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)] overflow-hidden">
        {error && (
          <div className="px-4 py-4">
            <p className="text-sm text-red-600">{error}</p>
            <button
              type="button"
              onClick={() => load()}
              className="mt-2 text-sm font-semibold text-sakura-700 hover:underline"
            >
              ลองอีกครั้ง
            </button>
          </div>
        )}

        {!error && (
          <>
            {/* Summary + user */}
            <div className="p-4 sm:p-6 md:p-8 space-y-6">
              <div className="flex flex-wrap justify-end gap-2 sm:gap-3 w-full">
                <div className="px-4 py-3 rounded-xl bg-white/80 border border-sakura-200/60 text-center min-w-[140px] max-w-[220px]">
                  <p className="text-xs text-muted-dark mb-0.5">รหัสลูกค้า</p>
                  <p className="text-sm font-semibold text-sakura-800 truncate">
                    {loading ? "—" : (data?.userCode ?? "—")}
                  </p>
                </div>
                <div className="px-4 py-3 rounded-xl bg-white/80 border border-sakura-200/60 text-center min-w-[140px] max-w-[220px]">
                  <p className="text-xs text-muted-dark mb-0.5">ชื่อผู้ใช้งาน</p>
                  <p className="text-sm font-semibold text-sakura-800 truncate">
                    {loading ? "—" : (data?.username ?? "—")}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:flex sm:flex-wrap sm:gap-8 md:gap-12 gap-4">
                {loading ? (
                  <>
                    <div className="min-w-0 text-center sm:flex-1 space-y-2">
                      <div className="skeleton-shimmer h-3 w-24 rounded mx-auto" />
                      <div className="skeleton-shimmer h-8 w-20 rounded mx-auto" />
                    </div>
                    <div className="min-w-0 text-center sm:flex-1 space-y-2">
                      <div className="skeleton-shimmer h-3 w-28 rounded mx-auto" />
                      <div className="skeleton-shimmer h-8 w-24 rounded mx-auto" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="min-w-0 text-center sm:flex-1 sm:min-w-[120px]">
                      <p className="text-xs sm:text-sm font-medium text-muted-dark uppercase tracking-wider mb-0.5 sm:mb-1">
                        จำนวนรายการ
                      </p>
                      <p className="text-2xl sm:text-3xl font-bold text-sakura-900 tracking-tight">
                        {count.toLocaleString("th-TH")}
                      </p>
                    </div>
                    <div className="min-w-0 text-center sm:flex-1 sm:min-w-[120px]">
                      <p className="text-xs sm:text-sm font-medium text-amber-800/90 uppercase tracking-wider mb-0.5 sm:mb-1">
                        ยอดที่ต้องชำระ (บาท)
                      </p>
                      <p className="text-2xl sm:text-3xl font-bold text-amber-800 tracking-tight break-all">
                        {baht.toLocaleString("th-TH")}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* อัพโหลดสลิปจัดส่งในไทย — เมื่อยอดที่ต้องชำระ > 0 */}
            {baht > 0 && !loading && (
              <div className="border-t border-sakura-100 px-4 sm:px-6 md:px-8 py-4 sm:py-5">
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
                      สถานะสลิป (จัดส่งในไทย): {slipStatusLabel}
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

            {/* Items */}
            <div className="border-t border-sakura-100">
              <div className="px-4 py-3 border-b border-sakura-100 bg-sakura-50/50 md:px-6">
                <h4 className="text-sm font-semibold text-sakura-800">
                  {loading
                    ? "รายการสินค้า"
                    : `รายการสินค้า (${items.length} รายการ)`}
                </h4>
              </div>

              {/* Mobile */}
              <div className="md:hidden">
                {loading ? (
                  <div className="divide-y divide-sakura-100">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="p-4 flex gap-3">
                        <div className="skeleton-shimmer w-14 h-14 rounded-xl shrink-0" />
                        <div className="flex-1 space-y-2 pt-1">
                          <div className="skeleton-shimmer h-3.5 w-3/4 rounded" />
                          <div className="skeleton-shimmer h-3 w-1/3 rounded" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : items.length === 0 ? (
                  <div className="p-8 text-center text-sm text-muted-dark">
                    ไม่มีสินค้าที่รอจัดส่งในไทย
                  </div>
                ) : (
                  <div className="divide-y divide-sakura-100">
                    {items.map((it, i) => {
                      const name = itemDisplayName(it);
                      const img = itemImageUrl(it);
                      const lot = itemLot(it);
                      return (
                        <div
                          key={pickString(it, ["id"]) ?? `row-${i}`}
                          className="p-4 flex gap-3 bg-white"
                        >
                          <div className="w-14 h-14 rounded-xl overflow-hidden bg-sakura-100 relative shrink-0">
                            {img ? (
                              <Image
                                src={img}
                                alt={name}
                                fill
                                className="object-cover"
                                sizes="56px"
                                unoptimized
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-sakura-400">
                                <Package className="w-6 h-6" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-sakura-900 line-clamp-2 mb-1">
                              {name}
                            </p>
                            <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-dark">
                              {lot != null && <span>Lot {lot}</span>}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Desktop table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full min-w-[640px]">
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
                      <th className="px-5 py-4 text-left text-xs font-semibold text-muted-dark uppercase tracking-wider">
                        Lot
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <tr
                          key={i}
                          className="border-b border-sakura-100 last:border-b-0"
                        >
                          <td className="px-5 py-4">
                            <div className="skeleton-shimmer h-4 w-4 rounded" />
                          </td>
                          <td className="px-5 py-4">
                            <div className="skeleton-shimmer w-12 h-12 rounded-xl" />
                          </td>
                          <td className="px-5 py-4">
                            <div className="skeleton-shimmer h-4 w-48 rounded" />
                          </td>
                          <td className="px-5 py-4">
                            <div className="skeleton-shimmer h-4 w-20 rounded" />
                          </td>
                        </tr>
                      ))
                    ) : items.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-5 py-10 text-center text-sm text-muted-dark"
                        >
                          ไม่มีสินค้าที่รอจัดส่งในไทย
                        </td>
                      </tr>
                    ) : (
                      items.map((it, i) => {
                        const name = itemDisplayName(it);
                        const img = itemImageUrl(it);
                        const lot = itemLot(it);
                        return (
                          <tr
                            key={pickString(it, ["id"]) ?? `row-${i}`}
                            className="border-b border-sakura-100 last:border-b-0 hover:bg-sakura-50/40 transition-colors"
                          >
                            <td className="px-5 py-4 text-sm text-muted-dark">
                              {i + 1}
                            </td>
                            <td className="px-5 py-4">
                              <div className="w-12 h-12 rounded-xl overflow-hidden bg-sakura-100 relative shadow-sm">
                                {img ? (
                                  <Image
                                    src={img}
                                    alt={name}
                                    fill
                                    className="object-cover"
                                    sizes="48px"
                                    unoptimized
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-sakura-400">
                                    <Package className="w-5 h-5" />
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-5 py-4">
                              <span className="text-sm font-medium text-sakura-900 line-clamp-2">
                                {name}
                              </span>
                            </td>
                            <td className="px-5 py-4 text-sm text-sakura-800 font-medium">
                              {lot ?? "—"}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      <UploadSlipModal
        open={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onSubmit={handleSubmitSlip}
        loading={uploadLoading}
        error={uploadError}
      />
    </div>
  );
}
