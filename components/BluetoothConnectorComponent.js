import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { BleManager } from 'react-native-ble-plx';

const manager = new BleManager();

export default function BluetoothComponent() {
  const [deviceInfo, setDeviceInfo] = useState(null);
  const [error, setError] = useState(null);

  const scanAndConnect = async () => {
    try {
      const device = await manager.startDeviceScan(null, null, (error, device) => {
        if (error) {
          setError('שגיאה בסריקת מכשירים');
          return;
        }
        if (device.name === 'YourDeviceName') {
          manager.stopDeviceScan();
          return device;
        }
      });

      await device.connect();
      const services = await device.discoverAllServicesAndCharacteristics();
      const batteryService = services.find(service => service.uuid === 'battery_service_uuid');
      if (batteryService) {
        const batteryLevel = await batteryService.readCharacteristic('battery_level_characteristic_uuid');
        setDeviceInfo({ name: device.name, batteryLevel: batteryLevel.value });
      }
    } catch (err) {
      setError('שגיאה בהתחברות למכשיר');
    }
  };

  return (
    <View style={styles.container}>
      <Button title="התחבר למכשיר" onPress={scanAndConnect} />
      {deviceInfo && (
        <Text>רמת סוללה של {deviceInfo.name}: {deviceInfo.batteryLevel}%</Text>
      )}
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  error: {
    color: 'red',
  },
});