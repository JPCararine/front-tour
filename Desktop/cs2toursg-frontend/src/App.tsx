import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import TeamsPage from "./pages/TeamsPage";
import RegistrationPage from "./pages/RegistrationPage";

export default function App() {
  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col pt-[88px]">
      <Navbar />
      <Routes>
        <Route path="/" element={<TeamsPage />} />
        <Route path="/inscricao" element={<RegistrationPage />} />
      </Routes>
      <Footer />
    </div>
  );
}
