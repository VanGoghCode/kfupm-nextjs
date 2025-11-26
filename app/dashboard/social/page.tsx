"use client";

import { useState } from "react";
import { getSocialHealthData } from "@/lib/data/loader";
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
import { MapComponent } from "@/components/ui/google-map";
import { Heart, Activity, Users } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  Cell,
} from "recharts";

export default function SocialPage() {
  const data = getSocialHealthData();
  const [populationCovered, setPopulationCovered] = useState(5); // Millions

  // Calculator Logic
  const livesSaved =
    (populationCovered / 10) * data.mortality_model.lives_saved_per_10m_people;
  const economicValue = livesSaved * data.mortality_model.vsl_usd_million;

  // Chart Data: Inequality Reduction (Simulated for Riyadh)
  const riyadh = data.city_health_metrics.find((c) => c.city_id === "riyadh");
  const inequalityData = [
    { name: "Current", value: riyadh?.thermal_inequity_index.current || 0.45 },
    {
      name: "Projected",
      value: riyadh?.thermal_inequity_index.projected || 0.3,
    },
  ];

  // Chart Data: Asthma (Simulated for Riyadh)
  const asthmaData = [
    {
      name: "Current",
      cases: riyadh?.asthma_hospitalizations_per_100k.current || 120,
    },
    {
      name: "With Greening",
      cases:
        riyadh?.asthma_hospitalizations_per_100k.projected_with_greening || 95,
    },
  ];

  // Map Markers for Refuges
  const refugeMarkers = data.heat_refuges.map((refuge) => ({
    id: refuge.id,
    position: refuge.coordinates,
    title: refuge.name,
    icon: "#3b82f6", // Blue for cooling centers
    content: (
      <div>
        <h3 className="font-bold">{refuge.name}</h3>
        <p className="text-xs text-slate-600">
          Capacity: {refuge.capacity.toLocaleString()}
        </p>
      </div>
    ),
  }));

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
          Social & Health Impact Panel
        </h2>
        <p className="text-slate-600 mt-2 max-w-4xl">
          This panel quantifies the human benefits of urban greening. It
          estimates lives saved from reduced heat stress, calculates the
          economic value of these health improvements, and identifies critical
          locations for cooling centers.
        </p>
        <div className="mt-4 bg-blue-50 p-4 rounded-lg border border-blue-100 max-w-4xl">
          <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <span className="bg-blue-200 text-blue-800 text-xs px-2 py-0.5 rounded-full">
              How to use this page
            </span>
          </h4>
          <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
            <li>
              <strong>Calculate Savings:</strong> Adjust the "Population
              Covered" slider to estimate the lives saved and economic value
              (VSL) of expanding green spaces.
            </li>
            <li>
              <strong>Track Equity:</strong> Monitor the "Inequality Reduction"
              chart to see how greening projects can close the gap between
              wealthy and vulnerable neighborhoods.
            </li>
            <li>
              <strong>Locate Refuges:</strong> Use the map to find "Heat
              Refuges" (cooling centers, parks) and identify underserved areas.
            </li>
          </ul>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Health Savings Calculator */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Health Savings Calculator
              <InfoTooltip
                term="VSL"
                description="Value of Statistical Life: Used to estimate the economic benefits of reducing mortality risks."
              />
            </CardTitle>
            <CardDescription className="text-slate-600">
              Estimate lives saved and economic value based on population
              coverage.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium text-slate-600">
                  Population Covered (Millions)
                </span>
                <span className="text-2xl font-bold text-primary">
                  {populationCovered.toFixed(1)}M
                </span>
              </div>
              <Slider
                value={[populationCovered]}
                min={1}
                max={15}
                step={0.5}
                onValueChange={(val) => setPopulationCovered(val[0])}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-rose-50 border border-rose-100">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="h-5 w-5 text-rose-500" />
                  <p className="text-sm font-medium text-rose-700">
                    Lives Saved (Annual)
                  </p>
                </div>
                <p className="text-3xl font-bold text-rose-900">
                  {livesSaved.toFixed(0)}
                </p>
                <p className="text-xs text-rose-600 mt-1">
                  Based on {data.mortality_model.lives_saved_per_10m_people} per
                  10M
                </p>
              </div>
              <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-100">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSignIcon className="h-5 w-5 text-emerald-500" />
                  <p className="text-sm font-medium text-emerald-700">
                    Economic Value
                  </p>
                </div>
                <p className="text-3xl font-bold text-emerald-900">
                  ${economicValue.toFixed(1)}M
                </p>
                <p className="text-xs text-emerald-600 mt-1">
                  @ ${data.mortality_model.vsl_usd_million}M per life
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Inequality Index */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Thermal Inequity Reduction
              <InfoTooltip
                term="Inequity Index"
                description="Measures the temperature gap between wealthy and vulnerable neighborhoods. Lower is better."
              />
            </CardTitle>
            <CardDescription className="text-slate-600">
              Projected impact on the thermal gap (Riyadh).
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
                <BarChart data={inequalityData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 0.6]} />
                  <YAxis dataKey="name" type="category" width={80} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" name="Inequity Index">
                    {inequalityData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={index === 0 ? "#ef4444" : "#22c55e"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Heat Refuge Map */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Heat Refuge Network</CardTitle>
            <CardDescription className="text-slate-600">
              Locations of designated cooling centers and green corridors.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 h-[400px]">
            <MapComponent
              markers={refugeMarkers}
              zoom={11}
              center={{ lat: 24.7136, lng: 46.6753 }}
            />
          </CardContent>
        </Card>

        {/* Asthma Stats */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Public Health: Asthma</CardTitle>
            <CardDescription className="text-slate-600">
              Projected reduction in hospitalizations (per 100k).
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
                <AreaChart data={asthmaData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="cases"
                    stroke="#3b82f6"
                    fill="#93c5fd"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function DollarSignIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" x2="12" y1="2" y2="22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}
