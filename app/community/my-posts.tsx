import React, { useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Spacing, FontSize, FontWeight } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useCommunityStore } from '@/stores/community-store';
import { useAuthStore } from '@/stores/auth-store';
import { PostCard } from '@/components/community';
import { Button } from '@/components/ui/button';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Post } from '@/services/community';
import communityApi from '@/services/community';

export default function MyPostsScreen() {
    const colorScheme = useColorScheme() ?? 'dark';
    const colors = Colors[colorScheme];
    const router = useRouter();

    const { isAuthenticated } = useAuthStore();
    const { myPosts, isLoading, fetchMyPosts } = useCommunityStore();

    useEffect(() => {
        if (isAuthenticated) {
            fetchMyPosts();
        }
    }, [isAuthenticated]);

    const handleDeletePost = (post: Post) => {
        Alert.alert(
            'Xóa bài viết',
            `Bạn có chắc muốn xóa "${post.title}"?`,
            [
                { text: 'Hủy', style: 'cancel' },
                {
                    text: 'Xóa',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await communityApi.deletePost(post.id);
                            fetchMyPosts();
                            Alert.alert('Thành công', 'Đã xóa bài viết');
                        } catch (error) {
                            Alert.alert('Lỗi', 'Không thể xóa bài viết');
                        }
                    },
                },
            ]
        );
    };

    if (!isAuthenticated) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
                <View style={styles.authPrompt}>
                    <IconSymbol name="person.crop.circle.badge.exclamationmark" size={64} color={colors.textTertiary} />
                    <Text style={[styles.authTitle, { color: colors.text }]}>
                        Yêu cầu đăng nhập
                    </Text>
                    <Text style={[styles.authDescription, { color: colors.textSecondary }]}>
                        Bạn cần đăng nhập để xem bài viết của mình
                    </Text>
                    <Button
                        title="Đăng nhập"
                        onPress={() => router.push('/account')}
                        style={{ marginTop: Spacing.lg }}
                    />
                </View>
            </SafeAreaView>
        );
    }

    if (isLoading) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            </SafeAreaView>
        );
    }

    const renderPost = ({ item }: { item: Post }) => (
        <View style={styles.postContainer}>
            <PostCard post={item} />
            <TouchableOpacity
                style={[styles.deleteButton, { backgroundColor: colors.danger }]}
                onPress={() => handleDeletePost(item)}
            >
                <IconSymbol name="trash" size={16} color={colors.textInverse} />
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
            {myPosts.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <IconSymbol name="doc.text" size={64} color={colors.textTertiary} />
                    <Text style={[styles.emptyTitle, { color: colors.text }]}>
                        Chưa có bài viết
                    </Text>
                    <Text style={[styles.emptyDescription, { color: colors.textSecondary }]}>
                        Hãy chia sẻ phân tích hoặc kiến thức của bạn với cộng đồng
                    </Text>
                    <Button
                        title="Tạo bài viết đầu tiên"
                        onPress={() => router.push('/community/create')}
                        style={{ marginTop: Spacing.lg }}
                    />
                </View>
            ) : (
                <FlatList
                    data={myPosts}
                    renderItem={renderPost}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    authPrompt: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: Spacing.xl,
    },
    authTitle: {
        fontSize: FontSize.xl,
        fontWeight: FontWeight.bold,
        marginTop: Spacing.lg,
    },
    authDescription: {
        fontSize: FontSize.md,
        textAlign: 'center',
        marginTop: Spacing.sm,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: Spacing.xl,
    },
    emptyTitle: {
        fontSize: FontSize.xl,
        fontWeight: FontWeight.bold,
        marginTop: Spacing.lg,
    },
    emptyDescription: {
        fontSize: FontSize.md,
        textAlign: 'center',
        marginTop: Spacing.sm,
    },
    listContent: {
        padding: Spacing.lg,
    },
    postContainer: {
        position: 'relative',
    },
    deleteButton: {
        position: 'absolute',
        top: Spacing.sm,
        right: Spacing.sm,
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
