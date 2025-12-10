// app/DailyTasks.jsx
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  useColorScheme,
} from 'react-native';
import { Link } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../constants/Color';

const PINK = '#c35a72';
const CARD_BG = '#2f2f2f';
const MUTED = '#cfcfcf';

const getRecommendations = (profile) => {
  if (!profile) {
    return [
      {
        id: 'walk-20',
        title: '20 min Walk',
        calories: 80,
        note: 'Gentle movement to get started.',
      },
      {
        id: 'stretch-10',
        title: '10 min Stretch',
        calories: 30,
        note: 'Loosen up your body.',
      },
    ];
  }

  const { goal, activity } = profile;
  const recs = [];

  if (goal === 'loss') {
    recs.push(
      {
        id: 'cardio-30',
        title: '30 min Cardio',
        calories: 250,
        note: 'Great for burning fat and improving stamina.',
      },
      {
        id: 'walk-45',
        title: '45 min Brisk Walk',
        calories: 220,
        note: 'Low-impact fat-burning session.',
      }
    );
  } else if (goal === 'muscle') {
    recs.push(
      {
        id: 'strength-upper',
        title: 'Upper Body Strength',
        calories: 180,
        note: 'Push-ups, rows, presses for muscle growth.',
      },
      {
        id: 'strength-lower',
        title: 'Lower Body Strength',
        calories: 200,
        note: 'Squats, lunges, and deadlifts.',
      }
    );
  } else if (goal === 'health') {
    recs.push(
      {
        id: 'mixed-20',
        title: '20 min Mixed Movement',
        calories: 150,
        note: 'Light cardio + mobility work.',
      },
      {
        id: 'yoga-15',
        title: '15 min Yoga / Mobility',
        calories: 70,
        note: 'Good for stress and joints.',
      }
    );
  }

  if (activity === '5-7') {
    recs.push({
      id: 'hiit-15',
      title: '15 min HIIT',
      calories: 200,
      note: 'Short, intense, big calorie burn.',
    });
  }

  return recs;
};

