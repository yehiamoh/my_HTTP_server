import * as net from "net";
import * as fs from "fs";

const args = process.argv.slice(2);
//The process.argv property returns an array containing the command-line arguments passed when the Node.js process was launched. The first element will be execPath. See process.argv0 if access to the original value of argv[0] is needed. The second element will be the path to the JavaScript file being executed. The remaining elements will be any additional command-line arguments.

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

//Uncomment this to pass the first stage
const server = net.createServer((socket: net.Socket) => {
  socket.on("close", () => {
    socket.end();
  });

  //socket.write(Buffer.from(`HTTP/1.1 200 OK\r\n\r\n`));

  /**
   * socket.write() : send data through socket connection
   *
   * buffer.from() : convert string to buffer for efficient transmission
   *
   * A Buffer is a raw binary data storage, which is useful for sending and receiving data over network protocols like TCP.
   *
   *
   */

  socket.on("data", (data) => {
    const request = data.toString();
    const [headers, requestBody] = request.split("\r\n\r\n");
    const requestLines = headers.split("\r\n");
    const requestLine = requestLines[0];
    const [method, url] = requestLine.split(" ");
    const query = url.split("/")[2];

    let responseText: string = "";

    let userAgentHeaderValue: string | undefined = requestLines.find((line) => {
     return line.startsWith("User-Agent:");
    });

    if (url === "/") {
      responseText = "HTTP/1.1 200 OK\r\n\r\n";
    } else if (url === `/echo/${query}`) {
      responseText = `HTTP/1.1 200 OK\r\nContent-Type:text/palin\r\nContent-Length:${query.length}\r\n\r\n${query}`;
    } else if (url === "/user-agent" && userAgentHeaderValue) {
      responseText = `HTTP/1.1 200 OK\r\nContent-Type:text/palin\r\nContent-Length:${
        userAgentHeaderValue!.length
      }\r\n\r\n${userAgentHeaderValue}}`;
    } else if (url === "/files/" && args[0] === "--directory") {
      const directory = args[1];
      const fileName = url.split("/")[2]; // ex : ......localhost:4221  files foo    file name the third elemnt in the array foo
      const filePath = directory + fileName;
      if (method === "GET") {
        try {
          const content = fs.readFileSync(filePath);
          responseText = `HTTP/1.1 200 OK\r\nContent-Type:applicatiopn/octet-system\r\nContent-Length:${content.length}\r\n\r\n${content}`;
        } catch (error) {
          responseText = "HTTP/1.1 404 Not Found\r\n\r\n";
        }
      }else if(method==="POST"){
        try{
          fs.writeFileSync(filePath,requestBody,'utf-8');
          responseText=`HTTP/1.1 201 Created\r\n\r\n`
        }catch{
          responseText = "HTTP/1.1 404 Not Found\r\n\r\n";
        }
      }
    } else {
      responseText = "HTTP/1.1 404 Not Found\r\n\r\n";
    }

    const responseBuffer = Buffer.from(responseText);
    socket.write(responseBuffer);
    socket.end();

    /**
     * socket.on('data', ...) :This listens for the data event on the socket. The data event is triggered when the server receives data from the client. The data is typically a Buffer object.
     */
  });
});

server.listen(4221, "localhost");
