import { Route, Routes } from "react-router-dom";
import { useCursorGlow } from "@/hooks/useCursorGlow";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { BackToTop } from "@/components/layout/BackToTop";
import { HomePage } from "@/pages/HomePage";
import { PublicationPage } from "@/pages/PublicationPage";

export function App() {
  useCursorGlow();

  return (
    <SmoothScrollProvider>
      <ScrollToTop />
      <ScrollProgress />
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/publicacoes/:slug" element={<PublicationPage />} />
      </Routes>
      <Footer />
      <BackToTop />
    </SmoothScrollProvider>
  );
}
