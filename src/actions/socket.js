import { SOCKET } from "../types";

const ENDPOINT = 'wss://stream.binance.com:9443/ws';



export const updateSocket = () => (dispatch, getState) => {

	let { snapshot: { prevCurrency, currency }, socket: { socket } } = getState();

	socket.send(JSON.stringify({
		method: "UNSUBSCRIBE",
		params: [`${prevCurrency}@depth`],
		id: 1
	}));

	socket.send(JSON.stringify({
		method: "SUBSCRIBE",
		params: [`${currency}@depth`],
		id: 1
	}));
};





const socketConnectionInit = (socket) => {
	return {
		type: SOCKET.SOCKET_CONNECTION_INIT,
		socket,
	};
}

const socketConnectionSuccess = () => {
	return {
		type: SOCKET.SOCKET_CONNECTION_SUCCESS,
	};
}

const socketConnectionError = () => {
	return {
		type: SOCKET.SOCKET_CONNECTION_ERROR,
	};
}

const socketConnectionClosed = () => {
	return {
		type: SOCKET.SOCKET_CONNECTION_CLOSED,
	};
}

const socketMessage = (data) => {
	return {
		type: SOCKET.SOCKET_MESSAGE,
		payload: {
			...data
		},
	};
}




export const initializeSocket = () => (dispatch, getState) => {

	const { currency } = getState().snapshot;
	const socket = new WebSocket(ENDPOINT);

	dispatch(socketConnectionInit(socket));

	socket.onopen = function() {
		socket.send(JSON.stringify({
			method: "SUBSCRIBE",
			params: [`${currency}@depth`],
			id: 1
		}));
		dispatch(socketConnectionSuccess());
	};

	socket.onerror = function() {
		dispatch(socketConnectionError());
	};

	socket.onmessage = function ({ data }) {
		if(JSON.parse(data).result !== null) {
			dispatch(socketMessage(JSON.parse(data)));
		}
	};

	socket.onclose = function() {
		dispatch(socketConnectionClosed());
	};
}

export const checkSocketAccessibility = () => (dispatch, getState) => {
	const { socket } = getState().socket;

	if(!socket || socket.readyState === 3) {
		dispatch(initializeSocket())
	}
}