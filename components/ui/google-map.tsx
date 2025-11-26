"use client";

import React, { useState, useCallback } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { Loader2 } from "lucide-react";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const defaultCenter = {
  lat: 24.7136,
  lng: 46.6753,
};

interface MapProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  markers?: Array<{
    id: string;
    position: { lat: number; lng: number };
    title?: string;
    content?: React.ReactNode;
    icon?: string;
  }>;
  mapId?: string;
  tilt?: number;
  heading?: number;
  children?: React.ReactNode;
}

export function MapComponent({
  center = defaultCenter,
  zoom = 5,
  markers = [],
  mapId,
  tilt = 0,
  heading = 0,
  children,
}: MapProps) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map: google.maps.Map) {
    setMap(null);
  }, []);

  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-slate-100 rounded-lg text-muted-foreground p-4 text-center">
        <p>Map unavailable</p>
        <p className="text-xs mt-2">
          Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to .env.local
        </p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-full bg-slate-50 rounded-lg">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={zoom}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={{
        mapId: mapId, // Required for 3D buildings (Vector Map)
        tilt: tilt,
        heading: heading,
        styles: !mapId
          ? [
              // Only apply styles if not using Vector Map (Map ID overrides styles)
              {
                featureType: "all",
                elementType: "geometry",
                stylers: [{ color: "#f5f5f5" }],
              },
              {
                featureType: "water",
                elementType: "geometry",
                stylers: [{ color: "#c9c9c9" }],
              },
              {
                featureType: "water",
                elementType: "labels.text.fill",
                stylers: [{ color: "#9e9e9e" }],
              },
            ]
          : undefined,
        streetViewControl: false,
        mapTypeControl: false,
      }}
    >
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          position={marker.position}
          title={marker.title}
          onClick={() => setSelectedMarker(marker.id)}
          // Simple color coding based on icon prop if provided, else default
          icon={
            marker.icon
              ? {
                  path: google.maps.SymbolPath.CIRCLE,
                  fillColor: marker.icon,
                  fillOpacity: 0.9,
                  scale: 8,
                  strokeColor: "white",
                  strokeWeight: 2,
                }
              : undefined
          }
        >
          {selectedMarker === marker.id && marker.content && (
            <InfoWindow onCloseClick={() => setSelectedMarker(null)}>
              <div className="text-slate-900 p-1">{marker.content}</div>
            </InfoWindow>
          )}
        </Marker>
      ))}
      {children}
    </GoogleMap>
  );
}
