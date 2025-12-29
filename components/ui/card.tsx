import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface CardProps {
    children: React.ReactNode;
    style?: ViewStyle;
    padding?: 'none' | 'sm' | 'md' | 'lg';
    variant?: 'default' | 'elevated' | 'outline';
}

export function Card({
    children,
    style,
    padding = 'md',
    variant = 'default',
}: CardProps) {
    const colorScheme = useColorScheme() ?? 'dark';
    const colors = Colors[colorScheme];

    const getPadding = () => {
        switch (padding) {
            case 'none':
                return 0;
            case 'sm':
                return Spacing.sm;
            case 'lg':
                return Spacing.lg;
            default:
                return Spacing.md;
        }
    };

    const getBackgroundColor = () => {
        switch (variant) {
            case 'elevated':
                return colors.surfaceElevated;
            default:
                return colors.surface;
        }
    };

    return (
        <View
            style={[
                styles.card,
                {
                    backgroundColor: getBackgroundColor(),
                    padding: getPadding(),
                    borderColor: variant === 'outline' ? colors.border : 'transparent',
                    borderWidth: variant === 'outline' ? 1 : 0,
                },
                style,
            ]}
        >
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: BorderRadius.lg,
    },
});
