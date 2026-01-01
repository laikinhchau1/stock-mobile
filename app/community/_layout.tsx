import { Stack } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

export default function CommunityLayout() {
    const colorScheme = useColorScheme() ?? 'dark';
    const colors = Colors[colorScheme];

    return (
        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: colors.background,
                },
                headerTintColor: colors.text,
                headerShadowVisible: false,
            }}
        >
            <Stack.Screen
                name="[postId]"
                options={{
                    title: 'Chi tiết bài viết',
                    headerBackTitle: 'Quay lại',
                }}
            />
            <Stack.Screen
                name="create"
                options={{
                    title: 'Tạo bài viết',
                    headerBackTitle: 'Hủy',
                    presentation: 'modal',
                }}
            />
            <Stack.Screen
                name="my-posts"
                options={{
                    title: 'Bài viết của tôi',
                    headerBackTitle: 'Quay lại',
                }}
            />
        </Stack>
    );
}
