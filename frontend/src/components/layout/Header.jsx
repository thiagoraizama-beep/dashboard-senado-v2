import { useEffect, useRef, useState } from "react";
import FilterCalendar from "../calendar/FilterCalendar.jsx";
import MultiSelectDropdown from "./MultiSelectDropdown.jsx";
import NotificationBell from "./NotificationBell.jsx";
import ThemeToggle from "./ThemeToggle.jsx";
import MobileFilterModal from "./MobileFilterModal.jsx";
import MobileTopBar from "./MobileTopBar.jsx";
import { getVehicles } from "../../api/client.js";
import { useDateRange } from "../../context/DateRangeContext.jsx";
import { useMobileNav } from "../../context/MobileNavContext.jsx";
import useIsMobile from "../../hooks/useIsMobile.js";

const MODELOS_COMPRA = ["CPM", "CPC", "CPV"];

function CalendarButtonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18" />
      <path d="M8 3v4" />
      <path d="M16 3v4" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 5h16l-6 8v6l-4-2v-4z" />
    </svg>
  );
}

function useClickOutside(ref, onOutside) {
  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) onOutside();
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [ref, onOutside]);
}

export default function Header() {
  const { range, veiculo, setVeiculo, modeloCompra, setModeloCompra } = useDateRange();
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [vehicleOptions, setVehicleOptions] = useState([]);
  const calendarRef = useRef(null);
  const isMobile = useIsMobile();
  const { openMobileMenu } = useMobileNav();

  useClickOutside(calendarRef, () => setCalendarOpen(false));

  useEffect(() => {
    getVehicles(range).then((vehicles) => setVehicleOptions(vehicles.map((v) => v.veiculo))).catch(console.error);
  }, [range]);

  if (isMobile) {
    return (
      <MobileTopBar onOpenMenu={openMobileMenu}>
        <button
          onClick={() => setMobileFiltersOpen(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "7px 12px",
            borderRadius: 999,
            border: "1px solid var(--border)",
            background: "transparent",
            color: "var(--text-primary)",
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          <FilterIcon />
          Filtros
        </button>
        <ThemeToggle variant="plain" />
        <NotificationBell variant="plain" />

        {mobileFiltersOpen && (
          <MobileFilterModal title="Filtros" onClose={() => setMobileFiltersOpen(false)}>
            <div>
              <label style={{ fontSize: 12, color: "var(--text-secondary)" }}>Veículos</label>
              <MultiSelectDropdown
                multi
                value={veiculo}
                onChange={setVeiculo}
                placeholder="Todos os veículos"
                options={vehicleOptions}
              />
            </div>
            <div>
              <label style={{ fontSize: 12, color: "var(--text-secondary)" }}>Modelo de compra</label>
              <MultiSelectDropdown
                multi
                value={modeloCompra}
                onChange={setModeloCompra}
                placeholder="Todos os modelos"
                options={MODELOS_COMPRA}
              />
            </div>
            <div>
              <label style={{ fontSize: 12, color: "var(--text-secondary)" }}>Período</label>
              <FilterCalendar hideApplyButton bare />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                style={{
                  flex: 1,
                  padding: "10px 0",
                  borderRadius: 8,
                  border: "1px solid var(--border)",
                  background: "transparent",
                  color: "var(--text-primary)",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Fechar
              </button>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                style={{
                  flex: 1,
                  padding: "10px 0",
                  borderRadius: 8,
                  border: "none",
                  background: "var(--accent)",
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Aplicar
              </button>
            </div>
          </MobileFilterModal>
        )}
      </MobileTopBar>
    );
  }

  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        gap: 12,
        backgroundImage:
          "linear-gradient(rgba(47, 111, 235, 0.82), rgba(47, 111, 235, 0.82)), url(/PlenarioSenadoFederal.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        borderRadius: 16,
        padding: "12px 24px",
        boxShadow: "0 1px 3px rgba(20,33,61,0.06)",
        marginBottom: 20,
        position: "relative",
      }}
    >
      <MultiSelectDropdown
        multi
        variant="onImage"
        value={veiculo}
        onChange={setVeiculo}
        placeholder="Todos os veículos"
        options={vehicleOptions}
      />

      <MultiSelectDropdown
        multi
        variant="onImage"
        value={modeloCompra}
        onChange={setModeloCompra}
        placeholder="Todos os modelos"
        options={MODELOS_COMPRA}
      />

      <div ref={calendarRef} style={{ position: "relative" }}>
        <button
          onClick={() => setCalendarOpen((open) => !open)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 14px",
            borderRadius: 999,
            border: "1px solid rgba(255,255,255,0.4)",
            background: "rgba(255,255,255,0.08)",
            color: "#fff",
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          <CalendarButtonIcon />
          Período
        </button>
        {calendarOpen && (
          <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, zIndex: 20 }}>
            <FilterCalendar onApply={() => setCalendarOpen(false)} />
          </div>
        )}
      </div>

      <ThemeToggle />
      <NotificationBell />
    </header>
  );
}
