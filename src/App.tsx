import React, { useState, useEffect } from 'react';
import './App.css';
import { Container, Row, Col } from 'react-bootstrap';
import Header from './components/Header/Header';
import Version from './components/Version/Version';
import PuppyScreen from './components/PuppyScreen/PuppyScreen';
import Editor from './components/Editor/Editor';
import Course from './components/Course/Course';
import { QueryParams } from './index';
import {
  fetchCourses,
  Courses,
  CourseShape,
  fetchContent,
  fetchSample,
  fetchSetting,
} from './logic/course';
import { Puppy } from '@playpuppy/puppy2d';
import { play, fullscreen, resize } from './logic/puppy';
import {
  onChange,
  editorDidMount,
  fontMinus,
  fontPlus,
  CodeEditor,
} from './logic/editor';

type AppProps = { qs: QueryParams; hash: string };

const App: React.FC<AppProps> = (props: AppProps) => {
  const coursePath = props.qs.course ? props.qs.course : 'LIVE2019';
  const page = props.hash !== '' ? parseInt(props.hash.substr(1)) : 0;
  const [courses, setCourses] = useState({} as Courses);
  const [isShowVersion, setIsShowVersion] = useState(false);
  const [isCourseVisible, setIsCourseVisible] = useState(false);
  const [course, setCourse] = useState({ title: '', list: [] } as CourseShape);
  const [courseContent, setCourseContent] = useState('');
  const [puppy, setPuppy] = useState(null as Puppy | null);
  const [source, setSource] = useState('');
  const [editorTheme, _setEditorTheme] = useState('vs');
  const [editorFontSize, setEditorFontSize] = useState(24);
  const [codeEditor, setCodeEditor] = useState(null as CodeEditor | null);
  const [decos, setDecos] = useState([] as string[]);

  useEffect(() => {
    fetchCourses(setCourses);
    const puppyElement = document.getElementById('puppy-screen');
    if (puppyElement) {
      const puppy = new Puppy(puppyElement, {});
      // puppy.addEventListener('error', setLog);
      // puppy.addEventListener('warning', setLog);
      // puppy.addEventListener('info', setLog);
      setPuppy(puppy);
    }
  }, []);
  return (
    <div className="App">
      <Container className="container">
        <Header courses={courses} setIsShowVersion={setIsShowVersion} />
        <Version setShow={setIsShowVersion} show={isShowVersion} />
        <Row id="main-row">
          <Col id="left-col" xs={6}>
            <Course
              course={course}
              coursePath={coursePath}
              page={page}
              content={courseContent}
              visible={isCourseVisible}
              play={play(puppy)}
              fetchContent={fetchContent(setCourseContent)}
              fetchSample={fetchSample(setSource)}
              fetchSetting={fetchSetting(setCourse)}
            />
            <PuppyScreen
              isCourseVisible={isCourseVisible}
              setIsCourseVisible={setIsCourseVisible}
              play={play(puppy)(source)}
              fullscreen={fullscreen(puppy)}
              setSize={resize(puppy)}
            />
          </Col>
          <Col id="right-col" xs={6}>
            <Editor
              fontSize={editorFontSize}
              theme={editorTheme}
              source={source}
              onChange={onChange(codeEditor, setSource, decos, setDecos)}
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

// const App: React.FC<AppProps> = (props: AppProps) => {
//   const coursePath = props.qs.course ? props.qs.course : 'LIVE2019';
//   const page = props.hash !== '' ? parseInt(props.hash.substr(1)) : 0;
//   return (
//     <div className="App">
//       <Container className="container">
//         <Header />
//         <Input />
//         <Version />
//         <Row id="main-row">
//           <Col id="left-col" xs={6}>
//             <Course coursePath={coursePath} page={page} />
//             <PuppyScreen />
//           </Col>
//           <Col id="right-col" xs={6}>
//             <Editor coursePath={coursePath} page={page} />
//           </Col>
//         </Row>
//       </Container>
//     </div>
//   );
// };

export default App;
