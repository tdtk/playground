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
