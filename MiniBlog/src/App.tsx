import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import PostDetail from './pages/PostDetail';
import Login from './pages/Login';
import CreatePost from './pages/CreatePost';
import NotFound from './pages/NotFound';
import ProtectedRoute from './routes/ProtectedRoute';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          {/* 1. Trang chủ danh sách bài viết & tìm kiếm */}
          <Route index element={<Home />} />

          {/* 2. Trang chi tiết bài viết và bình luận */}
          <Route path="posts/:id" element={<PostDetail />} />

          {/* 4. Trang đăng nhập tài khoản */}
          <Route path="login" element={<Login />} />

          {/* 4 & 5. Route viết bài được bảo vệ bởi ProtectedRoute */}
          <Route
            path="create"
            element={
              <ProtectedRoute>
                <CreatePost />
              </ProtectedRoute>
            }
          />

          {/* 6. Trang 404 cho mọi đường dẫn không tồn tại */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
