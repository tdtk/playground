export class AutoPlayer {
  private isRun = false;

  private run(func: () => void) {
    func();
    setTimeout(() => {
      if (this.isRun) {
        this.run(func);
      }
    }, 8000);
  }

  public play(func: () => void) {
    if (this.isRun) {
      this.isRun = false;
    } else {
      this.isRun = true;
      this.run(func);
    }
  }
}
