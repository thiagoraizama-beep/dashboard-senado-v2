import { useEffect, useState } from "react";
import MultiSelectDropdown from "./MultiSelectDropdown.jsx";
import NotificationBell from "./NotificationBell.jsx";
import ThemeToggle from "./ThemeToggle.jsx";
import MobileFilterModal from "./MobileFilterModal.jsx";
import MobileTopBar from "./MobileTopBar.jsx";
import { getOfflineFilterOptions } from "../../api/client.js";
import { useOfflineFilters } from "../../context/OfflineFiltersContext.jsx";
import { useMobileNav } from "../../context/MobileNavContext.jsx";
import useIsMobile from "../../hooks/useIsMobile.js";

function FilterIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 5h16l-6 8v6l-4-2v-4z" />
    </svg>
  );
}

export default function OfflineHeader() {
  const { categoria, setCategoria, praca, setPraca, veiculo, setVeiculo, campanha, setCampanha } = useOfflineFilters();
  const [options, setOptions] = useState({ categorias: [], pracas: [], veiculos: [], campanhas: [] });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const isMobile = useIsMobile();
  const { openMobileMenu } = useMobileNav();

  useEffect(() => {
    getOfflineFilterOptions().then(setOptions).catch(console.error);
  }, []);

  const headerStyle = {
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
  };

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
              <label style={{ fontSize: 12, color: "var(--text-secondary)" }}>Categoria</label>
              <MultiSelectDropdown
                multi
                value={categoria}
                onChange={setCategoria}
                placeholder="Todas as categorias"
                options={options.categorias}
              />
            </div>
            <div>
              <label style={{ fontSize: 12, color: "var(--text-secondary)" }}>Praça</label>
              <MultiSelectDropdown
                multi
                value={praca}
                onChange={setPraca}
                placeholder="Todas as praças"
                options={options.pracas}
              />
            </div>
            <div>
              <label style={{ fontSize: 12, color: "var(--text-secondary)" }}>Veículo</label>
              <MultiSelectDropdown
                multi
                value={veiculo}
                onChange={setVeiculo}
                placeholder="Todos os veículos"
                options={options.veiculos}
              />
            </div>
            <div>
              <label style={{ fontSize: 12, color: "var(--text-secondary)" }}>Campanha</label>
              <MultiSelectDropdown
                multi
                value={campanha}
                onChange={setCampanha}
                placeholder="Todas as campanhas"
                options={options.campanhas}
              />
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
    <header style={headerStyle}>
      <MultiSelectDropdown multi variant="onImage" value={categoria} onChange={setCategoria} placeholder="Todas as categorias" options={options.categorias} />
      <MultiSelectDropdown multi variant="onImage" value={praca} onChange={setPraca} placeholder="Todas as praças" options={options.pracas} />
      <MultiSelectDropdown multi variant="onImage" value={veiculo} onChange={setVeiculo} placeholder="Todos os veículos" options={options.veiculos} />
      <MultiSelectDropdown multi variant="onImage" value={campanha} onChange={setCampanha} placeholder="Todas as campanhas" options={options.campanhas} />

      <ThemeToggle />
      <NotificationBell />
    </header>
  );
}
