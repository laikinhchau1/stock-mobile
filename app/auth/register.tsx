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

export default function RegisterScreen() {
    const colorScheme = useColorScheme() ?? 'dark';
    const colors = Colors[colorScheme];
    const router = useRouter();
    const { login } = useAuthStore();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<{
        name?: string;
        email?: string;
        password?: string;
        confirmPassword?: string;
    }>({});

    const validate = () => {
        const newErrors: typeof errors = {};

        if (!name.trim()) {
            newErrors.name = 'Vui lòng nhập họ tên';
        }

        if (!email.trim()) {
            newErrors.email = 'Vui lòng nhập email';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Email không hợp lệ';
        }

        if (!password) {
            newErrors.password = 'Vui lòng nhập mật khẩu';
        } else if (password.length < 6) {
            newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Mật khẩu không khớp';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRegister = async () => {
        if (!validate()) return;

        setIsLoading(true);
        try {
            const response = await authApi.register({
                name: name.trim(),
                email: email.trim(),
                password,
            });
            await login(response.user, response.accessToken, response.refreshToken);
            Alert.alert('Thành công', 'Tạo tài khoản thành công!', [
                { text: 'OK', onPress: () => router.replace('/(tabs)') },
            ]);
        } catch (error: any) {
            const message = error.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.';
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
                        <Text style={[styles.title, { color: colors.text }]}>Tạo tài khoản</Text>
                        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                            Đăng ký để bắt đầu hành trình đầu tư của bạn.
                        </Text>
                    </View>

                    {/* Form */}
                    <View style={styles.formSection}>
                        <Input
                            label="Họ và tên"
                            placeholder="Nhập họ tên của bạn"
                            value={name}
                            onChangeText={setName}
                            autoCapitalize="words"
                            autoComplete="name"
                            error={errors.name}
                            leftIcon={<IconSymbol name="person" size={20} color={colors.textSecondary} />}
                        />

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
                            placeholder="Tạo mật khẩu (ít nhất 6 ký tự)"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                            autoComplete="new-password"
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

                        <Input
                            label="Xác nhận mật khẩu"
                            placeholder="Nhập lại mật khẩu"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry={!showConfirmPassword}
                            autoComplete="new-password"
                            error={errors.confirmPassword}
                            leftIcon={<IconSymbol name="lock" size={20} color={colors.textSecondary} />}
                            rightIcon={
                                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                                    <IconSymbol
                                        name={showConfirmPassword ? 'eye.slash' : 'eye'}
                                        size={20}
                                        color={colors.textSecondary}
                                    />
                                </TouchableOpacity>
                            }
                        />

                        <Button
                            title="Đăng ký"
                            onPress={handleRegister}
                            loading={isLoading}
                            fullWidth
                            size="lg"
                            style={{ marginTop: Spacing.md }}
                        />
                    </View>

                    {/* Terms */}
                    <Text style={[styles.termsText, { color: colors.textTertiary }]}>
                        Bằng việc đăng ký, bạn đồng ý với{' '}
                        <Text style={{ color: colors.primary }}>Điều khoản sử dụng</Text>
                        {' '}và{' '}
                        <Text style={{ color: colors.primary }}>Chính sách bảo mật</Text>
                        {' '}của chúng tôi.
                    </Text>

                    {/* Divider */}
                    <View style={styles.dividerContainer}>
                        <View style={[styles.divider, { backgroundColor: colors.border }]} />
                        <Text style={[styles.dividerText, { color: colors.textTertiary }]}>
                            hoặc
                        </Text>
                        <View style={[styles.divider, { backgroundColor: colors.border }]} />
                    </View>

                    {/* Social Register */}
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

                    {/* Login Link */}
                    <View style={styles.loginSection}>
                        <Text style={[styles.loginText, { color: colors.textSecondary }]}>
                            Đã có tài khoản?{' '}
                        </Text>
                        <TouchableOpacity onPress={() => router.push('/auth/login')}>
                            <Text style={[styles.loginLink, { color: colors.primary }]}>
                                Đăng nhập
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
        marginBottom: Spacing.md,
    },
    termsText: {
        fontSize: FontSize.xs,
        lineHeight: 18,
        textAlign: 'center',
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
    loginSection: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: Spacing.xl,
        marginBottom: Spacing.lg,
    },
    loginText: {
        fontSize: FontSize.md,
    },
    loginLink: {
        fontSize: FontSize.md,
        fontWeight: FontWeight.semibold,
    },
});
