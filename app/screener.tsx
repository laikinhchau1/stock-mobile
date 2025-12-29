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

const filters = [
    { id: 'pe', label: 'P/E', options: ['< 10', '10-15', '15-20', '> 20'] },
    { id: 'roe', label: 'ROE', options: ['> 20%', '15-20%', '10-15%', '< 10%'] },
    { id: 'marketCap', label: 'Vốn hóa', options: ['Large', 'Mid', 'Small'] },
    { id: 'sector', label: 'Ngành', options: ['Ngân hàng', 'Bất động sản', 'Công nghệ', 'Tiêu dùng'] },
];

export default function ScreenerScreen() {
    const colorScheme = useColorScheme() ?? 'dark';
    const colors = Colors[colorScheme];
    const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({});

    const toggleFilter = (filterId: string, option: string) => {
        setSelectedFilters((prev) => {
            if (prev[filterId] === option) {
                const copy = { ...prev };
                delete copy[filterId];
                return copy;
            }
            return { ...prev, [filterId]: option };
        });
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <IconSymbol name="chevron.left" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: colors.text }]}>Bộ lọc cổ phiếu</Text>
                <TouchableOpacity onPress={() => setSelectedFilters({})}>
                    <Text style={{ color: colors.primary }}>Xóa</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {filters.map((filter) => (
                    <View key={filter.id} style={styles.filterSection}>
                        <Text style={[styles.filterLabel, { color: colors.text }]}>{filter.label}</Text>
                        <View style={styles.optionsRow}>
                            {filter.options.map((option) => (
                                <TouchableOpacity
                                    key={option}
                                    style={[
                                        styles.optionBtn,
                                        {
                                            backgroundColor: selectedFilters[filter.id] === option ? colors.primary : colors.surface,
                                        },
                                    ]}
                                    onPress={() => toggleFilter(filter.id, option)}
                                >
                                    <Text
                                        style={{
                                            color: selectedFilters[filter.id] === option ? colors.textInverse : colors.textSecondary,
                                            fontSize: FontSize.sm,
                                        }}
                                    >
                                        {option}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                ))}

                <View style={styles.resultSection}>
                    <Text style={[styles.resultText, { color: colors.textSecondary }]}>
                        Đã chọn {Object.keys(selectedFilters).length} bộ lọc
                    </Text>
                    <Button
                        title="Tìm kiếm"
                        onPress={() => console.log('Search', selectedFilters)}
                        variant="primary"
                        fullWidth
                    />
                </View>
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
    filterSection: { marginBottom: Spacing.xl },
    filterLabel: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, marginBottom: Spacing.sm },
    optionsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
    optionBtn: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: BorderRadius.full },
    resultSection: { marginTop: Spacing.xl },
    resultText: { textAlign: 'center', marginBottom: Spacing.md },
});
