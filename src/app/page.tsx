"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/layout/header";
import SearchLinkTab from "@/components/search-link/search-link-tab";
import CheckStatusTab from "@/components/check-status/check-status-tab";

const TABS = [
  { id: "check_status", label: "เช็คสถานะสินค้า" },
  { id: "search_link", label: "ประมูลด้วยตนเอง" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function HomeContent() {
  const searchParams = useSearchParams();
  const tab = (searchParams.get("tab") as TabId) ?? "check_status";

  return (
    <div className="min-h-screen bg-body">
      {/* Header with tabs */}
      <Header tabs={TABS} currentTab={tab} />

      {/* Tab: check_status */}
      {tab === "check_status" && <CheckStatusTab />}

      {/* Tab: search_link */}
      {tab === "search_link" && <SearchLinkTab />}
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
