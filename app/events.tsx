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

const mockEvents = [
    { id: '1', symbol: 'VNM', type: 'DIVIDEND', title: 'Chia cổ tức 2,000₫/cp', date: '2025-01-15' },
    { id: '2', symbol: 'FPT', type: 'EARNINGS', title: 'Công bố BCTC Q4/2024', date: '2025-01-20' },
    { id: '3', symbol: 'VIC', type: 'AGM', title: 'Đại hội cổ đông thường niên', date: '2025-03-25' },
    { id: '4', symbol: 'VCB', type: 'DIVIDEND', title: 'Chia cổ tức 1,500₫/cp', date: '2025-02-10' },
];

export default function EventsScreen() {
    const colorScheme = useColorScheme() ?? 'dark';
    const colors = Colors[colorScheme];

    const getEventIcon = (type: string) => {
        switch (type) {
            case 'DIVIDEND': return 'dollarsign.circle.fill';
            case 'EARNINGS': return 'doc.text.fill';
            case 'AGM': return 'person.3.fill';
            default: return 'calendar';
        }
    };

    const getEventColor = (type: string) => {
        switch (type) {
            case 'DIVIDEND': return colors.profit;
            case 'EARNINGS': return colors.info;
            case 'AGM': return colors.warning;
            default: return colors.primary;
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <IconSymbol name="chevron.left" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: colors.text }]}>Lịch sự kiện</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {mockEvents.map((event) => (
                    <Card key={event.id} style={styles.eventCard}>
                        <View style={styles.eventRow}>
                            <View style={[styles.iconCircle, { backgroundColor: `${getEventColor(event.type)}20` }]}>
                                <IconSymbol name={getEventIcon(event.type) as any} size={20} color={getEventColor(event.type)} />
                            </View>
                            <View style={styles.eventInfo}>
                                <View style={styles.eventHeader}>
                                    <Text style={[styles.symbol, { color: colors.text }]}>{event.symbol}</Text>
                                    <Text style={[styles.date, { color: colors.textSecondary }]}>{event.date}</Text>
                                </View>
                                <Text style={[styles.eventTitle, { color: colors.textSecondary }]}>{event.title}</Text>
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
    content: { flex: 1, padding: Spacing.lg },
    eventCard: { marginBottom: Spacing.md },
    eventRow: { flexDirection: 'row', alignItems: 'center' },
    iconCircle: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
    eventInfo: { flex: 1, marginLeft: Spacing.md },
    eventHeader: { flexDirection: 'row', justifyContent: 'space-between' },
    symbol: { fontSize: FontSize.md, fontWeight: FontWeight.bold },
    date: { fontSize: FontSize.sm },
    eventTitle: { fontSize: FontSize.sm, marginTop: 2 },
});
