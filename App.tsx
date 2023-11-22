import { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import RNBluetoothClassic, {
  BluetoothEventType,
} from "react-native-bluetooth-classic";
import useBLE from "./src/hooks/useBle";
import DeviceModal from "./src/components/DeviceConnectionModal";

export default function App() {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const {
    requestPermissions,
    scanForPeripherals,
    connectToDevice,
    sendMessage,
    disconnect,
    allDevices,
    connectedDevice,
  } = useBLE();

  const scanForDevices = async () => {
    const isPermissionsEnabled = await requestPermissions();
    if (isPermissionsEnabled) {
      console.log("Los permisos están habilitados");
      await scanForPeripherals();
    }
  };

  const hideModal = () => {
    setIsModalVisible(false);
  };

  const openModal = async () => {
    scanForDevices();
    setIsModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.heartRateTitleWrapper}>
        <Text style={styles.heartRateTitleText}>
          {connectedDevice
            ? `Now you're connected to ${connectedDevice.name}`
            : "Por favor, escanea el modulo HC-05"}
        </Text>
      </View>
      <TouchableOpacity onPress={openModal} style={styles.ctaButton}>
        <Text style={styles.ctaButtonText}>{"Connect"}</Text>
      </TouchableOpacity>
      <DeviceModal
        closeModal={hideModal}
        visible={isModalVisible}
        connectToPeripheral={connectToDevice}
        devices={allDevices}
      />
      <TouchableOpacity
        onPress={() => {
          if (connectedDevice) {
            sendMessage(
              connectedDevice.address,
              "11111,00000,00000,00000,00000,00000,00000,00000,11111,00000,00000,00000,00000,00000,00000,00000,11111,00000,00000,00000,00000,00000,00000,00000,11111,00000,00000,00000,00000,00000,00000,00000,11111,00000,00000,00000,00000,00000,00000,00000,11111,00000,00000,00000,00000,00000,00000,00000,11111,00000,00000,00000,00000,00000,00000,00000,11111,00000,00000,00000,00000,00000,11111,11111" +
                "\n"
            );
          } else {
            console.log("No estás conectado");
          }
        }}
        style={styles.ctaButton}
      >
        <Text style={styles.ctaButtonText}>{"Send data"}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={async () => {
          if (connectedDevice) {
            if (await disconnect(connectedDevice.address))
              console.log("Deconectado satisfactoriamente");
          } else {
            console.log("No estás conectado");
          }
        }}
        style={styles.ctaButton}
      >
        <Text style={styles.ctaButtonText}>{"Disconnect"}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  heartRateTitleWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  heartRateTitleText: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginHorizontal: 20,
    color: "black",
  },
  heartRateText: {
    fontSize: 25,
    marginTop: 15,
  },
  ctaButton: {
    backgroundColor: "#FF6060",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    marginHorizontal: 20,
    marginBottom: 5,
    borderRadius: 8,
  },
  ctaButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
});
