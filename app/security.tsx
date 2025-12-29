import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors, Spacing, FontSize, FontWeight } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function SecurityScreen() {
    const colorScheme = useColorScheme() ?? 'dark';
    const colors = Colors[colorScheme];
    const [biometric, setBiometric] = React.useState(false);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <IconSymbol name="chevron.left" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: colors.text }]}>Bảo mật</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.content}>
                <Card padding="none">
                    <TouchableOpacity style={[styles.row, { borderBottomWidth: 1, borderBottomColor: colors.divider }]}>
                        <Text style={[styles.label, { color: colors.text }]}>Đổi mật khẩu</Text>
                        <IconSymbol name="chevron.right" size={16} color={colors.textTertiary} />
                    </TouchableOpacity>
                    <View style={styles.row}>
                        <Text style={[styles.label, { color: colors.text }]}>Face ID / Touch ID</Text>
                        <Switch value={biometric} onValueChange={setBiometric} trackColor={{ true: colors.primary }} />
                    </View>
                </Card>

                <View style={styles.logoutSection}>
                    <Button title="Đăng xuất tất cả thiết bị" onPress={() => { }} variant="danger" fullWidth />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: Spacing.lg },
    title: { fontSize: FontSize.lg, fontWeight: FontWeight.semibold },
    content: { flex: 1, padding: Spacing.lg },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: Spacing.md },
    label: { fontSize: FontSize.md },
    logoutSection: { marginTop: Spacing.xl },
});
