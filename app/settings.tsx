import React from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Card } from '@/components/ui/card';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function SettingsScreen() {
    const colorScheme = useColorScheme() ?? 'dark';
    const colors = Colors[colorScheme];

    const [notifications, setNotifications] = React.useState(true);
    const [priceAlerts, setPriceAlerts] = React.useState(true);
    const [newsAlerts, setNewsAlerts] = React.useState(false);

    const settingItems = [
        { icon: 'globe', label: 'Ngôn ngữ', value: 'Tiếng Việt', onPress: () => { } },
        { icon: 'chart.bar', label: 'Đơn vị tiền tệ', value: 'VND', onPress: () => { } },
        { icon: 'clock', label: 'Múi giờ', value: 'GMT+7', onPress: () => { } },
    ];

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <IconSymbol name="chevron.left" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: colors.text }]}>Cài đặt chung</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>THÔNG BÁO</Text>
                <Card padding="none">
                    <View style={[styles.settingRow, { borderBottomColor: colors.divider }]}>
                        <Text style={[styles.settingLabel, { color: colors.text }]}>Thông báo</Text>
                        <Switch value={notifications} onValueChange={setNotifications} trackColor={{ true: colors.primary }} />
                    </View>
                    <View style={[styles.settingRow, { borderBottomColor: colors.divider }]}>
                        <Text style={[styles.settingLabel, { color: colors.text }]}>Cảnh báo giá</Text>
                        <Switch value={priceAlerts} onValueChange={setPriceAlerts} trackColor={{ true: colors.primary }} />
                    </View>
                    <View style={styles.settingRow}>
                        <Text style={[styles.settingLabel, { color: colors.text }]}>Tin tức</Text>
                        <Switch value={newsAlerts} onValueChange={setNewsAlerts} trackColor={{ true: colors.primary }} />
                    </View>
                </Card>

                <Text style={[styles.sectionTitle, { color: colors.textSecondary, marginTop: Spacing.xl }]}>TÙY CHỌN</Text>
                <Card padding="none">
                    {settingItems.map((item, index) => (
                        <TouchableOpacity
                            key={item.label}
                            style={[styles.settingRow, index < settingItems.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.divider }]}
                            onPress={item.onPress}
                        >
                            <View style={styles.settingLeft}>
                                <IconSymbol name={item.icon as any} size={20} color={colors.textSecondary} />
                                <Text style={[styles.settingLabel, { color: colors.text, marginLeft: Spacing.md }]}>{item.label}</Text>
                            </View>
                            <View style={styles.settingRight}>
                                <Text style={[styles.settingValue, { color: colors.textSecondary }]}>{item.value}</Text>
                                <IconSymbol name="chevron.right" size={16} color={colors.textTertiary} />
                            </View>
                        </TouchableOpacity>
                    ))}
                </Card>
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
    sectionTitle: { fontSize: FontSize.sm, fontWeight: FontWeight.medium, marginBottom: Spacing.sm },
    settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: Spacing.md },
    settingLeft: { flexDirection: 'row', alignItems: 'center' },
    settingLabel: { fontSize: FontSize.md },
    settingRight: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
    settingValue: { fontSize: FontSize.md },
});
