import React from 'react';
import {
  Container, Row, Col, Tab, Nav
} from 'react-bootstrap';
import EditAccountInfo from './EditAccountInfo.jsx';
import TokensInfo from './TokensInfo.jsx';

// A page for the user to view and edit account information.
// It consists of the Pesonal Info page and the Classroom Page.

export default function AccountInfo() {
    return(
        <Tab.Container id="tabs" defaultActiveKey="personalInfo">
            <Row>
                <Col>
                    <Nav variant="pills" className="column">
                        <Nav.Item>
                            <Nav.Link eventKey="first">Personal Info</Nav.Link>                            
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="second">Classroom</Nav.Link>
                        </Nav.Item>
                    </Nav>        
                </Col>
                <Col>
                    <Tab.Content>
                        <Tab.Pane eventKey="first">
                            <EditAccountInfo />
                        </Tab.Pane>
                        <Tab.Pane eventKey="second">
                            <TokensInfo />
                        </Tab.Pane>
                    </Tab.Content>               
                </Col>
            </Row>
        </Tab.Container>
    );
}
