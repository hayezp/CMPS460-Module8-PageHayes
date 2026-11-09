import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';

type RootStackParamList = {
  Home: undefined;
  Tasks: undefined;
  TaskDetails: {
    taskId: string;
    taskTitle: string;
  };
};

type TaskDetailsRouteProp = RouteProp<
  RootStackParamList,
  'TaskDetails'
>;

export default function TaskDetailsScreen() {
  const route = useRoute<TaskDetailsRouteProp>();
  const { taskId, taskTitle } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Task Details</Text>

      <Text style={styles.label}>Task:</Text>
      <Text style={styles.value}>{taskTitle}</Text>

      <Text style={styles.label}>Task ID:</Text>
      <Text style={styles.value}>{taskId}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 12,
  },
  value: {
    fontSize: 18,
    marginTop: 5,
    color: '#555',
  },
});