import React, { useEffect } from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import { Button, Form } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { useDataStore } from '../contexts/DataStoreProvider.jsx';
import { useRealtime } from '../contexts/RealtimeProvider.jsx';
import { useToast } from '../contexts/ToastProvider.jsx';


const schema = yup.object().shape({
  classroomName: yup.string().required().label('Classroom Name'),
});


export default function CreateClassroom() {
  const history = useHistory();

  const { createClassroom } = useRealtime();

  const { data } = useDataStore();

  const { toast } = useToast();

  useEffect(() => {
    if (data.classroomMeta) history.push('/classroom/session');
  }, [data.classroomMeta]);

  const onSubmit = async (values) => {
    try {
      await createClassroom(values.classroomName);
    } catch (ex) {
      toast('error', 'Failed to create classroom', ex.error);
    }
  };

  return (
    <div>
      <h3>Create Classroom</h3>
      <Formik
        validationSchema={schema}
        onSubmit={onSubmit}
        initialValues={{
          classroomName: '',
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
            <Form.Group controlId="classroomName">
              <Form.Label>Classroom Name</Form.Label>
              <Form.Control
                type="text"
                name="classroomName"
                value={values.classroomName}
                onChange={handleChange}
                isValid={touched.classroomName && !errors.classroomName}
                isInvalid={touched.classroomName && errors.classroomName}
              />
              <Form.Control.Feedback type="invalid">
                {errors.classroomName}
              </Form.Control.Feedback>
            </Form.Group>
            <Button type="submit">Create Classroom</Button>
          </Form>
        )}
      </Formik>
      <div>
        <p>Want to join a classroom instead?</p>
        <LinkContainer to="/classroom/join">
          <Button>Join Classroom</Button>
        </LinkContainer>
      </div>
    </div>
  );
}
