import React from 'react';
import { View, StyleSheet } from 'react-native';

const ROOM_SIZE = 10; // 10x10 grid

export default function MapComponent({ userLocation }) {
  const { row, column } = userLocation;

  return (
    <View style={styles.container}>
      {[...Array(ROOM_SIZE)].map((_, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {[...Array(ROOM_SIZE)].map((_, colIndex) => (
            <View 
              key={colIndex} 
              style={[
                styles.cell,
                rowIndex === 3 && colIndex === 1 ? styles.userPosition : null
              ]}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 300,
    height: 300,
    borderWidth: 1,
    borderColor: 'black',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  cell: {
    flex: 1,
    borderWidth: 0.5,
    borderColor: 'gray',
  },
  userPosition: {
    backgroundColor: 'red',
  },
});