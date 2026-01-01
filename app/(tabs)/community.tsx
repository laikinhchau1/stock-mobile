import React, { useEffect, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    RefreshControl,
    TouchableOpacity,
    ActivityIndicator,
    Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useCommunityStore } from '@/stores/community-store';
import { useAuthStore } from '@/stores/auth-store';
import { PostCard } from '@/components/community';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Post, PostCategory } from '@/services/community';

const tabs: { key: PostCategory | null; label: string }[] = [
    { key: null, label: 'Tất cả' },
    { key: PostCategory.ANALYSIS, label: 'Phân tích' },
    { key: PostCategory.NEWS, label: 'Tin tức' },
    { key: PostCategory.DISCUSSION, label: 'Thảo luận' },
    { key: PostCategory.EDUCATION, label: 'Học tập' },
];

export default function CommunityScreen() {
    const colorScheme = useColorScheme() ?? 'dark';
    const colors = Colors[colorScheme];
    const router = useRouter();

    const { isAuthenticated } = useAuthStore();
    const {
        posts,
        isLoading,
        isLoadingMore,
        hasMore,
        activeCategory,
        fetchPosts,
        fetchMorePosts,
        setCategory,
        likePost,
    } = useCommunityStore();

    useEffect(() => {
        fetchPosts(true);
    }, []);

    const handleRefresh = useCallback(() => {
        fetchPosts(true);
    }, []);

    const handleLoadMore = useCallback(() => {
        if (hasMore && !isLoadingMore) {
            fetchMorePosts();
        }
    }, [hasMore, isLoadingMore]);

    const handleShare = async (post: Post) => {
        try {
            await Share.share({
                title: post.title,
                message: `${post.title}\n\n${post.summary || post.content.substring(0, 200)}...`,
            });
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

    const handleCreatePost = () => {
        router.push('/community/create');
    };

    const renderPost = ({ item }: { item: Post }) => (
        <PostCard
            post={item}
            onLike={likePost}
            onShare={handleShare}
        />
    );

    const renderHeader = () => (
        <>
            {/* Header */}
            <View style={styles.header}>
                <Text style={[styles.title, { color: colors.text }]}>Cộng đồng</Text>
                <View style={styles.headerActions}>
                    {isAuthenticated && (
                        <TouchableOpacity
                            style={styles.headerButton}
                            onPress={() => router.push('/community/my-posts')}
                        >
                            <IconSymbol name="person.crop.circle" size={22} color={colors.textSecondary} />
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity
                        style={[styles.writeButton, { backgroundColor: colors.primary }]}
                        onPress={handleCreatePost}
                    >
                        <IconSymbol name="square.and.pencil" size={20} color={colors.textInverse} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Tabs */}
            <View style={styles.tabsContainer}>
                <FlatList
                    horizontal
                    data={tabs}
                    keyExtractor={(item) => item.label}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[
                                styles.tab,
                                {
                                    backgroundColor:
                                        activeCategory === item.key ? colors.primary : colors.surface,
                                },
                            ]}
                            onPress={() => setCategory(item.key)}
                        >
                            <Text
                                style={[
                                    styles.tabText,
                                    {
                                        color:
                                            activeCategory === item.key
                                                ? colors.textInverse
                                                : colors.textSecondary,
                                    },
                                ]}
                            >
                                {item.label}
                            </Text>
                        </TouchableOpacity>
                    )}
                />
            </View>
        </>
    );

    const renderEmpty = () => {
        if (isLoading) return null;

        return (
            <View style={styles.emptyContainer}>
                <IconSymbol name="doc.text" size={48} color={colors.textTertiary} />
                <Text style={[styles.emptyTitle, { color: colors.text }]}>
                    Chưa có bài viết
                </Text>
                <Text style={[styles.emptyDescription, { color: colors.textSecondary }]}>
                    Hãy là người đầu tiên chia sẻ với cộng đồng
                </Text>
            </View>
        );
    };

    const renderFooter = () => {
        if (!isLoadingMore) return null;

        return (
            <View style={styles.footer}>
                <ActivityIndicator size="small" color={colors.primary} />
            </View>
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <FlatList
                data={posts}
                renderItem={renderPost}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={renderHeader}
                ListEmptyComponent={renderEmpty}
                ListFooterComponent={renderFooter}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={isLoading}
                        onRefresh={handleRefresh}
                        tintColor={colors.primary}
                    />
                }
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.3}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: Spacing.lg,
        paddingTop: Spacing.lg,
        paddingBottom: Spacing.md,
    },
    title: {
        fontSize: FontSize.xxl,
        fontWeight: FontWeight.bold,
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerButton: {
        padding: Spacing.sm,
        marginRight: Spacing.sm,
    },
    writeButton: {
        padding: Spacing.sm,
        borderRadius: BorderRadius.full,
    },
    tabsContainer: {
        paddingHorizontal: Spacing.lg,
        marginBottom: Spacing.md,
    },
    tab: {
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.sm,
        borderRadius: BorderRadius.full,
        marginRight: Spacing.sm,
    },
    tabText: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.medium,
    },
    listContent: {
        paddingHorizontal: Spacing.lg,
        paddingBottom: Spacing.xxl,
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: Spacing.xxl * 2,
    },
    emptyTitle: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.semibold,
        marginTop: Spacing.md,
    },
    emptyDescription: {
        fontSize: FontSize.sm,
        marginTop: Spacing.xs,
        textAlign: 'center',
    },
    footer: {
        paddingVertical: Spacing.lg,
        alignItems: 'center',
    },
});
