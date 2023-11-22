import { NavigationContainer } from "@react-navigation/native";
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from "@react-navigation/native-stack";
import Main from "./src/modules/Main";
import ConnectDevice from "./src/modules/ConnectDevice";
import { StatusBar } from "expo-status-bar";
import { Text, TouchableOpacity } from "react-native";
import { BluetoothProvider } from "./src/context/BluetoothContext";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <BluetoothProvider>
      <StatusBar style="dark" />
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Main">
          <Stack.Screen
            name="Main"
            component={Main}
            options={({ navigation }) => ({
              headerTitle: () => <Text>LCD app</Text>,
              headerRight: () => (
                <TouchableOpacity
                  onPress={() => navigation.navigate("Bluetooth")}
                >
                  <Text>Escanear dispositivo</Text>
                </TouchableOpacity>
              ),
            })}
          />
          <Stack.Screen
            name="Bluetooth"
            component={ConnectDevice}
            options={{ title: "Conexión con modulo" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </BluetoothProvider>
  );
}
