import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  Pressable,
  StyleSheet,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Tasks'>;

type Task = {
  id: string;
  title: string;
};

export default function TasksScreen({ navigation }: Props) {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState('');

  const addTask = () => {
    if (!task.trim()) {
      setError('Please enter a task.');
      return;
    }

    const newTask: Task = {
      id: Date.now().toString(),
      title: task.trim(),
    };

    setTasks((currentTasks) => [...currentTasks, newTask]);
    setTask('');
    setError('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Tasks</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter a new task"
        value={task}
        onChangeText={(text) => {
          setTask(text);
          setError('');
        }}
        accessibilityLabel="New task"
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Button title="Add Task" onPress={addTask} />

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            style={styles.taskItem}
            onPress={() =>
              navigation.navigate('TaskDetails', {
                taskId: item.id,
                taskTitle: item.title,
              })
            }
            accessibilityRole="button"
            accessibilityLabel={`View details for ${item.title}`}
          >
            <Text style={styles.taskText}>{item.title}</Text>
          </Pressable>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No tasks added yet.</Text>
        }
      />
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
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#FFF',
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  taskItem: {
    padding: 15,
    backgroundColor: '#FFF',
    borderRadius: 8,
    marginTop: 10,
  },
  taskText: {
    fontSize: 16,
  },
  empty: {
    textAlign: 'center',
    color: '#777',
    marginTop: 30,
  },
});