import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useAuthStore } from '@/stores/auth-store';
import { authApi } from '@/services/auth';

export default function LoginScreen() {
    const colorScheme = useColorScheme() ?? 'dark';
    const colors = Colors[colorScheme];
    const router = useRouter();
    const { login } = useAuthStore();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

    const validate = () => {
        const newErrors: { email?: string; password?: string } = {};

        if (!email.trim()) {
            newErrors.email = 'Vui lòng nhập email';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Email không hợp lệ';
        }

        if (!password) {
            newErrors.password = 'Vui lòng nhập mật khẩu';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = async () => {
        if (!validate()) return;

        setIsLoading(true);
        try {
            const response = await authApi.login({ email: email.trim(), password });
            await login(response.user, response.accessToken, response.refreshToken);
            router.replace('/(tabs)');
        } catch (error: any) {
            const message = error.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.';
            Alert.alert('Lỗi', message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Header */}
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.back()}
                    >
                        <IconSymbol name="chevron.left" size={24} color={colors.text} />
                    </TouchableOpacity>

                    {/* Title */}
                    <View style={styles.titleSection}>
                        <Text style={[styles.title, { color: colors.text }]}>Đăng nhập</Text>
                        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                            Chào mừng bạn trở lại! Nhập thông tin để tiếp tục.
                        </Text>
                    </View>

                    {/* Form */}
                    <View style={styles.formSection}>
                        <Input
                            label="Email"
                            placeholder="Nhập email của bạn"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoComplete="email"
                            error={errors.email}
                            leftIcon={<IconSymbol name="envelope" size={20} color={colors.textSecondary} />}
                        />

                        <Input
                            label="Mật khẩu"
                            placeholder="Nhập mật khẩu"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                            autoComplete="password"
                            error={errors.password}
                            leftIcon={<IconSymbol name="lock" size={20} color={colors.textSecondary} />}
                            rightIcon={
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                    <IconSymbol
                                        name={showPassword ? 'eye.slash' : 'eye'}
                                        size={20}
                                        color={colors.textSecondary}
                                    />
                                </TouchableOpacity>
                            }
                        />

                        <TouchableOpacity style={styles.forgotPassword}>
                            <Text style={[styles.forgotPasswordText, { color: colors.primary }]}>
                                Quên mật khẩu?
                            </Text>
                        </TouchableOpacity>

                        <Button
                            title="Đăng nhập"
                            onPress={handleLogin}
                            loading={isLoading}
                            fullWidth
                            size="lg"
                            style={{ marginTop: Spacing.md }}
                        />
                    </View>

                    {/* Divider */}
                    <View style={styles.dividerContainer}>
                        <View style={[styles.divider, { backgroundColor: colors.border }]} />
                        <Text style={[styles.dividerText, { color: colors.textTertiary }]}>
                            hoặc
                        </Text>
                        <View style={[styles.divider, { backgroundColor: colors.border }]} />
                    </View>

                    {/* Social Login */}
                    <View style={styles.socialSection}>
                        <TouchableOpacity
                            style={[styles.socialButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
                        >
                            <IconSymbol name="apple.logo" size={24} color={colors.text} />
                            <Text style={[styles.socialButtonText, { color: colors.text }]}>
                                Tiếp tục với Apple
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.socialButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
                        >
                            <IconSymbol name="globe" size={24} color={colors.text} />
                            <Text style={[styles.socialButtonText, { color: colors.text }]}>
                                Tiếp tục với Google
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Register Link */}
                    <View style={styles.registerSection}>
                        <Text style={[styles.registerText, { color: colors.textSecondary }]}>
                            Chưa có tài khoản?{' '}
                        </Text>
                        <TouchableOpacity onPress={() => router.push('/auth/register')}>
                            <Text style={[styles.registerLink, { color: colors.primary }]}>
                                Đăng ký ngay
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: Spacing.xl,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        marginTop: Spacing.sm,
    },
    titleSection: {
        marginTop: Spacing.lg,
        marginBottom: Spacing.xl,
    },
    title: {
        fontSize: FontSize.xxxl,
        fontWeight: FontWeight.bold,
        marginBottom: Spacing.sm,
    },
    subtitle: {
        fontSize: FontSize.md,
        lineHeight: 22,
    },
    formSection: {
        marginBottom: Spacing.lg,
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginTop: -Spacing.sm,
        marginBottom: Spacing.md,
    },
    forgotPasswordText: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.medium,
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: Spacing.lg,
    },
    divider: {
        flex: 1,
        height: 1,
    },
    dividerText: {
        marginHorizontal: Spacing.md,
        fontSize: FontSize.sm,
    },
    socialSection: {
        gap: Spacing.md,
    },
    socialButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Spacing.md,
        borderRadius: BorderRadius.md,
        borderWidth: 1,
    },
    socialButtonText: {
        fontSize: FontSize.md,
        fontWeight: FontWeight.medium,
        marginLeft: Spacing.sm,
    },
    registerSection: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: Spacing.xl,
        marginBottom: Spacing.lg,
    },
    registerText: {
        fontSize: FontSize.md,
    },
    registerLink: {
        fontSize: FontSize.md,
        fontWeight: FontWeight.semibold,
    },
});
