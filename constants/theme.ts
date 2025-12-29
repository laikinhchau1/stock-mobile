// Stock Investment App Theme
export const Colors = {
  light: {
    // Core
    primary: '#00C853',
    primaryDark: '#00A844',
    danger: '#FF5252',
    dangerDark: '#E04545',
    warning: '#FFB74D',
    info: '#58A6FF',

    // Background
    background: '#FFFFFF',
    surface: '#F5F5F5',
    surfaceElevated: '#FFFFFF',

    // Text
    text: '#1A1A1A',
    textSecondary: '#666666',
    textTertiary: '#999999',
    textInverse: '#FFFFFF',

    // UI
    border: '#E0E0E0',
    divider: '#EEEEEE',
    tint: '#00C853',
    tabIconDefault: '#999999',

    // Semantic
    profit: '#00C853',
    loss: '#FF5252',
    neutral: '#666666',

    // Chart
    chartUp: '#00C853',
    chartDown: '#FF5252',
    chartLine: '#58A6FF',
    chartGrid: '#E0E0E0',
  },
  dark: {
    // Core
    primary: '#00E676',
    primaryDark: '#00C853',
    danger: '#FF6B6B',
    dangerDark: '#FF5252',
    warning: '#FFCA28',
    info: '#64B5F6',

    // Background
    background: '#0D1117',
    surface: '#161B22',
    surfaceElevated: '#1C2128',

    // Text
    text: '#FFFFFF',
    textSecondary: '#8B949E',
    textTertiary: '#6E7681',
    textInverse: '#0D1117',

    // UI
    border: '#30363D',
    divider: '#21262D',
    tint: '#00E676',
    tabIconDefault: '#6E7681',

    // Semantic
    profit: '#00E676',
    loss: '#FF6B6B',
    neutral: '#8B949E',

    // Chart
    chartUp: '#00E676',
    chartDown: '#FF6B6B',
    chartLine: '#64B5F6',
    chartGrid: '#30363D',
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const FontSize = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const FontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export type ThemeColors = typeof Colors.light;
