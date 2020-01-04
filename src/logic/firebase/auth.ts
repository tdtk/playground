import firebase from './init';
import { get_user } from './firestore';

const provider = new firebase.auth.GoogleAuthProvider();

export const signInByGoogle = () =>
  firebase
    .auth()
    .signInWithPopup(provider)
    .then(result => {
      console.log(result);
      get_user();
    });
