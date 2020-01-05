import firebase from './init';
import { set_user } from './firestore';
import { PuppyVM } from '@playpuppy/puppy2d';

const provider = new firebase.auth.GoogleAuthProvider();

export const signInByGoogle = (puppyVM: PuppyVM | null) =>
  firebase
    .auth()
    .signInWithPopup(provider)
    .then(result => {
      if (puppyVM) {
        puppyVM.os.setenv('USER', result.user!.uid!);
      }
      set_user({
        name: result.user!.displayName!,
        email: result.user!.email!,
        uid: result.user!.uid!,
      });
    });
