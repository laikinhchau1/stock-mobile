import React from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Card } from '@/components/ui/card';
import { IconSymbol } from '@/components/ui/icon-symbol';

const mockCourses = [
    { id: '1', title: 'Nhập môn chứng khoán', duration: '2 giờ', lessons: 12, level: 'Cơ bản', progress: 0 },
    { id: '2', title: 'Phân tích kỹ thuật', duration: '4 giờ', lessons: 20, level: 'Trung cấp', progress: 45 },
    { id: '3', title: 'Đọc báo cáo tài chính', duration: '3 giờ', lessons: 15, level: 'Cơ bản', progress: 100 },
    { id: '4', title: 'Chiến lược đầu tư giá trị', duration: '5 giờ', lessons: 25, level: 'Nâng cao', progress: 0 },
];

export default function CoursesScreen() {
    const colorScheme = useColorScheme() ?? 'dark';
    const colors = Colors[colorScheme];

    const getLevelColor = (level: string) => {
        switch (level) {
            case 'Cơ bản': return colors.profit;
            case 'Trung cấp': return colors.warning;
            case 'Nâng cao': return colors.danger;
            default: return colors.primary;
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <IconSymbol name="chevron.left" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: colors.text }]}>Khóa học</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {mockCourses.map((course) => (
                    <TouchableOpacity key={course.id}>
                        <Card style={styles.courseCard}>
                            <View style={styles.courseHeader}>
                                <View style={[styles.levelBadge, { backgroundColor: `${getLevelColor(course.level)}20` }]}>
                                    <Text style={[styles.levelText, { color: getLevelColor(course.level) }]}>{course.level}</Text>
                                </View>
                                {course.progress === 100 && (
                                    <IconSymbol name="checkmark.circle.fill" size={20} color={colors.profit} />
                                )}
                            </View>
                            <Text style={[styles.courseTitle, { color: colors.text }]}>{course.title}</Text>
                            <View style={styles.courseInfo}>
                                <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                                    <IconSymbol name="clock" size={14} color={colors.textSecondary} /> {course.duration}
                                </Text>
                                <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                                    {course.lessons} bài học
                                </Text>
                            </View>
                            {course.progress > 0 && course.progress < 100 && (
                                <View style={styles.progressContainer}>
                                    <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
                                        <View style={[styles.progressFill, { width: `${course.progress}%`, backgroundColor: colors.primary }]} />
                                    </View>
                                    <Text style={[styles.progressText, { color: colors.textSecondary }]}>{course.progress}%</Text>
                                </View>
                            )}
                        </Card>
                    </TouchableOpacity>
                ))}
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
    courseCard: { marginBottom: Spacing.md },
    courseHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
    levelBadge: { paddingHorizontal: Spacing.sm, paddingVertical: 2, borderRadius: BorderRadius.sm },
    levelText: { fontSize: FontSize.xs, fontWeight: FontWeight.medium },
    courseTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.semibold },
    courseInfo: { flexDirection: 'row', gap: Spacing.lg, marginTop: Spacing.sm },
    infoText: { fontSize: FontSize.sm },
    progressContainer: { flexDirection: 'row', alignItems: 'center', marginTop: Spacing.md, gap: Spacing.sm },
    progressBar: { flex: 1, height: 4, borderRadius: 2 },
    progressFill: { height: '100%', borderRadius: 2 },
    progressText: { fontSize: FontSize.xs },
});
