import React from 'react';
import { Button, Form, Col} from 'react-bootstrap';
import dataStore from '../dataStore.js';


// This Page enables the user to edit his/her account information.

export default function EditAccountInfo(){
	return(
		<div>
			<Form>
                <Form.Group as={Row} controlId="Username">
                    <Form.Label column sm={2}>Username</Form.Label>
                    <Col sm={10}>
                        <Form.Control 
                            type="text"
                            placeholder="Username"

                        />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="Password">
                    <Form.Label column sm={2}>Password</Form.Label>
                    <Col sm={7}>
                        <Form.Control 
                            type="password" 
                            placeholder="New Password"

                        />
                    </Col>
                    <Col sm={3}>
                        <Button type="submit">Verfication</Button>

                    </Col>
                </Form.Group>

                <Button type="submit">Save</Button>

			</Form>
		</div>
    );
}




