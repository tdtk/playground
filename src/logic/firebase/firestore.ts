import firebase from './init';
import { ErrorLog } from '@playpuppy/puppy2d';

export type User = {
  email: string;
  name: string;
  uid: string;
};

export type ChangedEnvLog = {
  type: 'changed-env';
  value: {
    key: string;
    old_value: string;
    new_value: string;
  };
};

export type CompileErrorLog = {
  type: 'compile-error';
  value: ErrorLog[];
};

type LogValue = ChangedEnvLog | CompileErrorLog;

type Log = LogValue & {
  time: firebase.firestore.Timestamp;
  uid: string;
};

export const add_log = (logValue: LogValue, time: Date) => {
  const usr = firebase.auth().currentUser;
  if (usr) {
    firebase
      .firestore()
      .collection('logs')
      .add({
        type: logValue.type,
        value: logValue.value,
        time: firebase.firestore.Timestamp.fromDate(time),
        uid: usr.uid,
      });
  }
};

export const set_user = (user: User) => {
  firebase
    .firestore()
    .collection('users')
    .doc(user.uid)
    .set(user);
};

export const get_user = () => {
  const db = firebase.firestore();
  db.collection('users')
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        console.log(doc.id, ' => ', doc.data());
      });
    });
};
