"use client";

import "leaflet/dist/leaflet.css";
import {
  Component,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Map as LeafletMap } from "leaflet";
import { Search, LocateFixed, MapPin, AlertTriangle, Loader2 } from "lucide-react";

const IRAQ_CENTER: [number, number] = [33.3152, 44.3661];

export type ResolvedLocation = {
  lat: number;
  lng: number;
  address: string;
};

type SearchResult = {
  lat: number;
  lng: number;
  label: string;
};

class MapErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error("MapPicker failed to render:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-[380px] w-full flex-col items-center justify-center gap-2 rounded-3xl border border-amber-200 bg-amber-50 px-6 text-center">
          <AlertTriangle className="h-6 w-6 text-amber-600" />
          <p className="text-sm font-semibold text-amber-800">تعذّر تحميل الخريطة</p>
          <p className="text-xs text-amber-700">
            لا مشكلة، يمكنكِ إكمال الطلب بكتابة العنوان بالتفصيل بالحقل أدناه.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

async function reverseGeocode(lat: number, lng: number): Promise<string | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&accept-language=ar`
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data?.display_name ?? null;
  } catch {
    return null;
  }
}

async function searchAddress(query: string): Promise<SearchResult[]> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        query
      )}&countrycodes=iq&addressdetails=1&accept-language=ar&limit=5`
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data as { lat: string; lon: string; display_name: string }[]).map((r) => ({
      lat: Number(r.lat),
      lng: Number(r.lon),
      label: r.display_name,
    }));
  } catch {
    return [];
  }
}

function SearchBox({ onSelect }: { onSelect: (loc: SearchResult) => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.trim().length < 3) {
      setResults([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      const found = await searchAddress(query.trim());
      setSearching(false);
      setResults(found);
      setOpen(true);
    }, 450);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  return (
    <div className="absolute inset-x-3 top-3 z-[500]">
      <div className="flex items-center gap-2 rounded-2xl bg-white/95 px-4 py-3 shadow-lg backdrop-blur">
        {searching ? (
          <Loader2 className="h-4 w-4 shrink-0 animate-spin text-brand-500" />
        ) : (
          <Search className="h-4 w-4 shrink-0 text-ink-500" />
        )}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder="ابحثي عن الحي أو المنطقة..."
          className="w-full bg-transparent text-sm text-ink-900 outline-none placeholder:text-ink-400"
        />
      </div>
      {open && results.length > 0 && (
        <div className="mt-1.5 max-h-56 overflow-y-auto rounded-2xl bg-white shadow-lg">
          {results.map((r, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                onSelect(r);
                setQuery(r.label);
                setOpen(false);
              }}
              className="block w-full border-b border-brand-50 px-4 py-2.5 text-right text-xs text-ink-700 last:border-0 hover:bg-brand-50"
            >
              {r.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function CenterPin({ dragging }: { dragging: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-[400] flex items-center justify-center">
      <div
        className={`flex flex-col items-center transition-transform duration-150 ease-out ${
          dragging ? "-translate-y-3" : "translate-y-0"
        }`}
        style={{ marginBottom: dragging ? 28 : 12 }}
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 shadow-lg shadow-brand-900/30 ring-[3px] ring-white">
          <MapPin className="h-4.5 w-4.5 text-white" fill="white" />
        </div>
        <div
          className={`mt-1 h-1.5 w-1.5 rounded-full bg-ink-900/40 blur-[1px] transition-opacity duration-150 ${
            dragging ? "opacity-0" : "opacity-100"
          }`}
        />
      </div>
    </div>
  );
}

function MapPickerInner({
  onLocationChange,
}: {
  onLocationChange: (loc: ResolvedLocation) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [dragging, setDragging] = useState(false);
  const [resolving, setResolving] = useState(false);
  const [address, setAddress] = useState("");
  const [locating, setLocating] = useState(false);
  const [ready, setReady] = useState(false);

  const resolveCenter = useCallback(
    async (lat: number, lng: number) => {
      setResolving(true);
      const label = await reverseGeocode(lat, lng);
      setResolving(false);
      const finalAddress = label ?? `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
      setAddress(finalAddress);
      onLocationChange({ lat, lng, address: finalAddress });
    },
    [onLocationChange]
  );

  useEffect(() => {
    let cancelled = false;
    let map: LeafletMap | null = null;

    import("leaflet").then((L) => {
      if (cancelled || !containerRef.current || mapRef.current) return;

      map = L.map(containerRef.current, {
        center: IRAQ_CENTER,
        zoom: 11,
        zoomControl: false,
        attributionControl: false,
      });
      mapRef.current = map;

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        {
          maxZoom: 19,
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        }
      ).addTo(map);

      L.control.attribution({ position: "bottomleft", prefix: false }).addTo(map);

      map.on("dragstart", () => setDragging(true));
      map.on("dragend", () => setDragging(false));
      map.on("moveend", () => {
        const center = map!.getCenter();
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
          resolveCenter(center.lat, center.lng);
        }, 400);
      });

      setReady(true);
      resolveCenter(IRAQ_CENTER[0], IRAQ_CENTER[1]);
    });

    return () => {
      cancelled = true;
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const locateMe = useCallback(() => {
    if (!navigator.geolocation || !mapRef.current) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        mapRef.current?.flyTo([pos.coords.latitude, pos.coords.longitude], 17);
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, []);

  const handleSearchSelect = useCallback((loc: SearchResult) => {
    mapRef.current?.flyTo([loc.lat, loc.lng], 17);
  }, []);

  return (
    <div className="relative isolate h-[380px] w-full overflow-hidden rounded-3xl border border-brand-100 bg-brand-50 shadow-lg shadow-brand-900/5">
      <div ref={containerRef} className="h-full w-full" />

      {ready && (
        <>
          <SearchBox onSelect={handleSearchSelect} />
          <CenterPin dragging={dragging} />

          <button
            type="button"
            onClick={locateMe}
            className="absolute bottom-24 left-3 z-[500] flex h-11 w-11 items-center justify-center rounded-full bg-white text-brand-700 shadow-lg transition hover:bg-brand-50 disabled:opacity-60"
            aria-label="موقعي الحالي"
            disabled={locating}
          >
            <LocateFixed className={`h-5 w-5 ${locating ? "animate-pulse" : ""}`} />
          </button>

          <div className="absolute inset-x-3 bottom-3 z-[500] rounded-2xl bg-white px-4 py-3.5 shadow-xl">
            <p className="text-[11px] font-bold text-brand-600">📍 موقع التوصيل</p>
            <p className="mt-1 line-clamp-2 text-sm font-medium text-ink-900">
              {resolving
                ? "جارٍ تحديد العنوان..."
                : address || "حرّكي الخريطة لتحديد موقعك بدقة"}
            </p>
          </div>
        </>
      )}
    </div>
  );
}

export function MapPicker({
  onLocationChange,
}: {
  onLocationChange: (loc: ResolvedLocation) => void;
}) {
  return (
    <MapErrorBoundary>
      <MapPickerInner onLocationChange={onLocationChange} />
    </MapErrorBoundary>
  );
}
