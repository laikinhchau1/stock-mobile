import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Card } from '@/components/ui/card';
import { IconSymbol } from '@/components/ui/icon-symbol';

const themes = [
    { id: 'system', label: 'Theo hệ thống', icon: 'iphone' },
    { id: 'light', label: 'Sáng', icon: 'sun.max.fill' },
    { id: 'dark', label: 'Tối', icon: 'moon.fill' },
];

export default function AppearanceScreen() {
    const colorScheme = useColorScheme() ?? 'dark';
    const colors = Colors[colorScheme];
    const [selectedTheme, setSelectedTheme] = React.useState('system');

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <IconSymbol name="chevron.left" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: colors.text }]}>Giao diện</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.content}>
                <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>CHẾ ĐỘ</Text>
                <Card padding="none">
                    {themes.map((theme, i) => (
                        <TouchableOpacity
                            key={theme.id}
                            style={[styles.row, i < themes.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.divider }]}
                            onPress={() => setSelectedTheme(theme.id)}
                        >
                            <View style={styles.left}>
                                <IconSymbol name={theme.icon as any} size={20} color={colors.textSecondary} />
                                <Text style={[styles.label, { color: colors.text }]}>{theme.label}</Text>
                            </View>
                            {selectedTheme === theme.id && <IconSymbol name="checkmark" size={20} color={colors.primary} />}
                        </TouchableOpacity>
                    ))}
                </Card>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: Spacing.lg },
    title: { fontSize: FontSize.lg, fontWeight: FontWeight.semibold },
    content: { flex: 1, padding: Spacing.lg },
    sectionTitle: { fontSize: FontSize.sm, marginBottom: Spacing.sm },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: Spacing.md },
    left: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
    label: { fontSize: FontSize.md },
});
