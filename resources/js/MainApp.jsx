import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ReportPage from './pages/ReportPage';
import FinancePage from './pages/FinancePage';
import SocialAidPage from './pages/SocialAidPage';
import { useDarkMode } from './hooks/useDarkMode';

export default function App() {
    const { isDark, toggle } = useDarkMode();

    return (
        <Router>
            <div className="min-h-screen bg-background text-foreground">
                <Routes>
                    <Route path="/" element={<Dashboard isDark={isDark} toggleDark={toggle} />} />
                    <Route path="/report" element={<ReportPage isDark={isDark} toggleDark={toggle} />} />
                    <Route path="/transparency" element={<FinancePage isDark={isDark} toggleDark={toggle} />} />
                    <Route path="/social-aid" element={<SocialAidPage isDark={isDark} toggleDark={toggle} />} />
                </Routes>
            </div>
        </Router>
    );
}
