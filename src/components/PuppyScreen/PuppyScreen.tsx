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

type PuppyFooterProps = {
  isCourseVisible: boolean;
  setIsCourseVisible: (visible: boolean) => void;
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
      <Button style={{ paddingRight: '1em', paddingLeft: '0.4em' }}>
        <FontAwesomeIcon
          size={'xs'}
          icon={faTerminal}
          style={{ verticalAlign: 'top' }}
        />
      </Button>
    </div>
  );
};

export type PuppyScreenProps = PuppyFooterProps & {
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
        setTimeout(function() {
          const w = document.getElementById('puppy-screen')!.clientWidth;
          const h = document.getElementById('puppy-screen')!.clientHeight;
          props.setSize(w, h);
        }, 300)
      );
    });
  }, []);

  return (
    <>
      <div
        id="puppy-screen"
        onClick={() => props.setIsCourseVisible(false)}
      ></div>
      <PuppyFooter
        isCourseVisible={props.isCourseVisible}
        setIsCourseVisible={props.setIsCourseVisible}
        play={props.play}
        fullscreen={props.fullscreen}
      />
    </>
  );
};

export default PuppyScreen;
