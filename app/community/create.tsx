import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useCommunityStore } from '@/stores/community-store';
import { useAuthStore } from '@/stores/auth-store';
import { Button } from '@/components/ui/button';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { PostCategory } from '@/services/community';

const categories: { value: PostCategory; label: string }[] = [
    { value: PostCategory.DISCUSSION, label: 'Thảo luận' },
    { value: PostCategory.ANALYSIS, label: 'Phân tích' },
    { value: PostCategory.NEWS, label: 'Tin tức' },
    { value: PostCategory.STRATEGY, label: 'Chiến lược' },
    { value: PostCategory.EDUCATION, label: 'Học tập' },
];

export default function CreatePostScreen() {
    const colorScheme = useColorScheme() ?? 'dark';
    const colors = Colors[colorScheme];
    const router = useRouter();

    const { isAuthenticated } = useAuthStore();
    const { createPost, isSubmitting } = useCommunityStore();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [summary, setSummary] = useState('');
    const [category, setCategory] = useState<PostCategory>(PostCategory.DISCUSSION);
    const [symbolsText, setSymbolsText] = useState('');

    // Redirect if not authenticated
    if (!isAuthenticated) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
                <View style={styles.authPrompt}>
                    <IconSymbol name="person.crop.circle.badge.exclamationmark" size={64} color={colors.textTertiary} />
                    <Text style={[styles.authTitle, { color: colors.text }]}>
                        Yêu cầu đăng nhập
                    </Text>
                    <Text style={[styles.authDescription, { color: colors.textSecondary }]}>
                        Bạn cần đăng nhập để tạo bài viết mới
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

    const handleSubmit = async () => {
        if (!title.trim()) {
            Alert.alert('Lỗi', 'Vui lòng nhập tiêu đề bài viết');
            return;
        }

        if (!content.trim()) {
            Alert.alert('Lỗi', 'Vui lòng nhập nội dung bài viết');
            return;
        }

        const symbols = symbolsText
            .split(',')
            .map((s) => s.trim().toUpperCase())
            .filter((s) => s.length > 0);

        const post = await createPost({
            title: title.trim(),
            content: content.trim(),
            summary: summary.trim() || undefined,
            category,
            symbols: symbols.length > 0 ? symbols : undefined,
            isPublished: true,
        });

        if (post) {
            Alert.alert('Thành công', 'Bài viết đã được đăng', [
                { text: 'OK', onPress: () => router.back() },
            ]);
        } else {
            Alert.alert('Lỗi', 'Không thể đăng bài viết. Vui lòng thử lại.');
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
            <Stack.Screen
                options={{
                    headerRight: () => (
                        <Button
                            title="Đăng"
                            onPress={handleSubmit}
                            loading={isSubmitting}
                            disabled={!title.trim() || !content.trim()}
                            size="sm"
                        />
                    ),
                }}
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Category Selector */}
                    <View style={styles.section}>
                        <Text style={[styles.label, { color: colors.textSecondary }]}>Danh mục</Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={styles.categoriesContainer}
                        >
                            {categories.map((cat) => (
                                <TouchableOpacity
                                    key={cat.value}
                                    style={[
                                        styles.categoryChip,
                                        {
                                            backgroundColor:
                                                category === cat.value ? colors.primary : colors.surface,
                                            borderColor: category === cat.value ? colors.primary : colors.border,
                                        },
                                    ]}
                                    onPress={() => setCategory(cat.value)}
                                >
                                    <Text
                                        style={[
                                            styles.categoryChipText,
                                            {
                                                color:
                                                    category === cat.value
                                                        ? colors.textInverse
                                                        : colors.text,
                                            },
                                        ]}
                                    >
                                        {cat.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    {/* Title Input */}
                    <View style={styles.section}>
                        <Text style={[styles.label, { color: colors.textSecondary }]}>Tiêu đề *</Text>
                        <TextInput
                            style={[
                                styles.titleInput,
                                { color: colors.text, borderBottomColor: colors.border },
                            ]}
                            placeholder="Nhập tiêu đề bài viết..."
                            placeholderTextColor={colors.textTertiary}
                            value={title}
                            onChangeText={setTitle}
                            maxLength={200}
                        />
                        <Text style={[styles.charCount, { color: colors.textTertiary }]}>
                            {title.length}/200
                        </Text>
                    </View>

                    {/* Summary Input */}
                    <View style={styles.section}>
                        <Text style={[styles.label, { color: colors.textSecondary }]}>Tóm tắt</Text>
                        <TextInput
                            style={[
                                styles.summaryInput,
                                {
                                    color: colors.text,
                                    backgroundColor: colors.surface,
                                    borderColor: colors.border,
                                },
                            ]}
                            placeholder="Mô tả ngắn gọn về bài viết..."
                            placeholderTextColor={colors.textTertiary}
                            value={summary}
                            onChangeText={setSummary}
                            multiline
                            maxLength={500}
                        />
                    </View>

                    {/* Content Input */}
                    <View style={styles.section}>
                        <Text style={[styles.label, { color: colors.textSecondary }]}>Nội dung *</Text>
                        <TextInput
                            style={[
                                styles.contentInput,
                                {
                                    color: colors.text,
                                    backgroundColor: colors.surface,
                                    borderColor: colors.border,
                                },
                            ]}
                            placeholder="Viết nội dung bài viết của bạn..."
                            placeholderTextColor={colors.textTertiary}
                            value={content}
                            onChangeText={setContent}
                            multiline
                            textAlignVertical="top"
                        />
                    </View>

                    {/* Symbols Input */}
                    <View style={styles.section}>
                        <Text style={[styles.label, { color: colors.textSecondary }]}>
                            Mã chứng khoán liên quan
                        </Text>
                        <TextInput
                            style={[
                                styles.symbolsInput,
                                {
                                    color: colors.text,
                                    backgroundColor: colors.surface,
                                    borderColor: colors.border,
                                },
                            ]}
                            placeholder="VD: VNM, FPT, VCB (phân cách bởi dấu phẩy)"
                            placeholderTextColor={colors.textTertiary}
                            value={symbolsText}
                            onChangeText={setSymbolsText}
                            autoCapitalize="characters"
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    keyboardView: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
        padding: Spacing.lg,
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
    section: {
        marginBottom: Spacing.xl,
    },
    label: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.medium,
        marginBottom: Spacing.sm,
    },
    categoriesContainer: {
        flexDirection: 'row',
    },
    categoryChip: {
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderRadius: BorderRadius.full,
        marginRight: Spacing.sm,
        borderWidth: 1,
    },
    categoryChipText: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.medium,
    },
    titleInput: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.semibold,
        paddingVertical: Spacing.md,
        borderBottomWidth: 1,
    },
    charCount: {
        fontSize: FontSize.xs,
        textAlign: 'right',
        marginTop: Spacing.xs,
    },
    summaryInput: {
        fontSize: FontSize.md,
        padding: Spacing.md,
        borderRadius: BorderRadius.md,
        borderWidth: 1,
        minHeight: 80,
    },
    contentInput: {
        fontSize: FontSize.md,
        padding: Spacing.md,
        borderRadius: BorderRadius.md,
        borderWidth: 1,
        minHeight: 200,
    },
    symbolsInput: {
        fontSize: FontSize.md,
        padding: Spacing.md,
        borderRadius: BorderRadius.md,
        borderWidth: 1,
    },
});
