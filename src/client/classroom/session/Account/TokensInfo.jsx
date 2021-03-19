import React from 'react';
import Table from 'react-bootstrap';
import dataStore from '../dataStore.js';

// Students can view his/her tokens info in this page.

export default function TokensInfo() {
    return(
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Classroom participated</th>
                    <th>Tokens</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>1</td>


                </tr>
                <tr>
                    <td>2</td>


                </tr>
            </tbody>
        </Table>
    );
}