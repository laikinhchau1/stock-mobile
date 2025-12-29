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

const mockAccounts = [
    { id: '1', name: 'SSI', accountNumber: '0123456789', balance: 50000000, broker: 'SSI' },
    { id: '2', name: 'TCBS', accountNumber: '9876543210', balance: 75000000, broker: 'TCBS' },
];

export default function AccountsScreen() {
    const colorScheme = useColorScheme() ?? 'dark';
    const colors = Colors[colorScheme];

    const formatCurrency = (value: number) => value.toLocaleString('vi-VN') + ' ₫';

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <IconSymbol name="chevron.left" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: colors.text }]}>Tài khoản chứng khoán</Text>
                <TouchableOpacity>
                    <IconSymbol name="plus" size={24} color={colors.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {mockAccounts.map((account) => (
                    <Card key={account.id} style={styles.accountCard}>
                        <View style={styles.accountHeader}>
                            <View style={[styles.brokerBadge, { backgroundColor: colors.primary }]}>
                                <Text style={[styles.brokerText, { color: colors.textInverse }]}>
                                    {account.broker}
                                </Text>
                            </View>
                            <TouchableOpacity>
                                <IconSymbol name="ellipsis" size={20} color={colors.textSecondary} />
                            </TouchableOpacity>
                        </View>
                        <Text style={[styles.accountName, { color: colors.text }]}>{account.name}</Text>
                        <Text style={[styles.accountNumber, { color: colors.textSecondary }]}>
                            {account.accountNumber}
                        </Text>
                        <View style={styles.balanceRow}>
                            <Text style={[styles.balanceLabel, { color: colors.textSecondary }]}>Số dư:</Text>
                            <Text style={[styles.balanceValue, { color: colors.profit }]}>
                                {formatCurrency(account.balance)}
                            </Text>
                        </View>
                    </Card>
                ))}

                <Button
                    title="Liên kết tài khoản mới"
                    onPress={() => console.log('Add account')}
                    variant="outline"
                    fullWidth
                    leftIcon={<IconSymbol name="plus" size={18} color={colors.primary} />}
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
    accountCard: { marginBottom: Spacing.md },
    accountHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.sm,
    },
    brokerBadge: { paddingHorizontal: Spacing.sm, paddingVertical: 2, borderRadius: BorderRadius.sm },
    brokerText: { fontSize: FontSize.xs, fontWeight: FontWeight.bold },
    accountName: { fontSize: FontSize.lg, fontWeight: FontWeight.semibold },
    accountNumber: { fontSize: FontSize.sm, marginTop: 2 },
    balanceRow: { flexDirection: 'row', marginTop: Spacing.md, alignItems: 'center' },
    balanceLabel: { fontSize: FontSize.sm },
    balanceValue: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, marginLeft: Spacing.sm },
});
