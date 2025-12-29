import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    RefreshControl,
    TouchableOpacity,
    TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { StockCard } from '@/components/stocks/stock-card';
import { IconSymbol } from '@/components/ui/icon-symbol';

// Mock data
const mockStocks = [
    { symbol: 'VNM', name: 'Vinamilk', price: 75000, change: 1500, changePercent: 2.04, volume: 2500000 },
    { symbol: 'FPT', name: 'FPT Corporation', price: 125000, change: -2000, changePercent: -1.57, volume: 1800000 },
    { symbol: 'VIC', name: 'Vingroup', price: 45000, change: 500, changePercent: 1.12, volume: 3200000 },
    { symbol: 'VHM', name: 'Vinhomes', price: 42000, change: 0, changePercent: 0, volume: 1500000 },
    { symbol: 'HPG', name: 'Hòa Phát', price: 28000, change: -300, changePercent: -1.06, volume: 8500000 },
    { symbol: 'MSN', name: 'Masan', price: 72000, change: 1200, changePercent: 1.69, volume: 1200000 },
    { symbol: 'MBB', name: 'MB Bank', price: 25000, change: 200, changePercent: 0.81, volume: 4500000 },
    { symbol: 'VCB', name: 'Vietcombank', price: 88000, change: -1500, changePercent: -1.68, volume: 1100000 },
];

const tabs = ['VN30', 'HOSE', 'HNX', 'UPCOM'];

export default function MarketScreen() {
    const colorScheme = useColorScheme() ?? 'dark';
    const colors = Colors[colorScheme];
    const [refreshing, setRefreshing] = useState(false);
    const [activeTab, setActiveTab] = useState('VN30');
    const [searchQuery, setSearchQuery] = useState('');

    const onRefresh = async () => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1000);
    };

    const filteredStocks = mockStocks.filter(
        (stock) =>
            stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
            stock.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={[styles.title, { color: colors.text }]}>Thị trường</Text>
            </View>

            {/* Search */}
            <View style={styles.searchContainer}>
                <View style={[styles.searchInput, { backgroundColor: colors.surface }]}>
                    <IconSymbol name="magnifyingglass" size={18} color={colors.textTertiary} />
                    <TextInput
                        style={[styles.searchText, { color: colors.text }]}
                        placeholder="Tìm kiếm mã cổ phiếu..."
                        placeholderTextColor={colors.textTertiary}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
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

            {/* Stock List */}
            <ScrollView
                style={styles.stockList}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {filteredStocks.map((stock) => (
                    <StockCard
                        key={stock.symbol}
                        symbol={stock.symbol}
                        name={stock.name}
                        price={stock.price}
                        change={stock.change}
                        changePercent={stock.changePercent}
                        volume={stock.volume}
                        onPress={() => router.push(`/stock/${stock.symbol}`)}
                    />
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
        padding: Spacing.lg,
        paddingBottom: Spacing.sm,
    },
    title: {
        fontSize: FontSize.xxl,
        fontWeight: FontWeight.bold,
    },
    searchContainer: {
        paddingHorizontal: Spacing.lg,
        marginBottom: Spacing.md,
    },
    searchInput: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.md,
        borderRadius: BorderRadius.md,
        gap: Spacing.sm,
    },
    searchText: {
        flex: 1,
        fontSize: FontSize.md,
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
    stockList: {
        flex: 1,
        paddingHorizontal: Spacing.lg,
    },
});
