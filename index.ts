import { server } from "./server";
import { Ble } from "./sensor/Ble";

const hostname = "127.0.0.1";
const port = 3000;

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
  Ble.start();
});
