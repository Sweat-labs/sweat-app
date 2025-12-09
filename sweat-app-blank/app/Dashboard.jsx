// app/Dashboard.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  useColorScheme,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Pedometer } from 'expo-sensors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../constants/Color';

const PINK = '#c35a72';
const CARD_BG = '#2f2f2f';
const MUTED = '#cfcfcf';
const DEFAULT_DAILY_GOAL = 10000;

const GOAL_LABELS = {
  loss: 'Weight Loss',
  muscle: 'Build Muscle',
  health: 'Be Healthier',
};

const ACTIVITY_LABELS = {
  '1-3': '1–3 days / week',
  '3-5': '3–5 days / week',
  '5-7': '5–7 days / week',
};

const Dashboard = () => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;
  const router = useRouter();

  const [steps, setSteps] = useState(0);
  const [calories, setCalories] = useState(0);
  const [isAvailable, setIsAvailable] = useState(null);
  const [pedError, setPedError] = useState('');

  const [userName, setUserName] = useState('');
  const [userGoal, setUserGoal] = useState(null);
  const [userActivity, setUserActivity] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const progressAnim = useRef(new Animated.Value(0)).current;

  // load user + mode
  useEffect(() => {
    const loadUser = async () => {
      try {
        const credRaw = await AsyncStorage.getItem('userCredentials');
        const profileRaw = await AsyncStorage.getItem('userProfile');
        const modeRaw = await AsyncStorage.getItem('currentUserMode');

        if (credRaw) {
          const cred = JSON.parse(credRaw);
          const nameSource = cred.fullName || cred.username || '';
          setUserName(nameSource);
        }

        if (profileRaw) {
          const profile = JSON.parse(profileRaw);
          setUserGoal(profile.goal || null);
          setUserActivity(profile.activity || null);
        }

        if (modeRaw === 'admin') {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (e) {
        console.log('Error loading profile', e);
      }
    };

    loadUser();
  }, []);

  const dailyGoal =
    userActivity === '1-3'
      ? 6000
      : userActivity === '3-5'
      ? 8000
      : userActivity === '5-7'
      ? 10000
      : DEFAULT_DAILY_GOAL;

  const rawProgress = Math.min(steps / dailyGoal, 1);

  // calories from steps
  useEffect(() => {
    const kcal = steps * 0.04;
    setCalories(Math.round(kcal));
  }, [steps]);

  // smooth ring animation
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: rawProgress,
      duration: 700,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true, // rotate only
    }).start();
  }, [rawProgress, progressAnim]);

  // pedometer (disabled for admin)
  useEffect(() => {
    if (isAdmin) {
      setIsAvailable(false);
      setSteps(0);
      setPedError('Admin mode: live steps disabled.');
      return;
    }

    let subscription;

    const startPedometer = async () => {
      try {
        const available = await Pedometer.isAvailableAsync();
        setIsAvailable(available);

        if (!available) {
          setPedError('Step tracking is not available on this device.');
          return;
        }

        const end = new Date();
        const start = new Date();
        start.setHours(0, 0, 0, 0);

        try {
          const result = await Pedometer.getStepCountAsync(start, end);
          setSteps(result.steps ?? 0);
        } catch (e) {
          setPedError("Could not load today's step count.");
        }

        subscription = Pedometer.watchStepCount(result => {
          setSteps(prev => prev + result.steps);
        });
      } catch (e) {
        setPedError('Error initializing pedometer.');
      }
    };

    startPedometer();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [isAdmin]);

  // reset at midnight
  useEffect(() => {
    const now = new Date();
    const nextMidnight = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
      0,
      0,
      0,
      0
    );
    const msUntilMidnight = nextMidnight.getTime() - now.getTime();

    const timeout = setTimeout(() => {
      setSteps(0);
      setCalories(0);
    }, msUntilMidnight);

    return () => clearTimeout(timeout);
  }, []);

  const firstName = userName ? userName.split(' ')[0] : null;
  const goalLabel = userGoal ? GOAL_LABELS[userGoal] || 'Custom goal' : 'No goal set yet';
  const activityLabel = userActivity
    ? ACTIVITY_LABELS[userActivity] || 'Custom activity'
    : 'No activity selected';

  const rotateInterpolate = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['-90deg', '270deg'],
  });

  const handleDailyTasksPress = () => {
    router.push('/DailyTasks');
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <Text style={styles.brand}>Dashboard</Text>
      <Text style={styles.greeting}>
        {firstName ? `Hey, ${firstName}! Ready to SWEat?` : 'Hey! Ready to SWEat?'}
      </Text>

      <View style={styles.row}>
        <View style={styles.ringWrap}>
          <View style={styles.ringOuter} />
          <Animated.View
            style={[
              styles.ringInner,
              {
                transform: [{ rotate: rotateInterpolate }],
              },
            ]}
          />
          <View style={styles.ringCenter}>
            <Text style={styles.stepsTop}>
              {steps.toLocaleString()} / {dailyGoal.toLocaleString()}
            </Text>
            <Text style={styles.stepsMid}>Steps</Text>
            <Text style={styles.stepsHint}>Today’s Goal</Text>
            <Text style={styles.stepsPercent}>
              {Math.round(rawProgress * 100)}% complete
            </Text>
          </View>
        </View>

        <View style={styles.statsCol}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Calories Burned:</Text>
            <Text style={styles.statValue}>{calories}</Text>
            <Text style={styles.statSub}>kcal (estimated)</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Activity Level:</Text>
            <Text style={styles.statValueSmall}>{activityLabel}</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Main Goal:</Text>
            <Text style={styles.statValueSmall}>{goalLabel}</Text>
          </View>

          {pedError ? (
            <Text style={styles.pedError}>{pedError}</Text>
          ) : isAvailable === false ? (
            <Text style={styles.pedError}>Pedometer not available.</Text>
          ) : null}
        </View>
      </View>

      <Text style={styles.section}>Categories</Text>

      <View style={styles.grid}>
        <TouchableOpacity style={styles.card} onPress={handleDailyTasksPress}>
          <Text style={styles.cardTitle}>Daily Tasks</Text>
          <Text style={styles.cardSub}>View and manage what’s next.</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => {}}>
          <Text style={styles.cardTitle}>Roles</Text>
          <Text style={styles.cardSub}>See who’s doing what.</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => {}}>
          <Text style={styles.cardTitle}>Progress</Text>
          <Text style={styles.cardSub}>Track your wins.</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => {}}>
          <Text style={styles.cardTitle}>Messages</Text>
          <Text style={styles.cardSub}>Stay in the loop.</Text>
        </TouchableOpacity>
      </View>

      <Link href="/" style={styles.back}>Back to Home</Link>
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 40,
  },
  brand: {
    color: 'white',
    fontSize: 32,
    fontWeight: '900',
    textShadowColor: PINK,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 6,
  },
  greeting: {
    color: MUTED,
    fontSize: 16,
    marginTop: 4,
    marginBottom: 20,
  },
  row: {
    width: '92%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  ringWrap: {
    width: 220,
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringOuter: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 18,
    borderColor: '#3a3a3a',
  },
  ringInner: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 18,
    borderColor: PINK,
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  ringCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepsTop: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  stepsMid: {
    color: 'white',
    fontSize: 18,
    marginTop: 2,
  },
  stepsHint: {
    color: MUTED,
    marginTop: 4,
  },
  stepsPercent: {
    color: MUTED,
    marginTop: 4,
    fontSize: 14,
  },

  statsCol: {
    gap: 8,
  },
  statCard: {
    backgroundColor: CARD_BG,
    width: 160,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
  },
  statLabel: {
    color: MUTED,
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  statValueSmall: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  statSub: {
    color: MUTED,
    marginTop: 2,
  },
  pedError: {
    color: '#ff6b6b',
    fontSize: 12,
    marginTop: 4,
  },

  section: {
    width: '92%',
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 18,
    marginBottom: 10,
  },
  grid: {
    width: '92%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 16,
    marginTop: 4,
  },
  card: {
    width: '47%',
    backgroundColor: CARD_BG,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: PINK,
    paddingVertical: 18,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  cardTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  cardSub: {
    color: MUTED,
    fontSize: 12,
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
