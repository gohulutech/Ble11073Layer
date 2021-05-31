const noble = require("@abandonware/noble");
const http = require("http");
const hostname = "127.0.0.1";
const port = 3000;

noble.on("stateChange", async (state) => {
  if (state === "poweredOn") {
    console.log("Started scanning");
    await noble.startScanningAsync([], false);
  }
});

noble.on("discover", async (peripheral) => {
  if (peripheral.id === "036298d3b0dc43f7ac0613379ea38925") {
    try {
      await noble.stopScanningAsync();
      await peripheral.connectAsync();

      const led0 = await peripheral.discoverSomeServicesAndCharacteristicsAsync(
        ["f000111004514000b000000000000000"],
        ["f000111104514000b000000000000000"]
      );

      let buffer = new ArrayBuffer(1);
      let view = new Uint8Array(buffer);
      view[0] = 0x00;
      await led0.characteristics[0].writeAsync(view, false);
      const services =
        await peripheral.discoverAllServicesAndCharacteristicsAsync();

      console.log(
        `${peripheral.id} ${peripheral.address} (${peripheral.advertisement.localName})`
      );

      //   await peripheral.disconnectAsync();
      //   process.exit(0);
    } catch (error) {
      console.log(error);
    }
  }
});

const server = http.createServer((req, res) => {
  //Set the response HTTP header with HTTP status and Content type
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end("Hello World\n");
});

//listen for request on port 3000, and as a callback function have the port listened on logged
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
