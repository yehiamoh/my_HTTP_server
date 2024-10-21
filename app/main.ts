import * as net from "net";

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

 //Uncomment this to pass the first stage
 const server = net.createServer((socket:net.Socket) => {
   socket.on("close", () => {
     socket.end();
   });
   socket.write(Buffer.from(`HTTP/1.1 200 OK\r\n\r\n`));
   /**
    * socket.write() : send data through socket connection
    * 
    * buffer.from() : convert string to buffer for efficient transmission
    * 
    * A Buffer is a raw binary data storage, which is useful for sending and receiving data over network protocols like TCP.
    * 
    *   
    */

   socket.on('data',(data)=>{
    const request =data.toString();
    const path= request.split(' ')[1];
    const responseText = path === '/' ? 'HTTP/1.1 200 OK\r\n\r\n' : 'HTTP/1.1 404 Not Found\r\n\r\n';
    const responseBuffer =Buffer.from(responseText);
    socket.write(responseBuffer);
    socket.end();

/**
 * 
 * socket.on('data', ...) :This listens for the data event on the socket. The data event is triggered when the server receives data from the client. The data is typically a Buffer object.
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 */

  });

 });

 server.listen(4221, "localhost");



 