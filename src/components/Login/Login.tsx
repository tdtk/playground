import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import google_button from './google_button.png';

export type LoginProps = {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  signInByGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

const Login: React.FC<LoginProps> = (props: LoginProps) => {
  return (
    <>
      <Modal show={props.show} onHide={() => props.setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <img src={google_button} onClick={() => props.signInByGoogle()} />
          </div>
          {/* <label>e-mail</label>
          <FormControl placeholder="e-mail" />
          <label>password</label>
          <FormControl type="password" placeholder="password" />
          <a>Create new account</a> */}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => props.signOut()}>{'サインアウト'}</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Login;
