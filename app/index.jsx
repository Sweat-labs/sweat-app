import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import Logo from '../assets/img/logo_light.png'

const Home = () => {
  return (
    <View style={styles.container}>
      <Image source={Logo} style={styles.img}/>
      <Text style={styles.title}>SWEat Mobile</Text>

      <Text styles={{ marginTop: 10, marginBottom: 30 }}>Welcome</Text>

      <View style={styles.card}>
        <Text>This will do something soon</Text>
      </View>
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
        fontSize: 24
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
    }

})