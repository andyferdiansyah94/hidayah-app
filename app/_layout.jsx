import React from "react";
import { StatusBar } from "expo-status-bar";
import { Slot } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider as PaperProvider } from "react-native-paper";
import { SafeAreaView, StyleSheet } from "react-native";

export default function RootLayout() {
    return(
        <GestureHandlerRootView style={{ flex: 1 }}>
            <PaperProvider>
                <SafeAreaView style={styles.container}>
                    <StatusBar style="dark" />
                    <Slot />
                </SafeAreaView>
            </PaperProvider>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 0,
    marginTop: 40,
    },
});