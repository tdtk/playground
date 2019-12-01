import { PuppyVM } from '@playpuppy/puppy2d';

export const submitCommand = (puppy: PuppyVM | null) => (cmd: string) => {
  if (puppy) {
    const os = puppy.os;
    const splited = cmd.split(' ');
    const command = splited[0];
    const args = splited.slice(1);
    os.exec(command, args);
  }
};
