export class Subscribable<TListener extends Function> {
  protected listeners: Set<TListener> = new Set();

  public subscribe(listener: TListener) {
    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  }
}
