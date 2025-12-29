import React from 'react';
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

const mockWatchlists = [
    { id: '1', name: 'VN30', count: 15, change: 2.5 },
    { id: '2', name: 'Cổ phiếu yêu thích', count: 8, change: -1.2 },
    { id: '3', name: 'Ngân hàng', count: 6, change: 0.8 },
];

export default function WatchlistsScreen() {
    const colorScheme = useColorScheme() ?? 'dark';
    const colors = Colors[colorScheme];

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <IconSymbol name="chevron.left" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: colors.text }]}>Danh mục theo dõi</Text>
                <TouchableOpacity>
                    <IconSymbol name="plus" size={24} color={colors.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {mockWatchlists.map((list) => (
                    <TouchableOpacity key={list.id}>
                        <Card style={styles.listCard}>
                            <View style={styles.listRow}>
                                <View style={[styles.iconCircle, { backgroundColor: `${colors.primary}20` }]}>
                                    <IconSymbol name="star.fill" size={20} color={colors.primary} />
                                </View>
                                <View style={styles.listInfo}>
                                    <Text style={[styles.listName, { color: colors.text }]}>{list.name}</Text>
                                    <Text style={[styles.listCount, { color: colors.textSecondary }]}>{list.count} mã</Text>
                                </View>
                                <View style={styles.listRight}>
                                    <Text style={[styles.listChange, { color: list.change >= 0 ? colors.profit : colors.loss }]}>
                                        {list.change >= 0 ? '+' : ''}{list.change}%
                                    </Text>
                                    <IconSymbol name="chevron.right" size={16} color={colors.textTertiary} />
                                </View>
                            </View>
                        </Card>
                    </TouchableOpacity>
                ))}

                <Button
                    title="Tạo danh mục mới"
                    onPress={() => console.log('Create')}
                    variant="outline"
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
    listCard: { marginBottom: Spacing.md },
    listRow: { flexDirection: 'row', alignItems: 'center' },
    iconCircle: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
    listInfo: { flex: 1, marginLeft: Spacing.md },
    listName: { fontSize: FontSize.md, fontWeight: FontWeight.semibold },
    listCount: { fontSize: FontSize.sm },
    listRight: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
    listChange: { fontSize: FontSize.md, fontWeight: FontWeight.medium },
});
