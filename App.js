import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <View style={{width: 50, height: 50, backgroundColor: 'powderblue'}} />
      <Text>Hello World!</Text>
      <Text>Hello World!</Text>
      <Button
        title="Press me"
        onPress={() => alert('Button Pressed!')}    
      />
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
  },
});
