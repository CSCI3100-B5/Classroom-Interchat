# Glossary

## Persons

**`User`**

All persons that interact with the system. All users can join and leave `classrooms`, reply to `questions` and send `messages` (subject to moderation by `instructors`).

**`Participant`**

A `user` that has joined a `classroom`.

**`Instructor`**

A `participant` with elevated permission in a classrom that allows him/her to create/`enable`/`disable`/delete `classrooms`, `mute` or `unmute` `participants` and create `quizzes`.

**`Student`**

A `participant` without elevated permissions in a classroom. A student can request for `instructor` permissions in a classroom, which must be approved by an `instructor`.

**`Mute participant`**

Disallow the `participant` from sending any kind of `messages`. The `participant` can still answer `quizzes`.

**`Unmute participant`**

Reallow the `participant` to send `messages`.

## Classrooms

**`Classroom`**

A session. A `user` create a classroom and automatically gains `instructor` status. He/she can then ask other `users` to join the classroom as `students`.

**`Disable classroom`**

Have an effect similar to temporarily `muting` everyone in the classroom. (Their actual `mute` status is unchanged).

**`Enable classroom`**

Remove the global `mute` effect.

**`Chatbox`**

The place where all the interactions happen. Contains all `messages`. Chatbox is just a name for the UI component, not a real system entity. (In the class diagram, `classroom` contains the message and there isn't a class called chatbox).

## Messages

**`Messages`**

Things that `users` send in the `chatbox`. Can be a `normal message`, a `quiz` (sent by `instructors`) or a `question` (sent by `students` or `instructors`).

**`Normal message`**

A `message` with plain text only.

**`Quiz`**

A `message` sent by `instructors`, intended to test the `participants`' understanding or ask for opinions. Quizzes can be closed manually by the `instructor`. `Participants` can obtain `tokens` from answering quizzes if the `instructors` choose to award them when the quiz ends. Can be a `short answer quiz` or a `multiple choice quiz`

**`Short answer quiz`**

A type of `quiz` where `participants` can type any textual response. The results will be listed (similar to uReply). There are no correct answers.

**`Multiple choice quiz`**

A type of `quiz` where `participants` can pick one out of 2 to 10 choices. The results will be shown as the percentage of students choosing each choice. A correct answer can be set, or if there isn't a correct answer, this `quiz` simply becomes a poll.

**`Question`**

A `message` sent by `participants` to ask for help or explanation. All `participants` can answer questions either by typing under the question or answering through voice (out of our system). Typed answers will be marked as a reply. A filtered view of the message history is available to view all replies to a question. The senders of questions can **resolve** the questions when they are satisfied with the answers. A question can no longer accept answers after it is **resolved**.

## Tokens

**`Token`**

A token is the reward for `participants` for answering `quizzes` that contains a reward. It contains a value (just additional data that follows the token and is of no use in our system) and an ID. The sender of the `quiz` (an `instructor`) can choose who to award tokens to. They can also award tokens directly through the participant list. `Users` can see a list of tokens that they have earned in their account. They can use the token by copying the token ID elsewhere. Sender of the token can check that the token ID is genuine through the system. e.g. homework coupon can be supported by our system as a form of token
