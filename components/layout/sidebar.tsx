"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ThermometerSun,
  ShieldCheck,
  Droplets,
  DollarSign,
  Leaf,
  HeartPulse,
  Scale,
  Box,
} from "lucide-react";

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-sky-600",
  },
  {
    label: "Heat Intelligence",
    icon: ThermometerSun,
    href: "/dashboard/heat",
    color: "text-violet-600",
  },
  {
    label: "Mitigation Engine",
    icon: ShieldCheck,
    href: "/dashboard/mitigation",
    color: "text-pink-600",
  },
  {
    label: "Water Sustainability",
    icon: Droplets,
    href: "/dashboard/water",
    color: "text-blue-600",
  },
  {
    label: "Economic Impact",
    icon: DollarSign,
    href: "/dashboard/economic",
    color: "text-emerald-600",
  },
  {
    label: "Environmental",
    icon: Leaf,
    href: "/dashboard/environmental",
    color: "text-green-600",
  },
  {
    label: "Social & Health",
    icon: HeartPulse,
    href: "/dashboard/social",
    color: "text-rose-600",
  },
  {
    label: "Governance",
    icon: Scale,
    href: "/dashboard/governance",
    color: "text-slate-600",
  },
  {
    label: "Digital Twin",
    icon: Box,
    href: "/dashboard/digital-twin",
    color: "text-indigo-600",
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-slate-50 border-r border-slate-200 text-slate-900">
      <div className="px-3 py-2 flex-1">
        <Link href="/dashboard" className="flex items-center pl-3 mb-14">
          <div className="relative w-8 h-8 mr-4">
            {/* Logo placeholder */}
            <div className="w-full h-full bg-gradient-to-tr from-green-500 to-emerald-700 rounded-lg shadow-sm" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Plantwise</h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-slate-900 hover:bg-slate-200/50 rounded-lg transition",
                pathname === route.href
                  ? "text-slate-900 bg-slate-200 font-semibold"
                  : "text-slate-500"
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
