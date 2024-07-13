import menu from './menu'
import _public from './public'
import header from './header'
import task from './task';
import message from './message';
import common from './common';

export default {
  ...menu,
  ...header,
  ..._public,
  ...task,
  ...message,
  ...common
}
