import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {ActivityIndicator, StatusBar, StyleSheet, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SafeAreaView} from 'react-native-safe-area-context';
import {LoginScreen} from './src/screens/LoginScreen';
import {RegisterScreen} from './src/screens/RegisterScreen';
import {CharactersScreen} from './src/screens/CharactersScreen';
import {CharacterDetailScreen} from './src/screens/CharacterDetailScreen';
import {EpisodesScreen} from './src/screens/EpisodesScreen';
import SettingsModal from './src/components/SettingsModal';
import {useAuthStore} from './src/stores/authStore';
import {
  AuthStackParamList,
  MainStackParamList,
} from './src/navigation/types';
import {SettingsModalContext} from './src/contexts/SettingsModalContext';

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const MainStack = createNativeStackNavigator<MainStackParamList>();

const AuthNavigator = () => (
  <AuthStack.Navigator screenOptions={{headerShown: false}}>
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="Register" component={RegisterScreen} />
  </AuthStack.Navigator>
);

const MainNavigator = () => (
  <MainStack.Navigator screenOptions={{headerShown: false}}>
    <MainStack.Screen name="Characters" component={CharactersScreen} />
    <MainStack.Screen name="CharacterDetail" component={CharacterDetailScreen} />
    <MainStack.Screen name="Episodes" component={EpisodesScreen} />
  </MainStack.Navigator>
);

function App(): React.JSX.Element {
  const {isAuthenticated, isLoading, checkAuth, logout, user} = useAuthStore();
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const handleOpenSettings = useCallback(() => {
    setIsSettingsVisible(true);
  }, []);

  const handleCloseSettings = useCallback(() => {
    setIsSettingsVisible(false);
  }, []);

  const handleLogout = useCallback(async () => {
    await logout();
  }, [logout]);

  const settingsContextValue = useMemo(
    () => ({
      openSettings: handleOpenSettings,
    }),
    [handleOpenSettings],
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFD700" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0066CC" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SettingsModalContext.Provider value={settingsContextValue}>
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={isAuthenticated ? '#F5F5F5' : '#FFD700'}
        />
        <View style={styles.navigationWrapper}>
          <NavigationContainer>
            {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
          </NavigationContainer>
        </View>
        <SettingsModal
          visible={isSettingsVisible}
          onClose={handleCloseSettings}
          onLogout={handleLogout}
          userEmail={user?.email}
        />
      </SafeAreaView>
    </SettingsModalContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navigationWrapper: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFD700',
  },
});

export default App;
