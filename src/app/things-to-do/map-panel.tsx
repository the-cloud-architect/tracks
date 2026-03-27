"use client";

import { useMemo, useState } from "react";

import type { PointOfInterestView } from "@/lib/points-of-interest";

type MapPanelProps = {
  places: PointOfInterestView[];
};

export function ThingsToDoMapPanel({ places }: MapPanelProps) {
  const [selectedId, setSelectedId] = useState(places[0]?.id ?? "");

  const selectedPlace = useMemo(
    () => places.find((place) => place.id === selectedId) ?? places[0],
    [places, selectedId],
  );

  const mapUrl = selectedPlace
    ? `https://www.google.com/maps?q=${selectedPlace.latitude},${selectedPlace.longitude}&z=12&output=embed`
    : "https://www.google.com/maps?q=Ellijay,GA&z=11&output=embed";

  return (
    <section className="soft-panel rounded-3xl p-4 sm:p-6">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="eyebrow">Interactive area map</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
            Explore places around Ellijay
          </h2>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100">
        <iframe
          title="Ellijay area map"
          src={mapUrl}
          loading="lazy"
          className="h-[300px] w-full sm:h-[420px]"
          referrerPolicy="no-referrer-when-downgrade"
        />
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
              <tr key={place.id} className="border-t border-zinc-200">
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
