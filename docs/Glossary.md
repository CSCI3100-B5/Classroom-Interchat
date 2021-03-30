# Glossary

## Persons

**`User`**

All persons that interactive with the system, including `instructors` and `students`. All users can join and leave `classrooms`,reply to `questions` and send `messages` (subject to moderation by `instructors`)

**`Instructor`**

A kind of user with the permission to create/`enable`/`disable`/delete `classrooms`, `mute` or `unmute` `participants` and create `quizzes`

**`Student`**

A kind of user that can possess `tokens` and ask `questions` in `chatbox`

**`Participant`**

A `user` that has joined a `classroom`

**`Mute participant`**

Disallow the `participant` from sending any kind of `messages`. The `participant` can still answer `quizzes`.

**`Unmute participant`**

Reallow the `participant` to send `messages`.

## Classrooms

**`Classroom`**

A session. `Instructors` create a classroom and ask `students` to join when they start a lecture, and end it when the lecture ends

**`Disable classroom`**

Have an effect similar to temporarily `muting` everyone in the classroom. (Their actual `mute` status is unchanged)

**`Enable classroom`**

Remove the global `mute` effect

**`Chatbox`**

The place where all the interactions happen. Contains all `messages`. Chatbox is just a name for the UI component, not a real system entity. (In the class diagram, `classroom` contains the message and there isn't a class called chatbox)

## Messages

**`Messages`**

Things that `instructors` or `students` send in the `chatbox`. Can be a `normal message`, a `quiz` (sent by `instructors`) or a `question` (sent by `students` pr `instructors`)

**`Normal message`**

A `message` with text

**`Quiz`**

A `message` sent by `instructors`, intended to test the `students`' understanding or ask for opinions. Quizzes can be closed manually by the `instructor`. `Students` can obtain `tokens` from answering quizzes if the `instructors` choose to award them when the quiz ends. Can be a `short answer quiz` or a `multiple choice quiz`

**`Short answer quiz`**

A type of `quiz` where `students` can type any textual response. The result will be listed (similar to uReply). There are no correct answers.

**`Multiple choice quiz`**

A type of `quiz` where `students` can pick one out of 2 to 10 choices or type in "other" (if the `instructor` allows `students` to hand in other responses). The result will be shown as the percentage of students choosing each choice and other responses will be listed out. A correct answer can be set, or if there isn't a correct answer, this `quiz` simply becomes a poll.

**`Question`**

A `message` sent by `students` to ask for help or explanation. All `users` can answer questions either by typing under the question or answering through voice (out of our system). Typed answers will appear directly below the question instead of mixing with `normal messages`. The senders of questions can **resolve** the questions when they are satisfied with the answers. A question can no longer accept answers after it is **resolved**.

## Tokens

**`Token`**

A token is the reward for students for answering `quizzes` that contains a reward. It contains a value (just additional data that follows the token and is of no use in our system) and an ID. It is awarded to the **first student that has answered the `quiz` correctly**. `Students` can see a list of tokens that they have earned in their account. `Students` can use the token by copying the token ID elsewhere. `Instructors` can check that the token ID is genuine through the system. e.g. homework coupon can be supported by our system as a form of token
