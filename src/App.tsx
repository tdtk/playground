import React, { useState, useEffect } from 'react';
import './App.css';
import { Container, Row, Col } from 'react-bootstrap';
import Header from './components/Header/Header';
import Version from './components/Version/Version';
import Setting from './components/Setting/Setting';
import PuppyScreen from './components/PuppyScreen/PuppyScreen';
import Editor from './components/Editor/Editor';
import Course from './components/Course/Course';
import { QueryParams } from './index';
import {
  Courses,
  CourseShape,
  fetchTextFromGitHub,
  fetchSampleFromGitHub,
  fetchCoursesFromGitHub,
} from './logic/course';
import { PuppyOS, PuppyVM } from '@playpuppy/puppy2d';
import { LineEvent, ActionEvent } from '@playpuppy/puppy2d/dist/events';
import {
  play as puppyplay,
  fullscreen,
  resize,
  initConsole,
  ConsoleValue,
} from './logic/puppy';
import {
  onChange,
  editorDidMount,
  fontMinus,
  fontPlus,
  CodeEditor,
  setErrorLogs,
  setCodeHighLight,
  resetCodeHighLight,
} from './logic/editor';
import { submitCommand } from './logic/setting';
import { AutoPlayer } from './logic/autoplay';

type AppProps = { qs: QueryParams; hash: string };

