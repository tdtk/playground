import firebase from './init';

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
