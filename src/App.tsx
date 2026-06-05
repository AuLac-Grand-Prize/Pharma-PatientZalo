import { Route } from "react-router-dom";
import HomePage from "./pages/home";
import DrugSearchPage from "./pages/drug-search";
import PrescriptionScanPage from "./pages/prescription-scan";
import AiChatPage from "./pages/ai-chat";
import PharmacyFinderPage from "./pages/pharmacy-finder";
import MyHealthPage from "./pages/my-health";
import MedicationsPage from "./pages/medications";
import ProfilePage from "./pages/profile";

export default function App() {
  return (
    <>
      <Route path="/" element={<HomePage />} />
      <Route path="/drug-search" element={<DrugSearchPage />} />
      <Route path="/prescription-scan" element={<PrescriptionScanPage />} />
      <Route path="/ai-chat" element={<AiChatPage />} />
      <Route path="/pharmacy-finder" element={<PharmacyFinderPage />} />
      <Route path="/my-health" element={<MyHealthPage />} />
      <Route path="/medications" element={<MedicationsPage />} />
      <Route path="/profile" element={<ProfilePage />} />
    </>
  );
}
