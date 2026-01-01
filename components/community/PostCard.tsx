import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Card } from '@/components/ui/card';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Post, PostCategory } from '@/services/community';
import { useRouter } from 'expo-router';

interface PostCardProps {
    post: Post;
    onLike?: (id: string) => void;
    onShare?: (post: Post) => void;
}

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

const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Vừa xong';
    if (diffHours < 24) return `${diffHours}h trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;
    return date.toLocaleDateString('vi-VN');
};

export function PostCard({ post, onLike, onShare }: PostCardProps) {
    const colorScheme = useColorScheme() ?? 'dark';
    const colors = Colors[colorScheme];
    const router = useRouter();

    const categoryConfig = getCategoryConfig(post.category);
    const categoryColor = colors[categoryConfig.colorKey];

    const handlePress = () => {
        router.push(`/community/${post.id}`);
    };

    const handleLike = () => {
        onLike?.(post.id);
    };

    const handleShare = () => {
        onShare?.(post);
    };

    return (
        <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
            <Card style={styles.card}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.authorInfo}>
                        <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
                            <Text style={[styles.avatarText, { color: colors.textInverse }]}>
                                {(post.author?.name ?? 'U').charAt(0).toUpperCase()}
                            </Text>
                        </View>
                        <View>
                            <Text style={[styles.authorName, { color: colors.text }]}>
                                {post.author?.name ?? 'Ẩn danh'}
                            </Text>
                            <Text style={[styles.postTime, { color: colors.textTertiary }]}>
                                {formatTime(post.createdAt)}
                            </Text>
                        </View>
                    </View>
                    <View style={[styles.categoryBadge, { backgroundColor: `${categoryColor}20` }]}>
                        <Text style={[styles.categoryText, { color: categoryColor }]}>
                            {categoryConfig.label}
                        </Text>
                    </View>
                </View>

                {/* Content */}
                <Text style={[styles.title, { color: colors.text }]}>{post.title}</Text>
                {post.summary && (
                    <Text
                        style={[styles.summary, { color: colors.textSecondary }]}
                        numberOfLines={2}
                    >
                        {post.summary}
                    </Text>
                )}

                {/* Symbol Tags */}
                {post.symbols && post.symbols.length > 0 && (
                    <View style={styles.symbolTags}>
                        {post.symbols.map((symbol) => (
                            <TouchableOpacity
                                key={symbol}
                                style={[styles.symbolTag, { backgroundColor: colors.surface }]}
                                onPress={() => router.push(`/stock/${symbol}`)}
                            >
                                <Text style={[styles.symbolText, { color: colors.primary }]}>
                                    ${symbol}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                {/* Footer */}
                <View style={[styles.footer, { borderTopColor: colors.divider }]}>
                    <TouchableOpacity style={styles.footerAction} onPress={handleLike}>
                        <IconSymbol name="heart" size={18} color={colors.textSecondary} />
                        <Text style={[styles.footerText, { color: colors.textSecondary }]}>
                            {post.likes}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.footerAction} onPress={handlePress}>
                        <IconSymbol name="bubble.left" size={18} color={colors.textSecondary} />
                        <Text style={[styles.footerText, { color: colors.textSecondary }]}>
                            {post.comments?.length || 0}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.footerAction} onPress={handleShare}>
                        <IconSymbol name="square.and.arrow.up" size={18} color={colors.textSecondary} />
                    </TouchableOpacity>
                    <View style={styles.viewsContainer}>
                        <IconSymbol name="eye" size={14} color={colors.textTertiary} />
                        <Text style={[styles.viewsText, { color: colors.textTertiary }]}>
                            {post.views}
                        </Text>
                    </View>
                </View>
            </Card>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        marginBottom: Spacing.md,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    authorInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: Spacing.sm,
    },
    avatarText: {
        fontSize: FontSize.md,
        fontWeight: FontWeight.bold,
    },
    authorName: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.medium,
    },
    postTime: {
        fontSize: FontSize.xs,
    },
    categoryBadge: {
        paddingHorizontal: Spacing.sm,
        paddingVertical: 2,
        borderRadius: BorderRadius.sm,
    },
    categoryText: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.medium,
    },
    title: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.semibold,
        marginBottom: Spacing.xs,
    },
    summary: {
        fontSize: FontSize.sm,
        lineHeight: 20,
    },
    symbolTags: {
        flexDirection: 'row',
        marginTop: Spacing.sm,
        flexWrap: 'wrap',
    },
    symbolTag: {
        paddingHorizontal: Spacing.sm,
        paddingVertical: 2,
        borderRadius: BorderRadius.sm,
        marginRight: Spacing.xs,
        marginBottom: Spacing.xs,
    },
    symbolText: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.medium,
    },
    footer: {
        flexDirection: 'row',
        marginTop: Spacing.md,
        paddingTop: Spacing.md,
        borderTopWidth: 1,
        alignItems: 'center',
    },
    footerAction: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: Spacing.xl,
    },
    footerText: {
        fontSize: FontSize.sm,
        marginLeft: Spacing.xs,
    },
    viewsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 'auto',
    },
    viewsText: {
        fontSize: FontSize.xs,
        marginLeft: 4,
    },
});
