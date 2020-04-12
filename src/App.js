import React, { useState, useEffect } from 'react';
import Draggable from 'react-draggable';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form, Input, Label, FormGroup, Card, CardBody, CardHeader, CardText, Container, Row, Col, Table, Collapse } from 'reactstrap';
import './App.css';

function App() {
  const [devices, setDevices] = useState([]);
  const [devicesTableRows, setDevicesTableRows] = useState([]);
  const { data, error } = useFetchAllDevices();

  useEffect(() => {
    if (data.length > 0) {
      data.forEach(element => {
        let singleDevice = <Device devName={element.deviceName} position={{ x: element.x, y: element.y }} />
        let singleDeviceRow = <DeviceRow devName={element.deviceName} />

        setDevices((devices) => [...devices, singleDevice]);
        setDevicesTableRows((devicesTableRows) => [...devicesTableRows, singleDeviceRow]);
      });
    }
  }, [data]);

  function handleSetDevices(device, deviceRow) {
    setDevices([...devices, device]);
    setDevicesTableRows([...devicesTableRows, deviceRow])
  }

  return (
    <>
      <Container className="mt-2" fluid={true}>
        <Row>
          <Col>
            <Blueprint>
              {devices}
            </Blueprint>
          </Col>
          <Col>
            <AddDevice onAddDevice={handleSetDevices} />
            <p />
            <DevicesTable>
              {devicesTableRows}
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
  const { data, error } = useFetchDeviceData(props.devName);

  return (
    <>
      <tr>
        <td>{props.devName}</td>
        <td>{data.out.celsius}</td>
        <td>{data.out.humidity}</td>
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
    const newDevice = <Device devName={devName} />
    const newDeviceRow = <DeviceRow devName={devName} />
    props.onAddDevice(newDevice, newDeviceRow);
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
  const { data, error } = useFetchDeviceData(props.devName);

  const toggle = () => setIsOpen(!isOpen);

  const shortenName = () => {
    return String(props.devName).substr(0, 3);
  }

  // Kommentti pois kun servu toimii
  useEffect(() => {
    if (props.position !== undefined) {
      setControlledPosition(props.position);
    }
  }, [props.position]);

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
            {(isOpen) ? props.devName : shortenName()}
          </CardHeader>
          <Collapse isOpen={isOpen}>
            <CardBody>
              <CardText>
                Temp: {data.out.celsius} &#8451;
            </CardText>
              <CardText>
                Hum: {data.out.humidity} %
            </CardText>
              <Button type="button" onClick={() => onSaveClick(props.devName, controlledPosition.x, controlledPosition.y)}>Save</Button>
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
