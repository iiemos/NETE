import { Outlet } from "react-router-dom";
import GlobalHeader from "./GlobalHeader";
import FooterSection from "../landing/FooterSection";

export default function AppShell() {
  return (
    <div
      className="min-h-screen bg-[#0a0a0f] text-white"
      style={{
        backgroundImage:
          "radial-gradient(circle at 15% 10%, rgba(123, 77, 255, 0.22), transparent 38%), radial-gradient(circle at 88% 18%, rgba(202, 255, 0, 0.1), transparent 32%), radial-gradient(circle at 52% 86%, rgba(255, 45, 120, 0.08), transparent 34%)",
      }}
    >
      <GlobalHeader />

      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8" style={{ paddingTop: "calc(var(--nav-height) + 1.5rem)" }}>
        <Outlet />
      </div>

      <FooterSection />
    </div>
  );
}
