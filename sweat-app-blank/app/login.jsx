import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../constants/Color';
import Logo from '../assets/img/logo_dark.png';

const PINK = '#c35a72';

const Login = () => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');

    // ADMIN LOGIN (does NOT use phone activity)
    if (username === 'admin' && password === 'admin123') {
      try {
        await AsyncStorage.setItem(
          'userCredentials',
          JSON.stringify({ username: 'admin', fullName: 'Admin' })
        );
        await AsyncStorage.setItem('currentUserMode', 'admin');
        router.push('/Dashboard');
      } catch (e) {
        setError('Error logging in as admin.');
      }
      return;
    }

    // NORMAL LOGIN (uses saved account data)
    try {
      const stored = await AsyncStorage.getItem('userCredentials');
      if (!stored) {
        setError('No account found. Please create an account first.');
        return;
      }

      const saved = JSON.parse(stored);
      if (username === saved.username && password === saved.password) {
        await AsyncStorage.setItem('currentUserMode', 'user');
        router.push('/Dashboard');
      } else {
        setError('Incorrect username or password.');
      }
    } catch (e) {
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.heroContainer}>
        <Image source={Logo} style={styles.img} />
        <Text style={styles.centerText}>SWEat Mobile</Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Username"
          placeholderTextColor="#aaaaaa"
          style={styles.input}
          value={username}
          onChangeText={setUsername}
        />
        <View style={styles.passwordRow}>
          <TextInput
            placeholder="Password"
            placeholderTextColor="#aaaaaa"
            secureTextEntry={!showPass}
            style={[styles.input, { flex: 1 }]}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            style={styles.showButton}
            onPress={() => setShowPass(prev => !prev)}
          >
            <Text style={styles.showText}>{showPass ? 'Hide' : 'Show'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity style={styles.loginCard} onPress={handleLogin}>
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>

      <View style={styles.bottomLinks}>
        <Link href="/start" style={styles.link}>Register</Link>
        <Link href="/forgot" style={styles.link}>Forgot Password?</Link>
      </View>

      <Link href="/" style={styles.back}>Back to Home</Link>
    </View>
  );
};

export default Login;

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
    height: 250,
    marginTop: 10,
  },
  img: {
    width: '90%',
    height: '100%',
    resizeMode: 'contain',
  },
  centerText: {
    position: 'absolute',
    top: 120,
    fontWeight: 'bold',
    color: 'white',
    fontSize: 40,
    textAlign: 'center',
    width: '100%',
    textShadowColor: PINK,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
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
    fontSize: 18,
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  showButton: {
    marginLeft: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: PINK,
  },
  showText: {
    color: 'white',
    fontWeight: 'bold',
  },
  loginCard: {
    backgroundColor: PINK,
    width: '80%',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  loginText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  bottomLinks: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 16,
  },
  link: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    textShadowColor: PINK,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
  },
  back: {
    position: 'absolute',
    bottom: 70,
    color: 'white',
    fontSize: 16,
    textDecorationLine: 'underline',
    textShadowColor: PINK,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
  },
  error: {
    color: '#ff6b6b',
    marginTop: 6,
  },
});
