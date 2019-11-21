export const callKoinu = (NLPSymbol: string) =>
  fetch(`http://localhost:8888/api/option/${NLPSymbol}`, {
    method: 'POST',
  }).then((res: Response) => {
    if (res.ok) {
      return res.json();
    }
  });
