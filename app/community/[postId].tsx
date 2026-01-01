import React, { useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    ActivityIndicator,
    Share,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useCommunityStore } from '@/stores/community-store';
import { useAuthStore } from '@/stores/auth-store';
import { CommentItem, CommentInput } from '@/components/community';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { PostCategory } from '@/services/community';

const getCategoryConfig = (category: PostCategory) => {
    const configs: Record<PostCategory, { label: string; colorKey: 'info' | 'warning' | 'primary' | 'textSecondary' }> = {
        ANALYSIS: { label: 'Phân tích', colorKey: 'info' },
        NEWS: { label: 'Tin tức', colorKey: 'warning' },
        STRATEGY: { label: 'Chiến lược', colorKey: 'primary' },
        DISCUSSION: { label: 'Thảo luận', colorKey: 'textSecondary' },
        EDUCATION: { label: 'Học tập', colorKey: 'primary' },
    };
    return configs[category] || { label: category, colorKey: 'textSecondary' };
};

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

export default function PostDetailScreen() {
    const { postId } = useLocalSearchParams<{ postId: string }>();
    const colorScheme = useColorScheme() ?? 'dark';
    const colors = Colors[colorScheme];
    const router = useRouter();

    const { isAuthenticated } = useAuthStore();
    const {
        currentPost,
        isLoadingPost,
        isSubmitting,
        error,
        fetchPostById,
        likePost,
        addComment,
        likeComment,
    } = useCommunityStore();

    useEffect(() => {
        if (postId) {
            fetchPostById(postId);
        }
    }, [postId]);

    const handleShare = async () => {
        if (!currentPost) return;
        try {
            await Share.share({
                title: currentPost.title,
                message: `${currentPost.title}\n\n${currentPost.summary || currentPost.content.substring(0, 200)}...`,
            });
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

    const handleAddComment = async (content: string) => {
        if (!postId) return;
        await addComment(postId, { content });
    };

    if (isLoadingPost) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            </SafeAreaView>
        );
    }

    if (error || !currentPost) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
                {/* Header */}
                <View style={[styles.header, { borderBottomColor: colors.divider }]}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <IconSymbol name="chevron.left" size={24} color={colors.text} />
                        <Text style={[styles.backText, { color: colors.text }]}>Quay lại</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.errorContainer}>
                    <IconSymbol name="exclamationmark.triangle" size={48} color={colors.danger} />
                    <Text style={[styles.errorText, { color: colors.text }]}>
                        {error || 'Không tìm thấy bài viết'}
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    const categoryConfig = getCategoryConfig(currentPost.category);
    const categoryColor = colors[categoryConfig.colorKey];

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: colors.divider }]}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <IconSymbol name="chevron.left" size={24} color={colors.text} />
                    <Text style={[styles.backText, { color: colors.text }]}>Quay lại</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
                    <IconSymbol name="square.and.arrow.up" size={22} color={colors.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Author Info */}
                <View style={styles.authorSection}>
                    <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
                        <Text style={[styles.avatarText, { color: colors.textInverse }]}>
                            {(currentPost.author?.name ?? 'Ẩn danh').charAt(0).toUpperCase()}
                        </Text>
                    </View>
                    <View style={styles.authorInfo}>
                        <Text style={[styles.authorName, { color: colors.text }]}>
                            {currentPost.author?.name ?? 'Ẩn danh'}
                        </Text>
                        <Text style={[styles.postDate, { color: colors.textTertiary }]}>
                            {formatDate(currentPost.createdAt)}
                        </Text>
                    </View>
                    <View style={[styles.categoryBadge, { backgroundColor: `${categoryColor}20` }]}>
                        <Text style={[styles.categoryText, { color: categoryColor }]}>
                            {categoryConfig.label}
                        </Text>
                    </View>
                </View>

                {/* Title */}
                <Text style={[styles.title, { color: colors.text }]}>{currentPost.title}</Text>

                {/* Symbol Tags */}
                {currentPost.symbols && currentPost.symbols.length > 0 && (
                    <View style={styles.symbolTags}>
                        {currentPost.symbols.map((symbol) => (
                            <View
                                key={symbol}
                                style={[styles.symbolTag, { backgroundColor: colors.surface }]}
                            >
                                <Text style={[styles.symbolText, { color: colors.primary }]}>
                                    ${symbol}
                                </Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* Content */}
                <Text style={[styles.content, { color: colors.text }]}>
                    {currentPost.content}
                </Text>

                {/* Stats */}
                <View style={[styles.statsContainer, { borderTopColor: colors.divider, borderBottomColor: colors.divider }]}>
                    <TouchableOpacity style={styles.statItem} onPress={() => likePost(currentPost.id)}>
                        <IconSymbol name="heart" size={20} color={colors.textSecondary} />
                        <Text style={[styles.statText, { color: colors.textSecondary }]}>
                            {currentPost.likes} thích
                        </Text>
                    </TouchableOpacity>
                    <View style={styles.statItem}>
                        <IconSymbol name="bubble.left" size={20} color={colors.textSecondary} />
                        <Text style={[styles.statText, { color: colors.textSecondary }]}>
                            {currentPost.comments?.length || 0} bình luận
                        </Text>
                    </View>
                    <View style={styles.statItem}>
                        <IconSymbol name="eye" size={20} color={colors.textSecondary} />
                        <Text style={[styles.statText, { color: colors.textSecondary }]}>
                            {currentPost.views} lượt xem
                        </Text>
                    </View>
                </View>

                {/* Comments Section */}
                <View style={styles.commentsSection}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        Bình luận ({currentPost.comments?.length || 0})
                    </Text>

                    {currentPost.comments && currentPost.comments.length > 0 ? (
                        currentPost.comments.map((comment) => (
                            <CommentItem
                                key={comment.id}
                                comment={comment}
                                onLike={likeComment}
                            />
                        ))
                    ) : (
                        <View style={styles.emptyComments}>
                            <IconSymbol name="bubble.left" size={32} color={colors.textTertiary} />
                            <Text style={[styles.emptyText, { color: colors.textTertiary }]}>
                                Chưa có bình luận nào
                            </Text>
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Comment Input */}
            {isAuthenticated ? (
                <CommentInput
                    onSubmit={handleAddComment}
                    isSubmitting={isSubmitting}
                />
            ) : (
                <View style={[styles.loginPrompt, { backgroundColor: colors.surface, borderTopColor: colors.divider }]}>
                    <Text style={[styles.loginText, { color: colors.textSecondary }]}>
                        Đăng nhập để bình luận
                    </Text>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.md,
        borderBottomWidth: 1,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backText: {
        fontSize: FontSize.md,
        marginLeft: Spacing.xs,
    },
    shareButton: {
        padding: Spacing.xs,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: Spacing.xl,
    },
    errorText: {
        fontSize: FontSize.md,
        marginTop: Spacing.md,
        textAlign: 'center',
    },
    scrollView: {
        flex: 1,
        padding: Spacing.lg,
    },
    authorSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.lg,
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: Spacing.md,
    },
    avatarText: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.bold,
    },
    authorInfo: {
        flex: 1,
    },
    authorName: {
        fontSize: FontSize.md,
        fontWeight: FontWeight.semibold,
    },
    postDate: {
        fontSize: FontSize.xs,
        marginTop: 2,
    },
    categoryBadge: {
        paddingHorizontal: Spacing.sm,
        paddingVertical: 4,
        borderRadius: BorderRadius.sm,
    },
    categoryText: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.medium,
    },
    title: {
        fontSize: FontSize.xl,
        fontWeight: FontWeight.bold,
        lineHeight: 28,
        marginBottom: Spacing.md,
    },
    symbolTags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: Spacing.lg,
    },
    symbolTag: {
        paddingHorizontal: Spacing.sm,
        paddingVertical: 4,
        borderRadius: BorderRadius.sm,
        marginRight: Spacing.xs,
        marginBottom: Spacing.xs,
    },
    symbolText: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.medium,
    },
    content: {
        fontSize: FontSize.md,
        lineHeight: 24,
        marginBottom: Spacing.xl,
    },
    statsContainer: {
        flexDirection: 'row',
        paddingVertical: Spacing.md,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        marginBottom: Spacing.lg,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: Spacing.xl,
    },
    statText: {
        fontSize: FontSize.sm,
        marginLeft: Spacing.xs,
    },
    commentsSection: {
        marginBottom: Spacing.xxl,
    },
    sectionTitle: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.semibold,
        marginBottom: Spacing.md,
    },
    emptyComments: {
        alignItems: 'center',
        padding: Spacing.xl,
    },
    emptyText: {
        fontSize: FontSize.sm,
        marginTop: Spacing.sm,
    },
    loginPrompt: {
        padding: Spacing.lg,
        alignItems: 'center',
        borderTopWidth: 1,
    },
    loginText: {
        fontSize: FontSize.sm,
    },
});
