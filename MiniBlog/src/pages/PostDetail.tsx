import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { Comment, Post, PostCategory } from '../types';

const CATEGORY_STYLES: Record<PostCategory, { bg: string; text: string; icon: string }> = {
  Comeback: { bg: 'badge-comeback', text: 'Comeback', icon: '🔥' },
  News: { bg: 'badge-news', text: 'Tin Nóng', icon: '⚡' },
  Concert: { bg: 'badge-concert', text: 'Concert', icon: '🎤' },
  Rumor: { bg: 'badge-rumor', text: 'Tin Đồn', icon: '👀' },
  Exclusive: { bg: 'badge-exclusive', text: 'Độc Quyền', icon: '💎' },
};

export const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Form bình luận tương tác của fan
  const [fanName, setFanName] = useState<string>('');
  const [fanComment, setFanComment] = useState<string>('');

  useEffect(() => {
    let ignore = false;

    const fetchPostData = async () => {
      try {
        if (!id) {
          throw new Error('Không tìm thấy mã định danh bài viết.');
        }

        // 1. Kiểm tra xem bài viết có nằm trong localStorage không
        const stored = localStorage.getItem('local_posts');
        if (stored) {
          const localPosts: Post[] = JSON.parse(stored);
          const localMatch = localPosts.find((p) => String(p.id) === String(id));

          if (localMatch) {
            if (!ignore) {
              setPost({
                ...localMatch,
                isLocal: true,
                category: localMatch.category || 'Exclusive',
                author: localMatch.author || 'Quản trị viên K-Pop VIP',
                createdAt: localMatch.createdAt || 'Vừa đăng gần đây',
              });

              // Bình luận fan mặc định cho bài viết local
              setComments([
                {
                  id: 1001,
                  postId: localMatch.id,
                  name: 'K-Pop Fan Đích Thực',
                  email: 'fan@kpopzone.vn',
                  body: 'Thông tin bổ ích và rất nhanh chóng! Mong ban biên tập ra thêm nhiều bài viết độc quyền thế này nữa nhé.',
                },
                {
                  id: 1002,
                  postId: localMatch.id,
                  name: 'Idol Supporter',
                  email: 'stan@hallyu.com',
                  body: 'Ủng hộ hết mình cho idol, đợt này nhất định phải all-kill tất cả các bảng xếp hạng nhạc số!',
                },
              ]);
            }
            return;
          }
        }

        // 2. Nếu không có trong localStorage -> Gọi API JSONPlaceholder
        const [postRes, commentsRes] = await Promise.all([
          fetch(`https://jsonplaceholder.typicode.com/posts/${id}`),
          fetch(`https://jsonplaceholder.typicode.com/posts/${id}/comments`),
        ]);

        if (!postRes.ok) {
          if (postRes.status === 404) {
            throw new Error('Không tìm thấy bài viết này trong hệ thống K-Pop!');
          }
          throw new Error(`Lỗi máy chủ: Mã trạng thái ${postRes.status}`);
        }

        const postData = await postRes.json();
        const commentsData: Comment[] = commentsRes.ok ? await commentsRes.json() : [];

        const categories: PostCategory[] = ['Comeback', 'News', 'Concert', 'Rumor', 'Exclusive'];

        if (!ignore) {
          setPost({
            id: postData.id,
            title: postData.title,
            body: postData.body,
            userId: postData.userId,
            category: categories[postData.id % categories.length],
            author: `K-Net Editor #${postData.userId}`,
            createdAt: 'Tin chính thống',
            isLocal: false,
          });

          setComments(commentsData);
        }
      } catch (err: unknown) {
        if (!ignore) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError('Không thể kết nối đến máy chủ hoặc đường truyền bị gián đoạn!');
          }
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchPostData();

    return () => {
      ignore = true;
    };
  }, [id]);

  const handleAddFanComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fanName.trim() || !fanComment.trim()) return;

    const newComment: Comment = {
      id: Date.now(),
      postId: Number(id),
      name: fanName.trim(),
      email: 'fan@kpopzone.vn',
      body: fanComment.trim(),
    };

    setComments((prev) => [newComment, ...prev]);
    setFanName('');
    setFanComment('');
  };

  return (
    <div className="post-detail-page">
      <div className="navigation-bar">
        <Link to="/" className="btn-back">
          ← Quay lại danh sách tin tức
        </Link>
      </div>

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
          <h3 className="error-title">Lỗi xem bài viết</h3>
          <p className="error-message">{error}</p>
          <Link to="/" className="btn-retry">
            Về lại Trang chủ
          </Link>
        </div>
      )}

      {/* Chi Tiết Bài Viết & Bình Luận */}
      {!loading && !error && post && (
        <div className="post-detail-content">
          <article className="detail-card">
            <header className="detail-header">
              <div className="detail-meta-top">
                <span className={`post-badge ${CATEGORY_STYLES[post.category || 'News'].bg}`}>
                  {CATEGORY_STYLES[post.category || 'News'].icon}{' '}
                  {CATEGORY_STYLES[post.category || 'News'].text}
                </span>
                {post.isLocal && (
                  <span className="post-badge badge-user-created">👑 Bài Viết Của Bạn</span>
                )}
                <span className="detail-date">{post.createdAt || 'Mới cập nhật'}</span>
              </div>

              <h1 className="detail-title">{post.title}</h1>

              <div className="detail-author-info">
                <span className="author-avatar">✨</span>
                <div>
                  <div className="author-name">{post.author || 'Ban biên tập K-Pop Zone'}</div>
                  <div className="author-tag">Mã bài viết: #{post.id}</div>
                </div>
              </div>
            </header>

            <div className="detail-body">
              <p className="lead-text">{post.body}</p>
              <div className="kpop-quote-box">
                <p>
                  "Âm nhạc là cầu nối cảm xúc giữa Idol và người hâm mộ trên khắp thế giới. Hãy cùng theo dõi và lan tỏa những giai điệu rực rỡ nhất!"
                </p>
                <span>— K-Pop Zone Daily Scoop</span>
              </div>
            </div>
          </article>

          {/* Phần Bình Luận Của Fan */}
          <section className="comments-section">
            <div className="comments-header">
              <h2 className="comments-title">
                💬 Bình luận từ người hâm mộ ({comments.length})
              </h2>
            </div>

            {/* Ô nhập bình luận nhanh */}
            <form onSubmit={handleAddFanComment} className="fan-comment-form">
              <h4>Để lại bình luận ủng hộ Idol của bạn:</h4>
              <div className="form-group-row">
                <input
                  type="text"
                  placeholder="Tên của bạn hoặc Nickname Fan..."
                  value={fanName}
                  onChange={(e) => setFanName(e.target.value)}
                  className="comment-input"
                  required
                />
              </div>
              <div className="form-group-row">
                <textarea
                  placeholder="Gửi lời chúc, cảm nghĩ hoặc bình luận về bài viết..."
                  value={fanComment}
                  onChange={(e) => setFanComment(e.target.value)}
                  className="comment-textarea"
                  rows={3}
                  required
                />
              </div>
              <button type="submit" className="btn-primary">
                Gửi bình luận 💜
              </button>
            </form>

            {comments.length === 0 ? (
              <p className="no-comments">Chưa có bình luận nào. Hãy là người đầu tiên để lại cảm nghĩ!</p>
            ) : (
              <div className="comments-list">
                {comments.map((comment, index) => (
                  <div key={comment.id || index} className="comment-item">
                    <div className="comment-avatar">
                      {['🌸', '🎀', '⭐', '💖', '🎵', '🔥'][index % 6]}
                    </div>
                    <div className="comment-content">
                      <div className="comment-author-bar">
                        <span className="comment-author-name">{comment.name}</span>
                        <span className="comment-author-email">({comment.email})</span>
                      </div>
                      <p className="comment-text">{comment.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
};

export default PostDetail;
