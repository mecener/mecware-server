import { Server as IOServer, Socket } from "socket.io";
import { Server as HTTPServer } from "node:http";
import { setIoInstance } from "./socketInstance.js";

export const createSocketServer = (server: HTTPServer) => {
	const io = new IOServer(server, {
		cors: {
			origin: [
				"https://mecener.online",
				"https://www.mecener.online",
				"http://mecener.online",
				"http://www.mecener.online",
				"http://localhost:5173",
				"http://localhost:3000",
			],
			credentials: true,
		},
	});

	setIoInstance(io);

	io.on("connection", (socket: Socket) => {
		console.log("User connected:", socket.id);

		socket.on("disconnect", () => {
			console.log("User disconnected:", socket.id);
		});

		socket.on("join-scenario", (scenarioId: number) => {
			const roomName = `scenario-${scenarioId}`;

			socket.join(roomName);

			console.log(`Socket ${socket.id} joined room ${roomName}`);
		});

		socket.on("leave-scenario", (scenarioId: number) => {
			const roomName = `scenario-${scenarioId}`;

			socket.leave(roomName);

			console.log(`Socket ${socket.id} leave room ${roomName}`);
		});
	});

	return io;
};
