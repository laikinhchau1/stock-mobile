import React, { useState } from 'react';
import {
    View,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { Colors, Spacing, BorderRadius, FontSize } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';

interface CommentInputProps {
    onSubmit: (content: string) => Promise<void>;
    isSubmitting?: boolean;
    placeholder?: string;
}

export function CommentInput({
    onSubmit,
    isSubmitting = false,
    placeholder = 'Viết bình luận...',
}: CommentInputProps) {
    const colorScheme = useColorScheme() ?? 'dark';
    const colors = Colors[colorScheme];
    const [content, setContent] = useState('');

    const handleSubmit = async () => {
        if (!content.trim() || isSubmitting) return;

        await onSubmit(content.trim());
        setContent('');
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={100}
        >
            <View style={[styles.container, { backgroundColor: colors.surface, borderTopColor: colors.divider }]}>
                <View style={[styles.inputContainer, { backgroundColor: colors.background, borderColor: colors.border }]}>
                    <TextInput
                        style={[styles.input, { color: colors.text }]}
                        placeholder={placeholder}
                        placeholderTextColor={colors.textTertiary}
                        value={content}
                        onChangeText={setContent}
                        multiline
                        maxLength={1000}
                        editable={!isSubmitting}
                    />
                </View>
                <TouchableOpacity
                    style={[
                        styles.sendButton,
                        {
                            backgroundColor: content.trim() ? colors.primary : colors.border,
                        },
                    ]}
                    onPress={handleSubmit}
                    disabled={!content.trim() || isSubmitting}
                >
                    {isSubmitting ? (
                        <ActivityIndicator size="small" color={colors.textInverse} />
                    ) : (
                        <IconSymbol
                            name="paperplane.fill"
                            size={18}
                            color={content.trim() ? colors.textInverse : colors.textTertiary}
                        />
                    )}
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        padding: Spacing.md,
        borderTopWidth: 1,
    },
    inputContainer: {
        flex: 1,
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        marginRight: Spacing.sm,
        maxHeight: 100,
    },
    input: {
        fontSize: FontSize.sm,
        maxHeight: 80,
    },
    sendButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
