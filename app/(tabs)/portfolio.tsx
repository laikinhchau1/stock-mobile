import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    RefreshControl,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { PortfolioSummary, HoldingItem } from '@/components/portfolio/portfolio-summary';
import { Button } from '@/components/ui/button';
import { IconSymbol } from '@/components/ui/icon-symbol';

// Mock data
const mockPortfolio = {
    totalValue: 125000000,
    totalCost: 100000000,
    totalProfit: 25000000,
    profitPercent: 25.0,
    dayChange: 1500000,
    dayChangePercent: 1.21,
};

const mockHoldings = [
    {
        symbol: 'VNM',
        name: 'Vinamilk',
        quantity: 500,
        avgPrice: 72000,
        currentPrice: 75000,
        profit: 1500000,
        profitPercent: 4.17,
    },
    {
        symbol: 'FPT',
        name: 'FPT Corporation',
        quantity: 200,
        avgPrice: 120000,
        currentPrice: 125000,
        profit: 1000000,
        profitPercent: 4.17,
    },
    {
        symbol: 'VIC',
        name: 'Vingroup',
        quantity: 1000,
        avgPrice: 48000,
        currentPrice: 45000,
        profit: -3000000,
        profitPercent: -6.25,
    },
    {
        symbol: 'HPG',
        name: 'Hòa Phát',
        quantity: 2000,
        avgPrice: 26000,
        currentPrice: 28000,
        profit: 4000000,
        profitPercent: 7.69,
    },
];

const tabs = ['Tất cả', 'Lãi', 'Lỗ'];

export default function PortfolioScreen() {
    const colorScheme = useColorScheme() ?? 'dark';
    const colors = Colors[colorScheme];
    const [refreshing, setRefreshing] = useState(false);
    const [activeTab, setActiveTab] = useState('Tất cả');

    const onRefresh = async () => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1000);
    };

    const filteredHoldings = mockHoldings.filter((holding) => {
        if (activeTab === 'Lãi') return holding.profit > 0;
        if (activeTab === 'Lỗ') return holding.profit < 0;
        return true;
    });

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {/* Header */}
                <View style={styles.header}>
                    <Text style={[styles.title, { color: colors.text }]}>Danh mục</Text>
                    <TouchableOpacity style={[styles.addButton, { backgroundColor: colors.primary }]}>
                        <IconSymbol name="plus" size={20} color={colors.textInverse} />
                    </TouchableOpacity>
                </View>

                {/* Portfolio Summary */}
                <View style={styles.section}>
                    <PortfolioSummary {...mockPortfolio} />
                </View>

                {/* Actions */}
                <View style={styles.actions}>
                    <Button
                        title="Thêm giao dịch"
                        onPress={() => console.log('Add transaction')}
                        variant="primary"
                        size="md"
                        leftIcon={<IconSymbol name="plus" size={16} color={Colors[colorScheme].textInverse} />}
                    />
                    <View style={{ width: Spacing.sm }} />
                    <Button
                        title="Lịch sử"
                        onPress={() => console.log('History')}
                        variant="outline"
                        size="md"
                        leftIcon={<IconSymbol name="clock" size={16} color={Colors[colorScheme].primary} />}
                    />
                </View>

                {/* Holdings */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>
                            Cổ phiếu ({mockHoldings.length})
                        </Text>
                    </View>

                    {/* Filter Tabs */}
                    <View style={styles.filterTabs}>
                        {tabs.map((tab) => (
                            <TouchableOpacity
                                key={tab}
                                style={[
                                    styles.filterTab,
                                    {
                                        backgroundColor: activeTab === tab ? colors.primary : colors.surface,
                                    },
                                ]}
                                onPress={() => setActiveTab(tab)}
                            >
                                <Text
                                    style={[
                                        styles.filterTabText,
                                        {
                                            color: activeTab === tab ? colors.textInverse : colors.textSecondary,
                                        },
                                    ]}
                                >
                                    {tab}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Holdings List */}
                    {filteredHoldings.map((holding) => (
                        <HoldingItem
                            key={holding.symbol}
                            symbol={holding.symbol}
                            name={holding.name}
                            quantity={holding.quantity}
                            avgPrice={holding.avgPrice}
                            currentPrice={holding.currentPrice}
                            profit={holding.profit}
                            profitPercent={holding.profitPercent}
                        />
                    ))}
                </View>
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
    addButton: {
        padding: Spacing.sm,
        borderRadius: BorderRadius.full,
    },
    section: {
        paddingHorizontal: Spacing.lg,
        marginBottom: Spacing.lg,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    sectionTitle: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.semibold,
    },
    actions: {
        flexDirection: 'row',
        paddingHorizontal: Spacing.lg,
        marginBottom: Spacing.lg,
    },
    filterTabs: {
        flexDirection: 'row',
        marginBottom: Spacing.md,
    },
    filterTab: {
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderRadius: BorderRadius.full,
        marginRight: Spacing.sm,
    },
    filterTabText: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.medium,
    },
});
