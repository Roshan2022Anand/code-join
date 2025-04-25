import { Server as SocketServer } from "socket.io";
import { Server as HttpServer } from "http";
import RoomOperations from "../listeners/Room.service";
import { Room } from "../helpers/Types";
import { StopContainer } from "../listeners/Container.service";
import EditorOperations from "../listeners/Editor.service";

//global object to store rooms information
export const rooms: Room = new Map([]);

//to initilize socket
let io: SocketServer;
export const initSocket = (server: HttpServer) => {
  io = new SocketServer(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected");

    RoomOperations(socket);
    EditorOperations(socket);

    //on user disconnect
    socket.on("disconnect", () => {
      for (const [roomID, room] of rooms) {
        if (room.members.has(socket.id)) {
          room.members.delete(socket.id);
          if (room.members.size === 0) {
            // StopContainer(room.containerID);
            // rooms.delete(roomID);
          }
          console.log("User disconnected");
          break;
        }
      }
    });
  });
};

export const getIO = (): SocketServer => {
  if (!io) throw new Error("IO not initialized");
  return io;
};
