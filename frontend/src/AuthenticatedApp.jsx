import { useEffect, useState } from "react";
import { DateRangeProvider } from "./context/DateRangeContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { OfflineFiltersProvider } from "./context/OfflineFiltersContext.jsx";
import { CreativeAnalysisProvider } from "./context/CreativeAnalysisContext.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import Sidebar, {
  useSidebarCollapsed,
  SIDEBAR_WIDTH_EXPANDED,
  SIDEBAR_WIDTH_COLLAPSED,
  PAGES,
} from "./components/layout/Sidebar.jsx";
import { CREATIVE_VEHICLES } from "./components/layout/creativeVehicles.js";
import Header from "./components/layout/Header.jsx";
import OfflineHeader from "./components/layout/OfflineHeader.jsx";
import MediaOnlineDashboard from "./pages/MediaOnlineDashboard.jsx";
import OfflineMediaDashboard from "./pages/OfflineMediaDashboard.jsx";
import CreativeAnalysisPage from "./pages/CreativeAnalysisPage.jsx";
import ContentMatrixPage from "./pages/ContentMatrixPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import PageLoader from "./components/common/PageLoader.jsx";
import Footer from "./components/layout/Footer.jsx";
import MobileTopBar from "./components/layout/MobileTopBar.jsx";
import useIsMobile from "./hooks/useIsMobile.js";
import { MobileNavProvider } from "./context/MobileNavContext.jsx";

const PAGE_LOAD_DELAY_MS = 600;
const PAGES_WITH_OWN_TOPBAR = [PAGES.DASHBOARD, PAGES.MIDIA_OFFLINE, PAGES.MATRIZ_CONTEUDO];

export default function AuthenticatedApp() {
  const { user } = useAuth();
  const [collapsed, toggleCollapsed] = useSidebarCollapsed();
  const [activePage, setActivePage] = useState(PAGES.DASHBOARD);
  const [pageLoading, setPageLoading] = useState(true);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const isMobile = useIsMobile();
  const sidebarWidth = collapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH_EXPANDED;
  const openMobileMenu = () => setMobileNavOpen(true);

  useEffect(() => {
    setPageLoading(true);
    const timer = setTimeout(() => setPageLoading(false), PAGE_LOAD_DELAY_MS);
    return () => clearTimeout(timer);
  }, [activePage]);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [activePage]);

  return (
    <ThemeProvider>
      <DateRangeProvider>
        <OfflineFiltersProvider>
          <CreativeAnalysisProvider>
            <MobileNavProvider openMobileMenu={openMobileMenu}>
              {pageLoading && <PageLoader pageName={activePage} />}
              <Sidebar
                collapsed={collapsed}
                onToggle={toggleCollapsed}
                activePage={activePage}
                onNavigate={setActivePage}
                user={user}
                mobileOpen={mobileNavOpen}
                onCloseMobile={() => setMobileNavOpen(false)}
              />
              <div
                style={{
                  marginLeft: isMobile ? 0 : sidebarWidth,
                  transition: "margin-left 0.2s ease",
                  minHeight: "100vh",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {isMobile &&
                  !PAGES_WITH_OWN_TOPBAR.includes(activePage) &&
                  !CREATIVE_VEHICLES.includes(activePage) && <MobileTopBar onOpenMenu={openMobileMenu} />}
                <div className="app-shell" style={{ flex: 1, paddingTop: isMobile ? 56 : undefined }}>
                  {activePage === PAGES.DASHBOARD && (
                    <>
                      <Header />
                      <MediaOnlineDashboard />
                    </>
                  )}
                  {activePage === PAGES.MIDIA_OFFLINE && (
                    <>
                      <OfflineHeader />
                      <OfflineMediaDashboard />
                    </>
                  )}
                  {CREATIVE_VEHICLES.includes(activePage) && <CreativeAnalysisPage veiculo={activePage} />}
                  {activePage === PAGES.MATRIZ_CONTEUDO && <ContentMatrixPage />}
                  {activePage === PAGES.PERFIL && <ProfilePage />}
                </div>
                <div style={{ padding: "0 24px 24px" }}>
                  <Footer />
                </div>
              </div>
            </MobileNavProvider>
          </CreativeAnalysisProvider>
        </OfflineFiltersProvider>
      </DateRangeProvider>
    </ThemeProvider>
  );
}
