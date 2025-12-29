import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Card } from '@/components/ui/card';
import { StockMiniCard } from '@/components/stocks/stock-card';
import { PortfolioSummary } from '@/components/portfolio/portfolio-summary';
import { IconSymbol } from '@/components/ui/icon-symbol';

// Mock data - replace with real API calls
const mockIndices = [
  { symbol: 'VNINDEX', name: 'VN-Index', value: 1250.5, change: 12.3, changePercent: 0.99 },
  { symbol: 'VN30', name: 'VN30', value: 1280.2, change: 8.5, changePercent: 0.67 },
  { symbol: 'HNX', name: 'HNX-Index', value: 230.5, change: -2.1, changePercent: -0.9 },
];

const mockTopGainers = [
  { symbol: 'VNM', price: 75000, changePercent: 6.89 },
  { symbol: 'FPT', price: 125000, changePercent: 4.52 },
  { symbol: 'MWG', price: 48000, changePercent: 3.21 },
];

const mockPortfolio = {
  totalValue: 125000000,
  totalCost: 100000000,
  totalProfit: 25000000,
  profitPercent: 25.0,
  dayChange: 1500000,
  dayChangePercent: 1.21,
};

export default function HomeScreen() {
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    // Fetch data here
    setTimeout(() => setRefreshing(false), 1000);
  };

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
          <View>
            <Text style={[styles.greeting, { color: colors.textSecondary }]}>
              Xin chào 👋
            </Text>
            <Text style={[styles.title, { color: colors.text }]}>
              Nhà đầu tư
            </Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={[styles.iconButton, { backgroundColor: colors.surface }]}>
              <IconSymbol name="bell.fill" size={20} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.iconButton, { backgroundColor: colors.surface }]}>
              <IconSymbol name="magnifyingglass" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Market Indices */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Chỉ số thị trường</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {mockIndices.map((index) => (
              <Card key={index.symbol} style={{ ...styles.indexCard, marginRight: Spacing.sm }}>
                <Text style={[styles.indexName, { color: colors.textSecondary }]}>
                  {index.name}
                </Text>
                <Text style={[styles.indexValue, { color: colors.text }]}>
                  {index.value.toLocaleString('vi-VN')}
                </Text>
                <Text
                  style={[
                    styles.indexChange,
                    { color: index.change >= 0 ? colors.profit : colors.loss },
                  ]}
                >
                  {index.change >= 0 ? '+' : ''}
                  {index.change.toFixed(2)} ({index.changePercent.toFixed(2)}%)
                </Text>
              </Card>
            ))}
          </ScrollView>
        </View>

        {/* Portfolio Summary */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Danh mục của bạn</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/portfolio')}>
              <Text style={[styles.seeAll, { color: colors.primary }]}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>
          <PortfolioSummary {...mockPortfolio} />
        </View>

        {/* Top Gainers */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Tăng mạnh nhất</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/market')}>
              <Text style={[styles.seeAll, { color: colors.primary }]}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {mockTopGainers.map((stock) => (
              <StockMiniCard
                key={stock.symbol}
                symbol={stock.symbol}
                price={stock.price}
                changePercent={stock.changePercent}
                onPress={() => router.push(`/stock/${stock.symbol}`)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Tiện ích</Text>
          <View style={styles.quickActions}>
            {[
              { icon: 'magnifyingglass', label: 'Bộ lọc', route: '/screener' },
              { icon: 'bell.fill', label: 'Cảnh báo', route: '/alerts' },
              { icon: 'calendar', label: 'Sự kiện', route: '/events' },
              { icon: 'book.fill', label: 'Học tập', route: '/learning' },
            ].map((action) => (
              <TouchableOpacity
                key={action.label}
                style={[styles.quickAction, { backgroundColor: colors.surface }]}
                onPress={() => console.log(action.route)}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: `${colors.primary}20` }]}>
                  <IconSymbol name={action.icon as any} size={20} color={colors.primary} />
                </View>
                <Text style={[styles.quickActionLabel, { color: colors.text }]}>
                  {action.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
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
  greeting: {
    fontSize: FontSize.sm,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
  },
  headerActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  iconButton: {
    padding: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  section: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
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
    marginBottom: Spacing.sm,
  },
  seeAll: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
  },
  indexCard: {
    padding: Spacing.md,
    minWidth: 120,
  },
  indexName: {
    fontSize: FontSize.xs,
  },
  indexValue: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    marginVertical: 2,
  },
  indexChange: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickAction: {
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    flex: 1,
    marginHorizontal: Spacing.xs,
  },
  quickActionIcon: {
    padding: Spacing.sm,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.xs,
  },
  quickActionLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
  },
});
