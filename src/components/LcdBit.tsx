import React from "react";

import { TouchableOpacity } from "react-native";

import { theme } from "../theme/theme";

/*we can use width: 20% but the size is static, so if we add a margin, 
by the nature of the percentage, the child broke its parent, if we
use flex: 0.2 is like 20% but the child can be resized :like: */

type Props = {
  byteIndex: number;
  rowIndex: number;
  columnIndex: number;
  bit: string;
  handleBit: (
    byteIndex: number,
    rowIndex: number,
    columnIndex: number,
    bit: string
  ) => void;
};

const LcdBit = ({
  byteIndex,
  rowIndex,
  columnIndex,
  bit,
  handleBit,
}: Props) => {
  return (
    <TouchableOpacity
      style={{
        flex: 0.2,
        backgroundColor: bit === "0" ? theme.colors.mediumBlue : "white",
      }}
      onPress={() => {
        handleBit(byteIndex, rowIndex, columnIndex, bit);
      }}
    />
  );
};

export default LcdBit;
