import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import TabBar from '../../components/TabBar'

const _layout = () => {
  return (
    <Tabs
        tabBar={props=> <TabBar {...props}/> }
    >
        <Tabs.Screen
            name="index"
            options={{ 
                title: 'Home',
                headerShown: false,
             }}
        />
        <Tabs.Screen
            name="history"
            options={{ 
                title: 'History',
                headerShown: false,
             }}
        />
        <Tabs.Screen
            name="profile"
            options={{ 
                title: 'Profile',
                headerShown: false,
             }}
        />
    </Tabs>
  )
}

export default _layout