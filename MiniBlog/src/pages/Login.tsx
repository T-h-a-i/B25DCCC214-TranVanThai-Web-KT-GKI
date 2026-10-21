import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface LocationState {
  from?: {
    pathname: string;
  };
}

export const Login: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  // Xác định đường dẫn trước đó mà người dùng muốn vào (ví dụ /create)
  const state = location.state as LocationState;
  const redirectTarget = state?.from?.pathname || '/';

  // Nếu đã đăng nhập trước đó, điều hướng ngay lập tức
  useEffect(() => {
    const existingUser = localStorage.getItem('auth_user');
    if (existingUser) {
      navigate(redirectTarget, { replace: true });
    }
  }, [navigate, redirectTarget]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Kiểm tra tài khoản cố định theo yêu cầu: admin / 123456
    if (username.trim() === 'admin' && password === '123456') {
      const authData = {
        username: 'admin',
        loginAt: new Date().toISOString(),
      };

      // Lưu trạng thái đăng nhập vào localStorage
      localStorage.setItem('auth_user', JSON.stringify(authData));

      // Bắn sự kiện đồng bộ trạng thái đăng nhập tức thì cho Navbar
      window.dispatchEvent(new Event('auth-change'));

      // Chuyển hướng về trang trước đó (kèm replace: true)
      navigate(redirectTarget, { replace: true });
    } else {
      setErrorMessage('Sai tài khoản hoặc mật khẩu! Vui lòng kiểm tra lại thông tin.');
    }
  };

  // Nút hỗ trợ điền nhanh thông tin test
  const handleFillDemo = () => {
    setUsername('admin');
    setPassword('123456');
    setErrorMessage(null);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon">👑</div>
          <h2 className="login-title">Đăng Nhập K-Pop Zone</h2>
          <p className="login-subtitle">
            Dành riêng cho ban biên tập & thành viên có quyền đăng tải tin tức
          </p>
        </div>

        {/* Thông báo nếu vừa bị đẩy về từ Protected Route */}
        {state?.from && (
          <div className="info-banner">
            🔒 Bạn cần đăng nhập tài khoản Quản trị để tiếp tục truy cập trang{' '}
            <strong>{state.from.pathname}</strong>.
          </div>
        )}

        {/* Thông báo lỗi màu đỏ nếu đăng nhập sai */}
        {errorMessage && (
          <div className="error-alert">
            <span className="error-alert-icon">⚠️</span>
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Tên đăng nhập</label>
            <input
              id="username"
              type="text"
              placeholder="Nhập tên đăng nhập (admin)"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-control"
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <input
              id="password"
              type="password"
              placeholder="Nhập mật khẩu (123456)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              required
            />
          </div>

          <button type="submit" className="btn-primary btn-block">
            Đăng Nhập Ngay 🚀
          </button>
        </form>

        <div className="login-footer">
          <div className="credential-hint">
            <p>
              Tài khoản mẫu: <code>admin</code> | Mật khẩu: <code>123456</code>
            </p>
            <button type="button" onClick={handleFillDemo} className="btn-link-demo">
              ⚡ Điền nhanh tài khoản mẫu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
