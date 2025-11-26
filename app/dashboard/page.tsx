import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  ThermometerSun,
  ShieldCheck,
  Droplets,
  DollarSign,
} from "lucide-react";
import { getUrbanHeatData } from "@/lib/data/loader";
import { MapComponent } from "@/components/ui/google-map";

export default function DashboardPage() {
  const urbanHeatData = getUrbanHeatData();

  const mapMarkers = urbanHeatData.cities.map((city) => ({
    id: city.id,
    position: { lat: city.coordinates.lat, lng: city.coordinates.lon },
    title: city.name,
    content: (
      <div className="p-2 min-w-[150px]">
        <h3 className="font-bold text-base mb-1">{city.name}</h3>
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>Risk Score:</span>
            <span
              className={`font-bold ${
                city.risk_score > 90 ? "text-red-600" : "text-amber-600"
              }`}
            >
              {city.risk_score}
            </span>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>UHI Max:</span>
            <span>+{city.uhi_data.intensification_c_max}°C</span>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Population:</span>
            <span>{(city.current_population / 1000000).toFixed(1)}M</span>
          </div>
        </div>
      </div>
    ),
    icon:
      city.risk_score > 90
        ? "#ef4444"
        : city.risk_score > 85
        ? "#f97316"
        : "#eab308",
  }));

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
          Global Impact Overview
        </h2>
        <p className="text-slate-600 mt-2 max-w-4xl">
          This dashboard provides a high-level summary of the urban heat crisis
          across major global cities. It highlights key metrics like population
          at risk, cooling targets, and the economic potential of greening
          initiatives.
        </p>
        <div className="mt-4 bg-blue-50 p-4 rounded-lg border border-blue-100 max-w-4xl">
          <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <span className="bg-blue-200 text-blue-800 text-xs px-2 py-0.5 rounded-full">
              How to use this page
            </span>
          </h4>
          <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
            <li>
              <strong>Review Key Metrics:</strong> Check the top cards for a
              quick snapshot of the global situation.
            </li>
            <li>
              <strong>Explore the Map:</strong> Interact with the global map
              below to see heat risk scores for specific cities. Click markers
              for details.
            </li>
            <li>
              <strong>Monitor Alerts:</strong> Look at the "Recent Alerts"
              section for critical updates on heatwaves or water scarcity.
            </li>
          </ul>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Urban Population
            </CardTitle>
            <ThermometerSun className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">~350M</div>
            <p className="text-xs text-slate-600">
              Across 7 target megacities by 2050
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Potential Cooling
            </CardTitle>
            <ShieldCheck className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-4°C</div>
            <p className="text-xs text-slate-600">Target reduction in UHI</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              TSE Utilization
            </CardTitle>
            <Droplets className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">90%</div>
            <p className="text-xs text-slate-600">
              Target efficiency for irrigation
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Economic Benefit
            </CardTitle>
            <DollarSign className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12.5B</div>
            <p className="text-xs text-slate-600">
              Projected net benefit by 2030
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Global Impact Map</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[400px] w-full rounded-md overflow-hidden border">
              <MapComponent markers={mapMarkers} />
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Alerts</CardTitle>
            <CardDescription className="text-slate-600">
              Critical updates from monitoring stations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <div className="flex items-center">
                <span className="relative flex h-2 w-2 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Extreme Heat Warning - Riyadh
                  </p>
                  <p className="text-sm text-slate-600">
                    Expected to reach 47°C today.
                  </p>
                </div>
                <div className="ml-auto font-medium text-red-600">Critical</div>
              </div>
              <div className="flex items-center">
                <span className="relative flex h-2 w-2 mr-2">
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
                </span>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Water Scarcity Alert - Phoenix
                  </p>
                  <p className="text-sm text-slate-600">
                    Reservoir levels below 40%.
                  </p>
                </div>
                <div className="ml-auto font-medium text-yellow-600">
                  Warning
                </div>
              </div>
              <div className="flex items-center">
                <span className="relative flex h-2 w-2 mr-2">
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Planting Goal Met - Dubai
                  </p>
                  <p className="text-sm text-slate-600">
                    10,000 new Ghaf trees planted.
                  </p>
                </div>
                <div className="ml-auto font-medium text-green-600">
                  Success
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
