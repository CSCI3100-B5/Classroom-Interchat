import React, { useState } from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import {
  Button, Form, Alert, Card
} from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { useDataStore } from '../contexts/DataStoreProvider.jsx';


const schema = yup.object().shape({
  classroomId: yup.string().required().label('Classroom ID'),
});


export default function JoinClassroom() {
  const [showAlert, setAlertVisibility] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [classroomInfo, setClassroomInfo] = useState();

  const history = useHistory();

  const { data } = useDataStore();

  // TODO: use data store
  // const { data } = useDataStore();

  // TODO: use join classroom socket API

  const onSubmit = async (values) => {
    // TODO: call join classroom API
    // store an example classroom state for UI testing
    data.classroomMeta = {
      id: 'wdefbgtrh54ger',
      name: 'CSCI3100',
      host: {
        id: 'defvfbrgfrvgdbr',
        name: 'Michael',
        email: 'michael@classroom-interchat.ml'
      },
      createdAt: new Date(),
      isMuted: false
    };
    data.participants = [
      {
        user: {
          id: 'defvfbrgfrvgdbr',
          name: 'Michael',
          email: 'michael@classroom-interchat.ml',
          isAdmin: false,
          createdAt: new Date()
        },
        permission: 'instructor',
        isMuted: false
      },
      {
        user: {
          id: '6065c03c3ae34451fc031004',
          name: 'Administrator',
          email: 'admin@classroom-interchat.ml',
          isAdmin: true,
          createdAt: new Date()
        },
        permission: 'instructor',
        isMuted: false
      },
      {
        user: {
          id: 'frgth4htb',
          name: 'Henry',
          email: 'henry@classroom-interchat.ml',
          isAdmin: false,
          createdAt: new Date()
        },
        permission: 'requesting',
        isMuted: false
      },
      {
        user: {
          id: 'efvrfbtnrn',
          name: 'Jimmy',
          email: 'jimmy@classroom-interchat.ml',
          isAdmin: false,
          createdAt: new Date()
        },
        permission: 'student',
        isMuted: false
      },
      {
        user: {
          id: 'efvfbetnj4',
          name: 'Ann',
          email: 'ann@classroom-interchat.ml',
          isAdmin: false,
          createdAt: new Date()
        },
        permission: 'student',
        isMuted: false
      }
    ];
    data.messages = [
      {
        id: 'edwrtehgrwf',
        createdAt: new Date(),
        classroom: 'wdefbgtrh54ger',
        sender: {
          id: 'frgth4htb',
          name: 'Henry',
          email: 'henry@classroom-interchat.ml',
          permission: 'requesting',
          isMuted: false
        },
        type: 'text',
        content: 'Test normal message content **bold** [url](https://www.google.com/)'
      },
      {
        id: 'btgnrhymrnteb',
        createdAt: new Date(),
        classroom: 'wdefbgtrh54ger',
        sender: {
          id: 'defvfbrgfrvgdbr',
          name: 'Michael',
          email: 'michael@classroom-interchat.ml',
          permission: 'instructor',
          isMuted: false
        },
        type: 'mcq',
        content: {
          prompt: 'How many bits in 8 bytes?',
          choices: [
            '1', '2', '4', '8', '16', '64'
          ],
          multiSelect: false
        }
      },
      {
        id: 'fvbgfnhmtuyrt',
        createdAt: new Date(),
        classroom: 'wdefbgtrh54ger',
        sender: {
          id: 'defvfbrgfrvgdbr',
          name: 'Michael',
          email: 'michael@classroom-interchat.ml',
          permission: 'instructor',
          isMuted: false
        },
        type: 'mcq',
        content: {
          prompt: 'Select true?',
          choices: [
            'T', 't', 'True', 'f', 'F', 'false'
          ],
          multiSelect: true
        }
      },
      {
        id: ' dgbfhntmuynrgb',
        createdAt: new Date(),
        classroom: 'wdefbgtrh54ger',
        sender: {
          id: '6065c03c3ae34451fc031004',
          name: 'Administrator',
          email: 'admin@classroom-interchat.ml',
          permission: 'instructor',
          isMuted: false
        },
        type: 'mcq',
        content: {
          prompt: 'Select true?',
          choices: [
            'T', 't', 'True', 'f', 'F', 'false'
          ],
          correct: [0, 1, 2],
          multiSelect: true,
          result: [
            {
              userId: 'defvfbrgfrvgdbr',
              content: [0, 1, 2],
              createdAt: new Date()
            },
            {
              userId: 'frgth4htb',
              content: [1, 2],
              createdAt: new Date()
            },
            {
              userId: 'efvfbetnj4',
              content: [0, 1],
              createdAt: new Date()
            }
          ]
        }
      },
      {
        id: ' vfbgnrythegrgrb',
        createdAt: new Date(),
        classroom: 'wdefbgtrh54ger',
        sender: {
          id: '6065c03c3ae34451fc031004',
          name: 'Administrator',
          email: 'admin@classroom-interchat.ml',
          permission: 'instructor',
          isMuted: false
        },
        type: 'mcq',
        content: {
          prompt: 'Select true?',
          choices: [
            'T', 't', 'True', 'f', 'F', 'false'
          ],
          multiSelect: true,
          result: [
            {
              userId: 'defvfbrgfrvgdbr',
              content: [0, 1, 2],
              createdAt: new Date()
            },
            {
              userId: 'frgth4htb',
              content: [1, 2],
              createdAt: new Date()
            },
            {
              userId: 'efvfbetnj4',
              content: [0, 1],
              createdAt: new Date()
            }
          ]
        }
      },
      {
        id: 'vrwbetnrytb',
        createdAt: new Date(),
        classroom: 'wdefbgtrh54ger',
        sender: {
          id: 'defvfbrgfrvgdbr',
          name: 'Michael',
          email: 'michael@classroom-interchat.ml',
          permission: 'instructor',
          isMuted: false
        },
        type: 'saq',
        content: {
          prompt: 'Type some answer...'
        }
      },
      {
        id: 'vfbgnryjhtebf',
        createdAt: new Date(),
        classroom: 'wdefbgtrh54ger',
        sender: {
          id: '6065c03c3ae34451fc031004',
          name: 'Administrator',
          email: 'admin@classroom-interchat.ml',
          permission: 'instructor',
          isMuted: false
        },
        type: 'saq',
        content: {
          prompt: 'Type some answer...',
          result: [
            {
              userId: 'defvfbrgfrvgdbr',
              content: 'Answer by Michael',
              createdAt: new Date()
            },
            {
              userId: 'frgth4htb',
              content: 'Answer by Henry',
              createdAt: new Date()
            },
            {
              userId: 'efvfbetnj4',
              content: 'Answer by Ann',
              createdAt: new Date()
            },
            {
              userId: 'efvrfbtnrn',
              content: 'Answer by Ann',
              createdAt: new Date()
            }
          ]
        }
      },
      {
        id: 'rvbtnryntb',
        createdAt: new Date(),
        classroom: 'wdefbgtrh54ger',
        sender: null,
        type: 'text',
        content: 'System status message'
      },
      {
        id: 'ewvrbetnry',
        createdAt: new Date(),
        classroom: 'wdefbgtrh54ger',
        sender: {
          id: 'defvfbrgfrvgdbr',
          name: 'Michael',
          email: 'michael@classroom-interchat.ml',
          permission: 'instructor',
          isMuted: false
        },
        type: 'question',
        content: {
          isResolved: false,
          content: 'Question expecting answer'
        }
      },
      {
        id: 'rbtnryrbetnr',
        createdAt: new Date(),
        classroom: 'wdefbgtrh54ger',
        sender: {
          id: 'defvfbrgfrvgdbr',
          name: 'Michael',
          email: 'michael@classroom-interchat.ml',
          permission: 'instructor',
          isMuted: false
        },
        type: 'reply',
        content: {
          replyTo: 'ewvrbetnry',
          content: 'Answering question'
        }
      }
    ];
    history.push('/classroom/session');
  };

  const onChange = async (event) => {
    const classroomId = event.target.value;
    if (!await schema.isValid({ classroomId })) return;
    // TODO: call peek classroom API and populate classroom info
    setClassroomInfo({
      id: 'advfbethgrf',
      name: 'CSCI3100',
      host: { name: 'Michael' },
      createdAt: new Date(),
      participantCount: 150
    });
  };

  return (
    <div>
      <h3>Join Classroom</h3>
      <Alert
        className="m-2"
        show={showAlert}
        variant="warning"
        onClose={() => setAlertVisibility(false)}
        dismissible
      >
        {alertMessage}
      </Alert>
      <Formik
        validationSchema={schema}
        onSubmit={onSubmit}
        initialValues={{
          classroomId: '',
        }}
      >
        {({
          handleSubmit,
          handleChange,
          values,
          touched,
          errors,
        }) => (
          <Form className="m-4" noValidate onSubmit={handleSubmit}>
            <Form.Group controlId="classroomId">
              <Form.Label>Paste invite link here</Form.Label>
              <Form.Control
                type="text"
                name="classroomId"
                value={values.classroomId}
                onChange={(event) => {
                  handleChange(event);
                  onChange(event);
                }}
                isValid={touched.classroomId && !errors.classroomId}
                isInvalid={touched.classroomId && errors.classroomId}
              />
              <Form.Control.Feedback type="invalid">
                {errors.classroomId}
              </Form.Control.Feedback>
            </Form.Group>
            {classroomInfo
              ? (
                <Card>
                  <p><b>{classroomInfo.name}</b></p>
                  <span>
                    {classroomInfo.participantCount}
                    {' '}
                    participants
                  </span>
                  <span>
                    Hosted by
                    {' '}
                    {classroomInfo.host.name}
                  </span>
                  <p>
                    Started at
                    {' '}
                    {classroomInfo.createdAt.toString()}
                  </p>
                </Card>
              ) : null}
            <Button type="submit">Join Classroom</Button>
          </Form>
        )}
      </Formik>
      <div>
        <p>Want to create a classroom instead?</p>
        <LinkContainer to="/classroom/create">
          <Button>Create Classroom</Button>
        </LinkContainer>
      </div>
    </div>
  );
}
