import React, { useEffect } from 'react';
import { Formik } from 'formik';
import qs from 'qs';
import * as yup from 'yup';
import {
  Button, Form, Card
} from 'react-bootstrap';
import { useHistory, useLocation } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { useStates } from 'use-states';
import { useDataStore } from '../contexts/DataStoreProvider.jsx';
import { useRealtime } from '../contexts/RealtimeProvider.jsx';
import { useToast } from '../contexts/ToastProvider.jsx';


const schema = yup.object().shape({
  classroomId: yup.string().matches(/^[0-9a-f]{24}$/si, 'The classroom ID is invalid').label('Classroom ID'),
});


export default function JoinClassroom() {
  const location = useLocation();

  const history = useHistory();

  const { data } = useDataStore();

  const { toast } = useToast();

  const { peekClassroom, joinClassroom } = useRealtime();

  const localData = useStates({
    initialClassroomId: () => qs.parse(location.search, { ignoreQueryPrefix: true }).id ?? ''
  });

  useEffect(() => {
    if (data.classroomMeta) history.push('/classroom/session');
  }, [data.classroomMeta]);

  const onSubmit = async (values) => {
    try {
      await joinClassroom(values.classroomId);
    } catch (ex) {
      toast('error', 'Failed to join classroom', ex.error);
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
