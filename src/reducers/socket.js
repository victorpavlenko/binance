import { SOCKET } from "../types";

const initialState = {
	connected: false,
	socket: null,
	data: [],
};

export default function reducer(state = initialState, action = {}) {
	switch (action.type) {
		case SOCKET.SOCKET_CONNECTION_INIT:
			return {
				...state,
				connected: false,
				socket: action.socket,
			};

		case SOCKET.SOCKET_CONNECTION_SUCCESS:
			return {
				...state,
				connected: true,
			};

		case SOCKET.SOCKET_CONNECTION_ERROR:
			return {
				...state,
				connected: false,
			};

		case SOCKET.SOCKET_CONNECTION_CLOSED:
			return {
				...state,
				connected: false,
				socket: null,
			};

		case SOCKET.SOCKET_MESSAGE:
			return {
				...state,
				data: [action.payload]
			};

		default:
			return state;
	}
}
