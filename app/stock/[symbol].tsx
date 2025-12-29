import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PriceChange } from '@/components/stocks/stock-card';
import { IconSymbol } from '@/components/ui/icon-symbol';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Mock data
const getMockStock = (symbol: string) => ({
    symbol,
    name: `${symbol} Corporation`,
    price: 75000,
    change: 1500,
    changePercent: 2.04,
    open: 73500,
    high: 76000,
    low: 73000,
    close: 75000,
    volume: 2500000,
    avgVolume: 2000000,
    marketCap: 150000000000000,
    pe: 15.5,
    pb: 3.2,
    eps: 4839,
    dividendYield: 3.5,
    week52High: 82000,
    week52Low: 65000,
});

const timeframes = ['1D', '1W', '1M', '3M', '6M', '1Y', '5Y'];

export default function StockDetailScreen() {
    const { symbol } = useLocalSearchParams<{ symbol: string }>();
    const colorScheme = useColorScheme() ?? 'dark';
    const colors = Colors[colorScheme];
    const [activeTimeframe, setActiveTimeframe] = useState('1M');
    const [isInWatchlist, setIsInWatchlist] = useState(false);

    const stock = getMockStock(symbol || 'VNM');
    const isPositive = stock.change >= 0;

    const formatNumber = (num: number, suffix?: string) => {
        if (num >= 1e12) return `${(num / 1e12).toFixed(1)}T${suffix || ''}`;
        if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B${suffix || ''}`;
        if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M${suffix || ''}`;
        return num.toLocaleString('vi-VN') + (suffix || '');
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <IconSymbol name="chevron.left" size={24} color={colors.text} />
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                    <Text style={[styles.headerSymbol, { color: colors.text }]}>{stock.symbol}</Text>
                    <Text style={[styles.headerName, { color: colors.textSecondary }]} numberOfLines={1}>
                        {stock.name}
                    </Text>
                </View>
                <View style={styles.headerActions}>
                    <TouchableOpacity
                        style={styles.headerButton}
                        onPress={() => setIsInWatchlist(!isInWatchlist)}
                    >
                        <IconSymbol
                            name={isInWatchlist ? 'star.fill' : 'star'}
                            size={24}
                            color={isInWatchlist ? colors.warning : colors.text}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.headerButton}>
                        <IconSymbol name="bell" size={24} color={colors.text} />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Price Section */}
                <View style={styles.priceSection}>
                    <Text style={[styles.price, { color: colors.text }]}>
                        {stock.price.toLocaleString('vi-VN')} ₫
                    </Text>
                    <View style={styles.priceChange}>
                        <Text
                            style={[
                                styles.changeValue,
                                { color: isPositive ? colors.profit : colors.loss },
                            ]}
                        >
                            {isPositive ? '+' : ''}
                            {stock.change.toLocaleString('vi-VN')} ({stock.changePercent.toFixed(2)}%)
                        </Text>
                    </View>
                </View>

                {/* Chart Placeholder */}
                <View style={styles.chartSection}>
                    <View
                        style={[
                            styles.chartPlaceholder,
                            { backgroundColor: colors.surface, borderColor: colors.border },
                        ]}
                    >
                        <IconSymbol name="chart.line.uptrend.xyaxis" size={48} color={colors.textTertiary} />
                        <Text style={[styles.chartPlaceholderText, { color: colors.textTertiary }]}>
                            Biểu đồ giá sẽ hiển thị ở đây
                        </Text>
                    </View>

                    {/* Timeframe Selector */}
                    <View style={styles.timeframes}>
                        {timeframes.map((tf) => (
                            <TouchableOpacity
                                key={tf}
                                style={[
                                    styles.timeframeButton,
                                    {
                                        backgroundColor: activeTimeframe === tf ? colors.primary : 'transparent',
                                    },
                                ]}
                                onPress={() => setActiveTimeframe(tf)}
                            >
                                <Text
                                    style={[
                                        styles.timeframeText,
                                        {
                                            color: activeTimeframe === tf ? colors.textInverse : colors.textSecondary,
                                        },
                                    ]}
                                >
                                    {tf}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Trade Actions */}
                <View style={styles.tradeActions}>
                    <Button
                        title="Mua"
                        onPress={() => console.log('Buy')}
                        variant="primary"
                        style={{ ...styles.tradeButton, backgroundColor: colors.profit }}
                    />
                    <Button
                        title="Bán"
                        onPress={() => console.log('Sell')}
                        variant="danger"
                        style={styles.tradeButton}
                    />
                </View>

                {/* Stats Grid */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Thống kê</Text>
                    <Card>
                        <View style={styles.statsGrid}>
                            <View style={styles.statRow}>
                                <View style={styles.statItem}>
                                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Mở cửa</Text>
                                    <Text style={[styles.statValue, { color: colors.text }]}>
                                        {stock.open.toLocaleString('vi-VN')}
                                    </Text>
                                </View>
                                <View style={styles.statItem}>
                                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Cao nhất</Text>
                                    <Text style={[styles.statValue, { color: colors.profit }]}>
                                        {stock.high.toLocaleString('vi-VN')}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.statRow}>
                                <View style={styles.statItem}>
                                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Thấp nhất</Text>
                                    <Text style={[styles.statValue, { color: colors.loss }]}>
                                        {stock.low.toLocaleString('vi-VN')}
                                    </Text>
                                </View>
                                <View style={styles.statItem}>
                                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Khối lượng</Text>
                                    <Text style={[styles.statValue, { color: colors.text }]}>
                                        {formatNumber(stock.volume)}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </Card>
                </View>

                {/* Fundamentals */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Chỉ số tài chính</Text>
                    <Card>
                        <View style={styles.statsGrid}>
                            <View style={styles.statRow}>
                                <View style={styles.statItem}>
                                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Vốn hóa</Text>
                                    <Text style={[styles.statValue, { color: colors.text }]}>
                                        {formatNumber(stock.marketCap)}
                                    </Text>
                                </View>
                                <View style={styles.statItem}>
                                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>P/E</Text>
                                    <Text style={[styles.statValue, { color: colors.text }]}>
                                        {stock.pe.toFixed(2)}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.statRow}>
                                <View style={styles.statItem}>
                                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>P/B</Text>
                                    <Text style={[styles.statValue, { color: colors.text }]}>
                                        {stock.pb.toFixed(2)}
                                    </Text>
                                </View>
                                <View style={styles.statItem}>
                                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>EPS</Text>
                                    <Text style={[styles.statValue, { color: colors.text }]}>
                                        {stock.eps.toLocaleString('vi-VN')}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.statRow}>
                                <View style={styles.statItem}>
                                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                                        Cổ tức
                                    </Text>
                                    <Text style={[styles.statValue, { color: colors.text }]}>
                                        {stock.dividendYield}%
                                    </Text>
                                </View>
                                <View style={styles.statItem}>
                                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                                        52W Range
                                    </Text>
                                    <Text style={[styles.statValue, { color: colors.text }]}>
                                        {formatNumber(stock.week52Low)} - {formatNumber(stock.week52High)}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </Card>
                </View>

                {/* Company Info */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Thông tin công ty</Text>
                    <Card>
                        <Text style={[styles.companyDesc, { color: colors.textSecondary }]}>
                            {stock.name} là một trong những công ty hàng đầu trong lĩnh vực của mình tại Việt Nam.
                            Công ty được niêm yết trên sàn HOSE và là thành viên của chỉ số VN30.
                        </Text>
                        <TouchableOpacity style={styles.readMore}>
                            <Text style={[styles.readMoreText, { color: colors.primary }]}>
                                Xem thêm
                            </Text>
                            <IconSymbol name="chevron.right" size={14} color={colors.primary} />
                        </TouchableOpacity>
                    </Card>
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
        alignItems: 'center',
        padding: Spacing.lg,
    },
    headerCenter: {
        flex: 1,
        marginLeft: Spacing.md,
    },
    headerSymbol: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.bold,
    },
    headerName: {
        fontSize: FontSize.sm,
    },
    headerActions: {
        flexDirection: 'row',
    },
    headerButton: {
        marginLeft: Spacing.md,
    },
    priceSection: {
        paddingHorizontal: Spacing.lg,
        marginBottom: Spacing.md,
    },
    price: {
        fontSize: FontSize.xxxl,
        fontWeight: FontWeight.bold,
    },
    priceChange: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: Spacing.xs,
    },
    changeValue: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.medium,
    },
    chartSection: {
        paddingHorizontal: Spacing.lg,
        marginBottom: Spacing.lg,
    },
    chartPlaceholder: {
        height: 200,
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    chartPlaceholderText: {
        marginTop: Spacing.sm,
        fontSize: FontSize.sm,
    },
    timeframes: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: Spacing.md,
    },
    timeframeButton: {
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderRadius: BorderRadius.full,
    },
    timeframeText: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.medium,
    },
    tradeActions: {
        flexDirection: 'row',
        paddingHorizontal: Spacing.lg,
        marginBottom: Spacing.lg,
        gap: Spacing.md,
    },
    tradeButton: {
        flex: 1,
    },
    section: {
        paddingHorizontal: Spacing.lg,
        marginBottom: Spacing.lg,
    },
    sectionTitle: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.semibold,
        marginBottom: Spacing.md,
    },
    statsGrid: {
        gap: Spacing.md,
    },
    statRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statItem: {
        flex: 1,
    },
    statLabel: {
        fontSize: FontSize.xs,
        marginBottom: 2,
    },
    statValue: {
        fontSize: FontSize.md,
        fontWeight: FontWeight.semibold,
    },
    companyDesc: {
        fontSize: FontSize.sm,
        lineHeight: 22,
    },
    readMore: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: Spacing.md,
    },
    readMoreText: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.medium,
        marginRight: Spacing.xs,
    },
});
