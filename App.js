import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TextInput, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useAsyncStorageTasks = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      if (storedTasks !== null) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const saveTasks = async (updatedTasks) => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  };

  return { tasks, saveTasks };
};

export default function App() {
  const { tasks, saveTasks } = useAsyncStorageTasks();
  const [task, setTask] = useState('');
  const [ukTime, setUkTime] = useState(null);

  const handleAddTask = () => {
    if (task.trim() === '') {
      return; // Prevent adding empty task
    }
    const updatedTasks = [...tasks, task];
    saveTasks(updatedTasks);
    setTask('');
  };

  const handleDeleteTask = index => {
    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 1);
    saveTasks(updatedTasks);
  };

  const sendHttpRequest = async () => {
    try {
      const response = await fetch('https://worldtimeapi.org/api/timezone/Europe/London');

      if (!response.ok) {
        throw new Error('HTTP request failed');
      }

      const data = await response.json();

      // Extract date and time components
      const datetime = new Date(data.datetime);
      const date = datetime.toISOString().split('T')[0]; // yyyy-mm-dd
      const time = datetime.toTimeString().split(' ')[0]; // hh:mm:ss

      setUkTime({ date, time });
    } catch (error) {
      console.error('Error sending HTTP request:', error);
    }
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.taskContainer}>
      <Text style={styles.task}>{index + 1}. {item}</Text>
      <Button title="Delete" onPress={() => handleDeleteTask(index)} />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput
          style={styles.input}
          value={task}
          onChangeText={text => setTask(text)}
          placeholder="Enter task"
        />
        <Button title="Add Task" onPress={handleAddTask} />
      </View>
      <FlatList
        data={tasks}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        style={styles.taskList}
      />
      <Button title="UK Date & Time" onPress={sendHttpRequest} />
      {ukTime && (
        <View style={styles.ukTimeContainer}>
          <Text style={styles.ukTime}>Date: {ukTime.date}</Text>
          <Text style={styles.ukTime}>Time: {ukTime.time}</Text>
        </View>
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginRight: 10,
    paddingHorizontal: 10,
  },
  taskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  task: {
    flex: 1,
    fontSize: 16,
  },
  taskList: {
    flex: 1,
    width: '100%',
  },
  ukTimeContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  ukTime: {
    fontSize: 18,
  },
});
