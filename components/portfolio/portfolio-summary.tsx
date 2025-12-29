import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Card } from '@/components/ui/card';

interface PortfolioSummaryProps {
    totalValue: number;
    totalCost: number;
    totalProfit: number;
    profitPercent: number;
    dayChange?: number;
    dayChangePercent?: number;
}

export const PortfolioSummary = memo(function PortfolioSummary({
    totalValue,
    totalCost,
    totalProfit,
    profitPercent,
    dayChange = 0,
    dayChangePercent = 0,
}: PortfolioSummaryProps) {
    const colorScheme = useColorScheme() ?? 'dark';
    const colors = Colors[colorScheme];

    const formatCurrency = (value: number) => {
        return value.toLocaleString('vi-VN') + ' ₫';
    };

    const isProfitPositive = totalProfit >= 0;
    const isDayPositive = dayChange >= 0;

    return (
        <Card style={styles.container}>
            <Text style={[styles.title, { color: colors.textSecondary }]}>
                Tổng giá trị danh mục
            </Text>
            <Text style={[styles.totalValue, { color: colors.text }]}>
                {formatCurrency(totalValue)}
            </Text>

            <View style={styles.row}>
                <View style={styles.statItem}>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                        Vốn đầu tư
                    </Text>
                    <Text style={[styles.statValue, { color: colors.text }]}>
                        {formatCurrency(totalCost)}
                    </Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                        Lợi nhuận
                    </Text>
                    <Text
                        style={[
                            styles.statValue,
                            { color: isProfitPositive ? colors.profit : colors.loss },
                        ]}
                    >
                        {isProfitPositive ? '+' : ''}
                        {formatCurrency(totalProfit)}
                    </Text>
                    <Text
                        style={[
                            styles.percentBadge,
                            {
                                color: isProfitPositive ? colors.profit : colors.loss,
                                backgroundColor: isProfitPositive ? `${colors.profit}20` : `${colors.loss}20`,
                            },
                        ]}
                    >
                        {isProfitPositive ? '+' : ''}
                        {profitPercent.toFixed(2)}%
                    </Text>
                </View>
            </View>

            <View style={[styles.dayChangeContainer, { borderTopColor: colors.divider }]}>
                <Text style={[styles.dayLabel, { color: colors.textSecondary }]}>
                    Thay đổi hôm nay
                </Text>
                <View style={styles.dayValues}>
                    <Text
                        style={[
                            styles.dayChange,
                            { color: isDayPositive ? colors.profit : colors.loss },
                        ]}
                    >
                        {isDayPositive ? '+' : ''}
                        {formatCurrency(dayChange)}
                    </Text>
                    <Text
                        style={[
                            styles.dayPercent,
                            {
                                color: isDayPositive ? colors.profit : colors.loss,
                                backgroundColor: isDayPositive ? `${colors.profit}20` : `${colors.loss}20`,
                            },
                        ]}
                    >
                        {isDayPositive ? '+' : ''}
                        {dayChangePercent.toFixed(2)}%
                    </Text>
                </View>
            </View>
        </Card>
    );
});

interface HoldingItemProps {
    symbol: string;
    name: string;
    quantity: number;
    avgPrice: number;
    currentPrice: number;
    profit: number;
    profitPercent: number;
    onPress?: () => void;
}

