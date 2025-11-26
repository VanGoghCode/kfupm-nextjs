"use client";

import { getUrbanHeatData } from "@/lib/data/loader";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { MapComponent } from "@/components/ui/google-map";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

export default function HeatIntelligencePage() {
  const data = getUrbanHeatData();
  const cities = data.cities;

  // Prepare data for charts
  const uhiData = cities.map((city) => ({
    name: city.name,
    // Calculate average UHI from min/max since it's a range in the JSON
    uhi:
      (city.uhi_data.intensification_c_min +
        city.uhi_data.intensification_c_max) /
      2,
    mrt: city.mrt_data.baseline_unshaded_c,
  }));

  // Prepare markers for map
  const mapMarkers = cities.map((city) => ({
    id: city.id,
    position: { lat: city.coordinates.lat, lng: city.coordinates.lon },
    title: city.name,
    icon:
      city.risk_score > 80
        ? "#ef4444"
        : city.risk_score > 60
        ? "#f97316"
        : "#22c55e",
    content: (
      <div className="text-slate-700">
        <h3 className="font-bold text-slate-900">{city.name}</h3>
        <p className="text-xs">Risk Score: {city.risk_score}</p>
        <p className="text-xs">UHI: {city.uhi_data.intensification_c_max}°C</p>
      </div>
    ),
  }));

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
          Global Heat Intelligence
        </h2>
        <p className="text-slate-600 mt-2 max-w-4xl">
          This module tracks and visualizes urban heat data for cities
          worldwide. It helps identify high-risk areas by analyzing Urban Heat
          Island (UHI) intensity, Mean Radiant Temperature (MRT), and Wet Bulb
          Globe Temperature (WBGT).
        </p>
        <div className="mt-4 bg-blue-50 p-4 rounded-lg border border-blue-100 max-w-4xl">
          <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <span className="bg-blue-200 text-blue-800 text-xs px-2 py-0.5 rounded-full">
              How to use this page
            </span>
          </h4>
          <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
            <li>
              <strong>Analyze Trends:</strong> Use the charts to compare UHI
              intensity and MRT across different cities.
            </li>
            <li>
              <strong>Explore City Data:</strong> Click on map markers to view
              specific heat metrics for each location.
            </li>
            <li>
              <strong>Understand Metrics:</strong> Hover over the "i" icons to
              learn more about technical terms like UHI and WBGT.
            </li>
          </ul>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              UHI Intensification vs MRT Baseline
              <InfoTooltip
                term="UHI"
                description="Urban Heat Island: The phenomenon where urban areas are significantly warmer than surrounding rural areas due to human activities."
              />
              <InfoTooltip
                term="MRT"
                description="Mean Radiant Temperature: A measure of the combined effect of air temperature and surface radiation on human thermal comfort."
              />
            </CardTitle>
            <CardDescription className="text-slate-600">
              Comparing Urban Heat Island effect (Avg) and Mean Radiant
              Temperature across megacities.
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
                <BarChart data={uhiData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="uhi"
                    fill="#ef4444"
                    name="Avg UHI Intensification (°C)"
                  />
                  <Bar dataKey="mrt" fill="#f97316" name="MRT Baseline (°C)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Geospatial Risk Map</CardTitle>
            <CardDescription className="text-slate-600">
              Interactive map of target cities and heat risk.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 h-[400px]">
            <MapComponent markers={mapMarkers} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        {cities.slice(0, 2).map((city) => (
          <Card key={city.id}>
            <CardHeader>
              <CardTitle>{city.name} Temperature Curve</CardTitle>
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
                  <LineChart data={city.temperature_curve}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="avg_temp_c"
                      stroke="#8884d8"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
