import { loadFile } from './util';

const TMP_PATH = 'setting/tmp';

export const initSetting = (setSetting: (setting: JSON) => void) => {
  loadFile('/setting.json').then((setting: string) => {
    setSetting(JSON.parse(setting));
  });
};

export const openSetting = (
  setIsSettingOpened: (isOpened: boolean) => void,
  source: string,
  setSource: (source: string) => void,
  setLang: (lang: string) => void
) => () => {
  setIsSettingOpened(true);
  window.sessionStorage.setItem(TMP_PATH, source);
  loadFile('/setting.json').then((setting: string) => {
    setSource(setting);
    setLang('json');
  });
};

export const closeSetting = (
  setIsSettingOpened: (isOpened: boolean) => void,
  source: string,
  setSource: (source: string) => void,
  setSetting: (setting: JSON) => void,
  setLang: (lang: string) => void
) => () => {
  setIsSettingOpened(false);
  const code = window.sessionStorage.getItem(TMP_PATH);
  if (source) {
    try {
      const json = JSON.parse(source);
      setSetting(json);
    } catch {
      console.log(source);
    }
  }
  if (code) {
    setSource(code);
    setLang('python');
  }
};
