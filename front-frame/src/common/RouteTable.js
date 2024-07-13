

export function RouteTable() {
  return new class _RouteTable {
    static instance = null;

    constructor() {
      if (_RouteTable.instance) {
        return _RouteTable.instance;
      }

      _RouteTable.instance = this;
    }

    openPage() {
      // TODO 当将要打开的页面所在的应用没有初始化 如何获取路由配置?
    }
  }
}
