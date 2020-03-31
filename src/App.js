import React, { useEffect } from 'react';

import './App.css';
import {useDispatch, useSelector} from "react-redux";
import { getSnapshotAction, setCurrencyAction } from "./actions/snapshot";
import { initializeSocket, checkSocketAccessibility, updateSocket } from "./actions/socket";


function Table({ data, color, type }) {
  return <div>
    <div style={{ color }}>{type}</div>
    <br/>
    {data.map(([price, qte], key) => (
        <span key={key}><span>{price}</span>&nbsp;&nbsp;<span>{qte}</span></span>
    ))}
  </div>
}


function App() {

  let dispatch = useDispatch()
  let state = useSelector(({ socket, snapshot }) => ({ ...socket, ...snapshot }));
  let { options, data, connected, currency, prevCurrency, snapshot } = state;

  useEffect(() => {
    dispatch(initializeSocket())
  }, []);

  useEffect(() => {
    const interval = setInterval(() => dispatch(checkSocketAccessibility()), 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if(prevCurrency) {
      dispatch(updateSocket())
    }
    dispatch(getSnapshotAction())
  }, [prevCurrency]);


  if(!connected) {
      return null
  }

  let initial = { asks: [], bids: [] };
  let updated = data
      .map(item => item.u > snapshot.lastUpdateId ? item : null)
      .filter(item => item)
      .reduce((acc, item) => {
        acc.asks = [...acc.asks, ...item.a]
        acc.bids = [...acc.bids, ...item.b]
        return acc
      }, initial);

  return (
    <div className="App">

      <aside className={'App-aside'}>
        <select onChange={({ target }) => dispatch(setCurrencyAction(target.value))} value={currency}>
          {options.map(({ name, value }) => <option key={value} value={value}>{name}</option>)}
        </select>
      </aside>

      <div className={'App-block'}>
        <Table data={updated.asks} type={"ASKS"} color={'red'} />
        <Table data={updated.bids} type={"BIDS"} color={'green'} />
      </div>
    </div>
  );
}

export default App;



