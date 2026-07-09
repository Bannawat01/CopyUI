"use client";

import { motion } from "framer-motion";
import type { PromptTheme, PreviewKind } from "@/lib/prompts";

const dim = (opacity: number) => `rgba(255,255,255,${opacity})`;

function DashboardMock({ primaryColor }: { primaryColor: string }) {
  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex h-[16%] items-center justify-between px-[3%]">
        <div className="flex items-center gap-1">
          <div
            className="h-2 w-2 rounded-sm"
            style={{ backgroundColor: primaryColor }}
          />
          <div className="h-1 w-8 rounded-full" style={{ background: dim(0.5) }} />
        </div>
        <div className="flex items-center gap-1">
          <div className="h-1.5 w-1.5 rounded-full" style={{ background: dim(0.2) }} />
          <div className="h-2.5 w-2.5 rounded-full" style={{ background: dim(0.25) }} />
        </div>
      </div>

      <div className="flex flex-1 gap-[2%] px-[3%] pb-[4%]">
        <div className="flex w-[15%] flex-col gap-1 rounded-md p-1" style={{ background: dim(0.04) }}>
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-1.5 rounded-sm"
              style={
                i === 0
                  ? { backgroundColor: `${primaryColor}33`, borderLeft: `2px solid ${primaryColor}` }
                  : { background: dim(0.06) }
              }
            />
          ))}
        </div>

        <div className="flex flex-1 flex-col gap-1.5">
          <div className="grid grid-cols-4 gap-1" style={{ height: "34%" }}>
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex flex-col justify-between rounded-md p-1"
                style={{
                  background: dim(0.05),
                  borderTop: i === 0 ? `2px solid ${primaryColor}` : undefined,
                }}
              >
                <div className="h-1 w-3/4 rounded-full" style={{ background: dim(0.15) }} />
                <div className="h-2 w-1/2 rounded-sm" style={{ background: dim(0.8) }} />
              </div>
            ))}
          </div>

          <div className="flex flex-1 gap-1.5">
            <div className="flex flex-[2] flex-col justify-end gap-[2px] rounded-md p-1.5" style={{ background: dim(0.05) }}>
              <div className="flex h-full items-end gap-1">
                {[40, 65, 45, 80, 60, 90, 70].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t-sm"
                    style={{
                      height: `${h}%`,
                      backgroundColor: i === 5 ? primaryColor : dim(0.12),
                    }}
                  />
                ))}
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-1 rounded-md p-1.5" style={{ background: dim(0.05) }}>
              {[0.5, 0.35, 0.42].map((w, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-sm px-1 py-0.5"
                  style={{ background: dim(0.04) }}
                >
                  <div className="h-1 rounded-full" style={{ width: `${w * 60}%`, background: dim(0.25) }} />
                  <div className="h-1 w-2 rounded-full" style={{ backgroundColor: `${primaryColor}88` }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HeroMock({ primaryColor }: { primaryColor: string }) {
  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex h-[16%] items-center justify-between px-[4%]">
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 rounded-sm" style={{ backgroundColor: primaryColor }} />
          <div className="h-1 w-6 rounded-full" style={{ background: dim(0.4) }} />
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-1 w-4 rounded-full" style={{ background: dim(0.2) }} />
          <div className="h-1 w-4 rounded-full" style={{ background: dim(0.2) }} />
          <div className="h-2 w-6 rounded-full" style={{ backgroundColor: primaryColor }} />
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-1.5">
        <div
          className="rounded-full px-2 py-0.5 text-[5px] font-medium uppercase tracking-widest"
          style={{ background: dim(0.08), color: dim(0.6) }}
        >
          New
        </div>
        <div className="h-2.5 w-[55%] rounded-full" style={{ background: dim(0.85) }} />
        <div className="h-2.5 w-[38%] rounded-full" style={{ backgroundColor: primaryColor }} />
        <div className="mt-1 h-1 w-[40%] rounded-full" style={{ background: dim(0.25) }} />
        <div className="mt-1.5 flex items-center gap-1.5">
          <div className="h-2.5 w-10 rounded-full" style={{ backgroundColor: primaryColor }} />
          <div className="h-2.5 w-8 rounded-full border" style={{ borderColor: dim(0.2) }} />
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 px-[4%] pb-[6%]">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="h-1.5 w-4 rounded-sm" style={{ background: dim(0.12) }} />
        ))}
      </div>
    </div>
  );
}

