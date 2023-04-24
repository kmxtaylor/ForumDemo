import { useCallback } from 'react';
import {
  KeyboardAvoidingView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';

import {
  useFonts,
  Rubik_400Regular,
  Rubik_500Medium,
  Rubik_700Bold
} from '@expo-google-fonts/rubik';
import * as SplashScreen from 'expo-splash-screen';

import MainScreen from './screens/MainScreen';

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
        onLayout={onLayoutRootView}
        testID='app-screen'
      >
        <KeyboardAvoidingView
          style={styles.subContainer}
          behavior='padding'
          enabled
        >
          <MainScreen />
          {/* <MyText>Test text</MyText> */}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'hsl(239, 57%, 85%)',
  },
  subContainer: {
    flex: 1,
    // height: '100%',
    paddingHorizontal: 15,
    // paddingVertical: 5,
    justifyContent: 'space-between',
    // alignItems: 'center',
    // paddingBottom: 0,
  },
});

export default App;
