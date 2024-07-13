/**
 * 简单的消息服务
 */
 import { Subject } from 'rxjs';
 import { isFunction, isNaN } from 'lodash';

const staus = {
  pending: 'pending',
  ended: 'ended',
  unstart: 'unstart',
}


 export default class MessageDAO {
  name;
  /**
  * 轮询周期
  */
  #time;
  /**
   * 定时器
   */
  #timer;
  /**
   * 订阅通知
  */
  #subscriber;
  /**
   * 轮询方法
   */
  #checkMesaage;

  #status = staus.unstart;

  constructor({
    name,
    time, // 轮询间隔，0 为不轮询
    checkMesaage,
  }) {
    this.name = name || 'Message@' + Date.now();
    this.#time = isNaN(Number(time)) ? 0 : Number(time);
    this.#checkMesaage = isFunction(checkMesaage) ? checkMesaage : null;

    this.#subscriber = new Subject();
    // this.init();
  }

  init() {
    // 开启轮询
    this.setInterval();
  }

  setInterval() {
    if (this.#time && this.#checkMesaage) {
      if (this.#timer) return
      this.#timer = setInterval(this.#checkMesaage, this.#time);
      this.#status = staus.pending
    }
  }

  clearInterval() {
    if (this.#timer) {
      clearInterval(this.#timer);
      this.#timer = 0;
      this.#status = staus.ended;
    }
  }

  subscribe(fn) {
    this.#subscriber.asObservable().subscribe((args) => {
      fn(args);
    })
  }

  next(agv) {
    this.#subscriber.next(agv, this.#status)
  }
}

 