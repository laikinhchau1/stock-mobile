import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Button } from '@/components/ui/button';
import { IconSymbol } from '@/components/ui/icon-symbol';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
    const colorScheme = useColorScheme() ?? 'dark';
    const colors = Colors[colorScheme];
    const router = useRouter();

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Background Gradient */}
            <LinearGradient
                colors={[colors.primary + '30', colors.background]}
                style={styles.gradient}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 0.6 }}
            />

            <SafeAreaView style={styles.content}>
                {/* Hero Section */}
                <View style={styles.heroSection}>
                    <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
                        <IconSymbol name="chart.line.uptrend.xyaxis" size={64} color={colors.primary} />
                    </View>
                    <Text style={[styles.appName, { color: colors.text }]}>StockVN</Text>
                    <Text style={[styles.tagline, { color: colors.textSecondary }]}>
                        Đầu tư thông minh{'\n'}Tương lai thịnh vượng
                    </Text>
                </View>

                {/* Features */}
                <View style={styles.featuresSection}>
                    <FeatureItem
                        icon="chart.bar.fill"
                        title="Theo dõi thị trường"
                        description="Cập nhật giá cổ phiếu realtime"
                        colors={colors}
                    />
                    <FeatureItem
                        icon="bell.badge.fill"
                        title="Cảnh báo thông minh"
                        description="Nhận thông báo khi giá đạt mục tiêu"
                        colors={colors}
                    />
                    <FeatureItem
                        icon="person.2.fill"
                        title="Cộng đồng đầu tư"
                        description="Chia sẻ phân tích với cộng đồng"
                        colors={colors}
                    />
                </View>

                {/* Action Buttons */}
                <View style={styles.buttonsSection}>
                    <Button
                        title="Đăng nhập"
                        onPress={() => router.push('/auth/login')}
                        fullWidth
                        size="lg"
                    />
                    <Button
                        title="Tạo tài khoản mới"
                        onPress={() => router.push('/auth/register')}
                        variant="outline"
                        fullWidth
                        size="lg"
                        style={{ marginTop: Spacing.md }}
                    />
                    <Button
                        title="Khám phá trước"
                        onPress={() => router.replace('/(tabs)')}
                        variant="ghost"
                        fullWidth
                        style={{ marginTop: Spacing.sm }}
                    />
                </View>
            </SafeAreaView>
        </View>
    );
}

function FeatureItem({
    icon,
    title,
    description,
    colors,
}: {
    icon: string;
    title: string;
    description: string;
    colors: typeof Colors.dark;
}) {
    return (
        <View style={styles.featureItem}>
            <View style={[styles.featureIcon, { backgroundColor: colors.surface }]}>
                <IconSymbol name={icon as any} size={24} color={colors.primary} />
            </View>
            <View style={styles.featureText}>
                <Text style={[styles.featureTitle, { color: colors.text }]}>{title}</Text>
                <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
                    {description}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: height * 0.5,
    },
    content: {
        flex: 1,
        paddingHorizontal: Spacing.xl,
    },
    heroSection: {
        alignItems: 'center',
        paddingTop: height * 0.08,
        paddingBottom: Spacing.xl,
    },
    iconContainer: {
        width: 120,
        height: 120,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Spacing.lg,
    },
    appName: {
        fontSize: 36,
        fontWeight: FontWeight.bold,
        marginBottom: Spacing.sm,
    },
    tagline: {
        fontSize: FontSize.lg,
        textAlign: 'center',
        lineHeight: 26,
    },
    featuresSection: {
        flex: 1,
        justifyContent: 'center',
        paddingVertical: Spacing.xl,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.lg,
    },
    featureIcon: {
        width: 48,
        height: 48,
        borderRadius: BorderRadius.md,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: Spacing.md,
    },
    featureText: {
        flex: 1,
    },
    featureTitle: {
        fontSize: FontSize.md,
        fontWeight: FontWeight.semibold,
    },
    featureDescription: {
        fontSize: FontSize.sm,
        marginTop: 2,
    },
    buttonsSection: {
        paddingBottom: Spacing.xl,
    },
});
