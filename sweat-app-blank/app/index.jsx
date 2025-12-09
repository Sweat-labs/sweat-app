import { StyleSheet, Text, View, Image } from 'react-native';
import React from 'react';
import Logo from '../assets/img/logo_dark.png';
import { Link } from 'expo-router';
import { Colors } from "../constants/Color";
import { useColorScheme } from 'react-native';
import ThemedView from '../components/ThemedView';
import Spacer from '../components/Spacer';

const Home = () => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

  return (
    <ThemedView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.heroContainer}>
        <Image source={Logo} style={styles.img} />
        <Text style={styles.centerText}>SWEat Mobile</Text>
      </View>

      <Spacer height={40} />

      <Link href="/login" style={styles.login}>Login</Link>
      <Link href="/start" style={styles.link}>Get Started</Link>
      <Link href="/contact" style={styles.contact}>Contact Us</Link>
    </ThemedView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  heroContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',     // fill screen width
    height: 300,       // force taller hero area
  },

  img: {
    width: '200%',
    height: '200%',
    resizeMode: 'contain',
  },

  centerText: {
    position: 'absolute',
    fontWeight: 'bold',
    color: 'white',
    fontSize: 60,
    textAlign: 'center',
    width: '100%',
    textShadowColor: '#c35a72',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
    marginTop: 90,
  },

  login: {
    marginVertical: 10,
    textDecorationLine: 'underline',
    color: 'white',
    fontSize: 40,
    fontWeight: 'bold',
    textShadowColor: '#c35a72',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
  },

  link: {
    marginVertical: 10,
    textDecorationLine: 'underline',
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textShadowColor: '#c35a72',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
  },

  contact: {
    fontSize: 16,
    position: 'absolute',
    bottom: 30,
    right: 20,
    color: 'white',
    textDecorationLine: 'underline',
    textShadowColor: '#c35a72',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
  },
});
