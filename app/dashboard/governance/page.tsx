"use client";

import { getGovernanceData } from "@/lib/data/loader";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { CheckCircle2, Circle, Clock } from "lucide-react";
import {
  RadialBarChart,
  RadialBar,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export default function GovernancePage() {
  const data = getGovernanceData();

  // Chart Data: Readiness Index
  const readinessData = data.policy_readiness_index.map((city, i) => ({
    name: city.city,
    uv: 100,
    pv: city.score,
    fill: i === 0 ? "#22c55e" : i === 1 ? "#3b82f6" : "#f59e0b",
  }));

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
          Governance & Policy Panel
        </h2>
        <p className="text-slate-600 mt-2 max-w-4xl">
          This panel tracks the regulatory progress of cities. It evaluates
          their readiness to implement greening initiatives based on zoning
          laws, funding mechanisms, and water regulations.
        </p>
        <div className="mt-4 bg-blue-50 p-4 rounded-lg border border-blue-100 max-w-4xl">
          <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <span className="bg-blue-200 text-blue-800 text-xs px-2 py-0.5 rounded-full">
              How to use this page
            </span>
          </h4>
          <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
            <li>
              <strong>Assess Readiness:</strong> Check the "Policy Readiness
              Index" to see how well-prepared cities are for large-scale
              greening.
            </li>
            <li>
              <strong>Compare Regulations:</strong> Use the comparison table to
              benchmark policies across different regional cities (e.g., Riyadh
              vs. Dubai).
            </li>
            <li>
              <strong>Track Milestones:</strong> Follow the "Policy Roadmap" to
              see completed achievements and upcoming regulatory targets.
            </li>
          </ul>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Policy Readiness Index */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Policy Readiness Index
              <InfoTooltip
                term="PRI"
                description="Composite score evaluating a city's regulatory framework for urban greening and sustainability."
              />
            </CardTitle>
            <CardDescription className="text-slate-600">
              Scoring based on mandates, funding, and execution.
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
                <RadialBarChart
                  innerRadius="10%"
                  outerRadius="80%"
                  data={readinessData}
                  startAngle={180}
                  endAngle={0}
                >
                  <RadialBar
                    label={{ position: "insideStart", fill: "#fff" }}
                    background
                    dataKey="pv"
                  />
                  <Legend
                    iconSize={10}
                    width={120}
                    height={140}
                    layout="vertical"
                    verticalAlign="middle"
                    align="right"
                  />
                  <Tooltip />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-4">
              {data.policy_readiness_index.map((city) => (
                <div
                  key={city.city}
                  className="text-sm border-b pb-2 last:border-0"
                >
                  <div className="flex justify-between font-medium">
                    <span>{city.city}</span>
                    <span>{city.score}/100</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    {city.description}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* City Comparison Table */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Regional Policy Comparison</CardTitle>
            <CardDescription className="text-slate-600">
              Benchmarking key regulatory pillars.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-600 uppercase bg-slate-50 dark:bg-slate-800">
                  <tr>
                    <th className="px-4 py-3 rounded-l-lg">Category</th>
                    <th className="px-4 py-3">Riyadh (KSA)</th>
                    <th className="px-4 py-3">Dubai (UAE)</th>
                    <th className="px-4 py-3 rounded-r-lg">Cairo (EGY)</th>
                  </tr>
                </thead>
                <tbody>
                  {data.city_comparison.map((row, i) => (
                    <tr
                      key={row.category}
                      className="border-b last:border-0 hover:bg-slate-50/50"
                    >
                      <td className="px-4 py-3 font-medium">{row.category}</td>
                      <td className="px-4 py-3">{row.riyadh}</td>
                      <td className="px-4 py-3">{row.dubai}</td>
                      <td className="px-4 py-3">{row.cairo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Policy Roadmap */}
      <Card>
        <CardHeader>
          <CardTitle>Policy Roadmap & Milestones</CardTitle>
          <CardDescription className="text-slate-600">
            Timeline of critical regulatory achievements and targets.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative border-l border-slate-200 ml-3 space-y-8 pb-4">
            {data.policy_roadmap.map((item, i) => (
              <div key={i} className="mb-8 ml-6">
                <span
                  className={`absolute flex items-center justify-center w-6 h-6 rounded-full -left-3 ring-4 ring-white ${
                    item.status === "Completed"
                      ? "bg-green-100 text-green-600"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {item.status === "Completed" ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <Clock className="w-4 h-4" />
                  )}
                </span>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div>
                    <h3 className="flex items-center mb-1 text-lg font-semibold text-slate-900">
                      {item.milestone}
                    </h3>
                    <time className="block mb-2 text-sm font-normal leading-none text-slate-400">
                      {item.year}
                    </time>
                  </div>
                  <Badge
                    variant={
                      item.status === "Completed" ? "default" : "outline"
                    }
                  >
                    {item.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
