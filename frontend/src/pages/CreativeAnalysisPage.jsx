import { useState } from "react";
import CreativeHeader from "../components/creative/CreativeHeader.jsx";
import CreativeFilterFields from "../components/creative/CreativeFilterFields.jsx";
import CreativeKpiRow from "../components/creative/CreativeKpiRow.jsx";
import CreativesTable from "../components/creative/CreativesTable.jsx";
import ThemeToggle from "../components/layout/ThemeToggle.jsx";
import MobileTopBar from "../components/layout/MobileTopBar.jsx";
import MobileFilterModal from "../components/layout/MobileFilterModal.jsx";
import { useMobileNav } from "../context/MobileNavContext.jsx";
import useIsMobile from "../hooks/useIsMobile.js";

function FilterIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 5h16l-6 8v6l-4-2v-4z" />
    </svg>
  );
}

export default function CreativeAnalysisPage({ veiculo }) {
  const isMobile = useIsMobile();
  const { openMobileMenu } = useMobileNav();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  if (isMobile) {
    return (
      <div>
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

          {mobileFiltersOpen && (
            <MobileFilterModal title="Filtros" onClose={() => setMobileFiltersOpen(false)}>
              <CreativeFilterFields veiculo={veiculo} />
              <button
                onClick={() => setMobileFiltersOpen(false)}
                style={{
                  width: "100%",
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
            </MobileFilterModal>
          )}
        </MobileTopBar>

        <h2 style={{ margin: "16px 0", fontSize: 18 }}>Criativos {veiculo}</h2>
        <CreativeKpiRow veiculo={veiculo} />
        <CreativesTable veiculo={veiculo} />
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>Criativos {veiculo}</h2>
        <ThemeToggle variant="plain" />
      </div>
      <CreativeHeader veiculo={veiculo} />
      <CreativeKpiRow veiculo={veiculo} />
      <CreativesTable veiculo={veiculo} />
    </div>
  );
}
