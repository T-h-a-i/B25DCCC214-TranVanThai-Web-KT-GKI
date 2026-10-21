import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Post, PostCategory } from '../types';

export const CreatePost: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [body, setBody] = useState<string>('');
  const [category, setCategory] = useState<PostCategory>('Comeback');
  const [author, setAuthor] = useState<string>('Admin K-Pop Zone');

  const [errors, setErrors] = useState<{ title?: string; body?: string }>({});
  const [touched, setTouched] = useState<{ title?: boolean; body?: boolean }>({});

  const navigate = useNavigate();

  // Kiểm tra tính hợp lệ của dữ liệu
  const validateForm = (): boolean => {
    const newErrors: { title?: string; body?: string } = {};

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      newErrors.title = 'Tiêu đề tin tức không được để trống!';
    } else if (trimmedTitle.length < 5) {
      newErrors.title = 'Tiêu đề bài viết phải có tối thiểu 5 ký tự!';
    }

    const trimmedBody = body.trim();
    if (!trimmedBody) {
      newErrors.body = 'Nội dung bài viết không được để trống!';
    } else if (trimmedBody.length < 10) {
      newErrors.body = 'Nội dung bài viết phải chứa tối thiểu 10 ký tự!';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field: 'title' | 'body') => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateForm();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ title: true, body: true });

    if (!validateForm()) {
      return;
    }

    // Tạo bài viết mới với id sinh bằng Date.now()
    const newPost: Post = {
      id: Date.now(),
      title: title.trim(),
      body: body.trim(),
      category,
      author: author.trim() || 'Admin K-Pop Zone',
      createdAt: new Date().toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
      isLocal: true,
    };

    // Đọc danh sách cũ trong localStorage và gộp thêm bài mới lên đầu
    try {
      let localPosts: Post[] = [];
      const stored = localStorage.getItem('local_posts');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          localPosts = parsed;
        }
      }
      const updatedPosts = [newPost, ...localPosts];
      localStorage.setItem('local_posts', JSON.stringify(updatedPosts));
    } catch {
      localStorage.setItem('local_posts', JSON.stringify([newPost]));
    }

    // Điều hướng về trang chủ '/' sau khi đăng bài thành công
    navigate('/');
  };

  return (
    <div className="create-post-page">
      <div className="create-post-card">
        <div className="card-header">
          <span className="card-badge">👑 BAN BIÊN TẬP K-POP</span>
          <h1 className="card-title">Đăng Tin Tức Idol Mới</h1>
          <p className="card-subtitle">
            Chia sẻ tin tức, sự kiện concert, lịch comeback hoặc phỏng vấn độc quyền về thần tượng K-Pop.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="post-form" noValidate>
          {/* Danh mục bài viết */}
          <div className="form-group">
            <label htmlFor="category">Chuyên mục tin tức</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as PostCategory)}
              className="form-control"
            >
              <option value="Comeback">🔥 Comeback / MV mới</option>
              <option value="News">⚡ Tin nóng 24h</option>
              <option value="Concert">🎤 Concert & World Tour</option>
              <option value="Exclusive">💎 Bài viết độc quyền</option>
              <option value="Rumor">👀 Tin đồn & Thuyết âm mưu</option>
            </select>
          </div>

          {/* Tiêu đề bài viết */}
          <div className="form-group">
            <label htmlFor="post-title">
              Tiêu đề bài viết <span className="required">*</span>
            </label>
            <input
              id="post-title"
              type="text"
              placeholder="Nhập tiêu đề tin tức (tối thiểu 5 ký tự)..."
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (touched.title) validateForm();
              }}
              onBlur={() => handleBlur('title')}
              className={`form-control ${touched.title && errors.title ? 'is-invalid' : ''}`}
            />
            {touched.title && errors.title && (
              <p className="form-error-text">⚠️ {errors.title}</p>
            )}
          </div>

          {/* Tác giả / Bút danh */}
          <div className="form-group">
            <label htmlFor="author">Bút danh tác giả</label>
            <input
              id="author"
              type="text"
              placeholder="Ví dụ: Admin K-Pop Zone"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="form-control"
            />
          </div>

          {/* Nội dung bài viết */}
          <div className="form-group">
            <label htmlFor="post-body">
              Nội dung chi tiết <span className="required">*</span>
            </label>
            <textarea
              id="post-body"
              rows={6}
              placeholder="Nhập nội dung tin tức idol, phát ngôn, thành tích nhạc số (tối thiểu 10 ký tự)..."
              value={body}
              onChange={(e) => {
                setBody(e.target.value);
                if (touched.body) validateForm();
              }}
              onBlur={() => handleBlur('body')}
              className={`form-control ${touched.body && errors.body ? 'is-invalid' : ''}`}
            />
            {touched.body && errors.body && (
              <p className="form-error-text">⚠️ {errors.body}</p>
            )}
          </div>

          {/* Các nút hành động */}
          <div className="form-actions">
            <button type="button" onClick={() => navigate('/')} className="btn-secondary">
              Hủy bỏ
            </button>
            <button type="submit" className="btn-primary">
              Đăng Bài Viết Ngay ✨
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
