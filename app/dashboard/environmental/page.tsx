"use client";

import { useState, useEffect } from "react";
import { getEnvironmentalData } from "@/lib/data/loader";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { Loader2, Wind } from "lucide-react";
import {
  RadialBarChart,
  RadialBar,
  Legend,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

export default function EnvironmentalPage() {
  const data = getEnvironmentalData();
  const [aqiData, setAqiData] = useState<{
    aqi: number;
    category: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  // Data for Biodiversity Radial Chart
  const biodiversityData = data.biodiversity_metrics.indices.components.map(
    (c, i) => ({
      name: c.category,
      uv: 100, // Max score
      pv: 75 + i * 5, // Simulated score for demo
      fill: i === 0 ? "#22c55e" : i === 1 ? "#3b82f6" : "#f59e0b",
    })
  );

  // Data for PM2.5 Chart
  const pmData = Object.entries(data.pm25_interception.species_efficiency).map(
    ([name, efficiency]) => ({
      name,
      efficiency,
      rate: name.includes("Prosopis")
        ? 0.015
        : name.includes("Acacia")
        ? 0.012
        : 0.018, // Simulated relative rates based on description
    })
  );

  useEffect(() => {
    const fetchAirQuality = async () => {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
      if (!apiKey) return; // Fallback to static data if no key

      setLoading(true);
      try {
        // Example coordinates for Riyadh
        const lat = 24.7136;
        const lng = 46.6753;

        const response = await fetch(
          `https://airquality.googleapis.com/v1/currentConditions:lookup?key=${apiKey}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              location: {
                latitude: lat,
                longitude: lng,
              },
            }),
          }
        );

        if (response.ok) {
          const result = await response.json();
          // Parse Google AQI response
          // Note: Response structure depends on API version, assuming standard format
          if (result.indexes && result.indexes.length > 0) {
            const googleAqi =
              result.indexes.find((i: any) => i.code === "uaqi") ||
              result.indexes[0];
            setAqiData({
              aqi: googleAqi.aqi,
              category: googleAqi.category,
            });
          }
        }
      } catch (error) {
        console.error("Failed to fetch Air Quality data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAirQuality();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
          Environmental & Biodiversity Dashboard
        </h2>
        <p className="text-slate-600 mt-2 max-w-4xl">
          This dashboard tracks the ecological health of urban areas. It
          monitors key indicators like biodiversity, air quality (PM2.5
          removal), and carbon sequestration to ensure that greening efforts
          support a thriving, sustainable ecosystem.
        </p>
        <div className="mt-4 bg-blue-50 p-4 rounded-lg border border-blue-100 max-w-4xl">
          <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <span className="bg-blue-200 text-blue-800 text-xs px-2 py-0.5 rounded-full">
              How to use this page
            </span>
          </h4>
          <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
            <li>
              <strong>Track Biodiversity:</strong> View the "City Biodiversity
              Index" to see scores for native species, ecosystem services, and
              governance.
            </li>
            <li>
              <strong>Monitor Air Quality:</strong> Check the real-time Air
              Quality Index (AQI) and see how different tree species help remove
              pollutants like PM2.5.
            </li>
            <li>
              <strong>Measure Carbon Impact:</strong> Review the "Carbon
              Sequestration" metrics to understand the long-term climate
              benefits of the urban forest.
            </li>
          </ul>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Carbon Calculator */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Carbon Sequestration & Soil Health</CardTitle>
            <CardDescription className="text-slate-600">
              Impact on atmospheric CO2 and soil organic carbon.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="p-6 rounded-xl bg-green-50 border border-green-100 flex flex-col items-center text-center">
              <div className="text-4xl font-bold text-green-700 mb-2">
                {
                  data.carbon_calculator.sequestration_rate_kg_co2_year_per_tree
                    .avg
                }{" "}
                kg
              </div>
              <p className="text-sm font-medium text-green-800">
                CO₂ Sequestered per Tree/Year
              </p>
              <p className="text-xs text-green-600 mt-2">
                Range:{" "}
                {
                  data.carbon_calculator.sequestration_rate_kg_co2_year_per_tree
                    .min
                }
                -
                {
                  data.carbon_calculator.sequestration_rate_kg_co2_year_per_tree
                    .max
                }{" "}
                kg
              </p>
            </div>
            <div className="p-6 rounded-xl bg-amber-50 border border-amber-100 flex flex-col items-center text-center">
              <div className="text-4xl font-bold text-amber-700 mb-2">
                +
                {
                  data.carbon_calculator.soil_organic_carbon_improvement
                    .percentage_increase.avg
                }
                %
              </div>
              <p className="text-sm font-medium text-amber-800">
                Soil Organic Carbon Increase
              </p>
              <p className="text-xs text-amber-600 mt-2">
                Compared to bare arid land
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Biodiversity Index */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              City Biodiversity Index (CBI)
              <InfoTooltip
                term="CBI"
                description="Also known as the Singapore Index, a tool to measure biodiversity in cities."
              />
            </CardTitle>
            <CardDescription className="text-slate-600">
              Performance across key ecological pillars.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
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
                  data={biodiversityData}
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
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* PM2.5 Interception */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              PM2.5 Interception Efficiency
              <InfoTooltip
                term="PM2.5"
                description="Fine particulate matter (diameter < 2.5 micrometers) that poses health risks. Trees filter these particles."
              />
            </CardTitle>
            <CardDescription className="text-slate-600">
              Particulate matter removal by species.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6 p-4 border rounded-lg bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-full shadow-sm">
                  <Wind className="h-5 w-5 text-slate-500" />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    Current Air Quality (Riyadh)
                  </p>
                  <p className="text-xs text-slate-600">
                    Source: Google Air Quality API
                  </p>
                </div>
              </div>
              <div className="text-right">
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
                ) : aqiData ? (
                  <div>
                    <span className="text-2xl font-bold">{aqiData.aqi}</span>
                    <p className="text-xs font-medium text-emerald-600">
                      {aqiData.category}
                    </p>
                  </div>
                ) : (
                  <div>
                    <span className="text-xl font-bold text-slate-400">--</span>
                    <p className="text-xs text-slate-500">API Key Required</p>
                  </div>
                )}
              </div>
            </div>

            <div className="h-[250px]">
              <ResponsiveContainer
                width="100%"
                height="100%"
                minWidth={0}
                minHeight={0}
                aspect={undefined}
              >
                <BarChart data={pmData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip />
                  <Bar
                    dataKey="rate"
                    fill="#64748b"
                    name="Removal Rate (est)"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Species Risk */}
        <Card>
          <CardHeader>
            <CardTitle>Species Resilience & Risk</CardTitle>
            <CardDescription className="text-slate-600">
              Monoculture risks and pollinator support.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-red-50 text-red-800 rounded border border-red-100 text-sm">
                <span className="font-bold">Warning:</span>{" "}
                {data.species_risk_assessment.monoculture_risk.warning_message}
              </div>
              <div className="space-y-2">
                {data.species_risk_assessment.resilience_ratings.map((s) => (
                  <div
                    key={s.species}
                    className="flex items-center justify-between p-2 border rounded"
                  >
                    <div>
                      <p className="font-medium">{s.species}</p>
                      <p className="text-xs text-slate-600">
                        Pollinators: {s.pollinator_support}
                      </p>
                    </div>
                    <Badge
                      variant={
                        s.resilience === "Very High" ? "default" : "secondary"
                      }
                    >
                      {s.resilience} Resilience
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
