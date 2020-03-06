import React, { useState, useEffect } from 'react';
import Draggable from 'react-draggable';
import './App.css';

function App() {
  const [devices, setDevices] = useState([]);
  //const { data, error } = useFetchAllDevices();

  /* useEffect(() => {
    data.forEach(element => {
      let singleDevice = <Device devName={element.deviceName} position={{ x: element.posX, y: element.posY }} />
      setDevices([...devices, singleDevice]);
    });
  }); */

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
  const [controlledPosition, setControlledPosition] = useState({ x: 0, y: 0 });
  const { data, error } = useFetchDeviceData(props.devName);

  /* useEffect(() => {
    setControlledPosition(props.position);
  }, [props.position]); */

  function onControlledDrag(e, position) {
    const { x, y } = position;
    setControlledPosition({ x, y });
  }

  function onSaveClick() {
    const data = { deviceName: props.devName, posX: controlledPosition.x, posY: controlledPosition.y };

    fetch('', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Error');
        }
        res.json();
      })
      .catch((error) => {
        console.error(error);
      })
  }

  return (
    <>
      <Draggable bounds="parent" position={controlledPosition} onDrag={onControlledDrag}>
        <div className="box" style={{ position: 'absolute' }}>
          <p>Name: {props.devName} {controlledPosition.x + ' ' + controlledPosition.y}</p>
          <p>Temp: {data.temp}</p>
          <p>Hum: {data.hum}</p>
          <button type="button" onClick={onSaveClick}>Save</button>
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
        fetch(url, {
          method: 'GET',
        })
          .then((res) => {
            if (!res.ok) {
              throw new Error('Error');
            }
            return res.json();
          })
          .then((json) => {
            setData(json);
          })
          .catch((error) => {
            setError(error);
            console.error(error);
          });
        //setLoading tähän?
      }

      fetchData();
    }, 5000);
    return () => clearInterval(interval);
  });

  return { data, error };
}

function useFetchAllDevices() {
  const [data, setData] = useState([{}]);
  const [error, setError] = useState(null);
  const url = '';

  useEffect(() => {
    const fetchAllDevices = async () => {
      fetch(url, {
        method: 'GET',
      })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Error');
        }
        return res.json();
      })
      .then((json) => {
        setData(json);
      })
      .catch((error) => {
        setError(error);
        console.error(error);
      });
    }

    fetchAllDevices();
  }, []);

  return { data, error };
}

export default App;
