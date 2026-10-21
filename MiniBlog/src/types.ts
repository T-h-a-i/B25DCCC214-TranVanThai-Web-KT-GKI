export type PostCategory = 'Comeback' | 'News' | 'Concert' | 'Rumor' | 'Exclusive';

export interface Post {
  id: number;
  title: string;
  body: string;
  userId?: number;
  category?: PostCategory;
  author?: string;
  createdAt?: string;
  isLocal?: boolean;
}

export interface Comment {
  id: number;
  postId: number;
  name: string;
  email: string;
  body: string;
}

export interface AuthUser {
  username: string;
  loginAt?: string;
}
