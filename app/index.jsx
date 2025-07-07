import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import SplashScreen from './SplashScreen';
import Login from './login';

const AppStart = () => {
  const [isSplashVisible, setSplashVisible] = useState(true); 
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setSplashVisible(false); 
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isSplashVisible) {
      const isLoggedIn = false; 
      if (isLoggedIn) {
        router.replace('/tabs/index');
      }
    }
  }, [isSplashVisible]);

  if (isSplashVisible) {
    return <SplashScreen />; 
  }

  return <Login />; 
};

export default AppStart;
