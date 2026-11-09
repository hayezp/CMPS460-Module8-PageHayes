
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import type { RootStackParamList, TabParamList } from '../App';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Tasks'>,
  NativeStackScreenProps<RootStackParamList>
>;

type Task = {
  id: string;
  title: string;
};

type TaskItemProps = {
  task: Task;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

function TaskItem({ task, onView, onEdit, onDelete }: TaskItemProps) {
  return (
    <View style={styles.taskItem}>
      <Pressable
        onPress={onView}
        accessibilityRole="button"
        accessibilityLabel={`View details for ${task.title}`}
        style={styles.taskTitleButton}
      >
        <Text style={styles.taskText}>{task.title}</Text>
        <Text style={styles.detailsHint}>Tap to view details</Text>
      </Pressable>

      <View style={styles.buttonRow}>
        <Pressable
          style={[styles.smallButton, styles.editButton]}
          onPress={onEdit}
          accessibilityRole="button"
          accessibilityLabel={`Edit ${task.title}`}
        >
          <Text style={styles.buttonText}>Edit</Text>
        </Pressable>

        <Pressable
          style={[styles.smallButton, styles.deleteButton]}
          onPress={onDelete}
          accessibilityRole="button"
          accessibilityLabel={`Delete ${task.title}`}
        >
          <Text style={styles.buttonText}>Delete</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function TasksScreen({ navigation }: Props) {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editedTitle, setEditedTitle] = useState('');

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const savedTasks = await AsyncStorage.getItem('myTasks');
        if (savedTasks !== null) {
          setTasks(JSON.parse(savedTasks) as Task[]);
        }
      } catch {
        setError('Could not load saved tasks.');
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, []);

  const saveTasks = async (
    updatedTasks: Task[],
    successMessage: string
  ): Promise<boolean> => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await AsyncStorage.setItem(
        'myTasks',
        JSON.stringify(updatedTasks)
      );
      setTasks(updatedTasks);
      setSuccess(successMessage);
      return true;
    } catch {
      setError('Could not save changes. Please try again.');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const addTask = async () => {
    if (!task.trim()) {
      setSuccess('');
      setError('Please enter a task.');
      return;
    }

    const newTask: Task = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      title: task.trim(),
    };

    const saved = await saveTasks(
      [...tasks, newTask],
      'Task added successfully!'
    );

    if (saved) {
      setTask('');
    }
  };

  const editTask = async (taskId: string) => {
    if (!editedTitle.trim()) {
      setSuccess('');
      setError('Task title cannot be empty.');
      return;
    }

    const updatedTasks = tasks.map((item) =>
      item.id === taskId
        ? { ...item, title: editedTitle.trim() }
        : item
    );

    const saved = await saveTasks(
      updatedTasks,
      'Task updated successfully!'
    );

    if (saved) {
      setEditingTaskId(null);
      setEditedTitle('');
    }
  };

  const deleteTask = async (taskId: string) => {
    const updatedTasks = tasks.filter((item) => item.id !== taskId);

    const saved = await saveTasks(
      updatedTasks,
      'Task deleted successfully!'
    );

    if (saved && editingTaskId === taskId) {
      setEditingTaskId(null);
      setEditedTitle('');
    }
  };

  const confirmDelete = (item: Task) => {
    Alert.alert(
      'Delete Task',
      `Are you sure you want to delete "${item.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteTask(item.id),
        },
      ]
    );
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
          setSuccess('');
        }}
        accessibilityLabel="New task"
        editable={!loading && !saving}
      />

      <Pressable
        style={styles.addButton}
        onPress={addTask}
        disabled={loading || saving}
        accessibilityRole="button"
        accessibilityLabel="Add task"
        accessibilityState={{ disabled: loading || saving }}
      >
        <Text style={styles.buttonText}>Add Task</Text>
      </Pressable>

      {error ? (
        <Text style={styles.error} accessibilityRole="alert">
          {error}
        </Text>
      ) : null}

      {success ? (
        <Text style={styles.success} accessibilityLiveRegion="polite">
          {success}
        </Text>
      ) : null}

      {loading || saving ? (
        <View style={styles.loadingRow}>
          <ActivityIndicator />
          <Text style={styles.loadingText}>
            {loading ? 'Loading tasks...' : 'Saving changes...'}
          </Text>
        </View>
      ) : null}

      {!loading && (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <View>
              <TaskItem
                task={item}
                onView={() =>
                  navigation.navigate('TaskDetails', {
                    taskId: item.id,
                    taskTitle: item.title,
                  })
                }
                onEdit={() => {
                  setEditingTaskId(item.id);
                  setEditedTitle(item.title);
                  setError('');
                  setSuccess('');
                }}
                onDelete={() => confirmDelete(item)}
              />

              {editingTaskId === item.id && (
                <View style={styles.editContainer}>
                  <TextInput
                    style={styles.input}
                    value={editedTitle}
                    onChangeText={(text) => {
                      setEditedTitle(text);
                      setError('');
                      setSuccess('');
                    }}
                    placeholder="Edit task title"
                    accessibilityLabel="Edit task title"
                    editable={!saving}
                  />

                  <View style={styles.buttonRow}>
                    <Pressable
                      style={[styles.smallButton, styles.editButton]}
                      onPress={() => editTask(item.id)}
                      disabled={saving}
                      accessibilityRole="button"
                      accessibilityLabel="Save task changes"
                    >
                      <Text style={styles.buttonText}>Save Changes</Text>
                    </Pressable>

                    <Pressable
                      style={[styles.smallButton, styles.cancelButton]}
                      onPress={() => {
                        setEditingTaskId(null);
                        setEditedTitle('');
                        setError('');
                      }}
                      accessibilityRole="button"
                      accessibilityLabel="Cancel editing"
                    >
                      <Text style={styles.buttonText}>Cancel</Text>
                    </Pressable>
                  </View>
                </View>
              )}
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.empty}>No tasks added yet.</Text>
          }
          contentContainerStyle={styles.listContent}
        />
      )}
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
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#4361EE',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
  taskItem: {
    padding: 15,
    backgroundColor: '#FFF',
    borderRadius: 8,
    marginTop: 10,
  },
  taskTitleButton: {
    paddingVertical: 8,
  },
  taskText: {
    fontSize: 17,
    fontWeight: '600',
  },
  detailsHint: {
    color: '#666',
    fontSize: 12,
    marginTop: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  smallButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#4361EE',
  },
  deleteButton: {
    backgroundColor: '#C62828',
  },
  cancelButton: {
    backgroundColor: '#666',
  },
  editContainer: {
    backgroundColor: '#E8EDFF',
    padding: 12,
    borderRadius: 8,
    marginTop: 5,
  },
  error: {
    color: '#B00020',
    marginBottom: 10,
  },
  success: {
    color: '#187A35',
    marginBottom: 10,
    fontWeight: '500',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 12,
  },
  loadingText: {
    color: '#555',
  },
  empty: {
    textAlign: 'center',
    color: '#777',
    marginTop: 30,
  },
  listContent: {
    paddingBottom: 30,
  },
});
