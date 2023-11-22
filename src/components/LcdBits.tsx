import React, { ReactNode } from "react";

import { StyleSheet, View } from "react-native";

type Props = {
  children: ReactNode;
};

const LcdBits = ({ children }: Props) => {
  return <View style={styles.bitsContainer}>{children}</View>;
};

const styles = StyleSheet.create({
  bitsContainer: {
    flexDirection: "row",
    columnGap: 1,
    height: "12.5%",
    flex: 1,
    paddingVertical: 1,
  },
});

export default LcdBits;
