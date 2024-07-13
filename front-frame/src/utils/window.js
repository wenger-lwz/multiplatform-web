
const fnMap = new WeakMap();

export const onResize = (fn) => {
  if (fnMap.has(fn)) {
    throw new Error('方法' + fn + '已经绑定到了onResize');
  };
  window.addEventListener("resize", function(...argv) {
    fn(...argv)
  });
  fnMap.set(fn)
}