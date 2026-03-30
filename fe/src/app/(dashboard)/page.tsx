"use client";

import { Download, Plus, Wallet, GitBranch, Target, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { PipelineChart } from "@/components/dashboard/PipelineChart";
import { Leaderboard } from "@/components/dashboard/Leaderboard";
import { RecentDeals } from "@/components/dashboard/RecentDeals";
import { UpcomingActivities } from "@/components/dashboard/UpcomingActivities";

export default function DashboardPage() {
  return (
    <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

      {/* ── Top bar ────────────────────────────────────────────────────────── */}
      <header className="h-14 shrink-0 border-b bg-background flex items-center justify-between px-6 gap-3">
        <h1
          className="text-foreground tracking-tight"
          style={{ fontSize: 15, fontWeight: 600, lineHeight: 1 }}
        >
          Dashboard
        </h1>

        <div className="flex items-center gap-2">
          {/* Period tabs */}
          <Tabs defaultValue="month">
            <TabsList className="h-8 gap-0 p-0.5">
              <TabsTrigger value="week"    className="h-7 px-3 text-xs rounded-lg">Tuần này</TabsTrigger>
              <TabsTrigger value="month"   className="h-7 px-3 text-xs rounded-lg">Tháng này</TabsTrigger>
              <TabsTrigger value="quarter" className="h-7 px-3 text-xs rounded-lg">Quý này</TabsTrigger>
            </TabsList>
          </Tabs>

          <Separator orientation="vertical" className="h-5 mx-0.5" />

          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 border-border text-muted-foreground hover:text-foreground text-xs"
          >
            <Download className="size-3.5" />
            Xuất báo cáo
          </Button>

          <Button size="sm" className="h-8 gap-1.5 text-xs">
            <Plus className="size-3.5" />
            Thêm deal
          </Button>
        </div>
      </header>

      {/* ── Main content ───────────────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto p-6 space-y-5 bg-[#F8F8F7]">

        {/* Welcome strip */}
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground" style={{ fontSize: 13 }}>
            Chào buổi sáng,{" "}
            <strong className="text-foreground" style={{ fontWeight: 600 }}>
              Nguyễn Minh
            </strong>{" "}
            👋
          </p>
          <span
            className="text-muted-foreground bg-background border border-border rounded-md px-2.5 py-1"
            style={{ fontSize: 11 }}
          >
            Thứ Ba, 24 tháng 3, 2026
          </span>
        </div>

        {/* ── Metric cards ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-4 gap-4">
          <MetricCard
            label="Tổng deal value"
            value="2.4 tỷ"
            trend={{ value: "+12%", positive: true }}
            subtext="So với tháng trước"
            icon={Wallet}
          />
          <MetricCard
            label="Deals đang mở"
            value="38"
            trend={{ value: "+5 tuần này", positive: true }}
            subtext="Đang trong pipeline"
            icon={GitBranch}
          />
          <MetricCard
            label="Tỷ lệ chốt"
            value="28%"
            trend={{ value: "−3%", positive: false }}
            subtext="So với tháng trước"
            icon={Target}
            iconBg="#FEE2E2"
            iconColor="#A32D2D"
          />
          <MetricCard
            label="Doanh thu tháng"
            value="340tr"
            icon={TrendingUp}
            progress={{ current: 340, target: 500, label: "Target: 500tr" }}
          />
        </div>

        {/* ── Charts row ───────────────────────────────────────────────────── */}
        <div className="grid gap-4" style={{ gridTemplateColumns: "3fr 2fr", minHeight: 340 }}>
          <PipelineChart />
          <Leaderboard />
        </div>

        {/* ── Bottom row ───────────────────────────────────────────────────── */}
        <div className="grid gap-4" style={{ gridTemplateColumns: "3fr 2fr" }}>
          <RecentDeals />
          <UpcomingActivities />
        </div>

      </main>
    </div>
  );
}
