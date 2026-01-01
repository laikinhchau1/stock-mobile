import React from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useAuthStore } from '@/stores/auth-store';

const menuItems = [
    {
        title: 'Tài khoản',
        items: [
            { icon: 'person.fill', label: 'Thông tin cá nhân', route: '/profile' },
            { icon: 'creditcard.fill', label: 'Quản lý tài khoản CK', route: '/accounts' },
            { icon: 'bell.fill', label: 'Cảnh báo giá', route: '/alerts' },
            { icon: 'clock.fill', label: 'Lịch sử giao dịch', route: '/transactions' },
        ],
    },
    {
        title: 'Tiện ích',
        items: [
            { icon: 'calendar', label: 'Lịch sự kiện', route: '/events' },
            { icon: 'star.fill', label: 'Danh mục theo dõi', route: '/watchlists' },
            { icon: 'chart.bar.fill', label: 'Bộ lọc cổ phiếu', route: '/screener' },
            { icon: 'book.fill', label: 'Khóa học', route: '/courses' },
        ],
    },
    {
        title: 'Cài đặt',
        items: [
            { icon: 'gearshape.fill', label: 'Cài đặt chung', route: '/settings' },
            { icon: 'moon.fill', label: 'Giao diện', route: '/appearance' },
            { icon: 'lock.fill', label: 'Bảo mật', route: '/security' },
            { icon: 'questionmark.circle.fill', label: 'Trợ giúp', route: '/help' },
        ],
    },
];

