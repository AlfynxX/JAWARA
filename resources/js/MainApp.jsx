import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ReportPage from './pages/ReportPage';
import FinancePage from './pages/FinancePage';
import SocialAidPage from './pages/SocialAidPage';
import LayananSuratPage from './pages/LayananSuratPage';
import LapakDesaPage from './pages/LapakDesaPage';
import PinjamBarangPage from './pages/PinjamBarangPage';
import PosyanduPage from './pages/PosyanduPage';
import BarangHilangPage from './pages/BarangHilangPage';
import { useDarkMode } from './hooks/useDarkMode';

export default function App() {
    const { isDark, toggle } = useDarkMode();

    return (
        <Router>
            <div className="min-h-screen bg-background text-foreground">
                <Routes>
                    <Route path="/" element={<Dashboard isDark={isDark} toggleDark={toggle} />} />
                    <Route path="/report" element={<ReportPage isDark={isDark} toggleDark={toggle} />} />
                    <Route path="/finance" element={<FinancePage isDark={isDark} toggleDark={toggle} />} />
                    <Route path="/social-aid" element={<SocialAidPage isDark={isDark} toggleDark={toggle} />} />
                    <Route path="/layanan-surat" element={<LayananSuratPage isDark={isDark} toggleDark={toggle} />} />
                    <Route path="/lapak-desa" element={<LapakDesaPage isDark={isDark} toggleDark={toggle} />} />
                    <Route path="/pinjam-barang" element={<PinjamBarangPage isDark={isDark} toggleDark={toggle} />} />
                    <Route path="/posyandu" element={<PosyanduPage isDark={isDark} toggleDark={toggle} />} />
                    <Route path="/barang-hilang" element={<BarangHilangPage isDark={isDark} toggleDark={toggle} />} />
                </Routes>
            </div>
        </Router>
    );
}
