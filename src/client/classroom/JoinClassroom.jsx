import React, { useEffect, useState } from 'react';
import { Formik } from 'formik';
import qs from 'qs';
import * as yup from 'yup';
import {
  Button, Form, Alert, Card
} from 'react-bootstrap';
import { useHistory, useLocation } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { useStates } from 'use-states';
import { useDataStore } from '../contexts/DataStoreProvider.jsx';
import { useRealtime } from '../contexts/RealtimeProvider.jsx';


const schema = yup.object().shape({
  classroomId: yup.string().matches(/^[0-9a-f]{24}$/si, 'The classroom ID is invalid').label('Classroom ID'),
});


export default function JoinClassroom() {
  const location = useLocation();

  const history = useHistory();

  const { data } = useDataStore();

  const { peekClassroom, joinClassroom } = useRealtime();

  const localData = useStates({
    showAlert: false,
    alertMessage: '',
    initialClassroomId: () => qs.parse(location.search, { ignoreQueryPrefix: true }).id ?? ''
  });

  // TODO: DEBUG: sample data
  const classroomMetaSample = {
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

  const participantsSample = [
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

  const messagesSample = [
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

  useEffect(() => {
    if (data.classroomMeta) history.push('/classroom/session');
  }, [data.classroomMeta]);

  const onSubmit = async (values) => {
    // store an example classroom state for UI testing
    /*
    data.classroomMeta = classroomMetaSample
    data.participants = participantsSample
    data.messages = messagesSample
    */
    try {
      await joinClassroom(values.classroomId);
    } catch (ex) {
      localData.alertMessage = ex.error;
      localData.showAlert = true;
    }
  };

  const onChange = async (event) => {
    const classroomId = event.currentTarget.value;
    if (!await schema.isValid({ classroomId })) {
      data.peekClassroomMeta = null;
      return;
    }
    try {
      data.peekClassroomMeta = await peekClassroom(classroomId);
    } catch (ex) {
      data.peekClassroomMeta = ex;
    }
  };

  return (
    <div>
      <h3>Join Classroom</h3>
      <Alert
        className="m-2"
        show={localData.showAlert}
        variant="warning"
        onClose={() => { localData.showAlert = false; }}
        dismissible
      >
        {localData.alertMessage}
      </Alert>
      <Formik
        validationSchema={schema}
        onSubmit={onSubmit}
        initialValues={{
          classroomId: localData.initialClassroomId,
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
              <Form.Label>Paste invite link or classroom ID here</Form.Label>
              <Form.Control
                type="text"
                name="classroomId"
                value={values.classroomId}
                onChange={(event) => {
                  // TODO: convert invite link to classroom ID
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

            <Card>
              {(() => {
                if (!data.peekClassroomMeta) return (<p>Enter classroom ID to see a preview</p>);
                if (data.peekClassroomMeta.error) return (<p>{data.peekClassroomMeta.error}</p>);
                let closedAt = null;
                if (data.peekClassroomMeta.value.closedAt) {
                  closedAt = (
                    <p>
                      <b>
                        Closed at
                        {' '}
                        {data.peekClassroomMeta.value.closedAt.toString()}
                      </b>
                    </p>
                  );
                }
                return (
                  <>
                    <p><b>{data.peekClassroomMeta.value.name}</b></p>
                    <span>
                      {data.peekClassroomMeta.value.participantCount}
                      {' '}
                      participants
                    </span>
                    <span>
                      Hosted by
                      {' '}
                      {data.peekClassroomMeta.value.host.name}
                    </span>
                    <p>
                      Started at
                      {' '}
                      {data.peekClassroomMeta.value.createdAt.toString()}
                    </p>
                    {closedAt}
                  </>
                );
              })()}
            </Card>
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
