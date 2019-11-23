export type CourseShape = {
  title: string;
  list: {
    path: string;
    title: string;
  }[];
};

export type Courses = { [path: string]: CourseShape };

export const loadFile: (path: string) => Promise<string> = path => {
  return fetch(`${process.env['PUBLIC_URL']}${path}`, {
    method: 'GET',
  })
    .then((res: Response) => {
      if (res.ok) {
        return res.text();
      }
      throw new Error(res.statusText);
    })
    .then((sample: string) => {
      return sample;
    });
};

export const fetchSetting = (setCourse: (course: CourseShape) => void) => (
  path: string
): Promise<void> =>
  loadFile(`/course/${path}/setting.json`)
    .then((s: string) => {
      return JSON.parse(s);
    })
    .then((course: CourseShape) => {
      setCourse(course);
    })
    .catch((msg: string) => {
      console.log(`ERR ${msg}`);
    });

export const fetchContent = (setContent: (content: string) => void) => (
  coursePath: string,
  path: string
): Promise<void> =>
  loadFile(`/course/${coursePath}/${path}/index.md`).then((content: string) =>
    setContent(content)
  );

export const fetchSample = (setSource: (source: string) => void) => (
  coursePath: string,
  path: string
): Promise<string> => {
  const sample = window.sessionStorage.getItem(
    `/course/${coursePath}/${path}/sample.py`
  );
  if (sample) {
    setSource(sample);
    return new Promise(() => sample);
  }
  return loadFile(`/course/${coursePath}/${path}/sample.py`).then(
    (sample: string) => {
      setSource(sample);
      return sample;
    }
  );
};

export const fetchCourses = (setCourses: (courses: Courses) => void) => {
  const courses: Courses = {};
  const get_course: Promise<void>[] = ['NLP'].map((courseName: string) =>
    loadFile(`/course/${courseName}/setting.json`)
      .then((s: string) => JSON.parse(s))
      .then((course: CourseShape) => {
        courses[courseName] = course;
      })
  );
  Promise.all(get_course).then(() => setCourses(courses));
};
