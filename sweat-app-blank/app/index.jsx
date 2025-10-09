import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import Logo from '../assets/img/logo_light.png'
import  { Link } from 'expo-router'
import { Colors } from "../constants/Color"
import { useColorScheme } from 'react-native'

const Home = () => {
        const colorScheme = useColorScheme()
        const theme = Colors[colorScheme] ?? Colors.light
  return (
    <View style={[styles.container, { backgroundColor: theme.background } ]}>
      <Image source={Logo} style={styles.img}/>
      <Text style={styles.title}>SWEat Mobile</Text>

      <Link href="/login" style={styles.login}>Login</Link>
      <Link href="/start" style={styles.link}>Get Started</Link>
      <Link href="/contact" style={styles.contact}>Contact Us</Link>

    </View>
  )
}

export default Home

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        fontWeight: 'bold',
        color: '#ff4fa3',
        fontSize: 40,
        textShadowColor: 'black',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 5,
    },
    card: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 16,
        BoxShadow: '4px 6px rgba(0, 0, 0, 0.1)',
    },
    img: {
        marginVertical: 20,
        width: 400,
        height: 400,
        resizeMode: 'contain'
    },
    link: {
      marginVertical: 10,
      color: 'black',
      textDecorationLine: 'underline',
      textDecorationColor: 'black',

     },
      login: {
      marginVertical: 10,
      textDecorationLine : 'underline',
      textDecorationColor: 'black',
      color: 'black',
      fontSize: 30,
      fontWeight: 'bold'
     },
     contact: {
      fontSize: 16,
      bottom: 30,
      right: 20,
      position: 'absolute',
      color: 'black',
      textDecorationLine: 'underline',
      textDecorationColor: 'black',
      },
})