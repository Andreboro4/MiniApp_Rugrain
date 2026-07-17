import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import MarketPage from './pages/MarketPage';
import AuctionPage from './pages/AuctionPage';
import RequestsPage from './pages/RequestsPage';
import CabinetPage from './pages/CabinetPage';
import ListingDetailPage from './pages/ListingDetailPage';
import AuctionDetailPage from './pages/AuctionDetailPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<MarketPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="market" element={<MarketPage />} />
        <Route path="market/:id" element={<ListingDetailPage />} />
        <Route path="auctions" element={<AuctionPage />} />
        <Route path="auctions/:id" element={<AuctionDetailPage />} />
        <Route path="requests" element={<RequestsPage />} />
        <Route path="cabinet" element={<CabinetPage />} />
      </Route>
    </Routes>
  );
}

export default App;
