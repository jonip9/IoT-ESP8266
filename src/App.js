import React, { useState, useEffect } from 'react';
import Draggable from 'react-draggable';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form, Input, Label, FormGroup, Card, CardBody, CardHeader, CardText, Container, Row, Col, Table, Collapse } from 'reactstrap';
import './App.css';

function App() {
  const [devices, setDevices] = useState([]);
  const { data, error } = useFetchAllDevices();

  useEffect(() => {
    if (data.length > 0) {
      data.forEach(element => {
        let singleDevice = { id: element._id, devName: element.deviceName, position: { x: element.x, y: element.y } }

        setDevices((devices) => [...devices, singleDevice]);
      });
    }
  }, [data]);

  function handleSetDevices(device) {
    setDevices([...devices, device]);
  }

  function handleDeleteDevice(i, devname, e) {
    const data = { devName: devname }

    fetch('http://localhost:3001/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        response.json();

        const newDeviceList = devices.filter((item, index) => {
          return i !== index;
        });
        setDevices([...newDeviceList]);
      })
      .then((data) => {
        console.log('Success', data);
      })
      .catch((error) => {
        console.error('Error', error);
      })
  }

  return (
    <>
      <Container className="mt-2" fluid={true}>
        <Row>
          <Col>
            <Blueprint>
              {devices.map((item, i) => {
                return (
                  <Device deviceData={item} key={item.id} onDelete={() => handleDeleteDevice(i, item.devName)} />
                );
              })}
            </Blueprint>
          </Col>
          <Col>
            <AddDevice onAddDevice={handleSetDevices} />
            <p />
            <DevicesTable>
              {devices.map((item, i) => {
                return (
                  <DeviceRow deviceData={item} key={item.id} onDelete={() => handleDeleteDevice(i, item.devName)} />
                );
              })}
            </DevicesTable>
          </Col>
        </Row>
      </Container>
    </>
  );
}

function Blueprint(props) {

  return (
    <div className="blueprintImg">
      {props.children}
    </div>
  );
}

function DevicesTable(props) {

  return (
    <>
      <Table hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Temp &#8451;</th>
            <th>Hum %</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {props.children}
        </tbody>
      </Table>
    </>
  );
}

function DeviceRow(props) {
  const { data, error } = useFetchDeviceData(props.deviceData.devName);

  return (
    <>
      <tr key={props.deviceData.id}>
        <td>{props.deviceData.devName}</td>
        <td>{data.out.celsius}</td>
        <td>{data.out.humidity}</td>
        <td><Button type="button" onClick={props.onDelete}>Delete</Button></td>
      </tr>
    </>
  );
}

function AddDevice(props) {
  const [devName, setDevName] = useState('');

  function handleNameChange(e) {
    setDevName(e.target.value);
  }

  function handleSetDevices(e) {
    const newDevice = { id: devName, devName: devName }
    props.onAddDevice(newDevice);
    e.preventDefault();
  }

  return (
    <Form onSubmit={handleSetDevices}>
      <FormGroup className="formGroup">
        <Label for="inputDeviceName">Name</Label>
        <Input id="inputDeviceName" type="text" value={devName} onChange={handleNameChange} />
      </FormGroup>
      <Button type="submit">Add</Button>
    </Form>
  );
}

function Device(props) {
  const [controlledPosition, setControlledPosition] = useState({ x: 0, y: 0 });
  const [isOpen, setIsOpen] = useState(false);
  const { data, error } = useFetchDeviceData(props.deviceData.devName);

  const toggle = () => setIsOpen(!isOpen);

  const shortenName = () => {
    return String(props.deviceData.devName).substr(0, 3);
  }

  useEffect(() => {
    if (props.deviceData.position !== undefined) {
      setControlledPosition(props.deviceData.position);
    }
  }, [props.deviceData.position]);

  function onControlledDrag(e, position) {
    const { x, y } = position;
    setControlledPosition({ x, y });
  }

  function onSaveClick(devname, posx, posy) {
    const data = { devName: devname, posX: posx, posY: posy };
    console.log(data);

    fetch('http://localhost:3001/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        response.json();
      })
      .then((data) => {
        console.log('Success', data);
      })
      .catch((error) => {
        console.error('Error', error);
      })
  }

  return (
    <>
      <Draggable bounds="parent" position={controlledPosition} onDrag={onControlledDrag}>
        <Card className="box2">
          <CardHeader onDoubleClick={toggle}>
            {(isOpen) ? props.deviceData.devName : shortenName()}
          </CardHeader>
          <Collapse isOpen={isOpen}>
            <CardBody>
              <CardText>
                Temp: {data.out.celsius} &#8451;
            </CardText>
              <CardText>
                Hum: {data.out.humidity} %
            </CardText>
              <Button type="button" onClick={() => onSaveClick(props.deviceData.devName, controlledPosition.x, controlledPosition.y)}>Save</Button>
              <Button type="button" onClick={props.onDelete}>Delete</Button>
            </CardBody>
          </Collapse>
        </Card>
      </Draggable>
    </>
  );
}

function useFetchDeviceData(deviceName) {
  const [data, setData] = useState({ 'out': { 'humidity': 0.0, 'celsius': 0.0 } });
  const [error, setError] = useState(null);
  const url = 'https://api.thinger.io/v2/users/AlbertoTomba/devices/' + deviceName + '/dht11';

  useEffect(() => {
    const interval = setInterval(() => {
      const myHeaders = new Headers({
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkZXYiOiJlc3A4MjY2IiwiaWF0IjoxNTg1MjQwMjk4LCJqdGkiOiI1ZTdjZDhlYTJlYTg2YmFiN2I5Yzg1M2YiLCJ1c3IiOiJBbGJlcnRvVG9tYmEifQ.q5MEflhSN0w5mqu4C-56bg3Yb1Sb5Idrvw0MToesWWM'
      });

      const fetchData = async () => {
        fetch(url, {
          method: 'GET',
          credentials: 'same-origin',
          headers: myHeaders
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

      fetchData();
    }, 5000);
    return () => clearInterval(interval);
  });

  return { data, error };
}

function useFetchAllDevices() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const url = 'http://localhost:3001/fetch';

  useEffect(() => {
    const fetchAllDevices = async () => {
      fetch(url, {
        method: 'GET',
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Error');
          }
          console.log(response);
          return response.json();
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
