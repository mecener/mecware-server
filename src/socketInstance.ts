import { Server as IOServer } from "socket.io";

let ioInstance: IOServer | null = null;

export const setIoInstance = (io: IOServer) => {
	ioInstance = io;
};

export const getIoInstance = () => {
	if (!ioInstance) {
		throw new Error("Socket.IO instance not initialized");
	}
	return ioInstance;
};
