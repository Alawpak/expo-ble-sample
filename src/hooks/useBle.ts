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
  sendMessage(deviceAdress: string, message: string): Promise<void>;
  connectToDevice(device: BluetoothDevice): Promise<void>;
  disconnect(deviceAdress: string): Promise<boolean>;
  allDevices: BluetoothDevice[];
  connectedDevice: BluetoothDevice | null;
}

function useBLE(): BluetoothLowEnergyApi {
  const [allDevices, setAllDevices] = useState<BluetoothDevice[]>([]);
  const [connectedDevice, setConnectedDevice] =
    useState<BluetoothDevice | null>(null);

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

  const connectToDevice = async (device: BluetoothDevice) => {
    try {
      console.log("Start conecting...");
      const deviceConnection = await RNBluetoothClassic.connectToDevice(
        device.address
      );
      if (deviceConnection) {
        setConnectedDevice(deviceConnection);
        console.log(
          "Usted se ha conectado al dispositivo: ",
          deviceConnection.name
        );
      }
    } catch (e) {
      console.log("FAILED TO CONNECT", e);
    }
  };

  const sendMessage = async (deviceAdress: string, message: string) => {
    try {
      const isConected = await RNBluetoothClassic.isDeviceConnected(
        deviceAdress
      );
      if (isConected) {
        console.log("Enviando mensaje...");
        const itWasSent = await RNBluetoothClassic.writeToDevice(
          deviceAdress,
          message,
          "utf-8"
        );
        console.log(itWasSent);
      }
    } catch (e) {
      console.log("FAILED TO SEND DATA", e);
    }
  };

  const disconnect = async (deviceAdress: string): Promise<boolean> => {
    try {
      const itWasDisconnected = await RNBluetoothClassic.disconnectFromDevice(
        deviceAdress
      );
      return itWasDisconnected;
    } catch (e) {
      console.log("Error al desconectar", e);
      return false;
    }
  };

  return {
    requestPermissions,
    connectToDevice,
    sendMessage,
    disconnect,
    scanForPeripherals,
    allDevices,
    connectedDevice,
  };
}

export default useBLE;
