import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import TeamsPage from "./pages/TeamsPage";
import RegistrationPage from "./pages/RegistrationPage";
import PaymentPage from "./pages/PaymentPage";
import ContactPage from "./pages/ContactPage";

export default function App() {
  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col pt-[88px]">
      <Navbar />
      <Routes>
        <Route path="/" element={<TeamsPage />} />
        <Route path="/inscricao" element={<RegistrationPage />} />
        <Route path="/pagamento/:billingId" element={<PaymentPage />} />
        <Route path="/contato" element={<ContactPage />} />
      </Routes>
      <Footer />
    </div>
  );
}
