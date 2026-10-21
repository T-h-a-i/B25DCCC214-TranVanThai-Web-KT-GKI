import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import type { Post, PostCategory } from '../types';

const CATEGORY_STYLES: Record<PostCategory, { bg: string; text: string; icon: string }> = {
  Comeback: { bg: 'badge-comeback', text: 'Comeback', icon: '🔥' },
  News: { bg: 'badge-news', text: 'Tin Nóng', icon: '⚡' },
  Concert: { bg: 'badge-concert', text: 'Concert', icon: '🎤' },
  Rumor: { bg: 'badge-rumor', text: 'Tin Đồn', icon: '👀' },
  Exclusive: { bg: 'badge-exclusive', text: 'Độc Quyền', icon: '💎' },
};

export const Home: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState<number>(0);

  // Đồng bộ từ khóa tìm kiếm với URL query param: ?q=...
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  useEffect(() => {
    let ignore = false;

    const loadAllPosts = async () => {
      try {
        // 1. Lấy danh sách bài viết từ localStorage (local_posts)
        let localPosts: Post[] = [];
        try {
          const stored = localStorage.getItem('local_posts');
          if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed)) {
              localPosts = parsed.map((item) => ({
                ...item,
                isLocal: true,
                category: item.category || 'Exclusive',
              }));
            }
          }
        } catch {
          localPosts = [];
        }

        // 2. Fetch danh sách từ API JSONPlaceholder
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        if (!response.ok) {
          throw new Error(`Lỗi máy chủ: Mã trạng thái ${response.status}`);
        }

        const apiData: Array<{ id: number; title: string; body: string; userId: number }> =
          await response.json();

        const categories: PostCategory[] = ['Comeback', 'News', 'Concert', 'Rumor', 'Exclusive'];

        // Bổ sung metadata chủ đề K-Pop cho bài viết từ API
        const formattedApiPosts: Post[] = apiData.map((item) => ({
          id: item.id,
          title: item.title,
          body: item.body,
          userId: item.userId,
          category: categories[item.id % categories.length],
          author: `K-Net Editor #${item.userId}`,
          createdAt: 'Vừa cập nhật',
          isLocal: false,
        }));

        if (!ignore) {
          // Gộp bài viết local lên đầu danh sách hiển thị
          setPosts([...localPosts, ...formattedApiPosts]);
          setError(null);
        }
      } catch (err: unknown) {
        if (!ignore) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError('Không thể kết nối đến máy chủ hoặc mất kết nối mạng!');
          }
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadAllPosts();

    return () => {
      ignore = true;
    };
  }, [retryKey]);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    setRetryKey((prev) => prev + 1);
  };

  // Cập nhật URL khi người dùng gõ vào ô tìm kiếm
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.trim()) {
      setSearchParams({ q: value });
    } else {
      setSearchParams({});
    }
  };

  const handleClearSearch = () => {
    setSearchParams({});
  };

  // Lọc dữ liệu theo tiêu đề bằng useMemo
  const filteredPosts = useMemo(() => {
    if (!query.trim()) {
      return posts;
    }
    const lowerQuery = query.toLowerCase().trim();
    return posts.filter((post) => post.title.toLowerCase().includes(lowerQuery));
  }, [posts, query]);

  return (
    <div className="home-page">
      {/* Hero Banner K-Pop */}
      <section className="hero-banner">
        <div className="hero-badge">🌟 TRẠM TIN TỨC IDOL K-POP 24/7</div>
        <h1 className="hero-title">
          Khám Phá Thế Giới <span className="neon-text">K-POP ZONE</span>
        </h1>
        <p className="hero-subtitle">
          Cập nhật thông tin thần tượng, lịch comeback, concert và tin tức hậu trường hot nhất mọi thời điểm.
        </p>

        {/* Search Bar - Đồng bộ URL ?q=... */}
        <div className="search-box-wrapper">
          <div className="search-input-group">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Tìm kiếm tin tức idol theo tiêu đề (ví dụ: qui, sunt, comeback)..."
              value={query}
              onChange={handleSearchChange}
              className="search-input"
            />
            {query && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="btn-clear-search"
                title="Xóa tìm kiếm"
              >
                ✕
              </button>
            )}
          </div>
          {query && (
            <p className="search-status-text">
              Đang tìm kiếm theo từ khóa: <strong className="query-highlight">"{query}"</strong>
              {' '}(Tìm thấy {filteredPosts.length} kết quả)
            </p>
          )}
        </div>
      </section>

      {/* Trạng thái Đang Tải */}
      {loading && (
        <div className="status-container loading-container">
          <div className="kpop-spinner"></div>
          <p className="loading-text">Đang tải tin tức K-Pop...</p>
        </div>
      )}

      {/* Trạng thái Báo Lỗi */}
      {!loading && error && (
        <div className="status-container error-container">
          <div className="error-icon">⚠️</div>
          <h3 className="error-title">Không thể tải dữ liệu tin tức</h3>
          <p className="error-message">{error}</p>
          <button type="button" onClick={handleRetry} className="btn-retry">
            Thử tải lại
          </button>
        </div>
      )}

      {/* Danh Sách Bài Viết */}
      {!loading && !error && (
        <section className="posts-section">
          <div className="section-header">
            <h2 className="section-title">
              📰 Bảng Tin Mới Nhất ({filteredPosts.length} bài viết)
            </h2>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">💔</span>
              <h3>Không tìm thấy bài viết nào phù hợp!</h3>
              <p>Hãy thử tìm kiếm với từ khóa khác hoặc tạo một bài viết tin tức mới.</p>
              {query && (
                <button type="button" onClick={handleClearSearch} className="btn-secondary">
                  Xem tất cả bài viết
                </button>
              )}
            </div>
          ) : (
            <div className="posts-grid">
              {filteredPosts.map((post) => {
                const categoryInfo = CATEGORY_STYLES[post.category || 'News'];

                return (
                  <article key={post.id} className={`post-card ${post.isLocal ? 'local-highlight' : ''}`}>
                    <div className="post-card-top">
                      <div className="post-badges">
                        <span className={`post-badge ${categoryInfo.bg}`}>
                          {categoryInfo.icon} {categoryInfo.text}
                        </span>
                        {post.isLocal && (
                          <span className="post-badge badge-user-created">
                            👑 Tin Fan Đăng
                          </span>
                        )}
                      </div>
                      <span className="post-date">{post.createdAt || 'Mới cập nhật'}</span>
                    </div>

                    <h3 className="post-title">
                      <Link to={`/posts/${post.id}`} className="post-title-link">
                        {post.title}
                      </Link>
                    </h3>

                    <p className="post-excerpt">
                      {post.body.length > 120 ? `${post.body.slice(0, 120)}...` : post.body}
                    </p>

                    <div className="post-footer">
                      <span className="post-author">
                        ✍️ {post.author || 'K-Pop Fan Editor'}
                      </span>
                      <Link to={`/posts/${post.id}`} className="post-read-more">
                        Đọc tiếp →
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default Home;
