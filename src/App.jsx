import { Navigate, Route, Routes } from "react-router-dom";
import AppShell from "./components/common/AppShell";
import BuySeedPage from "./pages/modules/BuySeedPage";
import C2CMarketPage from "./pages/modules/C2CMarketPage";
import C2COverviewPage from "./pages/modules/C2COverviewPage";
import C2CSellPage from "./pages/modules/C2CSellPage";
import MiningPage from "./pages/modules/MiningPage";
import MyTeamPage from "./pages/modules/MyTeamPage";
import MyPage from "./pages/modules/MyPage";
import VipPage from "./pages/modules/VipPage";
import LandingPage from "./pages/LandingPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/c2c" element={<C2COverviewPage />} />
      <Route path="/c2c/sell" element={<C2CSellPage />} />
      <Route path="/c2c/market" element={<C2CMarketPage />} />

      <Route element={<AppShell />}>
        <Route path="/mining" element={<MiningPage />} />
        <Route path="/vip" element={<VipPage />} />
        <Route path="/leadership" element={<Navigate to="/vip" replace />} />
        <Route path="/my" element={<MyPage />} />
        <Route path="/account/team" element={<MyTeamPage />} />
        <Route path="/account/my-team" element={<Navigate to="/account/team" replace />} />
        <Route path="/finance/buy-seed" element={<BuySeedPage />} />
      </Route>

      <Route path="/landing" element={<Navigate to="/" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
