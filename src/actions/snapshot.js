import axios from 'axios';
import { SNAPSHOT } from '../types';
const ENDPOINT = 'https://api.binance.com/api/';


const getSnapshot = () => ({
	type: SNAPSHOT.GET_SNAPSHOT
});

const getSnapshotSuccess = data => ({
	type: SNAPSHOT.GET_SNAPSHOT_SUCCESS,
	payload: {
		...data
	}
});

const getSnapshotError = error => ({
	type: SNAPSHOT.GET_SNAPSHOT_ERROR,
	payload: { error }
});



export const setCurrencyAction = (currency) => (dispatch) => {
	return dispatch({
		type: SNAPSHOT.SET_CURRENCY,
		payload: { currency }
	})
}

export const getSnapshotAction = () => (dispatch, getState) => {

	dispatch(getSnapshot());

	let { options, currency, limit } = getState().snapshot;

	let symbol = options.find(({ value }) => value === currency).name;
	let params = { symbol, limit }

	axios
		.get(`${ENDPOINT}/v3/depth`, { params })
		.then(({ data }) => {
			dispatch(getSnapshotSuccess(data));
		})
		.catch(err => {
			dispatch(getSnapshotError(err.message));
		});
};
