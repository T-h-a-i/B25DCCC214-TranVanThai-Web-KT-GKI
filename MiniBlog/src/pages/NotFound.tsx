import React from 'react';
import { Link } from 'react-router-dom';

export const NotFound: React.FC = () => {
  return (
    <div className="notfound-page">
      <div className="notfound-card">
        <div className="notfound-code">404</div>
        <div className="notfound-glow-icon">💔 🎶</div>
        <h1 className="notfound-title">404 - Không tìm thấy trang K-Pop này</h1>
        <p className="notfound-text">
          Đường dẫn bạn vừa truy cập không tồn tại, đã bị xóa hoặc idol đã kết thúc thời gian quảng bá trên sân khấu này!
        </p>
        <Link to="/" className="btn-primary btn-notfound">
          ← Quay về Trang chủ K-Pop Zone
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
