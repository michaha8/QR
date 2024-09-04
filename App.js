import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, SafeAreaView, StatusBar } from 'react-native';
import { Camera } from 'expo-camera';
import * as Location from 'expo-location';
import QRScanner from './components/QRScannerComponent';
import DeviceVerifier from './components/DeviceVerifierComponent';
import { db } from './fireBaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import { getDatabase, ref, onValue } from 'firebase/database';
import LocationTrackerComponent from './components/LocationTrackerComponent';

export default function App() {
  const [deviceId, setDeviceId] = useState(null);
  const [isDeviceVerified, setIsDeviceVerified] = useState(false);
  const [hasPermissions, setHasPermissions] = useState(false);
  const [userLocation, setUserLocation] = useState({ row: 0, column: 0 });
  const [verificationError, setVerificationError] = useState(null);

  useEffect(() => {
    (async () => {
      const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
      const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
      
      if (cameraStatus === 'granted' && locationStatus === 'granted') {
        setHasPermissions(true);
      } else {
        Alert.alert('הרשאות חסרות', 'אנא אשר את כל ההרשאות הנדרשות כדי להשתמש באפליקציה.');
      }
    })();

    const db = getDatabase();
    const locationRef = ref(db, 'userLocation');
    const unsubscribe = onValue(locationRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setUserLocation(data);
      }
    });

    return () => unsubscribe();
  }, []);

  // const extractDeviceInfo = (url) => {
  //   const params = new URLSearchParams(url.split('?')[1]);
  //   const sn = params.get('sn');
  //   const mtm = params.get('mtm');
  //   return { sn, mtm };
  // };

  const handleQRScan = async (data) => {
    if (data && typeof data === 'string') {
      console.log(data);
      // const { sn, mtm } = extractDeviceInfo(data);
      // const deviceId = `${sn}_${mtm}`;
    
      setDeviceId(data);
      setIsDeviceVerified(false);  // Reset verification status when new QR is scanned
   
      try {
        await setDoc(doc(db, 'ScannedQr', data), {
          id: deviceId,
          scannedAt: new Date(),
        });
        console.log('Device saved to Firestore');
      } catch (error) {
        console.error('Error saving device to Firestore:', error);
        Alert.alert('שגיאה', 'אירעה שגיאה בשמירת המכשיר');
      }
    } else {
      console.error('Invalid QR code data:', data);
      setDeviceId(null);
    }
    setVerificationError(null); // Reset verification error on new scan
  };

  const handleDeviceVerification = (isVerified, error = null) => {
    setIsDeviceVerified(isVerified);
    setVerificationError(error);
  };

  const resetScan = () => {
    setDeviceId(null);
    setIsDeviceVerified(false);
    setVerificationError(null);
  };

  const retryVerification = () => {
 
    setIsDeviceVerified(false);
    setVerificationError(null);
  };

  if (!hasPermissions) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>מבקש הרשאות...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        {!deviceId ? (
          <View style={styles.contentContainer}>
            <Text style={styles.title}>סורק קוד QR</Text>
            <View style={styles.scannerContainer}>
              <QRScanner onScan={handleQRScan} />
            </View>
            <TouchableOpacity style={styles.button} onPress={() => handleQRScan(
              '123')}>
              <Text style={styles.buttonText}>סימולציה: הגדר מזהה מכשיר</Text>
            </TouchableOpacity>
          </View>
        ) : !isDeviceVerified ? (
          <View style={styles.contentContainer}>
            <Text style={styles.title}>אימות מכשיר</Text>
            <DeviceVerifier 
              deviceId={deviceId} 
              onVerificationComplete={handleDeviceVerification} 
            />
            {verificationError && (
              <View>
                <Text style={styles.errorText}>{verificationError}</Text>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.button} onPress={retryVerification}>
                    <Text style={styles.buttonText}>נסה שוב</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.button} onPress={resetScan}>
                    <Text style={styles.buttonText}>סרוק שוב</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.contentContainer}>
            <Text style={styles.title}>מעקב מיקום</Text>
            <LocationTrackerComponent userLocation={userLocation} />
            <TouchableOpacity style={styles.button} onPress={resetScan}>
              <Text style={styles.buttonText}>סרוק שוב</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  contentContainer: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  scannerContainer: {
    width: '100%',
    aspectRatio: 1,
    marginBottom: 20,
    overflow: 'hidden',
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 20,
    width: '88%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  locationContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 10,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});