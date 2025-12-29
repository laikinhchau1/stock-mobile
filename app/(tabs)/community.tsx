import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    RefreshControl,
    TouchableOpacity,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Card } from '@/components/ui/card';
import { IconSymbol } from '@/components/ui/icon-symbol';

// Mock data
const mockPosts = [
    {
        id: '1',
        title: 'Phân tích kỹ thuật VNM - Cơ hội mua vào?',
        summary: 'VNM đang trong xu hướng tăng với RSI ở vùng trung tính. Hỗ trợ mạnh tại 72,000...',
        author: 'Nguyễn Văn A',
        authorAvatar: null,
        category: 'ANALYSIS',
        likes: 42,
        comments: 15,
        createdAt: '2h trước',
        symbols: ['VNM'],
    },
    {
        id: '2',
        title: 'Tin nóng: FED giữ nguyên lãi suất',
        summary: 'Cục Dự trữ Liên bang Mỹ quyết định giữ nguyên lãi suất trong cuộc họp tháng 12...',
        author: 'Thị Trường',
        authorAvatar: null,
        category: 'NEWS',
        likes: 128,
        comments: 45,
        createdAt: '4h trước',
        symbols: [],
    },
    {
        id: '3',
        title: 'Chiến lược đầu tư cho năm 2025',
        summary: 'Năm 2025 được dự báo sẽ là năm nhiều biến động. Cùng phân tích các ngành tiềm năng...',
        author: 'Chuyên gia CK',
        authorAvatar: null,
        category: 'STRATEGY',
        likes: 256,
        comments: 78,
        createdAt: '1 ngày trước',
        symbols: ['VNM', 'FPT', 'VCB'],
    },
];

const tabs = ['Tất cả', 'Phân tích', 'Tin tức', 'Thảo luận', 'Học tập'];

export default function CommunityScreen() {
    const colorScheme = useColorScheme() ?? 'dark';
    const colors = Colors[colorScheme];
    const [refreshing, setRefreshing] = useState(false);
    const [activeTab, setActiveTab] = useState('Tất cả');

    const onRefresh = async () => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1000);
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'ANALYSIS':
                return colors.info;
            case 'NEWS':
                return colors.warning;
            case 'STRATEGY':
                return colors.primary;
            default:
                return colors.textSecondary;
        }
    };

    const getCategoryLabel = (category: string) => {
        switch (category) {
            case 'ANALYSIS':
                return 'Phân tích';
            case 'NEWS':
                return 'Tin tức';
            case 'STRATEGY':
                return 'Chiến lược';
            default:
                return category;
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={[styles.title, { color: colors.text }]}>Cộng đồng</Text>
                <TouchableOpacity style={[styles.writeButton, { backgroundColor: colors.primary }]}>
                    <IconSymbol name="square.and.pencil" size={20} color={colors.textInverse} />
                </TouchableOpacity>
            </View>

            {/* Tabs */}
            <View style={styles.tabsContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {tabs.map((tab) => (
                        <TouchableOpacity
                            key={tab}
                            style={[
                                styles.tab,
                                {
                                    backgroundColor: activeTab === tab ? colors.primary : colors.surface,
                                },
                            ]}
                            onPress={() => setActiveTab(tab)}
                        >
                            <Text
                                style={[
                                    styles.tabText,
                                    {
                                        color: activeTab === tab ? colors.textInverse : colors.textSecondary,
                                    },
                                ]}
                            >
                                {tab}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Posts */}
            <ScrollView
                style={styles.postList}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {mockPosts.map((post) => (
                    <Card key={post.id} style={styles.postCard}>
                        <View style={styles.postHeader}>
                            <View style={styles.authorInfo}>
                                <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
                                    <Text style={[styles.avatarText, { color: colors.textInverse }]}>
                                        {post.author.charAt(0)}
                                    </Text>
                                </View>
                                <View>
                                    <Text style={[styles.authorName, { color: colors.text }]}>{post.author}</Text>
                                    <Text style={[styles.postTime, { color: colors.textTertiary }]}>
                                        {post.createdAt}
                                    </Text>
                                </View>
                            </View>
                            <View
                                style={[
                                    styles.categoryBadge,
                                    { backgroundColor: `${getCategoryColor(post.category)}20` },
                                ]}
                            >
                                <Text
                                    style={[styles.categoryText, { color: getCategoryColor(post.category) }]}
                                >
                                    {getCategoryLabel(post.category)}
                                </Text>
                            </View>
                        </View>

                        <Text style={[styles.postTitle, { color: colors.text }]}>{post.title}</Text>
                        <Text
                            style={[styles.postSummary, { color: colors.textSecondary }]}
                            numberOfLines={2}
                        >
                            {post.summary}
                        </Text>

                        {post.symbols.length > 0 && (
                            <View style={styles.symbolTags}>
                                {post.symbols.map((symbol) => (
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

                        <View style={[styles.postFooter, { borderTopColor: colors.divider }]}>
                            <TouchableOpacity style={styles.footerAction}>
                                <IconSymbol name="heart" size={18} color={colors.textSecondary} />
                                <Text style={[styles.footerText, { color: colors.textSecondary }]}>
                                    {post.likes}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.footerAction}>
                                <IconSymbol name="bubble.left" size={18} color={colors.textSecondary} />
                                <Text style={[styles.footerText, { color: colors.textSecondary }]}>
                                    {post.comments}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.footerAction}>
                                <IconSymbol name="square.and.arrow.up" size={18} color={colors.textSecondary} />
                            </TouchableOpacity>
                        </View>
                    </Card>
                ))}
            </ScrollView>
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
        padding: Spacing.lg,
    },
    title: {
        fontSize: FontSize.xxl,
        fontWeight: FontWeight.bold,
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
    postList: {
        flex: 1,
        paddingHorizontal: Spacing.lg,
    },
    postCard: {
        marginBottom: Spacing.md,
    },
    postHeader: {
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
    postTitle: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.semibold,
        marginBottom: Spacing.xs,
    },
    postSummary: {
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
    },
    symbolText: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.medium,
    },
    postFooter: {
        flexDirection: 'row',
        marginTop: Spacing.md,
        paddingTop: Spacing.md,
        borderTopWidth: 1,
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
});
