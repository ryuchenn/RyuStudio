import { ActivityIndicator, View } from 'react-native';
import GlobalTheme from '@/styles/Global';

export default function LoadingScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color={GlobalTheme.gray1} />
    </View>
  );
}
