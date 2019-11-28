import { PuppyVM as Puppy } from '@playpuppy/puppy2d';

export const resize = (puppy: Puppy | null) => (w: number, h: number) => {
  if (puppy) {
    return puppy.resize(w, h);
  } else {
    return;
  }
};

export const play = (puppy: Puppy | null) => (source: string) => () => {
  if (puppy && puppy.load(source)) {
    puppy.start();
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
