import React, { useState, useEffect } from 'react';
import Draggable from 'react-draggable';
import './App.css';

function App() {
  const [devices, setDevices] = useState([]);

  function handleSetDevices(device) {
    setDevices([...devices, device]);
  }

  return (
    <div>
      <Blueprint>
        {devices}
      </Blueprint>
      <AddDevice onAddDevice={handleSetDevices} />
    </div>
  );
}

function Blueprint(props) {

  return (
    <div className="blueprintImg">
      {props.children}
    </div>
  );
}

function AddDevice(props) {
  const [devName, setDevName] = useState('');

  function handleNameChange(e) {
    setDevName(e.target.value);
  }

  function handleSetDevices(e) {
    const newDevice = <Device devName={devName} />
    props.onAddDevice(newDevice);
    e.preventDefault();
  }

  return (
    <form onSubmit={handleSetDevices}>
      <label>
        Name:
          <input type="text" value={devName} onChange={handleNameChange} />
      </label>
      <input type="submit" value="Add" />
    </form>
  );
}

function Device(props) {
  const { data, error } = useFetchDeviceData(props.devName);

  return (
    <>
      <Draggable bounds="parent">
        <div className="box" style={{ position: 'absolute' }}>
          <p>Name: {props.devName}</p>
          <p>Temp: {data.url}</p>
          <p>Hum: {data.hum}</p>
        </div>
      </Draggable>
    </>
  );
}

function useFetchDeviceData(deviceName) {
  const [data, setData] = useState({});
  const [error, setError] = useState(null);
  const url = 'x' + deviceName + 'y';

  useEffect(() => {
    const interval = setInterval(() => {
      const fetchData = async () => {
        fetch(url)
          .then((res) => {
            if (!res.ok) {
              throw new Error('Error');
            }
            return res.json();
          })
          .then((json) => {
            setData(json);
          })
          .then((error) => {
            setError(error);
          });
        //setLoading tähän?
      }

      fetchData();
    }, 5000);
    return () => clearInterval(interval);
  }, [url]);

  return { data, error };
}

export default App;
