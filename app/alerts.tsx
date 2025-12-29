import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { IconSymbol } from '@/components/ui/icon-symbol';

const mockAlerts = [
    { id: '1', symbol: 'VNM', type: 'PRICE_ABOVE', value: 80000, status: 'active' },
    { id: '2', symbol: 'FPT', type: 'PRICE_BELOW', value: 110000, status: 'active' },
    { id: '3', symbol: 'VIC', type: 'PRICE_ABOVE', value: 50000, status: 'triggered' },
];

export default function AlertsScreen() {
    const colorScheme = useColorScheme() ?? 'dark';
    const colors = Colors[colorScheme];

    const getAlertTypeText = (type: string) => {
        switch (type) {
            case 'PRICE_ABOVE': return 'Giá ≥';
            case 'PRICE_BELOW': return 'Giá ≤';
            default: return type;
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <IconSymbol name="chevron.left" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: colors.text }]}>Cảnh báo giá</Text>
                <TouchableOpacity>
                    <IconSymbol name="plus" size={24} color={colors.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {mockAlerts.map((alert) => (
                    <Card key={alert.id} style={styles.alertCard}>
                        <View style={styles.alertHeader}>
                            <Text style={[styles.symbol, { color: colors.text }]}>{alert.symbol}</Text>
                            <View
                                style={[
                                    styles.statusBadge,
                                    { backgroundColor: alert.status === 'active' ? `${colors.profit}20` : `${colors.warning}20` },
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.statusText,
                                        { color: alert.status === 'active' ? colors.profit : colors.warning },
                                    ]}
                                >
                                    {alert.status === 'active' ? 'Đang hoạt động' : 'Đã kích hoạt'}
                                </Text>
                            </View>
                        </View>
                        <Text style={[styles.condition, { color: colors.textSecondary }]}>
                            {getAlertTypeText(alert.type)} {alert.value.toLocaleString('vi-VN')} ₫
                        </Text>
                        <View style={styles.alertActions}>
                            <TouchableOpacity style={styles.actionBtn}>
                                <IconSymbol name="pencil" size={18} color={colors.primary} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.actionBtn}>
                                <IconSymbol name="trash" size={18} color={colors.danger} />
                            </TouchableOpacity>
                        </View>
                    </Card>
                ))}

                <Button
                    title="Tạo cảnh báo mới"
                    onPress={() => console.log('Create alert')}
                    variant="primary"
                    fullWidth
                />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: Spacing.lg,
    },
    title: { fontSize: FontSize.lg, fontWeight: FontWeight.semibold },
    content: { flex: 1, padding: Spacing.lg },
    alertCard: { marginBottom: Spacing.md },
    alertHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    symbol: { fontSize: FontSize.lg, fontWeight: FontWeight.bold },
    statusBadge: { paddingHorizontal: Spacing.sm, paddingVertical: 2, borderRadius: BorderRadius.sm },
    statusText: { fontSize: FontSize.xs, fontWeight: FontWeight.medium },
    condition: { fontSize: FontSize.md, marginTop: Spacing.sm },
    alertActions: { flexDirection: 'row', marginTop: Spacing.md, gap: Spacing.md },
    actionBtn: { padding: Spacing.sm },
});
