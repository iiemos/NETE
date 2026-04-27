import { Outlet } from "react-router-dom";
import GlobalHeader from "./GlobalHeader";

export default function AppShell() {
  return (
    <div className="page-shell">
      <GlobalHeader />

      <div className="page-container py-6" style={{ paddingTop: "calc(var(--nav-height) + 1.5rem)" }}>
        <Outlet />
      </div>
    </div>
  );
}
