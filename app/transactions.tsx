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
import { IconSymbol } from '@/components/ui/icon-symbol';

const mockTransactions = [
    { id: '1', symbol: 'VNM', type: 'BUY', quantity: 100, price: 72000, date: '2024-12-28', total: 7200000 },
    { id: '2', symbol: 'FPT', type: 'SELL', quantity: 50, price: 125000, date: '2024-12-27', total: 6250000 },
    { id: '3', symbol: 'VIC', type: 'BUY', quantity: 200, price: 45000, date: '2024-12-25', total: 9000000 },
    { id: '4', symbol: 'HPG', type: 'BUY', quantity: 500, price: 26000, date: '2024-12-20', total: 13000000 },
];

export default function TransactionsScreen() {
    const colorScheme = useColorScheme() ?? 'dark';
    const colors = Colors[colorScheme];
    const [filter, setFilter] = useState<'all' | 'buy' | 'sell'>('all');

    const filteredTransactions = mockTransactions.filter((t) => {
        if (filter === 'all') return true;
        return t.type.toLowerCase() === filter;
    });

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <IconSymbol name="chevron.left" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: colors.text }]}>Lịch sử giao dịch</Text>
                <View style={{ width: 24 }} />
            </View>

            {/* Filter Tabs */}
            <View style={styles.filterRow}>
                {(['all', 'buy', 'sell'] as const).map((f) => (
                    <TouchableOpacity
                        key={f}
                        style={[styles.filterBtn, { backgroundColor: filter === f ? colors.primary : colors.surface }]}
                        onPress={() => setFilter(f)}
                    >
                        <Text style={{ color: filter === f ? colors.textInverse : colors.textSecondary }}>
                            {f === 'all' ? 'Tất cả' : f === 'buy' ? 'Mua' : 'Bán'}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {filteredTransactions.map((tx) => (
                    <Card key={tx.id} style={styles.txCard}>
                        <View style={styles.txHeader}>
                            <View style={styles.txLeft}>
                                <Text style={[styles.symbol, { color: colors.text }]}>{tx.symbol}</Text>
                                <View
                                    style={[
                                        styles.typeBadge,
                                        { backgroundColor: tx.type === 'BUY' ? `${colors.profit}20` : `${colors.loss}20` },
                                    ]}
                                >
                                    <Text style={{ color: tx.type === 'BUY' ? colors.profit : colors.loss, fontSize: FontSize.xs }}>
                                        {tx.type === 'BUY' ? 'MUA' : 'BÁN'}
                                    </Text>
                                </View>
                            </View>
                            <Text style={[styles.date, { color: colors.textTertiary }]}>{tx.date}</Text>
                        </View>
                        <View style={styles.txDetails}>
                            <View style={styles.detailItem}>
                                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Số lượng</Text>
                                <Text style={[styles.detailValue, { color: colors.text }]}>{tx.quantity}</Text>
                            </View>
                            <View style={styles.detailItem}>
                                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Giá</Text>
                                <Text style={[styles.detailValue, { color: colors.text }]}>{tx.price.toLocaleString()}</Text>
                            </View>
                            <View style={styles.detailItem}>
                                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Tổng</Text>
                                <Text style={[styles.detailValue, { color: tx.type === 'BUY' ? colors.loss : colors.profit }]}>
                                    {tx.type === 'BUY' ? '-' : '+'}{tx.total.toLocaleString()} ₫
                                </Text>
                            </View>
                        </View>
                    </Card>
                ))}
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
    filterRow: { flexDirection: 'row', paddingHorizontal: Spacing.lg, gap: Spacing.sm, marginBottom: Spacing.md },
    filterBtn: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, borderRadius: BorderRadius.full },
    content: { flex: 1, padding: Spacing.lg },
    txCard: { marginBottom: Spacing.md },
    txHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    txLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
    symbol: { fontSize: FontSize.lg, fontWeight: FontWeight.bold },
    typeBadge: { paddingHorizontal: Spacing.sm, paddingVertical: 2, borderRadius: BorderRadius.sm },
    date: { fontSize: FontSize.sm },
    txDetails: { flexDirection: 'row', justifyContent: 'space-between', marginTop: Spacing.md },
    detailItem: { alignItems: 'center' },
    detailLabel: { fontSize: FontSize.xs },
    detailValue: { fontSize: FontSize.sm, fontWeight: FontWeight.medium },
});
