import { StyleSheet, Text, useColorScheme, View } from 'react-native'
import React from 'react'
import {  Stack } from 'expo-router'
import { Colors } from "../constants/Color"
import { StatusBar } from 'expo-status-bar'
const RootLayout = () => {

    const colorScheme = useColorScheme()
    const theme = Colors[colorScheme] ?? Colors.light


  return (
    <>
        <StatusBar value="auto" />
        <Stack screenOptions={{
            headerStyle: { backgroundColor: theme.navBackground },
            headerTintColor: theme.title,
        }}>
    <Stack.Screen name="index" options={{ title: 'Home' }}/>
    <Stack.Screen name="start" options={{ title: 'Get Started' }}/>
    <Stack.Screen name="contact" options={{ title: 'Contact Us' }}/>
    <Stack.Screen name="login" options={{ title: 'Login' }}/>
        </Stack>
    </>
  )
}

export default RootLayout

const styles = StyleSheet.create({})