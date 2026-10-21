import React, { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import type { AuthUser } from '../types';

const getStoredUser = (): AuthUser | null => {
  try {
    const stored = localStorage.getItem('auth_user');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

export const Navbar: React.FC = () => {
  const [user, setUser] = useState<AuthUser | null>(getStoredUser);
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthChange = () => {
      setUser(getStoredUser());
    };

    // Lắng nghe sự kiện đăng nhập/đăng xuất giữa các tab và trong cùng ứng dụng
    window.addEventListener('storage', handleAuthChange);
    window.addEventListener('auth-change', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleAuthChange);
      window.removeEventListener('auth-change', handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('auth_user');
    window.dispatchEvent(new Event('auth-change'));
    setUser(null);
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Logo K-Pop Zone */}
        <Link to="/" className="navbar-logo">
          <span className="logo-sparkle">✨</span>
          <span className="logo-text">
            K-POP <span className="logo-highlight">ZONE</span>
          </span>
          <span className="logo-badge">HOT NEWS</span>
        </Link>

        {/* Menu Điều hướng */}
        <nav className="navbar-nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }
          >
            Trang chủ
          </NavLink>

          <NavLink
            to="/create"
            className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }
          >
            <span className="nav-icon">✍️</span> Viết bài
          </NavLink>
        </nav>

        {/* Khu vực thông tin Auth */}
        <div className="navbar-auth">
          {user ? (
            <div className="auth-user-box">
              <span className="user-greeting">
                <span className="user-badge">👑 VIP</span>
                Xin chào, <strong>{user.username}</strong>
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="btn-logout"
                title="Đăng xuất khỏi hệ thống"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-login">
              Đăng nhập
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
