"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const POINTS = [
  { name: "Perth CBD", lat: -31.9523, lng: 115.8613, focus: "Commercial guarding" },
  { name: "Mirrabooka HQ", lat: -31.8753, lng: 115.8632, focus: "Head office" },
  { name: "Joondalup", lat: -31.7448, lng: 115.7681, focus: "Mobile patrols" },
  { name: "Fremantle", lat: -32.0569, lng: 115.7439, focus: "Event security" },
  { name: "Midland", lat: -31.8893, lng: 116.0117, focus: "Construction security" },
  { name: "Cannington", lat: -32.0157, lng: 115.9344, focus: "Retail & logistics" },
  { name: "Rockingham", lat: -32.2767, lng: 115.7297, focus: "Crowd control" },
  { name: "Mandurah", lat: -32.5269, lng: 115.7217, focus: "Mobile patrols" },
];

const PERTH_CENTER: [number, number] = [-32.0, 115.86];

const markerIcon = L.divIcon({
  className: "gunit-marker",
  html: `<div style="position:relative;width:14px;height:14px;">
    <span style="position:absolute;inset:0;border-radius:9999px;background:#c8102e;opacity:0.5;"></span>
    <span style="position:absolute;inset:3px;border-radius:9999px;background:#e63946;border:1px solid rgba(255,255,255,0.8);box-shadow:0 0 12px rgba(230,57,70,0.9);"></span>
  </div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

function FlyTo({ position }: { position: [number, number] | null }) {
  const map = useMap();
  if (position) {
    map.flyTo(position, 12, { duration: 1.2 });
  }
  return null;
}

export function CoverageMap() {
  const [activePoint, setActivePoint] = useState<(typeof POINTS)[number]>(POINTS[0]);
  const [flyTarget, setFlyTarget] = useState<[number, number] | null>(null);

  const focus = (p: (typeof POINTS)[number]) => {
    setActivePoint(p);
    setFlyTarget([p.lat, p.lng]);
  };

  return (
    <section className="py-32 bg-near-black relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-2xl mx-auto mb-16 space-y-5"
        >
          <div className="inline-flex items-center gap-2 bg-blue-primary/10 border border-blue-primary/30 text-blue-light text-[10px] tracking-[5px] font-medium px-5 py-2 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-light animate-pulse" />
            COVERAGE
          </div>
          <h2 className="font-display text-5xl sm:text-7xl tracking-wider">
            Across <span className="brand-gradient-text">Perth & WA</span>
          </h2>
          <p className="font-serif italic text-lg text-off-white/60">
            From CBD towers to regional sites — patrols, static guards, and event teams across the
            metro and beyond.
          </p>
        </motion.div>

        <div className="relative grid lg:grid-cols-[1fr_320px] gap-6 items-stretch">
          <div className="relative h-[440px] md:h-[520px] rounded-2xl overflow-hidden border border-white/8 bg-pure-black">
            <MapContainer
              center={PERTH_CENTER}
              zoom={10}
              scrollWheelZoom={false}
              zoomControl={false}
              attributionControl={false}
              style={{ height: "100%", width: "100%", background: "#0a0a0c" }}
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                subdomains="abcd"
                maxZoom={19}
              />
              {POINTS.map((p) => (
                <Marker
                  key={p.name}
                  position={[p.lat, p.lng]}
                  icon={markerIcon}
                  eventHandlers={{
                    click: () => focus(p),
                    mouseover: () => setActivePoint(p),
                  }}
                />
              ))}
              <FlyTo position={flyTarget} />
            </MapContainer>
            <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-gold-accent/15 rounded-2xl" />
            <p className="absolute bottom-3 right-3 text-[9px] text-off-white/40 z-[400] pointer-events-none">
              © OpenStreetMap · CartoDB
            </p>
          </div>

          <div className="card-luxury rounded-2xl p-6 flex flex-col">
            <p className="text-[10px] tracking-[3px] uppercase text-off-white/45 mb-3">
              Active Locations
            </p>
            <div className="mb-5">
              <h3 className="font-display text-3xl tracking-wider gold-gradient-text">
                {activePoint.name}
              </h3>
              <p className="text-sm text-off-white/65 mt-1.5 font-serif italic">
                {activePoint.focus}
              </p>
            </div>
            <ul className="space-y-1 text-sm overflow-y-auto flex-1 pr-1">
              {POINTS.map((p) => {
                const active = p.name === activePoint.name;
                return (
                  <li key={p.name}>
                    <button
                      onClick={() => focus(p)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition flex items-center justify-between gap-2 ${
                        active
                          ? "bg-gold-accent/10 border border-gold-accent/30 text-off-white"
                          : "border border-transparent text-off-white/65 hover:text-off-white hover:bg-white/5"
                      }`}
                    >
                      <span>{p.name}</span>
                      <span className="text-[10px] tracking-widest text-off-white/40 uppercase">
                        {p.focus}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
