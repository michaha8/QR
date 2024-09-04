import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { db } from '../fireBaseConfig';
import { doc, getDoc } from 'firebase/firestore';

export default function DeviceVerifier({ deviceId, onVerificationComplete }) {
  const [verificationStatus, setVerificationStatus] = useState(null);

  useEffect(() => {
    verifyDevice();
  }, [deviceId]);

  const verifyDevice = async () => {
    if (!deviceId) {
      setVerificationStatus('Invalid device ID');
      onVerificationComplete(false, 'Invalid device ID');
      return;
    }

    try {
      const deviceRef = doc(db, 'devices', deviceId);
      const docSnap = await getDoc(deviceRef);

      if (docSnap.exists()) {
        setVerificationStatus('Device verified successfully');
        onVerificationComplete(true);
      } else {
        setVerificationStatus('Houston, we have a problem');
        onVerificationComplete(false, 'Houston, we have a problem');
      }
    } catch (error) {
      console.error('Error verifying device:', error);
      setVerificationStatus(`Error verifying device: ${error.message}`);
      onVerificationComplete(false, `Error verifying device: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      {verificationStatus && <Text style={styles.status}>{verificationStatus}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  status: {
    marginBottom: 20,
    fontSize: 16,
    textAlign: 'center',
  },
});