export default function AccountScreen() {
    const colorScheme = useColorScheme() ?? 'dark';
    const colors = Colors[colorScheme];
    const { user, isAuthenticated, logout } = useAuthStore();

    const handleLogout = () => {
        Alert.alert(
            'Đăng xuất',
            'Bạn có chắc chắn muốn đăng xuất?',
            [
                { text: 'Hủy', style: 'cancel' },
                {
                    text: 'Đăng xuất',
                    style: 'destructive',
                    onPress: async () => {
                        await logout();
                    },
                },
            ]
        );
    };

    // Guest view - not logged in
    if (!isAuthenticated || !user) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* Guest Header */}
                    <View style={styles.guestHeader}>
                        <View style={[styles.guestAvatar, { backgroundColor: colors.surface }]}>
                            <IconSymbol name="person.crop.circle" size={48} color={colors.textTertiary} />
                        </View>
                        <Text style={[styles.guestTitle, { color: colors.text }]}>
                            Chào mừng bạn!
                        </Text>
                        <Text style={[styles.guestSubtitle, { color: colors.textSecondary }]}>
                            Đăng nhập để trải nghiệm đầy đủ tính năng
                        </Text>
                        <View style={styles.guestButtons}>
                            <Button
                                title="Đăng nhập"
                                onPress={() => router.push('/auth/login')}
                                fullWidth
                            />
                            <Button
                                title="Tạo tài khoản"
                                onPress={() => router.push('/auth/register')}
                                variant="outline"
                                fullWidth
                                style={{ marginTop: Spacing.sm }}
                            />
                        </View>
                    </View>

                    {/* Settings Menu - available for guests */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                            Cài đặt
                        </Text>
                        <Card padding="none">
                            {menuItems[2].items.map((item, index) => (
                                <TouchableOpacity
                                    key={item.label}
                                    style={[
                                        styles.menuItem,
                                        index < menuItems[2].items.length - 1 && {
                                            borderBottomWidth: 1,
                                            borderBottomColor: colors.divider,
                                        },
                                    ]}
                                    onPress={() => router.push(item.route as any)}
                                >
                                    <View style={styles.menuItemLeft}>
                                        <View style={[styles.menuIcon, { backgroundColor: `${colors.primary}15` }]}>
                                            <IconSymbol name={item.icon as any} size={18} color={colors.primary} />
                                        </View>
                                        <Text style={[styles.menuLabel, { color: colors.text }]}>{item.label}</Text>
                                    </View>
                                    <IconSymbol name="chevron.right" size={16} color={colors.textTertiary} />
                                </TouchableOpacity>
                            ))}
                        </Card>
                    </View>

                    <Text style={[styles.version, { color: colors.textTertiary }]}>
                        Phiên bản 1.0.0
                    </Text>
                </ScrollView>
            </SafeAreaView>
        );
    }

    // Logged in view
    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <TouchableOpacity
                    style={styles.header}
                    onPress={() => router.push('/profile')}
                >
                    <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
                        <Text style={[styles.avatarText, { color: colors.textInverse }]}>
                            {user.name.charAt(0).toUpperCase()}
                        </Text>
                    </View>
                    <View style={styles.userInfo}>
                        <Text style={[styles.userName, { color: colors.text }]}>{user.name}</Text>
                        <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
                            {user.email}
                        </Text>
                    </View>
                    <IconSymbol name="chevron.right" size={20} color={colors.textTertiary} />
                </TouchableOpacity>

                {/* Premium Card */}
                <View style={styles.section}>
                    <Card style={{ ...styles.premiumCard, backgroundColor: colors.primary }}>
                        <View style={styles.premiumContent}>
                            <View>
                                <Text style={[styles.premiumTitle, { color: colors.textInverse }]}>
                                    Nâng cấp Premium
                                </Text>
                                <Text style={[styles.premiumDesc, { color: `${colors.textInverse}CC` }]}>
                                    Mở khóa tất cả tính năng nâng cao
                                </Text>
                            </View>
                            <IconSymbol name="crown.fill" size={32} color={colors.textInverse} />
                        </View>
                    </Card>
                </View>

                {/* Menu Sections */}
                {menuItems.map((section) => (
                    <View key={section.title} style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                            {section.title}
                        </Text>
                        <Card padding="none">
                            {section.items.map((item, index) => (
                                <TouchableOpacity
                                    key={item.label}
                                    style={[
                                        styles.menuItem,
                                        index < section.items.length - 1 && {
                                            borderBottomWidth: 1,
                                            borderBottomColor: colors.divider,
                                        },
                                    ]}
                                    onPress={() => router.push(item.route as any)}
                                >
                                    <View style={styles.menuItemLeft}>
                                        <View style={[styles.menuIcon, { backgroundColor: `${colors.primary}15` }]}>
                                            <IconSymbol name={item.icon as any} size={18} color={colors.primary} />
                                        </View>
                                        <Text style={[styles.menuLabel, { color: colors.text }]}>{item.label}</Text>
                                    </View>
                                    <IconSymbol name="chevron.right" size={16} color={colors.textTertiary} />
                                </TouchableOpacity>
                            ))}
                        </Card>
                    </View>
                ))}

                {/* Logout */}
                <View style={styles.section}>
                    <TouchableOpacity
                        style={[styles.logoutButton, { backgroundColor: colors.surface }]}
                        onPress={handleLogout}
                    >
                        <IconSymbol name="rectangle.portrait.and.arrow.right" size={18} color={colors.danger} />
                        <Text style={[styles.logoutText, { color: colors.danger }]}>Đăng xuất</Text>
                    </TouchableOpacity>
                </View>

                <Text style={[styles.version, { color: colors.textTertiary }]}>
                    Phiên bản 1.0.0
                </Text>
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
        alignItems: 'center',
        padding: Spacing.lg,
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        fontSize: FontSize.xl,
        fontWeight: FontWeight.bold,
    },
    userInfo: {
        flex: 1,
        marginLeft: Spacing.md,
    },
    userName: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.semibold,
    },
    userEmail: {
        fontSize: FontSize.sm,
    },
    guestHeader: {
        alignItems: 'center',
        padding: Spacing.xl,
        paddingTop: Spacing.xxl,
    },
    guestAvatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Spacing.lg,
    },
    guestTitle: {
        fontSize: FontSize.xl,
        fontWeight: FontWeight.bold,
        marginBottom: Spacing.xs,
    },
    guestSubtitle: {
        fontSize: FontSize.md,
        textAlign: 'center',
        marginBottom: Spacing.lg,
    },
    guestButtons: {
        width: '100%',
    },
    section: {
        paddingHorizontal: Spacing.lg,
        marginBottom: Spacing.lg,
    },
    sectionTitle: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.medium,
        marginBottom: Spacing.sm,
        textTransform: 'uppercase',
    },
    premiumCard: {
        padding: Spacing.lg,
    },
    premiumContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    premiumTitle: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.bold,
    },
    premiumDesc: {
        fontSize: FontSize.sm,
        marginTop: 2,
    },
    menuItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: Spacing.md,
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuIcon: {
        width: 32,
        height: 32,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: Spacing.md,
    },
    menuLabel: {
        fontSize: FontSize.md,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: Spacing.md,
        borderRadius: BorderRadius.md,
    },
    logoutText: {
        fontSize: FontSize.md,
        fontWeight: FontWeight.medium,
        marginLeft: Spacing.sm,
    },
    version: {
        textAlign: 'center',
        fontSize: FontSize.xs,
        marginBottom: Spacing.xl,
    },
});
