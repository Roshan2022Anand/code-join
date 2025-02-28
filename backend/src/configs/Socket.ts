import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import RoomOperations from "../listeners/RoomSocket";
import { StopContainer } from "../controllers/container.controller";
import { Room } from "../helpers/Types";
import TerminalOperations from "../listeners/TerminalSocket";

//global object to store rooms information
export const rooms: Room = {
  //test
  "123": {
    containerID:
      "591670ae1fe490dd59e32dc9ef67ccc87a629660cab8c69950a1413781dbc36d",
    members: {},
  },
};

//to initilize socket
export const initSocket = (server: HttpServer) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    //test
    socket.join("123");
    rooms["123"].members[socket.id] = {
      name: socket.id.slice(0, 4),
      profile: "",
    };

    RoomOperations(socket);
    TerminalOperations(socket,io);

    //on user disconnect
    socket.on("disconnect", () => {
      for (const room in rooms) {
        if (rooms[room].members[socket.id]) {
          delete rooms[room].members[socket.id];
          //test
          //if room is empty
          // if (Object.keys(rooms[room].members).length === 0) {
          //   StopContainer(rooms[room].containerID);
          //   delete rooms[room];
          // }
          console.log("User disconnected");
          break;
        }
      }
    });
  });
};
