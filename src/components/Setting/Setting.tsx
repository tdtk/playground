import React from 'react';
import { Modal, Form, FormControl } from 'react-bootstrap';
import './Setting.css';

type SettingProps = {
  show: boolean;
  value: string;
  setShow: (show: boolean) => void;
  setValue: (v: string) => void;
  submitValue: (v: string) => void;
};

const Setting: React.FC<SettingProps> = (props: SettingProps) => {
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    props.submitValue(props.value);
    props.setShow(false);
    if (e.preventDefault) {
      e.preventDefault();
    }
    return false;
  };
  return (
    <Modal show={props.show} onHide={() => props.setShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Puppy Setting</Modal.Title>
      </Modal.Header>
      <Form id="puppy-setting" onSubmit={onSubmit}>
        <Form.Group controlId="formCommand">
          <FormControl
            value={props.value}
            onChange={(e: any) => props.setValue(e.target.value)}
          />
        </Form.Group>
      </Form>
    </Modal>
  );
};

export default Setting;
