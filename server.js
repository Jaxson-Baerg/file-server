const net = require("net");

const server = net.createServer();

let clients = [];

server.on("connection", client => {
  clients.push(client);
  console.log("New client detected!");

  client.write("ready");

  client.setEncoding("utf8");
  client.on("data", data => {
    console.log("Client:", data);
    if (data === "exit") {
      for (let i of clients) {
        i.destroy();
      }
      server.close(() => {
        console.log("Server closed.");
      });
    }
  });
});

server.listen(3000, () => {
  console.log("Server listening on port 3000.");
});