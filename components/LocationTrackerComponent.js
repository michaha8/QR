import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapComponent from './RoomMapComponent';

export default function LocationTrackerComponent({ userLocation }) {
  return (
    <View style={styles.container}>
      <MapComponent userLocation={userLocation} />
      <Text style={styles.locationText}>
        מיקום נוכחי: שורה {userLocation.row}, עמודה {userLocation.column}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationText: {
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },
});