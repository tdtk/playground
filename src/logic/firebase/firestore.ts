import firebase from './init';

export type User = {
  email: string;
  name: string;
  uid: string;
};

export type FontSizeLog = {
  type: 'font-size';
  value: {
    old_value: number;
    new_value: number;
  };
};

export type IntervalLog = {
  type: 'interval';
  value: {
    old_value: number;
    new_value: number;
  };
};

export type ChangedEnvLog = {
  type: 'changed-env';
  value: {
    key: string;
    old_value: string;
    new_value: string;
  };
};

type LogValue = FontSizeLog | IntervalLog | ChangedEnvLog;

type Log = LogValue & {
  time: firebase.firestore.Timestamp;
  uid: string;
};

export const add_log = (logValue: LogValue, time: Date, uid: string) => {
  firebase
    .firestore()
    .collection('logs')
    .add({
      type: logValue.type,
      value: logValue.value,
      time: firebase.firestore.Timestamp.fromDate(time),
      uid,
    });
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
