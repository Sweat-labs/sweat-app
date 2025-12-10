import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'
import { Colors } from "../constants/Color"
import { useColorScheme } from 'react-native'

const contact = () => {
    const colorScheme = useColorScheme()
    const theme = Colors[colorScheme] ?? Colors.light
  return (
    <View style={[styles.container, { backgroundColor: theme.background } ]}> 
      <Text style={styles.title}>Contact page</Text>
      <Link href="/" style={styles.link}>Back to Home</Link>
    </View>

  )
}

export default contact

const styles = StyleSheet.create({
  container: {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center'
},
title: {
  fontWeight: 'bold',
  fontSize: 24,
  color: 'white',
  textShadowColor: '#c35a72',
  textShadowOffset: { width: 2, height: 2 },
  textShadowRadius: 10,

},
   link: {
    marginVertical: 10,
    borderBottimWidth: 1,
    textDecorationLine: 'underline',
    textDecorationColor: 'white',
    color: 'white',
    textShadowColor: '#c35a72',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
   },
})