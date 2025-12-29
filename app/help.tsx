import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors, Spacing, FontSize, FontWeight } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Card } from '@/components/ui/card';
import { IconSymbol } from '@/components/ui/icon-symbol';

const helpItems = [
    { icon: 'questionmark.circle', label: 'Câu hỏi thường gặp', route: '/faq' },
    { icon: 'envelope', label: 'Liên hệ hỗ trợ', action: 'email' },
    { icon: 'doc.text', label: 'Điều khoản sử dụng', route: '/terms' },
    { icon: 'lock.shield', label: 'Chính sách bảo mật', route: '/privacy' },
];

export default function HelpScreen() {
    const colorScheme = useColorScheme() ?? 'dark';
    const colors = Colors[colorScheme];

    const handlePress = (item: typeof helpItems[0]) => {
        if (item.action === 'email') {
            Linking.openURL('mailto:support@example.com');
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <IconSymbol name="chevron.left" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: colors.text }]}>Trợ giúp</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.content}>
                <Card padding="none">
                    {helpItems.map((item, i) => (
                        <TouchableOpacity
                            key={item.label}
                            style={[styles.row, i < helpItems.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.divider }]}
                            onPress={() => handlePress(item)}
                        >
                            <View style={styles.left}>
                                <IconSymbol name={item.icon as any} size={20} color={colors.textSecondary} />
                                <Text style={[styles.label, { color: colors.text }]}>{item.label}</Text>
                            </View>
                            <IconSymbol name="chevron.right" size={16} color={colors.textTertiary} />
                        </TouchableOpacity>
                    ))}
                </Card>

                <Text style={[styles.version, { color: colors.textTertiary }]}>Phiên bản 1.0.0</Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: Spacing.lg },
    title: { fontSize: FontSize.lg, fontWeight: FontWeight.semibold },
    content: { flex: 1, padding: Spacing.lg },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: Spacing.md },
    left: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
    label: { fontSize: FontSize.md },
    version: { textAlign: 'center', marginTop: Spacing.xl, fontSize: FontSize.sm },
});
