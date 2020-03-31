import { SNAPSHOT } from '../types';

const initialState = {
	loading: false,
	error: null,

	prevCurrency: null,
	currency: 'btsusdt',

	limit: 10,

	snapshot: {
		bids: [],
		asks: [],
		lastUpdateId: null
	},

	options: [{
		name: 'BTCUSDT',
		value: 'btcusdt',
	}, {
		name: 'ETCUSDT',
		value: 'etcusdt',
	}, {
		name: 'XRPUSDT',
		value: 'xrpusdt',
	}, {
		name: 'BTSUSDT',
		value: 'btsusdt',
	}]
};

export default function snapshot(state = initialState, action) {
	switch (action.type) {


		case SNAPSHOT.SET_CURRENCY:
			return {
				...state,
				prevCurrency: state.currency,
				currency: action.payload.currency,
			}


		case SNAPSHOT.GET_SNAPSHOT:
			return {
				...state,
				loading: true
			};

		case SNAPSHOT.GET_SNAPSHOT_SUCCESS:
			return {
				...state,
				loading: false,
				error: null,
				snapshot: action.payload
			};

		case SNAPSHOT.GET_SNAPSHOT_ERROR:
			return {
				...state,
				loading: false,
				error: action.payload.error
			};


		default:
			return state;
	}
}