function PricingMock({ primaryColor }: { primaryColor: string }) {
  const cards = [
    { tall: false },
    { tall: true },
    { tall: false },
  ];
  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex h-[14%] items-center justify-center">
        <div className="flex rounded-full p-0.5" style={{ background: dim(0.06) }}>
          <div className="rounded-full px-2 py-0.5 text-[5px]" style={{ background: dim(0.12), color: dim(0.8) }}>
            Monthly
          </div>
          <div className="rounded-full px-2 py-0.5 text-[5px]" style={{ color: dim(0.35) }}>
            Yearly
          </div>
        </div>
      </div>
      <div className="flex flex-1 items-end justify-center gap-1.5 px-[6%] pb-[4%]">
        {cards.map((c, i) => (
          <div
            key={i}
            className="relative flex flex-1 flex-col gap-1 rounded-md p-1.5"
            style={{
              height: c.tall ? "96%" : "80%",
              background: dim(c.tall ? 0.07 : 0.04),
              border: c.tall ? `1.5px solid ${primaryColor}` : undefined,
            }}
          >
            {c.tall && (
              <div
                className="absolute -top-1 left-1/2 -translate-x-1/2 rounded-full px-1.5 py-0.5 text-[4px] font-medium"
                style={{ backgroundColor: primaryColor, color: "#0a0a0a" }}
              >
                POPULAR
              </div>
            )}
            <div className="h-1 w-1/2 rounded-full" style={{ background: dim(0.3) }} />
            <div className="h-2 w-2/3 rounded-sm" style={{ background: dim(0.85) }} />
            <div className="mt-0.5 flex flex-col gap-0.5">
              {[0, 1, 2].map((j) => (
                <div key={j} className="flex items-center gap-0.5">
                  <div className="h-1 w-1 rounded-full" style={{ backgroundColor: c.tall ? primaryColor : dim(0.3) }} />
                  <div className="h-1 flex-1 rounded-full" style={{ background: dim(0.15) }} />
                </div>
              ))}
            </div>
            <div
              className="mt-auto h-2 w-full rounded-sm"
              style={{ backgroundColor: c.tall ? primaryColor : dim(0.1) }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function AuthMock({ primaryColor }: { primaryColor: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div
        className="flex w-[46%] flex-col items-center gap-1.5 rounded-lg p-3"
        style={{ background: dim(0.05), border: `1px solid ${dim(0.08)}` }}
      >
        <div className="h-2 w-2 rounded-sm" style={{ backgroundColor: primaryColor }} />
        <div className="h-1.5 w-1/2 rounded-full" style={{ background: dim(0.6) }} />
        <div className="mt-1 h-2 w-full rounded-sm" style={{ background: dim(0.08) }} />
        <div className="h-2 w-full rounded-sm" style={{ background: dim(0.08) }} />
        <div className="mt-0.5 h-2 w-full rounded-sm" style={{ backgroundColor: primaryColor }} />
        <div className="flex w-full items-center gap-1 py-0.5">
          <div className="h-px flex-1" style={{ background: dim(0.1) }} />
          <div className="text-[4px]" style={{ color: dim(0.3) }}>
            OR
          </div>
          <div className="h-px flex-1" style={{ background: dim(0.1) }} />
        </div>
        <div className="flex w-full gap-1">
          <div className="h-2 flex-1 rounded-sm" style={{ background: dim(0.08) }} />
          <div className="h-2 flex-1 rounded-sm" style={{ background: dim(0.08) }} />
        </div>
      </div>
    </div>
  );
}

function PortfolioMock({ primaryColor }: { primaryColor: string }) {
  const blocks = [
    "row-span-2",
    "row-span-1",
    "row-span-1",
    "row-span-1",
    "row-span-2",
    "row-span-1",
  ];
  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex h-[14%] items-center gap-1 px-[4%]">
        {["All", "Web", "Brand", "3D"].map((label, i) => (
          <div
            key={label}
            className="rounded-full px-1.5 py-0.5 text-[5px]"
            style={
              i === 0
                ? { backgroundColor: `${primaryColor}33`, color: primaryColor }
                : { background: dim(0.06), color: dim(0.4) }
            }
          >
            {label}
          </div>
        ))}
      </div>
      <div className="grid flex-1 grid-cols-3 grid-rows-2 gap-1 px-[4%] pb-[4%]">
        {blocks.map((span, i) => (
          <div
            key={i}
            className={`relative overflow-hidden rounded-sm ${span}`}
            style={{ background: dim(i === 4 ? 0.1 : 0.06) }}
          >
            {i === 4 && (
              <div
                className="absolute inset-0 flex flex-col items-start justify-end gap-0.5 p-1"
                style={{ background: `linear-gradient(0deg, ${primaryColor}44, transparent 70%)` }}
              >
                <div className="h-1 w-3/4 rounded-full" style={{ background: dim(0.9) }} />
                <div className="h-0.5 w-1/2 rounded-full" style={{ background: dim(0.5) }} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ChangelogMock({ primaryColor }: { primaryColor: string }) {
  const entries = [
    { badge: "v2.4.0", accent: true },
    { badge: "v2.3.0", accent: false },
    { badge: "v2.2.1", accent: false },
  ];
  return (
    <div className="flex h-full w-full flex-col gap-2 p-[5%]">
      <div className="flex items-center justify-between">
        <div className="h-1.5 w-1/4 rounded-full" style={{ background: dim(0.6) }} />
        <div className="h-2 w-1/5 rounded-full" style={{ backgroundColor: `${primaryColor}55` }} />
      </div>
      <div className="relative flex flex-1 flex-col justify-around pl-3">
        <div className="absolute left-[3px] top-0 h-full w-px" style={{ background: dim(0.1) }} />
        {entries.map((entry, i) => (
          <div key={i} className="relative flex items-start gap-1.5">
            <div
              className="absolute -left-3 top-0.5 h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: entry.accent ? primaryColor : dim(0.25) }}
            />
            <div className="flex flex-1 flex-col gap-0.5">
              <div className="flex items-center gap-1">
                <div
                  className="rounded-sm px-1 text-[4px] font-medium"
                  style={{
                    backgroundColor: entry.accent ? `${primaryColor}33` : dim(0.06),
                    color: entry.accent ? primaryColor : dim(0.4),
                  }}
                >
                  {entry.badge}
                </div>
                <div className="h-1 w-8 rounded-full" style={{ background: dim(0.15) }} />
              </div>
              <div className="h-1 w-2/3 rounded-full" style={{ background: dim(0.7) }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AgencyMock({ primaryColor }: { primaryColor: string }) {
  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex h-[14%] items-center justify-between px-[4%]">
        <div className="h-1.5 w-6 rounded-full" style={{ background: dim(0.5) }} />
        <div className="flex items-center gap-1.5">
          <div className="h-1 w-4 rounded-full" style={{ background: dim(0.2) }} />
          <div className="h-1 w-4 rounded-full" style={{ background: dim(0.2) }} />
          <div className="h-2 w-6 rounded-full" style={{ backgroundColor: primaryColor }} />
        </div>
      </div>
      <div className="flex flex-col items-start justify-center gap-1 px-[4%]" style={{ height: "30%" }}>
        <div className="h-2.5 w-[60%] rounded-full" style={{ background: dim(0.85) }} />
        <div className="h-1 w-[35%] rounded-full" style={{ background: dim(0.25) }} />
      </div>
      <div className="grid flex-1 grid-cols-2 gap-1.5 px-[4%] pb-[4%]">
        {[0, 1].map((i) => (
          <div key={i} className="flex flex-col justify-end gap-0.5 rounded-md p-1.5" style={{ background: dim(0.05) }}>
            <div className="h-1 w-1/3 rounded-full" style={{ background: dim(0.15) }} />
            <div className="h-1.5 w-1/2 rounded-sm" style={{ backgroundColor: `${primaryColor}aa` }} />
          </div>
        ))}
      </div>
    </div>
  );
}

function ChatMock({ primaryColor }: { primaryColor: string }) {
  return (
    <div className="flex h-full w-full">
      <div className="flex w-[22%] flex-col gap-1 p-1.5" style={{ background: dim(0.03) }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-1.5 rounded-sm"
            style={i === 0 ? { backgroundColor: `${primaryColor}33` } : { background: dim(0.06) }}
          />
        ))}
      </div>
      <div className="flex flex-1 flex-col justify-end gap-1 p-2">
        <div className="max-w-[70%] self-start rounded-md rounded-bl-none p-1" style={{ background: dim(0.07) }}>
          <div className="h-1 w-16 rounded-full" style={{ background: dim(0.4) }} />
        </div>
        <div className="max-w-[70%] self-start rounded-md rounded-bl-none p-1" style={{ background: dim(0.07) }}>
          <div className="h-1 w-10 rounded-full" style={{ background: dim(0.4) }} />
        </div>
        <div
          className="max-w-[60%] self-end rounded-md rounded-br-none p-1"
          style={{ backgroundColor: `${primaryColor}55` }}
        >
          <div className="h-1 w-12 rounded-full" style={{ background: dim(0.8) }} />
        </div>
        <div className="mt-1 h-2.5 w-full rounded-md" style={{ background: dim(0.06) }} />
      </div>
    </div>
  );
}

function AnalyticsMock({ primaryColor }: { primaryColor: string }) {
  return (
    <div className="grid h-full w-full grid-cols-2 gap-1 p-[4%]">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex flex-col justify-between rounded-md p-1.5"
          style={{ background: dim(0.05), borderTop: i === 1 ? `2px solid ${primaryColor}` : undefined }}
        >
          <div className="h-1 w-1/2 rounded-full" style={{ background: dim(0.2) }} />
          <div className="h-2 w-2/3 rounded-sm" style={{ background: dim(0.8) }} />
          <div className="flex items-end gap-0.5" style={{ height: "40%" }}>
            {[30, 60, 45, 75].map((h, j) => (
              <div
                key={j}
                className="flex-1 rounded-t-sm"
                style={{ height: `${h}%`, backgroundColor: i === 1 ? primaryColor : dim(0.15) }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function EcommerceMock({ primaryColor }: { primaryColor: string }) {
  return (
    <div className="flex h-full w-full gap-2 p-[5%]">
      <div className="flex flex-1 flex-col gap-1">
        <div className="flex-1 rounded-md" style={{ background: dim(0.08) }} />
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-2 flex-1 rounded-sm" style={{ background: dim(0.06) }} />
          ))}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1.5">
        <div className="h-1.5 w-2/3 rounded-full" style={{ background: dim(0.7) }} />
        <div className="h-2 w-1/3 rounded-sm" style={{ background: dim(0.85) }} />
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-2 w-2 rounded-full"
              style={i === 0 ? { backgroundColor: primaryColor } : { background: dim(0.15) }}
            />
          ))}
        </div>
        <div className="mt-auto h-2.5 w-full rounded-sm" style={{ backgroundColor: primaryColor }} />
      </div>
    </div>
  );
}

function FinanceMock({ primaryColor }: { primaryColor: string }) {
  return (
    <div className="flex h-full w-full flex-col gap-1.5 p-[5%]">
      <div className="flex flex-col gap-0.5">
        <div className="h-1 w-1/4 rounded-full" style={{ background: dim(0.3) }} />
        <div className="h-3 w-1/2 rounded-sm" style={{ background: dim(0.85) }} />
      </div>
      <div className="flex flex-1 gap-1.5">
        <div className="flex flex-1 flex-col gap-1 rounded-md p-1" style={{ background: dim(0.05) }}>
          {[0.8, 0.5, 0.3].map((w, i) => (
            <div key={i} className="h-1.5 rounded-full" style={{ width: `${w * 100}%`, background: dim(0.1) }}>
              <div
                className="h-full rounded-full"
                style={{ width: `${w * 90}%`, backgroundColor: i === 0 ? primaryColor : dim(0.3) }}
              />
            </div>
          ))}
        </div>
        <div className="flex flex-1 flex-col gap-0.5 rounded-md p-1" style={{ background: dim(0.05) }}>
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="h-1 w-6 rounded-full" style={{ background: dim(0.2) }} />
              <div className="h-1 w-4 rounded-full" style={{ background: dim(0.4) }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function KanbanMock({ primaryColor }: { primaryColor: string }) {
  const columns = [2, 1, 2];
  return (
    <div className="flex h-full w-full gap-1.5 p-[4%]">
      {columns.map((count, colIdx) => (
        <div key={colIdx} className="flex flex-1 flex-col gap-1 rounded-md p-1" style={{ background: dim(0.04) }}>
          <div className="h-1 w-1/2 rounded-full" style={{ background: dim(0.3) }} />
          {Array.from({ length: count }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col gap-0.5 rounded-sm p-1"
              style={{
                background: dim(0.07),
                borderLeft: colIdx === 1 && i === 0 ? `2px solid ${primaryColor}` : undefined,
              }}
            >
              <div className="h-1 w-full rounded-full" style={{ background: dim(0.2) }} />
              <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: `${primaryColor}88` }} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function DocsMock({ primaryColor }: { primaryColor: string }) {
  return (
    <div className="flex h-full w-full gap-2 p-[5%]">
      <div className="flex w-[20%] flex-col gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-1 rounded-full"
            style={i === 1 ? { backgroundColor: primaryColor } : { background: dim(0.15) }}
          />
        ))}
      </div>
      <div className="flex flex-1 flex-col gap-1">
        <div className="h-1.5 w-1/2 rounded-full" style={{ background: dim(0.7) }} />
        <div className="h-1 w-full rounded-full" style={{ background: dim(0.2) }} />
        <div className="h-1 w-4/5 rounded-full" style={{ background: dim(0.2) }} />
        <div className="mt-1 h-4 w-full rounded-sm" style={{ background: dim(0.08) }} />
      </div>
    </div>
  );
}

function MobileMock({ primaryColor }: { primaryColor: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center gap-3 p-[4%]">
      <div className="flex flex-col gap-1">
        <div className="h-2 w-14 rounded-full" style={{ background: dim(0.8) }} />
        <div className="h-1 w-10 rounded-full" style={{ background: dim(0.25) }} />
        <div className="mt-1 h-2 w-10 rounded-full" style={{ backgroundColor: primaryColor }} />
      </div>
      <div
        className="flex h-full w-[30%] flex-col gap-1 rounded-xl border-2 p-1"
        style={{ borderColor: dim(0.2), background: "#0c0c0e" }}
      >
        <div className="h-1 w-1/2 self-center rounded-full" style={{ background: dim(0.2) }} />
        <div className="flex-1 rounded-md" style={{ backgroundColor: `${primaryColor}33` }} />
        <div className="h-1.5 w-full rounded-sm" style={{ background: dim(0.15) }} />
      </div>
    </div>
  );
}

function RealEstateMock({ primaryColor }: { primaryColor: string }) {
  return (
    <div className="flex h-full w-full flex-col gap-1.5 p-[5%]">
      <div className="relative flex-[1.4] rounded-md" style={{ background: dim(0.08) }}>
        <div
          className="absolute bottom-1 left-1 rounded-sm px-1 text-[4px] font-medium"
          style={{ backgroundColor: primaryColor, color: "#0a0a0a" }}
        >
          $649,000
        </div>
      </div>
      <div className="flex flex-1 gap-1.5">
        <div className="flex flex-[2] flex-col gap-0.5">
          <div className="h-1 w-2/3 rounded-full" style={{ background: dim(0.6) }} />
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-1 w-4 rounded-full" style={{ background: dim(0.2) }} />
            ))}
          </div>
        </div>
        <div className="flex-1 rounded-md p-1" style={{ background: dim(0.05) }}>
          <div className="h-1 w-full rounded-full" style={{ background: dim(0.2) }} />
          <div className="mt-1 h-1.5 w-full rounded-sm" style={{ backgroundColor: primaryColor }} />
        </div>
      </div>
    </div>
  );
}

function MenuMock({ primaryColor }: { primaryColor: string }) {
  return (
    <div className="flex h-full w-full flex-col gap-1.5 p-[5%]">
      <div className="h-1.5 w-1/3 rounded-full" style={{ background: dim(0.7) }} />
      <div className="flex flex-col gap-1">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="h-1 rounded-full" style={{ width: "40%", background: dim(0.4) }} />
            <div
              className="h-1 w-4 rounded-full"
              style={{ background: i === 0 ? primaryColor : dim(0.3) }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function EventMock({ primaryColor }: { primaryColor: string }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 p-[4%]">
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex h-4 w-4 flex-col items-center justify-center rounded-sm" style={{ backgroundColor: `${primaryColor}33` }}>
            <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: primaryColor }} />
          </div>
        ))}
      </div>
      <div className="h-1.5 w-1/2 rounded-full" style={{ backgroundColor: primaryColor }} />
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-2.5 w-2.5 rounded-full" style={{ background: dim(0.15) }} />
        ))}
      </div>
    </div>
  );
}

function LinkBioMock({ primaryColor }: { primaryColor: string }) {
  return (
    <div className="flex h-full w-full flex-col items-center gap-1 p-[6%]">
      <div className="h-4 w-4 rounded-full" style={{ backgroundColor: `${primaryColor}55` }} />
      <div className="h-1 w-1/3 rounded-full" style={{ background: dim(0.6) }} />
      <div className="mt-1 flex w-[70%] flex-col gap-1">
        <div className="h-2 w-full rounded-full" style={{ backgroundColor: primaryColor }} />
        <div className="h-2 w-full rounded-full" style={{ background: dim(0.08) }} />
        <div className="h-2 w-full rounded-full" style={{ background: dim(0.08) }} />
      </div>
    </div>
  );
}

const MOCKS: Record<
  PreviewKind,
  (props: { primaryColor: string }) => React.JSX.Element
> = {
  dashboard: DashboardMock,
  hero: HeroMock,
  pricing: PricingMock,
  auth: AuthMock,
  portfolio: PortfolioMock,
  changelog: ChangelogMock,
  agency: AgencyMock,
  chat: ChatMock,
  analytics: AnalyticsMock,
  ecommerce: EcommerceMock,
  finance: FinanceMock,
  kanban: KanbanMock,
  docs: DocsMock,
  mobile: MobileMock,
  realestate: RealEstateMock,
  menu: MenuMock,
  event: EventMock,
  linkbio: LinkBioMock,
};

export function PromptPreview({
  preview,
  primaryColor,
  secondaryColor,
  accentColor,
  className,
}: {
  preview: PromptTheme["preview"];
  primaryColor?: string;
  /** Optional palette colors — tint the preview's ambient glows. */
  secondaryColor?: string;
  accentColor?: string;
  className?: string;
}) {
  const Mock = MOCKS[preview.kind];
  const color = primaryColor ?? "#8b5cf6";
  const glowTop = secondaryColor ?? preview.gradientFrom;
  const glowBottom = accentColor ?? preview.gradientTo;

  return (
    <div
      className={`group/preview relative overflow-hidden bg-[#08080a] ${className ?? ""}`}
    >
      <div
        className="absolute inset-0 opacity-40 transition-opacity duration-300"
        style={{
          background: `radial-gradient(120% 100% at 100% 0%, ${glowTop}, transparent 60%), radial-gradient(120% 100% at 0% 100%, ${glowBottom}, transparent 60%)`,
        }}
      />
      <div className="absolute inset-0 p-[6%]">
        <div
          className="h-full w-full overflow-hidden rounded-md shadow-[0_1px_0_rgba(255,255,255,0.06)_inset]"
          style={{ background: "linear-gradient(180deg, #101014, #0a0a0d)" }}
        >
          <motion.div
            key={`${color}-${glowTop}-${glowBottom}`}
            initial={{ opacity: 0.55 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="h-full w-full"
          >
            <Mock primaryColor={color} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
