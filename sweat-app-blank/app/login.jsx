import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'
import { Colors } from "../constants/Color"
import { useColorScheme } from 'react-native'

const login = () => {
    const colorScheme = useColorScheme()
    const theme = Colors[colorScheme] ?? Colors.light
  return (
    <View style={[styles.container, { backgroundColor: theme.background } ]}> 
      <Text style={styles.title}>Login</Text>
      <Link href="/" style={styles.link}>Back to Home</Link>
    </View>

  )
}

export default login

const styles = StyleSheet.create({
  container: {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center'
},
title: {
  fontWeight: 'bold',
  fontSize: 24

},
   link: {
    marginVertical: 10,
    borderBottimWidth: 1,
    textDecorationLine: 'underline',
    textDecorationColor: 'black'
   },
})