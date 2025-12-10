import { StyleSheet, Text, View , useColorScheme} from 'react-native'
import React from 'react'
import { Link } from 'expo-router'
import { Colors } from "../constants/Color"

const start = () => {
      const colorScheme = useColorScheme()
      const theme = Colors[colorScheme] ?? Colors.light
  return (
    <View style={[styles.container, { backgroundColor: theme.background } ]}> 
      <Text style={styles.title}>Start page</Text>
      <Link href="/" style={styles.link}>Back to Home</Link>
    </View>

  )
}

export default start

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