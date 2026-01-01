import { create } from 'zustand';
import { communityApi, Post, PostCategory, PostsResponse, CreatePostData, CreateCommentData, Comment } from '@/services/community';

interface CommunityState {
    // Posts
    posts: Post[];
    currentPost: Post | null;
    myPosts: Post[];

    // Pagination
    page: number;
    totalPages: number;
    hasMore: boolean;

    // Filters
    activeCategory: PostCategory | null;
    searchQuery: string;

    // Loading states
    isLoading: boolean;
    isRefreshing: boolean;
    isLoadingMore: boolean;
    isLoadingPost: boolean;
    isSubmitting: boolean;

    // Error
    error: string | null;

    // Actions
    fetchPosts: (reset?: boolean, isRefresh?: boolean) => Promise<void>;
    fetchMorePosts: () => Promise<void>;
    fetchPostById: (id: string) => Promise<void>;
    fetchMyPosts: () => Promise<void>;
    setCategory: (category: PostCategory | null) => void;
    setSearchQuery: (query: string) => void;
    createPost: (data: CreatePostData) => Promise<Post | null>;
    likePost: (id: string) => Promise<void>;
    addComment: (postId: string, data: CreateCommentData) => Promise<Comment | null>;
    likeComment: (commentId: string) => Promise<void>;
    clearError: () => void;
    reset: () => void;
}

const initialState = {
    posts: [],
    currentPost: null,
    myPosts: [],
    page: 1,
    totalPages: 1,
    hasMore: false,
    activeCategory: null,
    searchQuery: '',
    isLoading: false,
    isRefreshing: false,
    isLoadingMore: false,
    isLoadingPost: false,
    isSubmitting: false,
    error: null,
};

export const useCommunityStore = create<CommunityState>((set, get) => ({
    ...initialState,

    fetchPosts: async (reset = true, isRefresh = false) => {
        const { activeCategory, searchQuery, page } = get();

        if (reset) {
            set({
                isLoading: true,
                isRefreshing: isRefresh,
                error: null,
                page: 1
            });
        }

        try {
            const response = await communityApi.getPosts({
                category: activeCategory || undefined,
                search: searchQuery || undefined,
                page: reset ? 1 : page,
                limit: 20,
            });

            set({
                posts: reset ? response.data : [...get().posts, ...response.data],
                page: response.meta.page,
                totalPages: response.meta.totalPages,
                hasMore: response.meta.page < response.meta.totalPages,
                isLoading: false,
                isRefreshing: false,
            });
        } catch (error: any) {
            set({
                error: error.message || 'Failed to fetch posts',
                isLoading: false,
                isRefreshing: false,
            });
        }
    },

    fetchMorePosts: async () => {
        const { hasMore, isLoadingMore, page, activeCategory, searchQuery, posts } = get();

        if (!hasMore || isLoadingMore) return;

        set({ isLoadingMore: true });

        try {
            const response = await communityApi.getPosts({
                category: activeCategory || undefined,
                search: searchQuery || undefined,
                page: page + 1,
                limit: 20,
            });

            set({
                posts: [...posts, ...response.data],
                page: response.meta.page,
                totalPages: response.meta.totalPages,
                hasMore: response.meta.page < response.meta.totalPages,
                isLoadingMore: false,
            });
        } catch (error: any) {
            set({
                error: error.message || 'Failed to fetch more posts',
                isLoadingMore: false,
            });
        }
    },

    fetchPostById: async (id: string) => {
        set({ isLoadingPost: true, error: null, currentPost: null });

        try {
            const post = await communityApi.getPostById(id);
            set({ currentPost: post, isLoadingPost: false });
        } catch (error: any) {
            set({
                error: error.message || 'Failed to fetch post',
                isLoadingPost: false,
            });
        }
    },

    fetchMyPosts: async () => {
        set({ isLoading: true, error: null });

        try {
            const response = await communityApi.getMyPosts();
            set({ myPosts: response.data, isLoading: false });
        } catch (error: any) {
            set({
                error: error.message || 'Failed to fetch my posts',
                isLoading: false,
            });
        }
    },

    setCategory: (category: PostCategory | null) => {
        set({ activeCategory: category });
        get().fetchPosts(true);
    },

    setSearchQuery: (query: string) => {
        set({ searchQuery: query });
    },

    createPost: async (data: CreatePostData) => {
        set({ isSubmitting: true, error: null });

        try {
            const post = await communityApi.createPost(data);
            set((state) => ({
                posts: [post, ...state.posts],
                isSubmitting: false,
            }));
            return post;
        } catch (error: any) {
            set({
                error: error.message || 'Failed to create post',
                isSubmitting: false,
            });
            return null;
        }
    },

    likePost: async (id: string) => {
        try {
            const updatedPost = await communityApi.likePost(id);

            // Update in posts list
            set((state) => ({
                posts: state.posts.map((p) =>
                    p.id === id ? { ...p, likes: updatedPost.likes } : p
                ),
                currentPost:
                    state.currentPost?.id === id
                        ? { ...state.currentPost, likes: updatedPost.likes }
                        : state.currentPost,
            }));
        } catch (error: any) {
            set({ error: error.message || 'Failed to like post' });
        }
    },

    addComment: async (postId: string, data: CreateCommentData) => {
        set({ isSubmitting: true, error: null });

        try {
            const comment = await communityApi.addComment(postId, data);

            // Update currentPost comments
            set((state) => ({
                currentPost: state.currentPost
                    ? {
                        ...state.currentPost,
                        comments: [...(state.currentPost.comments || []), comment],
                    }
                    : null,
                isSubmitting: false,
            }));

            return comment;
        } catch (error: any) {
            set({
                error: error.message || 'Failed to add comment',
                isSubmitting: false,
            });
            return null;
        }
    },

    likeComment: async (commentId: string) => {
        try {
            const updatedComment = await communityApi.likeComment(commentId);

            set((state) => ({
                currentPost: state.currentPost
                    ? {
                        ...state.currentPost,
                        comments: state.currentPost.comments?.map((c) =>
                            c.id === commentId ? { ...c, likes: updatedComment.likes } : c
                        ),
                    }
                    : null,
            }));
        } catch (error: any) {
            set({ error: error.message || 'Failed to like comment' });
        }
    },

    clearError: () => set({ error: null }),

    reset: () => set(initialState),
}));
