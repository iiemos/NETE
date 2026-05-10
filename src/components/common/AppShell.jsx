import { Outlet } from "react-router-dom";
import GlobalHeader from "./GlobalHeader";
import FooterSection from "../landing/FooterSection";

export default function AppShell() {
  return (
    <div
      className="min-h-screen bg-[#070a09] text-white"
      style={{
        backgroundImage:
          "radial-gradient(circle at top left, rgba(108, 77, 255, 0.18), transparent 28%), radial-gradient(circle at top right, rgba(118, 245, 196, 0.12), transparent 24%), linear-gradient(180deg, #09100d 0%, #060807 100%)",
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