const App: React.FC<AppProps> = (props: AppProps) => {
  const coursePath = props.qs.course ? props.qs.course : 'course/TronShow';
  const page = props.hash !== '' ? parseInt(props.hash.substr(1)) : 0;
  const [courses, setCourses] = useState({} as Courses);
  const [isShowVersion, setIsShowVersion] = useState(false);
  const [isCourseVisible, setIsCourseVisible] = useState(false);
  const [course, setCourse] = useState({ title: '', list: [] } as CourseShape);
  const [courseContent, setCourseContent] = useState('');
  const [puppy, setPuppy] = useState(null as PuppyVM | null);
  const [source, setSource] = useState('');
  const [editorTheme, setEditorTheme] = useState('vs');
  const [editorFontSize, setEditorFontSize] = useState(24);
  const [codeEditor, setCodeEditor] = useState(null as CodeEditor | null);
  const [decos, setDecos] = useState([] as string[]);
  const [isShowSetting, setIsShowSetting] = useState(false);
  const [settingCommand, setSettingCommand] = useState('');
  const [isConsoleVisible, setIsConsoleVisible] = useState(false);
  const [consoleValue, setConsoleValue] = useState([] as ConsoleValue);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [isDebug, setIsDebug] = useState(false);
  const [autoPlayer, _setAutoPlayer] = useState(new AutoPlayer());
  const [_highlight, setHighLight] = useState([] as string[]);
  const [codeChangeTimer, setCodeChangeTimer] = useState(
    null as NodeJS.Timer | null
  );

  const autoPlayFunc = () => {
    const page =
      window.location.hash !== ''
        ? parseInt(window.location.hash.substr(1))
        : 0;
    window.location.hash = `#${page === course.list.length - 1 ? 0 : page + 1}`;
  };
  const play = (puppy: PuppyVM | null) => (source: string) => () => {
    if (course.list.length !== 0) {
      sessionStorage.setItem(
        `${coursePath}${course.list[page].path}/sample.py`,
        source
      );
    }
    setConsoleValue([]);
    if (codeEditor) {
      codeEditor.setSelection({
        startColumn: 0,
        endColumn: 0,
        startLineNumber: 0,
        endLineNumber: 0,
      });
    }
    if (puppyplay(puppy)(source)()) {
      setEditorTheme('vs');
    } else {
      setEditorTheme('error');
    }
  };

  useEffect(() => {
    fetchCoursesFromGitHub(setCourses);
    const puppyElement = document.getElementById('puppy-screen');
    if (puppyElement) {
      const puppyOS = new PuppyOS();
      const puppy = puppyOS.newPuppyVM(puppyElement);
      setPuppy(puppy);
    }
  }, []);
  useEffect(() => {
    if (puppy) {
      puppy.addEventListener('error', setErrorLogs(codeEditor)('error'));
      puppy.addEventListener('warning', setErrorLogs(codeEditor)('warning'));
      puppy.addEventListener('info', setErrorLogs(codeEditor)('info'));
    }
  }, [puppy, codeEditor]);
  useEffect(() => {
    if (puppy && codeEditor) {
      puppy.addEventListener('line', (e: LineEvent) => {
        setCodeHighLight(setHighLight, codeEditor)(e.row + 1, e.row + 1);
      });
      puppy.addEventListener('action', (e: ActionEvent) => {
        if (e.action == 'end' && e.type == 'run') {
          resetCodeHighLight(setHighLight, codeEditor)();
        }
      });
    }
  }, [puppy, codeEditor, setHighLight]);
  useEffect(() => {
    initConsole(
      setConsoleValue,
      { AUTO_PLAY: setIsAutoPlay, DEBUG: setIsDebug },
      puppy
    );
    if (puppy) {
      setIsAutoPlay(puppy.os.getenv('AUTO_PLAY', false) === 'true');
      setIsDebug(puppy.os.getenv('DEBUG', false) === 'true');
    }
  }, [puppy]);
  useEffect(() => {
    if (courses[coursePath]) {
      setCourse(courses[coursePath]);
    }
  }, [coursePath, courses]);
  useEffect(() => {
    if (puppy) {
      // const appendLine = (stringElements: StringElement[]) =>
      //   setConsoleValue(prev => prev.concat([stringElements]));
      // if (isDebug) {
      //   puppy.addEventListener('action', (e: ActionEvent) => {
      //     const stringElements: StringElement[] = [];
      //     stringElements.push({
      //       value: `> Puppy ${e.type} ${e.action}`,
      //     });
      //     appendLine(stringElements);
      //   });
      // } else {
      //   puppy.resetEventListener('action');
      // }
    }
  }, [isDebug, puppy]);

  return (
    <div className="App">
      <Container className="container">
        <Header
          courses={courses}
          setIsShowVersion={setIsShowVersion}
          setIsShowSetting={() => setIsShowSetting(true)}
        />
        <Version show={isShowVersion} setShow={setIsShowVersion} />
        <Setting
          show={isShowSetting}
          setShow={setIsShowSetting}
          value={settingCommand}
          setValue={setSettingCommand}
          submitValue={submitCommand(puppy)}
        />
        <Row id="main-row">
          <Col id="left-col" xs={6}>
            <Course
              course={course}
              coursePath={coursePath}
              page={page}
              content={courseContent}
              visible={isCourseVisible}
              play={play(puppy)}
              fetchContent={fetchTextFromGitHub(setCourseContent)}
              fetchSample={fetchSampleFromGitHub(setSource)}
            />
            <PuppyScreen
              isCourseVisible={isCourseVisible}
              isConsoleVisible={isConsoleVisible}
              setIsCourseVisible={setIsCourseVisible}
              setIsConsoleVisible={setIsConsoleVisible}
              consoleValue={consoleValue}
              play={
                isAutoPlay
                  ? () => autoPlayer.play(autoPlayFunc)
                  : play(puppy)(source)
              }
              fullscreen={fullscreen(puppy)}
              setSize={resize(puppy)}
            />
          </Col>
          <Col id="right-col" xs={6}>
            <Editor
              fontSize={editorFontSize}
              theme={editorTheme}
              source={source}
              onChange={onChange(
                codeEditor,
                setSource,
                decos,
                setDecos,
                puppy,
                codeChangeTimer,
                setCodeChangeTimer
              )}
              editorDidMount={editorDidMount(setCodeEditor)}
              fontPlus={fontPlus(editorFontSize, setEditorFontSize)}
              fontMinus={fontMinus(editorFontSize, setEditorFontSize)}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default App;
