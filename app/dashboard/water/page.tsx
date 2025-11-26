"use client";

import { getWaterSustainabilityData } from "@/lib/data/loader";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
  Cell,
} from "recharts";

export default function WaterPage() {
  const data = getWaterSustainabilityData();
  const budgets = data.water_budgets;

  // Transform data for chart
  const chartData = budgets.map((city) => ({
    name: city.name,
    generated: city.wastewater_generated_m3_day,
    tse: city.tse_production_m3_day,
    gap: Math.abs(city.water_gap_m3_day), // Show gap as positive magnitude for visualization
  }));

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
          Water Sustainability & TSE Analytics
        </h2>
        <p className="text-slate-600 mt-2 max-w-4xl">
          This module analyzes the water balance for greening projects. It
          compares wastewater generation with Treated Sewage Effluent (TSE)
          production to ensure sustainable irrigation without depleting
          freshwater resources.
        </p>
        <div className="mt-4 bg-blue-50 p-4 rounded-lg border border-blue-100 max-w-4xl">
          <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <span className="bg-blue-200 text-blue-800 text-xs px-2 py-0.5 rounded-full">
              How to use this page
            </span>
          </h4>
          <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
            <li>
              <strong>Check Water Budgets:</strong> View the bar chart to see if
              a city produces enough TSE to support its greening goals.
            </li>
            <li>
              <strong>Compare Scenarios:</strong> Review the "Irrigation
              Simulation" to see the massive water savings from using native
              species vs. exotics.
            </li>
            <li>
              <strong>Monitor Efficiency:</strong> Track TSE utilization rates
              for specific cities to identify infrastructure gaps.
            </li>
          </ul>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Water Budget Analysis (m³/day)
              <InfoTooltip description="Comparison of total wastewater generated versus the amount treated and available for reuse (TSE)." />
            </CardTitle>
            <CardDescription className="text-slate-600">
              Wastewater generation vs TSE production capacity.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[350px]">
              <ResponsiveContainer
                width="100%"
                height="100%"
                minWidth={0}
                minHeight={0}
                aspect={undefined}
              >
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `${value / 1000}k`} />
                  <Tooltip
                    formatter={(value: number) => value.toLocaleString()}
                  />
                  <Legend />
                  <Bar
                    dataKey="generated"
                    fill="#94a3b8"
                    name="Wastewater Generated"
                  />
                  <Bar dataKey="tse" fill="#3b82f6" name="TSE Production" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Irrigation Simulation Scenarios</CardTitle>
            <CardDescription className="text-slate-600">
              Water demand impact of species selection.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="p-4 border rounded-lg bg-green-50/50 border-green-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-green-800">
                    Native Species
                  </span>
                  <Badge className="bg-green-600">Sustainable</Badge>
                </div>
                <div className="text-sm text-green-700 space-y-1">
                  <p>
                    Example:{" "}
                    {
                      data.irrigation_simulation.scenarios.native_species
                        .species_example
                    }
                  </p>
                  <p className="font-bold text-lg">
                    {
                      data.irrigation_simulation.scenarios.native_species
                        .water_use_l_day
                    }{" "}
                    L/day
                  </p>
                  <p className="opacity-80">
                    {
                      data.irrigation_simulation.scenarios.native_species
                        .description
                    }
                  </p>
                </div>
              </div>

              <div className="p-4 border rounded-lg bg-red-50/50 border-red-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-red-800">
                    Exotic Species
                  </span>
                  <Badge variant="destructive">High Risk</Badge>
                </div>
                <div className="text-sm text-red-700 space-y-1">
                  <p>
                    Example:{" "}
                    {
                      data.irrigation_simulation.scenarios.exotic_species
                        .species_example
                    }
                  </p>
                  <p className="font-bold text-lg">
                    {
                      data.irrigation_simulation.scenarios.exotic_species
                        .water_use_l_day
                    }{" "}
                    L/day
                  </p>
                  <p className="opacity-80">
                    {
                      data.irrigation_simulation.scenarios.exotic_species
                        .description
                    }
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-3">Risk Alerts</h4>
              <div className="space-y-2">
                {data.irrigation_simulation.risk_alerts.map((alert, i) => (
                  <div
                    key={i}
                    className="flex items-start text-sm p-2 rounded bg-muted text-slate-700"
                  >
                    <span className="mr-2 mt-0.5">⚠️</span>
                    <div>
                      <span className="font-semibold">{alert.level}:</span>{" "}
                      {alert.message}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {budgets.slice(0, 3).map((city) => (
          <Card key={city.city_id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                {city.name} Efficiency
                <InfoTooltip
                  term="TSE"
                  description="Treated Sewage Effluent Utilization Rate."
                />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-2xl font-bold">
                    {(city.tse_utilization_rate * 100).toFixed(0)}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Current Utilization
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-blue-600">
                    Target:{" "}
                    {(city.target_tse_utilization_rate * 100).toFixed(0)}%
                  </div>
                </div>
              </div>
              <div className="mt-3 h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${city.tse_utilization_rate * 100}%` }}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
