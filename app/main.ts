import * as net from "net";

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

 //Uncomment this to pass the first stage
 const server = net.createServer((socket:net.Socket) => {
   socket.on("close", () => {
     socket.end();
   });
   socket.write(Buffer.from(`HTTP/1.1 200 OK \r\n\r\n`));
   /**
    * socket.write() : send data through socket connection
    * 
    * buffer.from() : convert string to buffer for efficient transmission
    * 
    * A Buffer is a raw binary data storage, which is useful for sending and receiving data over network protocols like TCP.
    * 
    *   
    */

 });

 server.listen(4221, "localhost");



 