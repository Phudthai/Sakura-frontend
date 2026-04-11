"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/layout/header";
import SearchLinkTab, {
  type AuctionPlatform,
} from "@/components/search-link/search-link-tab";
import CheckStatusTab from "@/components/check-status/check-status-tab";
import DomesticPendingTab from "@/components/check-status/domestic-pending-tab";
import HomeTab from "@/components/home/home-tab";

const TABS = [
  { id: "home", label: "หน้าแรก" },
  { id: "check_status", label: "เช็คสถานะสินค้า" },
  { id: "domestic_pending", label: "สินค้าที่รอจัดส่งในไทย" },
  { id: "search_link", label: "ประมูลด้วยตนเอง" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function HomeContent() {
  const searchParams = useSearchParams();
  const tab = (searchParams.get("tab") as TabId) ?? "home";
  const platform: AuctionPlatform =
    searchParams.get("platform") === "mercari" ? "mercari" : "yahoo";

  return (
    <div className="min-h-screen bg-body">
      {/* Header with tabs */}
      <Header
        tabs={TABS}
        currentTab={tab}
        auctionPlatformMenuKey={`${tab}-${platform}`}
      />

      {/* Tab: home */}
      {tab === "home" && <HomeTab />}

      {/* Tab: check_status */}
      {tab === "check_status" && <CheckStatusTab />}

      {/* Tab: domestic_pending */}
      {tab === "domestic_pending" && <DomesticPendingTab />}

      {/* Tab: search_link */}
      {tab === "search_link" && <SearchLinkTab platform={platform} />}
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense>
      <HomeContent />
    </Suspense>
  );
}
