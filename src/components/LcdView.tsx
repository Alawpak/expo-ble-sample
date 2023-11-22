import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { ReactNativeZoomableView } from "@openspacelabs/react-native-zoomable-view";

import { INIT_BYTE_ARRAY } from "../commons/constants/constants";
import { theme } from "../theme/theme";

import LcdByte from "./LcdByte";
import LcdBits from "./LcdBits";
import LcdBit from "./LcdBit";
import useBLE from "../hooks/useBle";
import { useBluetooth } from "../context/BluetoothContext";

const LcdView = () => {
  const [bytes, setBytes] = useState<string[][][]>([...INIT_BYTE_ARRAY]);
  const [bytesMessage, setBytesMessage] = useState<string>("");
  const { sendMessage, connectedDevice } = useBluetooth();

  const handleBit = (
    byteIndex: number,
    rowIndex: number,
    columnIndex: number,
    bit: string
  ) => {
    let newBytes = [...bytes];
    let newBit: number = parseInt(bit);
    newBit = newBit === 0 ? 1 : 0;

    newBytes[byteIndex][rowIndex][columnIndex] = String(newBit);
    setBytes([...newBytes]);
  };

  //this useEffect is when bytesState changes and to send data
  useEffect(() => {
    const bytesAsString: string = bytes.join();
    let newArray = [];

    const exportBytesAsString: string[] = bytesAsString.split(",");

    for (let i = 0; i < exportBytesAsString.length; i += 5) {
      let grupo = exportBytesAsString.slice(i, i + 5);
      newArray.push(grupo.join(""));
    }

    setBytesMessage(newArray.join());
  }, [bytes]);

  return (
    <View style={styles.container}>
      <View style={styles.lcdContainer}>
        <ReactNativeZoomableView
          maxZoom={4}
          minZoom={1}
          zoomStep={1}
          bindToBorders={true}
          //onZoomAfter={this.logOutZoomState}
          style={styles.zoomableView}
        >
          {bytes.map((byte, byteIndex) => (
            <LcdByte key={byteIndex} index={byteIndex}>
              {byte.map((bits, rowIndex) => (
                <LcdBits key={rowIndex}>
                  {bits.map((bit, columnIndex) => (
                    <LcdBit
                      key={columnIndex}
                      {...{ bit, byteIndex, rowIndex, columnIndex, handleBit }}
                    />
                  ))}
                </LcdBits>
              ))}
            </LcdByte>
          ))}
        </ReactNativeZoomableView>
      </View>
      <TouchableOpacity
        style={styles.sendBtn}
        onPress={() => {
          if (connectedDevice) {
            sendMessage(connectedDevice.address, bytesMessage + "\n");
          } else {
            console.log("No estás conectado");
          }
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: "bold", color: "white" }}>
          {"Send data"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    paddingHorizontal: 10,
  },
  lcdContainer: {
    flex: 0.5,
    flexDirection: "row",
    borderColor: theme.colors.black,
    borderWidth: 10,
    borderRadius: 10,
  },
  zoomableView: {
    flexDirection: "row",
    flex: 1,
    width: "100%",
    flexWrap: "wrap",
    backgroundColor: theme.colors.blue,
  },
  sendBtn: {
    backgroundColor: theme.colors.mediumBlue,
    padding: 5,
    marginTop: 5,
    width: "80%",
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
  },
});

export default LcdView;
