/* eslint-disable no-bitwise */
import { useEffect, useMemo, useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";

import RNBluetoothClassic, {
  BluetoothDevice,
  BluetoothEventType,
} from "react-native-bluetooth-classic";

import * as ExpoDevice from "expo-device";

interface BluetoothLowEnergyApi {
  requestPermissions(): Promise<boolean>;
  scanForPeripherals(): Promise<boolean>;
  allDevices: any[];
}

function useBLE(): BluetoothLowEnergyApi {
  const [allDevices, setAllDevices] = useState<BluetoothDevice[]>([]);

  useEffect(() => {
    console.log(allDevices);
  }, [allDevices]);

  const requestAndroid31Permissions = async () => {
    const bluetoothScanPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      {
        title: "Location Permission",
        message: "Bluetooth Low Energy requires Location",
        buttonPositive: "OK",
      }
    );
    const bluetoothConnectPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      {
        title: "Location Permission",
        message: "Bluetooth Low Energy requires Location",
        buttonPositive: "OK",
      }
    );
    const fineLocationPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: "Location Permission",
        message: "Bluetooth Low Energy requires Location",
        buttonPositive: "OK",
      }
    );

    return (
      bluetoothScanPermission === "granted" &&
      bluetoothConnectPermission === "granted" &&
      fineLocationPermission === "granted"
    );
  };

  const requestPermissions = async () => {
    if (Platform.OS === "android") {
      if ((ExpoDevice.platformApiLevel ?? -1) < 31) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Permission",
            message: "Bluetooth Low Energy requires Location",
            buttonPositive: "OK",
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        const isAndroid31PermissionsGranted =
          await requestAndroid31Permissions();

        return isAndroid31PermissionsGranted;
      }
    } else {
      return true;
    }
  };

  const isDuplicteDevice = (
    devices: BluetoothDevice[],
    nextDevice: BluetoothDevice
  ) => devices.findIndex((device) => nextDevice.id === device.id) > -1;

  const scanForPeripherals = async () => {
    console.log("Start discovery");
    if (await RNBluetoothClassic.isBluetoothAvailable()) {
      RNBluetoothClassic.startDiscovery().then((devices) => {
        if (devices) {
          devices.forEach((device: BluetoothDevice) => {
            if (device && device.name?.includes("HC-05")) {
              console.log(device);
              setAllDevices((prevState: BluetoothDevice[]) => {
                if (!isDuplicteDevice(prevState, device)) {
                  return [...prevState, device];
                }
                return prevState;
              });
            }
          });
        }
      });
    } else {
      console.log("El bluetooth no está activado");
    }

    return false;
  };

  return {
    requestPermissions,
    scanForPeripherals,
    allDevices,
  };
}

export default useBLE;
