import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function ProfileScreen() {
    const colorScheme = useColorScheme() ?? 'dark';
    const colors = Colors[colorScheme];
    const [isEditing, setIsEditing] = useState(false);

    const [profile, setProfile] = useState({
        name: 'Nhà Đầu Tư',
        email: 'investor@example.com',
        phone: '0901234567',
        address: 'TP. Hồ Chí Minh',
    });

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <IconSymbol name="chevron.left" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: colors.text }]}>Thông tin cá nhân</Text>
                <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
                    <Text style={{ color: colors.primary }}>{isEditing ? 'Hủy' : 'Sửa'}</Text>
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Avatar */}
                <View style={styles.avatarSection}>
                    <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
                        <Text style={[styles.avatarText, { color: colors.textInverse }]}>NĐT</Text>
                    </View>
                    {isEditing && (
                        <TouchableOpacity>
                            <Text style={[styles.changeAvatar, { color: colors.primary }]}>
                                Thay đổi ảnh đại diện
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Form */}
                <View style={styles.form}>
                    <Card>
                        <View style={styles.formItem}>
                            <Text style={[styles.label, { color: colors.textSecondary }]}>Họ và tên</Text>
                            {isEditing ? (
                                <TextInput
                                    style={[styles.input, { color: colors.text, borderColor: colors.border }]}
                                    value={profile.name}
                                    onChangeText={(text) => setProfile({ ...profile, name: text })}
                                />
                            ) : (
                                <Text style={[styles.value, { color: colors.text }]}>{profile.name}</Text>
                            )}
                        </View>

                        <View style={[styles.divider, { backgroundColor: colors.divider }]} />

                        <View style={styles.formItem}>
                            <Text style={[styles.label, { color: colors.textSecondary }]}>Email</Text>
                            {isEditing ? (
                                <TextInput
                                    style={[styles.input, { color: colors.text, borderColor: colors.border }]}
                                    value={profile.email}
                                    onChangeText={(text) => setProfile({ ...profile, email: text })}
                                    keyboardType="email-address"
                                />
                            ) : (
                                <Text style={[styles.value, { color: colors.text }]}>{profile.email}</Text>
                            )}
                        </View>

                        <View style={[styles.divider, { backgroundColor: colors.divider }]} />

                        <View style={styles.formItem}>
                            <Text style={[styles.label, { color: colors.textSecondary }]}>Số điện thoại</Text>
                            {isEditing ? (
                                <TextInput
                                    style={[styles.input, { color: colors.text, borderColor: colors.border }]}
                                    value={profile.phone}
                                    onChangeText={(text) => setProfile({ ...profile, phone: text })}
                                    keyboardType="phone-pad"
                                />
                            ) : (
                                <Text style={[styles.value, { color: colors.text }]}>{profile.phone}</Text>
                            )}
                        </View>

                        <View style={[styles.divider, { backgroundColor: colors.divider }]} />

                        <View style={styles.formItem}>
                            <Text style={[styles.label, { color: colors.textSecondary }]}>Địa chỉ</Text>
                            {isEditing ? (
                                <TextInput
                                    style={[styles.input, { color: colors.text, borderColor: colors.border }]}
                                    value={profile.address}
                                    onChangeText={(text) => setProfile({ ...profile, address: text })}
                                />
                            ) : (
                                <Text style={[styles.value, { color: colors.text }]}>{profile.address}</Text>
                            )}
                        </View>
                    </Card>
                </View>

                {isEditing && (
                    <View style={styles.saveButton}>
                        <Button
                            title="Lưu thay đổi"
                            onPress={() => setIsEditing(false)}
                            variant="primary"
                            fullWidth
                        />
                    </View>
                )}
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
    avatarSection: { alignItems: 'center', marginVertical: Spacing.xl },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: { fontSize: FontSize.xxxl, fontWeight: FontWeight.bold },
    changeAvatar: { marginTop: Spacing.md, fontSize: FontSize.sm },
    form: { paddingHorizontal: Spacing.lg },
    formItem: { paddingVertical: Spacing.md },
    label: { fontSize: FontSize.sm, marginBottom: Spacing.xs },
    value: { fontSize: FontSize.md },
    input: {
        fontSize: FontSize.md,
        borderWidth: 1,
        borderRadius: BorderRadius.md,
        padding: Spacing.sm,
    },
    divider: { height: 1 },
    saveButton: { padding: Spacing.lg },
});
