import { StyleSheet, Text, View } from "react-native";
import Constants from "expo-constants";
import { theme } from "../theme/theme";

const AppBar = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>LCD app</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.blue,
    paddingTop: Constants.statusBarHeight + theme.paddings.paddingY,
    paddingLeft: theme.paddings.paddingX,
    paddingBottom: theme.paddings.paddingY,
  },
  title: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.subHeading,
  },
});

export default AppBar;
