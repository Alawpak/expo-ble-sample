import React, { ReactNode } from "react";

import { StyleSheet, View } from "react-native";

type Props = {
  index: number;
  children: ReactNode;
};

const LcdByte = ({ index, children }: Props) => {
  return (
    <View style={{ marginBottom: index < 4 ? 2 : 0, ...styles.byteContainer }}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  byteContainer: {
    flexDirection: "column",
    width: "25%",
    height: "50%",
    padding: 7,
  },
});

export default LcdByte;
