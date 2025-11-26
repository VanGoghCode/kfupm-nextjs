"use client";

import { useState } from "react";
import { getDigitalTwinData } from "@/lib/data/loader";
import { Badge } from "@/components/ui/badge";
import { MapComponent } from "@/components/ui/google-map";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Polygon } from "@react-google-maps/api";

export default function DigitalTwinPage() {
  const data = getDigitalTwinData();
  const [isPlantWise, setIsPlantWise] = useState(false);

  const currentScenario = isPlantWise
    ? data.scenarios.PlantWise
    : data.scenarios.baseline;

  // Polygon Options
  const polygonOptions = {
    fillColor: "#10b981", // Emerald green for shade
    fillOpacity: 0.4,
    strokeColor: "#059669",
    strokeWeight: 1,
    clickable: false,
    draggable: false,
    editable: false,
    geodesic: false,
    zIndex: 1,
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col p-4 space-y-4">
      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            Plantwise Digital Twin
            <Badge variant="outline" className="text-xs font-normal">
              3D Simulation
            </Badge>
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl">
            This 3D simulation visualizes the physical impact of greening on the
            urban environment. It models how new tree canopies create shade
            corridors and lower Mean Radiant Temperature (MRT) in real-world
            locations.
          </p>
          <div className="mt-2 bg-blue-50 p-3 rounded-lg border border-blue-100 text-xs text-blue-800">
            <span className="font-semibold mr-2">How to use:</span>
            Toggle the switch to compare <strong>"Baseline"</strong> (current
            state) vs. <strong>"PlantWise-AI"</strong> (proposed greening). Look
            for green polygons appearing on the map to see projected shade
            coverage.
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center space-x-2">
            <Label htmlFor="scenario-mode" className="font-medium">
              Baseline
            </Label>
            <Switch
              id="scenario-mode"
              checked={isPlantWise}
              onCheckedChange={setIsPlantWise}
            />
            <Label
              htmlFor="scenario-mode"
              className="font-medium text-emerald-600"
            >
              PlantWise-AI
            </Label>
          </div>

          <div className="flex gap-4 text-sm">
            <div className="flex flex-col items-end">
              <span className="text-slate-600">Avg MRT</span>
              <span
                className={`font-bold ${
                  isPlantWise ? "text-emerald-600" : "text-rose-600"
                }`}
              >
                {currentScenario.avg_mrt}°C
              </span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-slate-600">Shade Coverage</span>
              <span className="font-bold">
                {currentScenario.shade_coverage_pct}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 relative rounded-xl overflow-hidden border shadow-sm">
        <MapComponent
          center={{ lat: 24.7136, lng: 46.6753 }}
          zoom={17}
          tilt={45}
          heading={30}
          mapId="DEMO_MAP_ID" // Placeholder, user needs to replace with real Vector Map ID
        >
          {isPlantWise &&
            data.shade_polygons.map((poly) => (
              <Polygon
                key={poly.id}
                paths={poly.paths}
                options={polygonOptions}
              />
            ))}
        </MapComponent>

        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur p-3 rounded-lg shadow-lg max-w-xs text-xs">
          <p className="font-semibold mb-1">Simulation Info</p>
          <p>
            Displaying <strong>{currentScenario.name}</strong>.
            {isPlantWise
              ? " Green polygons represent projected shade corridors from proposed canopy."
              : " Standard urban form with minimal shading."}
          </p>
          <p className="mt-2 text-slate-500 italic">
            *For full 3D buildings, ensure a valid Vector Map ID is configured
            in Google Cloud.
          </p>
        </div>
      </div>
    </div>
  );
}
