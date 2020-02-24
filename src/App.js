import React, { useState } from 'react';
import Draggable from 'react-draggable';
import './App.css';

function App() {
  const [devices, setDevices] = useState([]);

  function handleSetDevices(device) {
    setDevices([...devices, device]);
  }

  return (
    <div>
      {/* Kokeilu */}
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

  return (
    <div>
      <Draggable bounds="parent">
        <div className="box">
          <p>Name: {props.devName}</p>
          <p>Temp</p>
          <p>Hum</p>
        </div>
      </Draggable>
    </div>
  );
}

export default App;
