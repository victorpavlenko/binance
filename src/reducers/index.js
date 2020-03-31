import { combineReducers } from 'redux';
import socket from './socket';
import snapshot from './snapshot';

const rootReducer = combineReducers({
	socket,
	snapshot,
});

export default rootReducer;