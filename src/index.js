import { useCallback } from 'react';
import {
  KeyboardAvoidingView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  View,
} from 'react-native';

import {
  useFonts,
  Rubik_400Regular,
  Rubik_500Medium,
  Rubik_700Bold
} from '@expo-google-fonts/rubik';
import * as SplashScreen from 'expo-splash-screen';

import Forum from 'screens/Forum';

import colors from '../assets/colors';

SplashScreen.preventAutoHideAsync();

const App = () => {
  const [fontsLoaded] = useFonts({
    Rubik_400Regular,
    Rubik_500Medium,
    Rubik_700Bold
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
      <StatusBar barStyle='light-content' />
      <SafeAreaView
        style={styles.container}
      >
        <View
          onLayout={onLayoutRootView}
          style={styles.subContainer}
          testID='app-screen'
        >
          <Forum />
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  subContainer: {
    flex: 1,
    backgroundColor: colors.neutral.veryLightGray,
    paddingHorizontal: 15,
    paddingVertical: 10,
    justifyContent: 'space-between',
  },
});

export default App;
