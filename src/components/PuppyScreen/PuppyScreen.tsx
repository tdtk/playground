import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import './PuppyScreen.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlay,
  faExpand,
  faBookOpen,
  faBook,
  faTerminal,
} from '@fortawesome/free-solid-svg-icons';
import MonacoEditor from 'react-monaco-editor';

type PuppyConsoleProps = {
  consoleValue: string;
};

const PuppyConsole: React.FC<PuppyConsoleProps> = (
  props: PuppyConsoleProps
) => {
  const [height, setHeight] = useState(500);
  const [width, setWidth] = useState(500);
  const [resizeTimer, setResizeTimer] = useState(null as NodeJS.Timer | null);
  const editorOptions = {
    fontSize: 30,
    wordWrap: 'on' as 'on',
    lineNumbers: 'off' as 'off',
    readOnly: true,
  };

  useEffect(() => {
    addEventListener('resize', () => {
      if (resizeTimer) {
        clearTimeout(resizeTimer);
        return;
      }
      setResizeTimer(
        setTimeout(() => {
          setHeight(document.getElementById('left-col')!.clientHeight);
          setWidth(document.getElementById('left-col')!.clientWidth);
        }, 300)
      );
    });
    setHeight(document.getElementById('left-col')!.clientHeight);
    setWidth(document.getElementById('left-col')!.clientWidth);
  }, []);

  return (
    <MonacoEditor
      width={width}
      height={height}
      options={editorOptions}
      value={props.consoleValue}
      language={'python'}
      theme={'vs-dark'}
    />
  );
};

type PuppyFooterProps = {
  isCourseVisible: boolean;
  isConsoleVisible: boolean;
  setIsCourseVisible: (visible: boolean) => void;
  setIsConsoleVisible: (visible: boolean) => void;
  fullscreen: () => void;
  play: () => void;
};

const PuppyFooter: React.FC<PuppyFooterProps> = (props: PuppyFooterProps) => {
  return (
    <div id="puppy-footer">
      <Button onClick={() => props.play()}>
        <FontAwesomeIcon icon={faPlay} />
        {' Play'}
      </Button>
      <Button onClick={() => props.fullscreen()}>
        <FontAwesomeIcon icon={faExpand} />
      </Button>
      <Button onClick={() => props.setIsCourseVisible(!props.isCourseVisible)}>
        <FontAwesomeIcon icon={props.isCourseVisible ? faBookOpen : faBook} />
      </Button>
      <Button
        style={{ paddingRight: '1em', paddingLeft: '0.4em' }}
        onClick={() => props.setIsConsoleVisible(!props.isConsoleVisible)}
      >
        <FontAwesomeIcon
          size={'xs'}
          icon={faTerminal}
          style={{ verticalAlign: 'top' }}
        />
      </Button>
    </div>
  );
};

export type PuppyScreenProps = PuppyConsoleProps &
  PuppyFooterProps & {
    setSize: (width: number, height: number) => void;
  };

const PuppyScreen: React.FC<PuppyScreenProps> = (props: PuppyScreenProps) => {
  const [resizeTimer, setResizeTimer] = useState(null as NodeJS.Timeout | null);
  useEffect(() => {
    addEventListener('resize', () => {
      if (resizeTimer) {
        clearTimeout(resizeTimer);
        setResizeTimer(null);
      }
      setResizeTimer(
        setTimeout(() => {
          const w = document.getElementById('puppy-screen')!.clientWidth;
          const h = document.getElementById('puppy-screen')!.clientHeight;
          props.setSize(w, h);
        }, 300)
      );
    });
  }, [props.setSize]);

  return (
    <>
      <div
        id="puppy-screen"
        onClick={() => props.setIsCourseVisible(false)}
      ></div>
      <div
        id="puppy-console"
        style={{ visibility: props.isConsoleVisible ? 'visible' : 'hidden' }}
      >
        <PuppyConsole consoleValue={props.consoleValue} />
      </div>
      <PuppyFooter
        isCourseVisible={props.isCourseVisible}
        isConsoleVisible={props.isConsoleVisible}
        setIsCourseVisible={props.setIsCourseVisible}
        setIsConsoleVisible={props.setIsConsoleVisible}
        play={props.play}
        fullscreen={props.fullscreen}
      />
    </>
  );
};

export default PuppyScreen;
