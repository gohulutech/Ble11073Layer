import * as noble from "@abandonware/noble";
import { BleState } from "../constants/BleState";

const hostname = "127.0.0.1";
const port = 3000;

const changeLedValue = async (peripheral: noble.Peripheral) => {
  const led0 = await peripheral.discoverSomeServicesAndCharacteristicsAsync(
    ["f000111004514000b000000000000000"],
    ["f000111104514000b000000000000000"]
  );

  if (!led0) return;

  const buffer = await led0.characteristics[0].readAsync();
  buffer[0] = buffer[0] === 0x00 ? 0x01 : 0x00;
  await led0.characteristics[0].writeAsync(buffer, false);
};

const onBleDiscover = async (peripheral: noble.Peripheral): Promise<void> => {
  if (peripheral.id !== "036298d3b0dc43f7ac0613379ea38925") return;

  try {
    await noble.stopScanningAsync();
    await peripheral.connectAsync();

    await changeLedValue(peripheral);
    //await readOximeterValue(peripheral);
    const services =
      await peripheral.discoverAllServicesAndCharacteristicsAsync();

    console.log(
      `${peripheral.id} ${peripheral.address} (${peripheral.advertisement.localName})`
    );

    //   await peripheral.disconnectAsync();
    //   process.exit(0);
  } catch (error) {
    console.error(error);
  }
};

const onBleStateChange = async (state: BleState) => {
  if (state !== BleState.POWEREDON) {
    console.error("Bluetooth not enabled");
    return;
  }

  console.log("Started scanning");
  await noble.startScanningAsync();
};

const readOximeterValue = async (peripheral: noble.Peripheral) => {
  const oximeter = await peripheral.discoverSomeServicesAndCharacteristicsAsync(
    ["f000114004514000b000000000000000"],
    ["f000114104514000b000000000000000"]
  );

  if (!oximeter) return;

  const subscription = await oximeter[0].characteristics[0].subscribe();
  oximeter[0].characteristics[0].on("data", (data, isNotification) => {
    console.log(data);
  });
  const buffer = await oximeter[0].characteristics[0].readAsync();
  // console.log(buffer);
};

export const Ble = {
  start: () => {
    noble.on("stateChange", onBleStateChange);
    noble.on("discover", onBleDiscover);
  },
};
