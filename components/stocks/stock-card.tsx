import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface PriceChangeProps {
    value: number;
    percent?: number;
    size?: 'sm' | 'md' | 'lg';
    showSign?: boolean;
    showPercent?: boolean;
    style?: object;
}

export const PriceChange = memo(function PriceChange({
    value,
    percent,
    size = 'md',
    showSign = true,
    showPercent = true,
    style,
}: PriceChangeProps) {
    const colorScheme = useColorScheme() ?? 'dark';
    const colors = Colors[colorScheme];

    const isPositive = value >= 0;
    const color = value === 0 ? colors.neutral : isPositive ? colors.profit : colors.loss;
    const sign = showSign ? (isPositive ? '+' : '') : '';

    const getFontSize = () => {
        switch (size) {
            case 'sm':
                return FontSize.xs;
            case 'lg':
                return FontSize.lg;
            default:
                return FontSize.sm;
        }
    };

    const formatNumber = (num: number) => {
        return num.toLocaleString('vi-VN', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        });
    };

    return (
        <View style={[styles.container, style]}>
            <Text style={[styles.text, { color, fontSize: getFontSize() }]}>
                {sign}
                {formatNumber(value)}
                {showPercent && percent !== undefined && ` (${sign}${percent.toFixed(2)}%)`}
            </Text>
        </View>
    );
});

interface StockCardProps {
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
    volume?: number;
    onPress?: () => void;
}

export const StockCard = memo(function StockCard({
    symbol,
    name,
    price,
    change,
    changePercent,
    volume,
    onPress,
}: StockCardProps) {
    const colorScheme = useColorScheme() ?? 'dark';
    const colors = Colors[colorScheme];

    const formatPrice = (p: number) => {
        return p.toLocaleString('vi-VN');
    };

    const formatVolume = (v: number) => {
        if (v >= 1000000) return `${(v / 1000000).toFixed(1)}M`;
        if (v >= 1000) return `${(v / 1000).toFixed(1)}K`;
        return v.toString();
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            style={[styles.stockCard, { backgroundColor: colors.surface }]}
        >
            <View style={styles.stockLeft}>
                <Text style={[styles.stockSymbol, { color: colors.text }]}>{symbol}</Text>
                <Text
                    style={[styles.stockName, { color: colors.textSecondary }]}
                    numberOfLines={1}
                >
                    {name}
                </Text>
            </View>
            <View style={styles.stockRight}>
                <Text style={[styles.stockPrice, { color: colors.text }]}>
                    {formatPrice(price)}
                </Text>
                <PriceChange value={change} percent={changePercent} size="sm" />
                {volume !== undefined && (
                    <Text style={[styles.stockVolume, { color: colors.textTertiary }]}>
                        KL: {formatVolume(volume)}
                    </Text>
                )}
            </View>
        </TouchableOpacity>
    );
});

interface StockMiniCardProps {
    symbol: string;
    price: number;
    changePercent: number;
    onPress?: () => void;
}

export const StockMiniCard = memo(function StockMiniCard({
    symbol,
    price,
    changePercent,
    onPress,
}: StockMiniCardProps) {
    const colorScheme = useColorScheme() ?? 'dark';
    const colors = Colors[colorScheme];

    const bgColor =
        changePercent === 0
            ? colors.surface
            : changePercent > 0
                ? `${colors.profit}20`
                : `${colors.loss}20`;

    const textColor =
        changePercent === 0
            ? colors.text
            : changePercent > 0
                ? colors.profit
                : colors.loss;

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            style={[styles.miniCard, { backgroundColor: bgColor }]}
        >
            <Text style={[styles.miniSymbol, { color: colors.text }]}>{symbol}</Text>
            <Text style={[styles.miniPrice, { color: colors.text }]}>
                {price.toLocaleString('vi-VN')}
            </Text>
            <Text style={[styles.miniChange, { color: textColor }]}>
                {changePercent >= 0 ? '+' : ''}
                {changePercent.toFixed(2)}%
            </Text>
        </TouchableOpacity>
    );
});

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    text: {
        fontWeight: FontWeight.medium,
    },
    stockCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: Spacing.md,
        borderRadius: BorderRadius.md,
        marginBottom: Spacing.sm,
    },
    stockLeft: {
        flex: 1,
        marginRight: Spacing.md,
    },
    stockSymbol: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.bold,
    },
    stockName: {
        fontSize: FontSize.sm,
        marginTop: 2,
    },
    stockRight: {
        alignItems: 'flex-end',
    },
    stockPrice: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.semibold,
    },
    stockVolume: {
        fontSize: FontSize.xs,
        marginTop: 2,
    },
    miniCard: {
        padding: Spacing.sm,
        borderRadius: BorderRadius.md,
        alignItems: 'center',
        minWidth: 80,
        marginRight: Spacing.sm,
    },
    miniSymbol: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.bold,
    },
    miniPrice: {
        fontSize: FontSize.sm,
        marginTop: 2,
    },
    miniChange: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.medium,
        marginTop: 2,
    },
});
