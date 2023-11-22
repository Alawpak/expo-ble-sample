import { View } from "react-native";
import AppBar from "../components/AppBar";
import LcdView from "../components/LcdView";

export const Main = () => {
  return (
    <View style={{ flex: 1 }}>
      <AppBar />
      <LcdView />
    </View>
  );
};
