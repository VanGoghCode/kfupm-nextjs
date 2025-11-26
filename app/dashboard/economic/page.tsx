"use client";

import { useState } from "react";
import { getEconomicImpactData } from "@/lib/data/loader";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function EconomicPage() {
  const data = getEconomicImpactData();
  const [treeCount, setTreeCount] = useState(1000);

  const baseModel = data.roi_model_base;

  // Calculate dynamic ROI based on tree count
  const totalCapex = baseModel.capex_per_tree * treeCount;
  const totalOpex = baseModel.opex_40_years * treeCount;
  const totalCost = totalCapex + totalOpex;

  const totalBenefits = baseModel.total_benefits * treeCount;
  const netBenefit = totalBenefits - totalCost;
  const roiRatio = baseModel.roi_ratio;

  // Data for National Projections Chart
  const projectionData = data.national_projections.scenarios.map((s) => ({
    name: s.name,
    investment: s.total_investment_usd_bn,
    benefit: s.net_economic_benefit_usd_bn,
    roi: s.roi,
  }));

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
          Economic Impact Simulator
        </h2>
        <p className="text-slate-600 mt-2 max-w-4xl">
          This tool calculates the financial return on investment (ROI) for
          urban greening projects. It estimates the economic value of benefits
          like energy savings, carbon avoidance, and improved public health
          compared to the costs of planting and maintenance.
        </p>
        <div className="mt-4 bg-blue-50 p-4 rounded-lg border border-blue-100 max-w-4xl">
          <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <span className="bg-blue-200 text-blue-800 text-xs px-2 py-0.5 rounded-full">
              How to use this page
            </span>
          </h4>
          <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
            <li>
              <strong>Estimate ROI:</strong> Use the slider to adjust the number
              of trees and see the projected Net Economic Benefit and ROI ratio.
            </li>
            <li>
              <strong>Review Costs vs. Benefits:</strong> Analyze the breakdown
              of Capital Expenditure (CAPEX) and Operating Expenditure (OPEX)
              against long-term savings.
            </li>
            <li>
              <strong>Compare Scenarios:</strong> Check the "National Economic
              Scenarios" chart to see the potential impact of large-scale
              adoption.
            </li>
          </ul>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* ROI Calculator */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              ROI Calculator
              <InfoTooltip
                term="ROI"
                description="Return on Investment: A performance measure used to evaluate the efficiency of an investment."
              />
            </CardTitle>
            <CardDescription className="text-slate-600">
              Estimate returns for urban forestry projects over 40 years.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">
                  Number of AI-Optimized Trees
                </span>
                <span className="text-2xl font-bold text-primary">
                  {treeCount.toLocaleString()}
                </span>
              </div>
              <Slider
                value={[treeCount]}
                min={100}
                max={10000}
                step={100}
                onValueChange={(val) => setTreeCount(val[0])}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-slate-100 dark:bg-slate-800">
                <p className="text-sm text-slate-600">
                  Total Investment (40yr)
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  ${(totalCost / 1000000).toFixed(2)}M
                </p>
                <div className="mt-2 text-xs text-slate-600 flex flex-wrap gap-2">
                  <span className="flex items-center gap-1">
                    CAPEX: ${(totalCapex / 1000000).toFixed(2)}M
                    <InfoTooltip
                      term="CAPEX"
                      description="Capital Expenditure: Upfront costs for planting, soil preparation, and irrigation installation."
                    />
                  </span>
                  <span className="flex items-center gap-1">
                    OPEX: ${(totalOpex / 1000000).toFixed(2)}M
                    <InfoTooltip
                      term="OPEX"
                      description="Operating Expenditure: Ongoing costs for water, maintenance, and monitoring over 40 years."
                    />
                  </span>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                <p className="text-sm text-emerald-700 dark:text-emerald-400">
                  Net Economic Benefit
                </p>
                <p className="text-2xl font-bold text-emerald-800 dark:text-emerald-300">
                  ${(netBenefit / 1000000).toFixed(2)}M
                </p>
                <div className="mt-2 text-xs text-emerald-600/80">
                  ROI Ratio: {roiRatio}:1
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-3">
                Benefit Breakdown (per tree)
              </h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex justify-between p-2 bg-muted rounded text-slate-700">
                  <span>Energy Savings</span>
                  <span className="font-mono">
                    ${baseModel.benefits.energy_savings}
                  </span>
                </div>
                <div className="flex justify-between p-2 bg-muted rounded text-slate-700">
                  <span>Carbon Avoidance</span>
                  <span className="font-mono">
                    ${baseModel.benefits.carbon_avoidance}
                  </span>
                </div>
                <div className="flex justify-between p-2 bg-muted rounded text-slate-700">
                  <span className="flex items-center gap-1">
                    Health (VSL)
                    <InfoTooltip
                      term="VSL"
                      description="Value of Statistical Life: Economic value assigned to mortality risk reduction from reduced heat stress and pollution."
                    />
                  </span>
                  <span className="font-mono">
                    ${baseModel.benefits.health_vsl_share}
                  </span>
                </div>
                <div className="flex justify-between p-2 bg-muted rounded text-slate-700">
                  <span>Productivity</span>
                  <span className="font-mono">
                    ${baseModel.benefits.productivity_gain}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* National Projections */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>National Economic Scenarios</CardTitle>
            <CardDescription className="text-slate-600">
              Projected impact at national scale (Billions USD).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer
                width="100%"
                height="100%"
                minWidth={0}
                minHeight={0}
                aspect={undefined}
              >
                <BarChart data={projectionData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={80} />
                  <Tooltip formatter={(value: number) => `$${value} Bn`} />
                  <Legend />
                  <Bar
                    dataKey="investment"
                    fill="#94a3b8"
                    name="Investment ($Bn)"
                  />
                  <Bar
                    dataKey="benefit"
                    fill="#10b981"
                    name="Net Benefit ($Bn)"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-4">
              {data.national_projections.scenarios.map((s) => (
                <div
                  key={s.name}
                  className="flex items-center justify-between text-sm border-b pb-2 last:border-0"
                >
                  <div>
                    <span className="font-medium">{s.name}</span>
                    <p className="text-xs text-slate-600">{s.description}</p>
                  </div>
                  <Badge
                    variant={s.name === "PlantWise-AI" ? "default" : "outline"}
                  >
                    ROI {s.roi}x
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
