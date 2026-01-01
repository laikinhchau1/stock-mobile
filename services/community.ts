import api from './api';
import { API_ENDPOINTS } from '@/constants/api';

// Types
export enum PostCategory {
    ANALYSIS = 'ANALYSIS',
    NEWS = 'NEWS',
    DISCUSSION = 'DISCUSSION',
    STRATEGY = 'STRATEGY',
    EDUCATION = 'EDUCATION',
}

export interface Author {
    id: string;
    name: string;
    avatar?: string;
}

export interface Comment {
    id: string;
    content: string;
    likes: number;
    createdAt: string;
    updatedAt: string;
    author: Author;
    parentId?: string;
}

export interface Post {
    id: string;
    title: string;
    content: string;
    summary?: string;
    category: PostCategory;
    tags?: string[];
    symbols?: string[];
    thumbnail?: string;
    views: number;
    likes: number;
    isPublished: boolean;
    isPinned: boolean;
    createdAt: string;
    updatedAt: string;
    author: Author;
    comments?: Comment[];
}

export interface PostsResponse {
    data: Post[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface QueryPostsParams {
    category?: PostCategory;
    symbol?: string;
    tag?: string;
    search?: string;
    page?: number;
    limit?: number;
}

export interface CreatePostData {
    title: string;
    content: string;
    summary?: string;
    category?: PostCategory;
    tags?: string[];
    symbols?: string[];
    thumbnail?: string;
    isPublished?: boolean;
}

export interface CreateCommentData {
    content: string;
    parentId?: string;
}

// API Functions
export const communityApi = {
    // Posts
    getPosts: (params?: QueryPostsParams) => {
        const queryString = params
            ? '?' + new URLSearchParams(
                Object.entries(params)
                    .filter(([, v]) => v !== undefined)
                    .map(([k, v]) => [k, String(v)])
            ).toString()
            : '';
        return api.get<PostsResponse>(`${API_ENDPOINTS.POSTS}${queryString}`);
    },

    getPostsByCategory: (category: 'analysis' | 'news' | 'education') => {
        const endpoints = {
            analysis: API_ENDPOINTS.POSTS_ANALYSIS,
            news: API_ENDPOINTS.POSTS_NEWS,
            education: API_ENDPOINTS.POSTS_EDUCATION,
        };
        return api.get<PostsResponse>(endpoints[category]);
    },

    getPostById: (id: string) => {
        return api.get<Post>(`${API_ENDPOINTS.POSTS}/${id}`);
    },

    createPost: (data: CreatePostData) => {
        return api.post<Post>(API_ENDPOINTS.POSTS, data);
    },

    updatePost: (id: string, data: Partial<CreatePostData>) => {
        return api.put<Post>(`${API_ENDPOINTS.POSTS}/${id}`, data);
    },

    deletePost: (id: string) => {
        return api.delete<{ message: string }>(`${API_ENDPOINTS.POSTS}/${id}`);
    },

    likePost: (id: string) => {
        return api.post<Post>(`${API_ENDPOINTS.POSTS}/${id}/like`);
    },

    getMyPosts: (page?: number, limit?: number) => {
        const params = new URLSearchParams();
        if (page) params.append('page', String(page));
        if (limit) params.append('limit', String(limit));
        const queryString = params.toString() ? `?${params.toString()}` : '';
        return api.get<PostsResponse>(`${API_ENDPOINTS.MY_POSTS}${queryString}`);
    },

    // Comments
    addComment: (postId: string, data: CreateCommentData) => {
        return api.post<Comment>(`${API_ENDPOINTS.POSTS}/${postId}/comments`, data);
    },

    deleteComment: (id: string) => {
        return api.delete<{ message: string }>(`/community/comments/${id}`);
    },

    likeComment: (id: string) => {
        return api.post<Comment>(`/community/comments/${id}/like`);
    },
};

export default communityApi;
