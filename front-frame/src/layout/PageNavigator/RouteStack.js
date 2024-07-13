
export function RouteStack() {
  return new class _RouteStack {
    static instance = null;
    #routeStack = [];

    get length() {
      return this.#routeStack.length;
    }

    get lastEl() {
      return this.#routeStack[this.length - 1];
    }

    constructor() {
      if (_RouteStack.instance) {
        return _RouteStack.instance;
      }

      _RouteStack.instance = this;
    }

    push(route) {
      const {lastEl} = this;

      if (lastEl && route === lastEl) {
        return;
      }

      this.#routeStack.push(route);

      if (this.length > 100) {
        this.#routeStack.shift();
      }
    }

    at(index) {
      return this.#routeStack[index];
    }

    previous(visitedViews, options) {
      const {  routeTo, queryParams } = options || {};

      if (routeTo) {
        const view = visitedViews.find(value => value.route === routeTo);

        if (view) {
          view.query = Object.assign(view.query || {}, queryParams || {});
          return view;
        }
      }

      for (let i = this.length - 1; i > -1; i--) {
        const item = this.at(i);

        const view = visitedViews.find(value => value.route === item);

        if (view) {
          return view;
        }
      }

      return visitedViews.slice(-1)[0];
    }
  }
}
