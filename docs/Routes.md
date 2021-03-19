# Routes and page components

- `/` is the landing page which introduces the system.
- `/login` shows the log in and sign up boxes.
- `/account` allows users to edit basic account info (such as password), and check the tokens they have earned.
- `/classroom` is the main part of the system where users can join and create classrooms. Realtime interactions are accessible in this route once users are inside a classroom.

  > The interactive interface consists of 3 parts:
  >
  > - **Chat box**: the place for sending and receiving messages
  > - **Dashboard**: the place for instructors to control the classroom, such as creating quizzes and disabling the classroom.
  > - **Info**: the component that shows basic info, such as name and participant count, of the classroom. A participant list can be brought up through the info component.
