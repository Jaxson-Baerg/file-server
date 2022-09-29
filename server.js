const net = require("net");
const fs = require("fs");

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
    } else {
      //console.log(data);
      if (data.includes("---")) {
        main(data.slice(0, -3)).then((fileInfo) => {
          if (fileInfo) {
            client.write(`File info:\n${fileInfo}`);
          } else {
            client.write(`Error: File not found.`);
          }
          client.write(`ready`);
        });
      }
    }
  });
});

const pullData = (data) => {
  return new Promise((resolve, reject) => {
    let encoding = "";
    if (data.slice(data.length - 3) === "png" || data.slice(data.length - 3) === "jpg") {
      encoding = "Base64";
    } else {
      encoding = "utf8";
    }
    fs.readFile(`${data}`, `${encoding}`, (err, contents) => {
      resolve(contents);
    });
  });
};

const checkPath = (data) => {
  return new Promise((resolve, reject) => {
    fs.rename(`${data}`, `${data}`, async (err) => {
      if (err) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
};

const main = async (data) => {
  let fileInfo;
  if (await checkPath(data)) {
    fileInfo = await pullData(data)
  } else {
    return false;
  }
  return fileInfo;
};

server.listen(3000, () => {
  console.log("Server listening on port 3000.");
});