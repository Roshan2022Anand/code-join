import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import RoomOperations from "./RoomSocket";
import { StopContainer } from "../controllers/container.controller";
import { Room } from "../helpers/Types";

//global object to store rooms information
export const rooms: Room = {};

//to initilize socket
export const initSocket = (server: HttpServer) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    RoomOperations(socket);

    //on user disconnect
    socket.on("disconnect", () => {
      for (const room in rooms) {
        if (rooms[room].members[socket.id]) {
          delete rooms[room].members[socket.id];
          //if room is empty
          if (Object.keys(rooms[room]).length === 0) {
            StopContainer(rooms[room].containerID);
            delete rooms[room];
          }
          console.log("User disconnected");
          break;
        }
      }
    });
  });
};