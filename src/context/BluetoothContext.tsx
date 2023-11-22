import React, { createContext, useContext, useEffect, ReactNode } from "react";
import useBLE, { BluetoothLowEnergyApi } from "../hooks/useBle";

interface BluetoothContextProps {
  bluetooth: BluetoothLowEnergyApi;
}

const BluetoothContext = createContext<BluetoothContextProps | undefined>(
  undefined
);

interface BluetoothProviderProps {
  children: ReactNode;
}

export const BluetoothProvider: React.FC<BluetoothProviderProps> = ({
  children,
}) => {
  const bluetooth = useBLE();

  useEffect(() => {
    // Puedes realizar acciones adicionales al montar/desmontar el contexto aquí
    return () => {
      // Acciones al desmontar el contexto
    };
  }, []);

  return (
    <BluetoothContext.Provider value={{ bluetooth }}>
      {children}
    </BluetoothContext.Provider>
  );
};

export const useBluetooth = () => {
  const context = useContext(BluetoothContext);
  if (!context) {
    throw new Error("useBluetooth debe usarse dentro de BluetoothProvider");
  }
  return context.bluetooth;
};
