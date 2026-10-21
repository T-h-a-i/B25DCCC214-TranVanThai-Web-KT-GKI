import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

export const MainLayout: React.FC = () => {
  return (
    <div className="app-layout">
      <Navbar />

      <main className="main-content">
        <Outlet />
      </main>

      <footer className="footer">
        <div className="footer-container">
          <div className="footer-brand">
            <h3>✨ K-POP ZONE</h3>
            <p>Trạm tin tức & giải trí số 1 dành cho cộng đồng người hâm mộ K-Pop tại Việt Nam.</p>
            <div className="fandom-tags">
              <span className="tag">#BLACKPINK</span>
              <span className="tag">#BTS</span>
              <span className="tag">#NewJeans</span>
              <span className="tag">#aespa</span>
              <span className="tag">#IVE</span>
              <span className="tag">#StrayKids</span>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} K-Pop Zone (MiniBlog SPA) • Phát triển bởi K-Pop Fan Community</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