const DailyTasks = () => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

  const [tasks, setTasks] = useState([
    { id: 't1', title: '5,000 steps', calories: 200, done: false },
    { id: 't2', title: 'Drink 8 cups of water', calories: 0, done: false },
  ]);

  const [profile, setProfile] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCalories, setNewTaskCalories] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profileRaw = await AsyncStorage.getItem('userProfile');
        if (profileRaw) {
          const p = JSON.parse(profileRaw);
          setProfile(p);
          setRecommendations(getRecommendations(p));
        } else {
          setRecommendations(getRecommendations(null));
        }
      } catch (e) {
        setRecommendations(getRecommendations(null));
      }
    };

    loadProfile();
  }, []);

  const toggleTaskDone = (id) => {
    setTasks(prev =>
      prev.map(t =>
        t.id === id ? { ...t, done: !t.done } : t
      )
    );
  };

  const addNewTask = () => {
    if (!newTaskTitle.trim()) return;

    const cals = newTaskCalories ? parseInt(newTaskCalories, 10) || 0 : 0;

    const newTask = {
      id: `t-${Date.now()}`,
      title: newTaskTitle.trim(),
      calories: cals,
      done: false,
    };

    setTasks(prev => [...prev, newTask]);
    setNewTaskTitle('');
    setNewTaskCalories('');
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <View style={styles.headerBox}>
        <Text style={styles.header}>Daily Tasks</Text>
        <Text style={styles.subHeader}>Stay on top of your SWEat goals today.</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Today’s Tasks</Text>

          {tasks.map(task => (
            <View key={task.id} style={styles.taskRow}>
              <TouchableOpacity
                onPress={() => toggleTaskDone(task.id)}
                style={[
                  styles.checkbox,
                  task.done && styles.checkboxChecked,
                ]}
              >
                {task.done && <Text style={styles.checkboxMark}>✓</Text>}
              </TouchableOpacity>

              <View style={styles.taskTextCol}>
                <Text
                  style={[
                    styles.taskTitle,
                    task.done && styles.taskTitleDone,
                  ]}
                >
                  {task.title}
                </Text>
                {task.calories > 0 && (
                  <Text style={styles.taskSub}>
                    Est. {task.calories} kcal
                  </Text>
                )}
              </View>
            </View>
          ))}

          <View style={styles.addRow}>
            <View style={{ flex: 1 }}>
              <TextInput
                placeholder="Add a workout or habit..."
                placeholderTextColor="#aaaaaa"
                style={styles.input}
                value={newTaskTitle}
                onChangeText={setNewTaskTitle}
              />
            </View>
          </View>

          <View style={styles.addRow}>
            <TextInput
              placeholder="Calories (optional)"
              placeholderTextColor="#aaaaaa"
              style={[styles.input, { flex: 1, marginRight: 8 }]}
              value={newTaskCalories}
              onChangeText={setNewTaskCalories}
              keyboardType="numeric"
            />
            <TouchableOpacity style={styles.addButton} onPress={addNewTask}>
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Recommended for You</Text>
          {profile && (
            <Text style={styles.profileHint}>
              Based on your goal ({profile.goal}) and activity ({profile.activity}).
            </Text>
          )}

          {recommendations.map(rec => (
            <View key={rec.id} style={styles.recoCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.recoTitle}>{rec.title}</Text>
                <Text style={styles.recoSub}>{rec.note}</Text>
                {rec.calories > 0 && (
                  <Text style={styles.recoCals}>
                    Est. {rec.calories} kcal
                  </Text>
                )}
              </View>
              <TouchableOpacity
                style={styles.smallAddButton}
                onPress={() =>
                  setTasks(prev => [
                    ...prev,
                    {
                      id: `t-rec-${rec.id}-${Date.now()}`,
                      title: rec.title,
                      calories: rec.calories,
                      done: false,
                    },
                  ])
                }
              >
                <Text style={styles.smallAddText}>Add</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <Link href="/Dashboard" style={styles.backLink}>
          Back to Dashboard
        </Link>
      </ScrollView>
    </View>
  );
};

export default DailyTasks;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  headerBox: {
    paddingTop: 40,
    paddingHorizontal: 18,
    paddingBottom: 8,
  },
  header: {
    color: 'white',
    fontSize: 28,
    fontWeight: '900',
    textShadowColor: PINK,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 6,
  },
  subHeader: {
    color: MUTED,
    fontSize: 14,
    marginTop: 4,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingBottom: 40,
  },

  sectionCard: {
    marginTop: 10,
    marginBottom: 18,
    backgroundColor: CARD_BG,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#3a3a3a',
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: PINK,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: PINK,
  },
  checkboxMark: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  taskTextCol: {
    flex: 1,
  },
  taskTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  taskTitleDone: {
    textDecorationLine: 'line-through',
    color: MUTED,
  },
  taskSub: {
    color: MUTED,
    fontSize: 12,
    marginTop: 2,
  },

  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  input: {
    backgroundColor: '#1e1e1e',
    borderWidth: 1,
    borderColor: PINK,
    borderRadius: 10,
    padding: 10,
    color: 'white',
    fontSize: 14,
  },
  addButton: {
    backgroundColor: PINK,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },

  profileHint: {
    color: MUTED,
    fontSize: 12,
    marginBottom: 8,
  },
  recoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#242424',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginTop: 8,
  },
  recoTitle: {
    color: 'white',
    fontSize: 15,
    fontWeight: '700',
  },
  recoSub: {
    color: MUTED,
    fontSize: 12,
    marginTop: 2,
  },
  recoCals: {
    color: MUTED,
    fontSize: 12,
    marginTop: 2,
  },
  smallAddButton: {
    backgroundColor: PINK,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    marginLeft: 8,
  },
  smallAddText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },

  backLink: {
    marginTop: 10,
    alignSelf: 'center',
    color: 'white',
    fontSize: 14,
    textDecorationLine: 'underline',
    textShadowColor: PINK,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 6,
  },
});
