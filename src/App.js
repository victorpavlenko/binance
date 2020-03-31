import React, { useEffect, useState } from 'react';
import axios from 'axios';

import './App.css';


const ENDPOINT = 'https://api.binance.com/api/';
const SOCKET = 'wss://stream.binance.com:9443/ws';
const OPTIONS = [{
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

  let [data, setData] = useState([]);
  let [snapshot, setSnapshot] = useState({ bids: [], asks: [], lastUpdateId: null });
  let [socket, setSocket] = useState({});
  let [limit, setLimit] = useState(10);
  let [update, setUpdate] = useState(false);
  let [[prevCurrency, currency], setCurrency] = useState([null, 'btsusdt']);


  useEffect(() => {
    setUpdate(false)
    socket = new WebSocket(SOCKET);
    setSocket(socket);

    socket.onopen = () => {
      socket.send(JSON.stringify({
        method: "SUBSCRIBE",
        params: [`${currency}@depth`],
        id: 1
      }));
    };

  }, [update]);


  socket.onmessage = (event) => {
    if(JSON.parse(event.data).result !== null) {
      setData([JSON.parse(event.data)])
    }
  };

  const checkSocketAccessibility = () => {
    if(!socket || socket.readyState === 3) {
        setUpdate(true)
    }
  }


  useEffect(() => {
    const interval = setInterval(() => checkSocketAccessibility, 10000);
    return () => clearInterval(interval);
  }, []);


  useEffect(() => {
    let symbol = OPTIONS.find(({ value }) => value === currency).name;
    let params = { symbol, limit }

    axios
        .get(`${ENDPOINT}/v3/depth`, { params })
        .then(({ data }) => setSnapshot(data))
  }, [prevCurrency]);


  useEffect(() => {
    if(prevCurrency) {
      socket.send(JSON.stringify({
        method: "UNSUBSCRIBE",
        params: [`${prevCurrency}@depth`],
        id: 1
      }));

      socket.send(JSON.stringify({
        method: "SUBSCRIBE",
        params: [`${currency}@depth`],
        id: 2
      }));
    }
  }, [prevCurrency])


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
        <select onChange={({ target }) => setCurrency([currency, target.value])} value={currency}>
          {OPTIONS.map(({ name, value }) => <option key={value} value={value}>{name}</option>)}
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



