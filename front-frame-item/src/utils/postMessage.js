// 与父组件的通信
export function sendPostMessage() {
  if (window.top) {
    window.top.postMessage({
      type: 4,
      data: {
        type: "sendUnauthorized", // 401
      },
      app: 3,
    });
  }
}
