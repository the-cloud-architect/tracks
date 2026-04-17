"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import type { PointOfInterestView } from "@/lib/points-of-interest";

type LeafletModule = typeof import("leaflet");
type MapPanelProps = {
  places: PointOfInterestView[];
};

const markerBaseStyle = {
  color: "#433427",
  fillColor: "#8f6e53",
  fillOpacity: 0.88,
  radius: 7,
  weight: 2,
};

const markerSelectedStyle = {
  color: "#1e1b18",
  fillColor: "#f0c78c",
  fillOpacity: 1,
  radius: 10,
  weight: 3,
};

export function ThingsToDoMapPanel({ places }: MapPanelProps) {
  const [selectedId, setSelectedId] = useState(places[0]?.id ?? "");
  const mapElementRef = useRef<HTMLDivElement | null>(null);
  const leafletRef = useRef<LeafletModule | null>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const markersRef = useRef<Map<string, import("leaflet").CircleMarker>>(new Map());

  const selectedPlace = useMemo(
    () => places.find((place) => place.id === selectedId) ?? places[0],
    [places, selectedId],
  );

  useEffect(() => {
    let cancelled = false;
    const markers = markersRef.current;

    async function initializeMap() {
      if (!mapElementRef.current || mapRef.current) {
        return;
      }

      const L = await import("leaflet");
      if (cancelled || !mapElementRef.current) {
        return;
      }

      leafletRef.current = L;
      const map = L.map(mapElementRef.current, {
        scrollWheelZoom: false,
        zoomControl: true,
      });
      mapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);

      const bounds = L.latLngBounds(
        places.map((place) => [place.latitude, place.longitude] as [number, number]),
      );
      places.forEach((place) => {
        const marker = L.circleMarker([place.latitude, place.longitude], markerBaseStyle)
          .addTo(map)
          .bindTooltip(place.name, { direction: "top" })
          .on("click", () => setSelectedId(place.id));
        markers.set(place.id, marker);
      });

      if (bounds.isValid()) {
        map.fitBounds(bounds.pad(0.2));
      } else if (places[0]) {
        map.setView([places[0].latitude, places[0].longitude], 11);
      }
    }

    initializeMap();

    return () => {
      cancelled = true;
      markers.clear();
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [places]);

  useEffect(() => {
    const L = leafletRef.current;
    if (!L) {
      return;
    }

    markersRef.current.forEach((marker, id) => {
      if (id === selectedPlace?.id) {
        marker.setStyle(markerSelectedStyle);
        marker.bringToFront();
      } else {
        marker.setStyle(markerBaseStyle);
      }
    });
  }, [selectedPlace]);

  return (
    <section className="soft-panel rounded-3xl p-4 sm:p-6">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="eyebrow">Interactive area map</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
            Explore Chatsworth & Ellijay
          </h2>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100">
        <div ref={mapElementRef} className="h-[320px] w-full sm:h-[460px]" />
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {places.map((place) => (
          <button
            key={place.id}
            type="button"
            onClick={() => setSelectedId(place.id)}
            className={[
              "rounded-full border px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em]",
              selectedPlace?.id === place.id
                ? "border-zinc-900 bg-zinc-900 text-white"
                : "border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100",
            ].join(" ")}
          >
            {place.name}
          </button>
        ))}
      </div>
      <div className="mt-4 overflow-x-auto rounded-2xl border border-zinc-200">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="sticky top-0 z-10 bg-zinc-50 text-zinc-700">
            <tr>
              <th className="px-3 py-2 font-medium">Place</th>
              <th className="px-3 py-2 font-medium">Category</th>
              <th className="px-3 py-2 font-medium">Notes</th>
              <th className="px-3 py-2 font-medium">Research</th>
            </tr>
          </thead>
          <tbody>
            {places.map((place) => (
              <tr
                key={place.id}
                className={[
                  "border-t border-zinc-200",
                  selectedPlace?.id === place.id ? "bg-amber-50/70" : "",
                ].join(" ")}
              >
                <td className="px-3 py-2">
                  <button
                    type="button"
                    onClick={() => setSelectedId(place.id)}
                    className="font-semibold text-zinc-900 underline decoration-zinc-300 underline-offset-4"
                  >
                    {place.name}
                  </button>
                </td>
                <td className="px-3 py-2 text-zinc-700">{place.category}</td>
                <td className="px-3 py-2 text-zinc-600">{place.description || "—"}</td>
                <td className="px-3 py-2">
                  <a
                    href={place.externalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded border border-zinc-300 bg-white px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-zinc-700 hover:bg-zinc-100"
                  >
                    Open
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
