import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import { SocketEvents } from "@constants/enums";

let io: Server;

export const initializeSocket = (server: HttpServer): void => {
  try {
    io = new Server(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    io.on("connection", (socket: Socket) => {
      console.log(`🔹 Client connected: ${socket.id}`);

      socket.on("join", (userId: string) => {
        console.log(`✅ User ${userId} joined`);
        socket.join(`user-${userId}`);
      });

      socket.on("join-room", (roomId: string) => {
        console.log(`📌 User joined room ${roomId}`);
        socket.join(`room-${roomId}`);
      });

      socket.on("send-message", ({ roomId, message }) => {
        console.log(`💬 Message in room ${roomId}:`, message);
        io.to(`room-${roomId}`).emit("receive-message", message);
      });

      socket.on("typing", ({ roomId, userId }) => {
        socket.to(`room-${roomId}`).emit("user-typing", { userId });
      });

      socket.on("message-read", ({ messageId, userId }) => {
        io.emit("update-message-status", { messageId, userId, status: "read" });
      });

      socket.on("disconnect", () => {
        console.log(`❌ Client disconnected: ${socket.id}`);
      });
    });
  } catch (error) {
    console.error("Socket Initialization Error:", error);
  }
};

export const getIo = (): Server | undefined => io;

export const notifyUser = (userId: string, event: string, data: any): void => {
  const ioInstance = getIo();
  if (ioInstance) {
    console.log(`📢 Notifying user ${userId} with event '${event}'`, data);
    ioInstance.to(`user-${userId}`).emit(event, data);
  }
};

export const notifyRoom = (roomId: string, event: string, data: any): void => {
  const ioInstance = getIo();
  if (ioInstance) {
    console.log(`📢 Broadcasting to room ${roomId} event '${event}'`, data);
    ioInstance.to(`room-${roomId}`).emit(event, data);
  }
};

export const notifyAll = (event: string, data: any): void => {
  const ioInstance = getIo();
  if (ioInstance) {
    console.log(`📢 Broadcasting event '${event}' to all`, data);
    ioInstance.emit(event, data);
  }
};

export const removeUserFromRoom = (socket: Socket, roomId: string) => {
  console.log(`🔻 Removing user ${socket.id} from room ${roomId}`);
  socket.leave(`room-${roomId}`);
};

// Sample usage
notifyUser("123", SocketEvents.ORDER_STATUS_UPDATE, {
  orderId: "456",
  status: "shipped",
});

notifyRoom("room-789", SocketEvents.MESSAGE_RECEIVE, {
  sender: "John",
  text: "Hello!",
});

notifyAll(SocketEvents.SYSTEM_ANNOUNCEMENT, {
  message: "Scheduled maintenance at 10PM",
});