export const HoldingItem = memo(function HoldingItem({
    symbol,
    name,
    quantity,
    avgPrice,
    currentPrice,
    profit,
    profitPercent,
}: HoldingItemProps) {
    const colorScheme = useColorScheme() ?? 'dark';
    const colors = Colors[colorScheme];

    const isProfitPositive = profit >= 0;
    const currentValue = quantity * currentPrice;

    return (
        <View style={[styles.holdingItem, { backgroundColor: colors.surface }]}>
            <View style={styles.holdingHeader}>
                <View>
                    <Text style={[styles.holdingSymbol, { color: colors.text }]}>{symbol}</Text>
                    <Text style={[styles.holdingName, { color: colors.textSecondary }]} numberOfLines={1}>
                        {name}
                    </Text>
                </View>
                <View style={styles.holdingValues}>
                    <Text style={[styles.holdingValue, { color: colors.text }]}>
                        {currentValue.toLocaleString('vi-VN')} ₫
                    </Text>
                    <Text
                        style={[
                            styles.holdingProfit,
                            { color: isProfitPositive ? colors.profit : colors.loss },
                        ]}
                    >
                        {isProfitPositive ? '+' : ''}
                        {profitPercent.toFixed(2)}%
                    </Text>
                </View>
            </View>

            <View style={[styles.holdingDetails, { borderTopColor: colors.divider }]}>
                <View style={styles.holdingDetail}>
                    <Text style={[styles.detailLabel, { color: colors.textTertiary }]}>SL</Text>
                    <Text style={[styles.detailValue, { color: colors.text }]}>
                        {quantity.toLocaleString()}
                    </Text>
                </View>
                <View style={styles.holdingDetail}>
                    <Text style={[styles.detailLabel, { color: colors.textTertiary }]}>Giá TB</Text>
                    <Text style={[styles.detailValue, { color: colors.text }]}>
                        {avgPrice.toLocaleString()}
                    </Text>
                </View>
                <View style={styles.holdingDetail}>
                    <Text style={[styles.detailLabel, { color: colors.textTertiary }]}>Giá hiện tại</Text>
                    <Text
                        style={[
                            styles.detailValue,
                            { color: isProfitPositive ? colors.profit : colors.loss },
                        ]}
                    >
                        {currentPrice.toLocaleString()}
                    </Text>
                </View>
                <View style={styles.holdingDetail}>
                    <Text style={[styles.detailLabel, { color: colors.textTertiary }]}>Lãi/Lỗ</Text>
                    <Text
                        style={[
                            styles.detailValue,
                            { color: isProfitPositive ? colors.profit : colors.loss },
                        ]}
                    >
                        {isProfitPositive ? '+' : ''}
                        {profit.toLocaleString()}
                    </Text>
                </View>
            </View>
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        padding: Spacing.lg,
    },
    title: {
        fontSize: FontSize.sm,
        marginBottom: Spacing.xs,
    },
    totalValue: {
        fontSize: FontSize.xxxl,
        fontWeight: FontWeight.bold,
        marginBottom: Spacing.lg,
    },
    row: {
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
        fontSize: FontSize.lg,
        fontWeight: FontWeight.semibold,
    },
    percentBadge: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.medium,
        paddingHorizontal: Spacing.sm,
        paddingVertical: 2,
        borderRadius: BorderRadius.sm,
        alignSelf: 'flex-start',
        marginTop: 4,
    },
    dayChangeContainer: {
        marginTop: Spacing.lg,
        paddingTop: Spacing.md,
        borderTopWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dayLabel: {
        fontSize: FontSize.sm,
    },
    dayValues: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dayChange: {
        fontSize: FontSize.md,
        fontWeight: FontWeight.semibold,
        marginRight: Spacing.sm,
    },
    dayPercent: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.medium,
        paddingHorizontal: Spacing.sm,
        paddingVertical: 2,
        borderRadius: BorderRadius.sm,
    },
    holdingItem: {
        borderRadius: BorderRadius.md,
        padding: Spacing.md,
        marginBottom: Spacing.sm,
    },
    holdingHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    holdingSymbol: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.bold,
    },
    holdingName: {
        fontSize: FontSize.sm,
        marginTop: 2,
        maxWidth: 150,
    },
    holdingValues: {
        alignItems: 'flex-end',
    },
    holdingValue: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.semibold,
    },
    holdingProfit: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.medium,
        marginTop: 2,
    },
    holdingDetails: {
        marginTop: Spacing.md,
        paddingTop: Spacing.md,
        borderTopWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    holdingDetail: {
        alignItems: 'center',
    },
    detailLabel: {
        fontSize: FontSize.xs,
        marginBottom: 2,
    },
    detailValue: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.medium,
    },
});
