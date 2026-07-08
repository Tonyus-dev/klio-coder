import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ForgePage from './pages/ForgePage';
import StatsPage from './pages/StatsPage';
import FeedPage from './pages/FeedPage';

export default function PromptForgeApp() {
  return (
    <Routes>
      <Route path="/" element={<ForgePage />} />
      <Route path="/stats" element={<StatsPage />} />
      <Route path="/feed" element={<FeedPage />} />
    </Routes>
  );
}
