import React from 'react';
import { Modal, FormControl } from 'react-bootstrap';

export type LoginProps = {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
};

const Login: React.FC<LoginProps> = (props: LoginProps) => {
  return (
    <>
      <Modal show={props.show} onHide={() => props.setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <label>e-mail</label>
          <FormControl placeholder="e-mail" />
          <label>password</label>
          <FormControl placeholder="password" />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Login;
