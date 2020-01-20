import React, { useState, useEffect } from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { CourseShape } from '../../logic/course';
import { faCog, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from 'react-bootstrap';
import './Header.css';

export type HeaderProps = {
  courses: { [path: string]: CourseShape };
  userName: string;
  setIsShowVersion: (isShow: boolean) => void;
  setIsShowSetting: () => void;
  setIsShowLogin: () => void;
};

const Header: React.FC<HeaderProps> = (props: HeaderProps) => {
  const [sortedCourses, setSortedCourses] = useState([] as [
    string,
    CourseShape
  ][]);
  useEffect(() => {
    const sorted_keys = Object.keys(props.courses).sort();
    const sc: [string, CourseShape][] = [];
    for (const key of sorted_keys) {
      sc.push([key, props.courses[key]]);
    }
    setSortedCourses(sc);
  }, [props.courses]);
  return (
    <div className="Header" id="puppy-header">
      <Navbar bg="white" variant="light" expand="lg">
        <Navbar.Brand onClick={() => props.setIsShowVersion(true)}>
          <img
            src="./image/logo.png"
            width="25"
            height="25"
            className="d-inline-block align-top"
          />
          {' Puppy'}
        </Navbar.Brand>
        <Nav className="mr-auto">
          <NavDropdown title={'Courseware'} id="nav-dropdown-courses">
            {sortedCourses.map(c => {
              const [course_path, course] = c;
              return (
                <NavDropdown
                  title={course.title}
                  id={`nav-dropdown-pages-${course.title}`}
                  drop="right"
                  key={course.title}
                >
                  {course.list.map(
                    (page: { path: string; title: string }, i: number) => (
                      <NavDropdown.Item
                        href={`?course=${course_path}#${i}`}
                        key={i}
                      >
                        {page.title}
                      </NavDropdown.Item>
                    )
                  )}
                </NavDropdown>
              );
            })}
          </NavDropdown>
        </Nav>
        <div className="header-buttons">
          <Button className="puppy-background" onClick={props.setIsShowLogin}>
            <FontAwesomeIcon icon={faUser} />
            {` ${props.userName}`}
          </Button>
          <Button className="puppy-background" onClick={props.setIsShowSetting}>
            <FontAwesomeIcon icon={faCog} />
          </Button>
        </div>
      </Navbar>
    </div>
  );
};

export default Header;
