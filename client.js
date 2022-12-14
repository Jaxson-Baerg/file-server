const net = require("net");
const readline = require("readline");

let conn;

const toConnect = () => {
  return new Promise((resolve, reject) => {
    conn = net.createConnection({
      //host: "8.tcp.ngrok.io",
      //port: 18624
      host: "localhost",
      port: 3000
    });
    resolve(conn);
  });
};

const filePull = (rl) => {
  return new Promise((resolve, reject) => {
    rl.question(`Input file path that you want to pull(./example.txt):\n: `, (answer) => {
      rl.close();
      resolve(answer += "---");
    });
  });
};

const main = async () => {
  await toConnect().then(() => {
    conn.on("connect", () => {
      console.log("Connected to server!");
      conn.write("Client active.");
    });

    conn.on("end", () => {
      console.log("\nServer Teminated...");
      process.exit();
    });

    conn.setEncoding("utf8");
    let answ;
    conn.on("data", async data => {
      if (data.includes("File")) {
        console.log(data);
      }

      if (data === "ready") {
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout
        });

        process.stdin.on("keypress", (str, key) => {
          if (key.ctrl && key.name === "c") {
            console.log("\nQuitting...");
            process.exit();
          }
        });
        
        conn.write(await filePull(rl));
      }
    });
  });
  //
};

main().then(() => {

});