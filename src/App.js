import React, { useState, useEffect } from 'react';
import Draggable from 'react-draggable';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form, Input, Label, FormGroup, Card, CardBody, CardHeader, CardText } from 'reactstrap';
import './App.css';

function App() {
  const [devices, setDevices] = useState([]);
  const { data, error } = useFetchAllDevices();

  useEffect(() => {
    if (data.length > 0) {
      data.forEach(element => {
        let singleDevice = <Device devName={element.deviceName} position={{ x: element.posX, y: element.posY }} />
        setDevices([...devices, singleDevice]);
      });
    }
  }, [data, devices]);

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
    <Form onSubmit={handleSetDevices} inline>
      <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
        <Label for="inputDeviceName" className="mr-sm-2">Name</Label>
        <Input id="inputDeviceName" type="text" value={devName} onChange={handleNameChange} />
      </FormGroup>
      <Button type="submit">Add</Button>
    </Form>
  );
}

function Device(props) {
  const [controlledPosition, setControlledPosition] = useState({ x: 0, y: 0 });
  const { data, error } = useFetchDeviceData(props.devName);

  // Kommentti pois kun servu toimii
  /* useEffect(() => {
    if (props.position.x >= 0 && props.position.y >= 0) {
      setControlledPosition(props.position);
    }
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
          <Card className="box2">
            <CardHeader>
              Name: {props.devName}
            </CardHeader>
            <CardBody>
              <CardText>
                Temp: {controlledPosition.x}
              </CardText>
              <CardText>
                Hum: {controlledPosition.y}
              </CardText>
              <Button type="button" onClick={onSaveClick}>Save</Button>
            </CardBody>
          </Card>
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
  const [data, setData] = useState([]);
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
