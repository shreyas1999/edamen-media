import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";

import Home from "@/pages/Home";
import Framework from "@/pages/Framework";
import BrandBuilding from "@/pages/BrandBuilding";
import CreatorRepresentation from "@/pages/CreatorRepresentation";
import Work from "@/pages/Work";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Apply from "@/pages/Apply";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";

function PublicLayout({ children }) {
  return (
    <>
      <Nav />
      <main className="pt-20">{children}</main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/framework" element={<PublicLayout><Framework /></PublicLayout>} />
          <Route path="/brand-building" element={<PublicLayout><BrandBuilding /></PublicLayout>} />
          <Route path="/creator-representation" element={<PublicLayout><CreatorRepresentation /></PublicLayout>} />
          <Route path="/work" element={<PublicLayout><Work /></PublicLayout>} />
          <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
          <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
          <Route path="/apply" element={<PublicLayout><Apply /></PublicLayout>} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </BrowserRouter>
      <Toaster theme="dark" position="bottom-right" />
    </div>
  );
}
