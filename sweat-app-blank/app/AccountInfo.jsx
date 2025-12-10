// app/AccountInfo.jsx
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  Alert,
  ScrollView,
} from 'react-native';
import { useRouter, Link } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../constants/Color';

const PINK = '#c35a72';
const CARD_BG = '#2f2f2f';
const MUTED = '#cfcfcf';

const activityOptions = [
  { id: '1-3', label: '1–3 days / week' },
  { id: '3-5', label: '3–5 days / week' },
  { id: '5-7', label: '5–7 days / week' },
];

const goalOptions = [
  { id: 'loss', label: 'Weight Loss' },
  { id: 'muscle', label: 'Build Muscle' },
  { id: 'health', label: 'Be Healthier' },
];

const AccountInfo = () => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;
  const router = useRouter();

  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [activity, setActivity] = useState(null);
  const [goal, setGoal] = useState(null);

  const handleSaveProfile = async () => {
    if (!weight || !height || !activity || !goal) {
      Alert.alert('Missing info', 'Please fill out all fields.');
      return;
    }

    try {
      const profile = {
        weight,
        height,
        activity,
        goal,
      };
      await AsyncStorage.setItem('userProfile', JSON.stringify(profile));
      router.push('/Dashboard');
    } catch (e) {
      Alert.alert('Error', 'Could not save profile. Try again.');
    }
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <ScrollView
        style={{ width: '100%' }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.header}>Tell us about you</Text>
        <Text style={styles.subHeader}>
          This helps SWEat customize your goals and progress.
        </Text>

        <View style={styles.card}>
          <Text style={styles.label}>Weight (lbs)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 170"
            placeholderTextColor="#aaaaaa"
            keyboardType="numeric"
            value={weight}
            onChangeText={setWeight}
          />

          <Text style={styles.label}>Height (inches)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 68"
            placeholderTextColor="#aaaaaa"
            keyboardType="numeric"
            value={height}
            onChangeText={setHeight}
          />

          <Text style={[styles.label, { marginTop: 14 }]}>
            How active are you?
          </Text>
          <View style={styles.chipRow}>
            {activityOptions.map(option => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.chip,
                  activity === option.id && styles.chipSelected,
                ]}
                onPress={() => setActivity(option.id)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.chipText,
                    activity === option.id && styles.chipTextSelected,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.label, { marginTop: 14 }]}>
            What is your main goal?
          </Text>
          <View style={styles.chipRow}>
            {goalOptions.map(option => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.chip,
                  goal === option.id && styles.chipSelected,
                ]}
                onPress={() => setGoal(option.id)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.chipText,
                    goal === option.id && styles.chipTextSelected,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.primaryButton} onPress={handleSaveProfile}>
          <Text style={styles.primaryButtonText}>Save & Go to Dashboard</Text>
        </TouchableOpacity>

        <Link href="/start" style={styles.backLink}>
          Back to Create Account
        </Link>
      </ScrollView>
    </View>
  );
};

export default AccountInfo;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 18,
    paddingBottom: 40,
  },
  header: {
    color: 'white',
    fontSize: 26,
    fontWeight: '900',
    textShadowColor: PINK,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 6,
    alignSelf: 'flex-start',
  },
  subHeader: {
    color: MUTED,
    fontSize: 14,
    marginTop: 6,
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  card: {
    width: '100%',
    backgroundColor: CARD_BG,
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 14,
    borderWidth: 2,
    borderColor: '#3a3a3a',
    marginBottom: 20,
  },
  label: {
    color: 'white',
    fontSize: 14,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#1e1e1e',
    borderWidth: 1,
    borderColor: PINK,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    color: 'white',
    fontSize: 16,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: PINK,
    marginBottom: 6,
  },
  chipSelected: {
    backgroundColor: PINK,
  },
  chipText: {
    color: PINK,
    fontSize: 12,
    fontWeight: '600',
  },
  chipTextSelected: {
    color: 'white',
  },
  primaryButton: {
    backgroundColor: PINK,
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backLink: {
    marginTop: 16,
    color: 'white',
    fontSize: 14,
    textDecorationLine: 'underline',
    textShadowColor: PINK,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 6,
  },
});
