import { loadFile } from './util';

export type CourseShape = {
  title: string;
  list: {
    path: string;
    title: string;
  }[];
};

export type Courses = { [path: string]: CourseShape };

export type GitHubContent = {
  type: 'file' | 'dir';
  name: string;
  path: string;
  download_url: string | null;
};

export type GitHubContents = GitHubContent[];

// https://developer.github.com/v3/repos/contents/
const GITHUB_API_REPO =
  'https://api.github.com/repos/playpuppy/course-demo/contents/';

const headers = new Headers({
  Origin: process.env['PUBLIC_URL']!,
});

const fetchFileFromGitHub = (path: string) =>
  fetch(path, { headers })
    .then((res: Response) => {
      if (res.ok) {
        return res.json();
      }
      throw Error(res.status.toString());
    })
    .then((content: GitHubContent) => {
      if (content.download_url) {
        return fetch(content.download_url, { headers });
      }
      throw Error(`This path ${path} is not file.`);
    });

const fetchSettingFromGitHub = (path: string, courses: Courses) =>
  fetchFileFromGitHub(`${GITHUB_API_REPO}${path}/setting.json`)
    .then((res: Response) => {
      if (res.ok) {
        return res.json();
      }
    })
    .then((course: CourseShape) => {
      courses[path] = course;
    })
    .catch((msg: string) => {
      console.log(`ERR ${msg}`);
    });

export const fetchCoursesFromGitHub = (
  setCourses: (courses: Courses) => void
) =>
  fetch(`${GITHUB_API_REPO}course`, { headers })
    .then((res: Response) => {
      if (res.ok) {
        return res.json();
      }
    })
    .then((contents: GitHubContents) => {
      const fetchSettingPromises: Promise<void | undefined>[] = [];
      const courses: Courses = {};
      for (const content of contents) {
        if (content.type === 'dir') {
          fetchSettingPromises.push(
            fetchSettingFromGitHub(content.path, courses)
          );
        }
      }
      Promise.all(fetchSettingPromises).then(() => setCourses(courses));
    });

export const fetchTextFromGitHub = (setContent: (content: string) => void) => (
  coursePath: string,
  path: string
): Promise<void> =>
  fetchFileFromGitHub(`${GITHUB_API_REPO}${coursePath}${path}/index.md`)
    .then((res: Response) => {
      if (res.ok) {
        return res.text();
      }
      throw new Error(res.statusText);
    })
    .then((text: string) => {
      setContent(text);
    });

export const fetchSampleFromGitHub = (setSource: (sample: string) => void) => (
  coursePath: string,
  path: string
): Promise<string> => {
  const sample = window.sessionStorage.getItem(
    `${coursePath}${path}/sample.py`
  );
  if (sample) {
    setSource(sample);
    return new Promise(() => sample);
  }
  return fetchFileFromGitHub(`${GITHUB_API_REPO}${coursePath}${path}/sample.py`)
    .then((res: Response) => {
      if (res.ok) {
        return res.text();
      }
      throw new Error(res.statusText);
    })
    .then((sample: string) => {
      setSource(sample);
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
