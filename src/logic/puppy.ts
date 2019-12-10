import { PuppyVM as Puppy } from '@playpuppy/puppy2d';
import { OutputEvent } from '@playpuppy/puppy2d/dist/events';

export type StringElement = {
  color?: string;
  backgroundColor?: string;
  value: string;
};

export type ConsoleValue = StringElement[][];

export const resize = (puppy: Puppy | null) => (w: number, h: number) => {
  if (puppy) {
    return puppy.resize(w, h);
  } else {
    return;
  }
};

export const play = (puppy: Puppy | null) => (source: string) => () => {
  if (puppy && puppy.load(source)) {
    return true;
  } else {
    return false;
  }
};

export const fullscreen = (puppy: Puppy | null) => () => {
  if (puppy) {
    const canvas = puppy.render!.canvas;
    if (canvas) {
      // FIXME
      if (canvas['webkitRequestFullscreen']) {
        canvas['webkitRequestFullscreen'](); // Chrome15+, Safari5.1+, Opera15+
      } else if (canvas['mozRequestFullScreen']) {
        canvas['mozRequestFullScreen'](); // FF10+
      } else if (canvas['msRequestFullscreen']) {
        canvas['msRequestFullscreen'](); // IE11+
      } else if (canvas['requestFullscreen']) {
        canvas['requestFullscreen'](); // HTML5 Fullscreen API仕様
      } else {
        // alert('ご利用のブラウザはフルスクリーン操作に対応していません');
        return;
      }
    }
  }
};

export const initConsole = (
  setConsoleValue: (action: React.SetStateAction<ConsoleValue>) => void,
  settingAction: {
    AUTO_PLAY: React.Dispatch<React.SetStateAction<boolean>>;
    DEBUG: React.Dispatch<React.SetStateAction<boolean>>;
  },
  puppy: Puppy | null
) => {
  if (puppy) {
    const appendLine = (stringElements: StringElement[]) =>
      setConsoleValue(prev => prev.concat([stringElements]));
    puppy.addEventListener('stdout', (e: OutputEvent) => {
      const stringElements: StringElement[] = [];
      stringElements.push({
        value: e.text,
      });
      appendLine(stringElements);
    });
    puppy.addEventListener('stderr', (e: OutputEvent) => {
      const stringElements: StringElement[] = [];
      stringElements.push({
        value: e.text,
        color: 'red',
      });
      appendLine(stringElements);
    });
    // puppy.addEventListener('action', (e: ActionEvent) => {
    //   const stringElements: StringElement[] = [];
    //   stringElements.push({
    //     value: `> Puppy ${e.type} ${e.action}`,
    //   });
    //   appendLine(stringElements);
    // });
    const os = puppy.os;
    os.addEventListener(
      'changed',
      (e: {
        key: string;
        value: string;
        oldValue: string;
        env: { [key: string]: any };
      }) => {
        const stringElements: StringElement[] = [];
        if (e.key in settingAction) {
          settingAction[e.key](e.value === 'true');
        }
        stringElements.push({
          value: `> The env value of key "${e.key}" was changed to "${e.value}" from "${e.oldValue}". \n`,
        });
        appendLine(stringElements);
      }
    );
  }
};
