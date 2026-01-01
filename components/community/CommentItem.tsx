import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Comment } from '@/services/community';

interface CommentItemProps {
    comment: Comment;
    onLike?: (id: string) => void;
    onReply?: (comment: Comment) => void;
}

const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Vừa xong';
    if (diffHours < 24) return `${diffHours}h trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;
    return date.toLocaleDateString('vi-VN');
};

export function CommentItem({ comment, onLike, onReply }: CommentItemProps) {
    const colorScheme = useColorScheme() ?? 'dark';
    const colors = Colors[colorScheme];

    return (
        <View style={[styles.container, { borderBottomColor: colors.divider }]}>
            <View style={styles.header}>
                <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
                    <Text style={[styles.avatarText, { color: colors.textInverse }]}>
                        {comment.author.name.charAt(0).toUpperCase()}
                    </Text>
                </View>
                <View style={styles.headerInfo}>
                    <Text style={[styles.authorName, { color: colors.text }]}>
                        {comment.author.name}
                    </Text>
                    <Text style={[styles.time, { color: colors.textTertiary }]}>
                        {formatTime(comment.createdAt)}
                    </Text>
                </View>
            </View>

            <Text style={[styles.content, { color: colors.text }]}>
                {comment.content}
            </Text>

            <View style={styles.actions}>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => onLike?.(comment.id)}
                >
                    <IconSymbol name="heart" size={14} color={colors.textSecondary} />
                    <Text style={[styles.actionText, { color: colors.textSecondary }]}>
                        {comment.likes > 0 ? comment.likes : 'Thích'}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => onReply?.(comment)}
                >
                    <IconSymbol name="arrowshape.turn.up.left" size={14} color={colors.textSecondary} />
                    <Text style={[styles.actionText, { color: colors.textSecondary }]}>
                        Trả lời
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: Spacing.md,
        borderBottomWidth: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.sm,
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: Spacing.sm,
    },
    avatarText: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.bold,
    },
    headerInfo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    authorName: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.medium,
        marginRight: Spacing.sm,
    },
    time: {
        fontSize: FontSize.xs,
    },
    content: {
        fontSize: FontSize.sm,
        lineHeight: 20,
        marginLeft: 40,
    },
    actions: {
        flexDirection: 'row',
        marginLeft: 40,
        marginTop: Spacing.sm,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: Spacing.lg,
    },
    actionText: {
        fontSize: FontSize.xs,
        marginLeft: 4,
    },
});
