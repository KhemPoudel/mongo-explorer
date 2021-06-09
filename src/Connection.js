import {useState} from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

export default function Connection(props) {
    const [connDetails, changeConnDetails] = useState({hostname:"localhost", port: 27017, user_credentials: {}});

    const submitConnection = async (e) => {
        e.preventDefault();
        try {
          let conn = await invoke("create_connection", {connectionDetails:connDetails});
          console.log(conn);
          props.setConnValue(conn);
        } catch (e) {
          console.log(e);
        }

    }

    const findDocs = async () => {
      console.log(await invoke("find_all_collection"));
    }

    return (
      <Container>
        <Row className="justify-content-md-center">
          <Col sm={6}>
            <Form onSubmit={(e) => submitConnection(e)}>
              <Form.Group controlId="formBasicHost">
                <Form.Label>Host Name</Form.Label>
                <Form.Control type="text" value={connDetails.hostname} onChange={(e) => {
                    connDetails.hostname = e.target.value;
                    changeConnDetails(connDetails);
                  }}
                />
                <Form.Text className="text-muted">
                  Enter the url of the database host
                </Form.Text>
              </Form.Group>

              <Form.Group controlId="formBasicPort">
                <Form.Label>Port</Form.Label>
                <Form.Control type="number" value={connDetails.port} onChange={(e) => {
                    connDetails.port = e.target.value;
                    changeConnDetails(connDetails);
                  }}
                />
              </Form.Group>
              <Form.Group controlId="formBasicCheckbox">
                <Form.Check type="checkbox" label="Authenticate" />
              </Form.Group>
              <Form.Group controlId="formBasicUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control type="text" value={connDetails.user_credentials.username} onChange={(e) => {
                    connDetails.user_credentials.username = e.target.value;
                    changeConnDetails(connDetails);
                  }}
                />
              </Form.Group>
              <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" value={connDetails.user_credentials.password} onChange={(e) => {
                    connDetails.user_credentials.password = e.target.value;
                    changeConnDetails(connDetails);
                  }}
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                Create new connection
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    );
}
