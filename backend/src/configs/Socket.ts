import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import RoomOperations from "../listeners/Room.service";
import { Room } from "../helpers/Types";
import TerminalOperations from "../listeners/Terminal.service";
import { StopContainer } from "../listeners/Container.service";

//global object to store rooms information
export const rooms: Room = {
  //test
  "123": {
    containerID:
      "6bcbc6e985496cdda3f7d88af57030d173ea9ca38f26ef528b3e0277a6febac7",
    streams: {},
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
    console.log("User connected");

    RoomOperations(socket);
    TerminalOperations(socket, io);

    //on user disconnect
    socket.on("disconnect", () => {
      for (const room in rooms) {
        if (rooms[room].members[socket.id]) {
          delete rooms[room].members[socket.id];
          //test
          //if room is empty
          // if (Object.keys(rooms[room].members).length === 0) {
          // StopContainer(rooms[room].containerID);
          //   delete rooms[room];
          // }
          console.log("User disconnected");
          break;
        }
      }
    });
  });
};
