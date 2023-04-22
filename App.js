import { useCallback } from 'react';
import {
  KeyboardAvoidingView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';

import { useFonts, Rubik_400Regular, Rubik_500Medium, Rubik_700Bold } from '@expo-google-fonts/rubik';
import * as SplashScreen from 'expo-splash-screen';

import MainScreen from './screens/mainScreen';

const App = () => {
  
  return (
    <>
      <StatusBar barStyle='light-content' />
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={styles.subContainer}
          behavior='padding'
          enabled
        >
          <MainScreen />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'hsl(228, 33%, 97%)',
  },
  subContainer: {
    flex: 1,
    padding: 20,
  },
});

export default App;
