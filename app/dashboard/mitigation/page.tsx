"use client";

import { useState, useMemo } from "react";
import { getHeatMitigationData } from "@/lib/data/loader";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { MapComponent } from "@/components/ui/google-map";
import { Polygon } from "@react-google-maps/api";

export default function MitigationPage() {
  const initialData = getHeatMitigationData();

  const [weights, setWeights] = useState({
    w1: initialData.model_config.weights.w1_solar_heat_load,
    w2: initialData.model_config.weights.w2_pedestrian_mobility,
    w3: initialData.model_config.weights.w3_tse_availability,
    w4: initialData.model_config.weights.w4_social_vulnerability,
  });

  const gridData = useMemo(() => {
    return initialData.grid_data.map((cell) => {
      // Normalize inputs to 0-100 scale for scoring
      const solarScore = (cell.inputs.solar_kwh_m2_yr / 3000) * 100;
      const mobilityScore = cell.inputs.mobility_score;
      const tseScore = Math.max(0, (1000 - cell.inputs.tse_distance_m) / 10); // Closer is better
      const socialScore = cell.inputs.social_vulnerability_index * 100;

      // Calculate Priority Score S
      const score =
        weights.w1 * solarScore +
        weights.w2 * mobilityScore +
        weights.w3 * tseScore +
        weights.w4 * socialScore;

      return {
        ...cell,
        calculatedScore: Math.min(100, Math.max(0, score)),
      };
    });
  }, [weights, initialData.grid_data]);

  const handleWeightChange = (key: string, value: number) => {
    setWeights((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
          🌳 Where Should We Plant Trees?
        </h2>
        <p className="text-slate-600 mt-2 max-w-4xl text-lg">
          This tool helps you decide the best locations to plant trees in your
          city. It considers four important factors: how hot an area gets, how
          many people walk there, access to recycled water for irrigation, and
          which neighborhoods need help the most.
        </p>
        <div className="mt-4 bg-emerald-50 p-4 rounded-lg border border-emerald-200 max-w-4xl">
          <h4 className="font-semibold text-emerald-900 mb-3 flex items-center gap-2 text-lg">
            <span className="bg-emerald-200 text-emerald-800 text-xs px-2 py-1 rounded-full">
              📖 Quick Guide
            </span>
          </h4>
          <div className="space-y-3 text-emerald-800">
            <div className="flex gap-3">
              <span className="font-bold text-emerald-600 min-w-[24px]">
                1.
              </span>
              <div>
                <strong>Choose What Matters Most:</strong> Use the sliders on
                the left to tell us what's most important. For example, if you
                want to help vulnerable communities, increase the "Help
                Vulnerable Communities" slider.
              </div>
            </div>
            <div className="flex gap-3">
              <span className="font-bold text-emerald-600 min-w-[24px]">
                2.
              </span>
              <div>
                <strong>Watch the Map Update:</strong> The grid shows different
                areas of your city. Darker red areas = higher priority for
                planting trees. The numbers show priority scores (0-100).
              </div>
            </div>
            <div className="flex gap-3">
              <span className="font-bold text-emerald-600 min-w-[24px]">
                3.
              </span>
              <div>
                <strong>Pick the Right Trees:</strong> Scroll down to see
                recommended tree species. Each tree card shows how much water it
                needs and how well it cools the area.
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-12">
        {/* Controls */}
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>⚙️ What's Important to You?</CardTitle>
            <CardDescription className="text-slate-600">
              Move the sliders to tell us which factors matter most when
              choosing where to plant trees.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium flex items-center gap-2">
                  ☀️ How Hot It Gets
                  <InfoTooltip description="Areas that get more sun and heat need more shade from trees. Higher values mean we prioritize hot areas." />
                </span>
                <span className="text-sm text-slate-600">
                  {weights.w1.toFixed(2)}
                </span>
              </div>
              <Slider
                value={[weights.w1]}
                max={1}
                step={0.05}
                onValueChange={(val) => handleWeightChange("w1", val[0])}
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium flex items-center gap-2">
                  🚶 How Many People Walk There
                  <InfoTooltip description="Busy walking areas need more shade to keep people comfortable. Higher values mean we prioritize areas with lots of foot traffic." />
                </span>
                <span className="text-sm text-slate-600">
                  {weights.w2.toFixed(2)}
                </span>
              </div>
              <Slider
                value={[weights.w2]}
                max={1}
                step={0.05}
                onValueChange={(val) => handleWeightChange("w2", val[0])}
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium flex items-center gap-2">
                  💧 Access to Recycled Water
                  <InfoTooltip
                    term="Recycled Water"
                    description="Treated wastewater that's safe for watering trees. Areas closer to recycled water sources are cheaper to maintain."
                  />
                </span>
                <span className="text-sm text-slate-600">
                  {weights.w3.toFixed(2)}
                </span>
              </div>
              <Slider
                value={[weights.w3]}
                max={1}
                step={0.05}
                onValueChange={(val) => handleWeightChange("w3", val[0])}
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium flex items-center gap-2">
                  🏘️ Help Vulnerable Communities
                  <InfoTooltip description="Neighborhoods with elderly residents, low-income families, or people more affected by heat. Higher values mean we prioritize helping these communities first." />
                </span>
                <span className="text-sm text-slate-600">
                  {weights.w4.toFixed(2)}
                </span>
              </div>
              <Slider
                value={[weights.w4]}
                max={1}
                step={0.05}
                onValueChange={(val) => handleWeightChange("w4", val[0])}
              />
            </div>
          </CardContent>
        </Card>

        {/* Grid Visualization */}
        <Card className="md:col-span-8">
          <CardHeader>
            <CardTitle>🗺️ City Priority Map</CardTitle>
            <CardDescription className="text-slate-600">
              This map shows 3 different neighborhoods in your city. Each box is
              one neighborhood.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] rounded-lg overflow-hidden border">
              <MapComponent
                center={{ lat: 24.7136, lng: 46.6753 }} // Riyadh
                zoom={13}
              >
                {gridData.map((cell, index) => {
                  // Create polygon coordinates for each area (simplified rectangles)
                  const baseLatOffset = 0.01;
                  const baseLngOffset = 0.015;
                  const row = Math.floor(index / 3);
                  const col = index % 3;

                  const lat = 24.7136 + (row - 1) * baseLatOffset;
                  const lng = 46.6753 + (col - 1) * baseLngOffset;

                  const paths = [
                    { lat: lat, lng: lng },
                    { lat: lat, lng: lng + baseLngOffset * 0.9 },
                    {
                      lat: lat + baseLatOffset * 0.9,
                      lng: lng + baseLngOffset * 0.9,
                    },
                    { lat: lat + baseLatOffset * 0.9, lng: lng },
                  ];

                  const opacity = Math.max(0.3, cell.calculatedScore / 100);

                  return (
                    <Polygon
                      key={cell.cell_id}
                      paths={paths}
                      options={{
                        fillColor: "#ef4444",
                        fillOpacity: opacity,
                        strokeColor: "#dc2626",
                        strokeOpacity: 0.8,
                        strokeWeight: 2,
                      }}
                      onClick={() => {
                        alert(
                          `Area ${
                            index + 1
                          }\nPriority Score: ${cell.calculatedScore.toFixed(
                            0
                          )}\n\n${
                            index === 0
                              ? "Very hot + lots of people walking"
                              : index === 1
                              ? "Moderate priority"
                              : "Vulnerable community needs help"
                          }`
                        );
                      }}
                    />
                  );
                })}
              </MapComponent>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 text-xs text-slate-600">
              {gridData.map((cell, index) => (
                <div
                  key={cell.cell_id}
                  className="p-2 bg-slate-50 rounded border"
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold text-slate-700">
                      Area {index + 1}
                    </p>
                    <span className="font-bold text-lg text-red-600">
                      {cell.calculatedScore.toFixed(0)}
                    </span>
                  </div>
                  <p className="text-slate-600">
                    {index === 0
                      ? "Very hot + lots of people walking"
                      : index === 1
                      ? "Moderate priority"
                      : "Vulnerable community needs help"}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-900">
                <strong>💡 Tip:</strong> Move the sliders on the left to see how
                the map colors change. Darker red areas = plant trees there
                first!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Species Matrix */}
      <Card>
        <CardHeader>
          <CardTitle>🌲 Recommended Trees for Your City</CardTitle>
          <CardDescription className="text-slate-600">
            These trees are chosen because they provide good shade and don't
            need too much water.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {initialData.species_matrix.map((species) => (
              <div
                key={species.name}
                className="flex flex-col space-y-3 p-4 border rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <span className="font-semibold text-lg">{species.name}</span>
                  <Badge
                    variant={
                      species.type === "Native" ? "default" : "secondary"
                    }
                    className="text-xs"
                  >
                    {species.type === "Native" ? "🌿 Local" : "🌍 Adapted"}
                  </Badge>
                </div>
                <div className="text-sm text-slate-700 space-y-2 bg-slate-50 p-3 rounded">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">💧 Water Needs:</span>
                    <span className="font-medium">
                      {species.water_needs_l_day} L/day
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">❄️ Cooling Power:</span>
                    <span className="font-medium">
                      {species.cooling_potential}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 flex items-center gap-1">
                      🍃 Shade Density:
                      <InfoTooltip
                        term="Shade Density"
                        description="How thick the tree's leaves are. Higher numbers mean more shade and better cooling. Think of it like an umbrella - thicker is better!"
                      />
                    </span>
                    <span className="font-medium">{species.lai_value}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 italic">
                  {species.type === "Native"
                    ? "✓ Grows naturally in this region"
                    : "✓ Proven to thrive in similar climates"}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
