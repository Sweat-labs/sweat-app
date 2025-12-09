// app/start.jsx
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  Alert,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../constants/Color';
import Logo from '../assets/img/logo_dark.png';

const PINK = '#c35a72';

const Start = () => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [emailOrUser, setEmailOrUser] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const handleCreateAccount = async () => {
    if (!fullName || !emailOrUser || !password || !confirm) {
      Alert.alert('Missing info', 'Please fill in all fields.');
      return;
    }
    if (password !== confirm) {
      Alert.alert('Password mismatch', 'Passwords do not match.');
      return;
    }

    try {
      const credentials = {
        fullName,
        username: emailOrUser,
        password,
      };
      await AsyncStorage.setItem('userCredentials', JSON.stringify(credentials));

      // go to the profile info page
      router.push('/AccountInfo');
    } catch (e) {
      Alert.alert('Error', 'Could not save account. Try again.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.heroContainer}>
        <Image source={Logo} style={styles.img} />
        <Text style={styles.centerText}>SWEat Mobile</Text>
      </View>

      <Text style={styles.screenTitle}>Create an Account</Text>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Full Name"
          placeholderTextColor="#aaaaaa"
          style={styles.input}
          value={fullName}
          onChangeText={setFullName}
        />
        <TextInput
          placeholder="Email or Username"
          placeholderTextColor="#aaaaaa"
          style={styles.input}
          value={emailOrUser}
          onChangeText={setEmailOrUser}
        />
        <TextInput
          placeholder="Password"
          placeholderTextColor="#aaaaaa"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          placeholder="Confirm Password"
          placeholderTextColor="#aaaaaa"
          secureTextEntry
          style={styles.input}
          value={confirm}
          onChangeText={setConfirm}
        />
      </View>

      <TouchableOpacity style={styles.primaryButton} onPress={handleCreateAccount}>
        <Text style={styles.primaryButtonText}>Create Account</Text>
      </TouchableOpacity>

      <View style={styles.bottomLinks}>
        <Text style={styles.bottomText}>Already have an account?</Text>
        <Link href="/login" style={styles.link}>
          Login
        </Link>
      </View>

      <Link href="/" style={styles.back}>
        Back to Home
      </Link>
    </View>
  );
};

export default Start;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 30,
  },
  heroContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 220,
    marginTop: 10,
  },
  img: {
    width: '85%',
    height: '100%',
    resizeMode: 'contain',
  },
  centerText: {
    position: 'absolute',
    top: 110,
    fontWeight: 'bold',
    color: 'white',
    fontSize: 36,
    textAlign: 'center',
    width: '100%',
    textShadowColor: PINK,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
  },
  screenTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
    textShadowColor: PINK,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 6,
  },
  inputContainer: {
    width: '80%',
    marginTop: 10,
  },
  input: {
    backgroundColor: '#1e1e1e',
    borderWidth: 1,
    borderColor: PINK,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    color: 'white',
    fontSize: 16,
  },
  primaryButton: {
    backgroundColor: PINK,
    width: '80%',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  bottomLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    gap: 6,
  },
  bottomText: {
    color: 'white',
    fontSize: 14,
  },
  link: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    textShadowColor: PINK,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 6,
  },
  back: {
    position: 'absolute',
    bottom: 40,
    color: 'white',
    fontSize: 16,
    textDecorationLine: 'underline',
    textShadowColor: PINK,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 6,
  },
});
