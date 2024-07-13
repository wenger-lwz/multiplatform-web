import { isNaN, isNil, isArray, findIndex } from 'lodash';

export function debounce(func, wait) {
  let timeout
  return function() {
    let context = this
    let args = arguments
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(() => {
      func.apply(context, args)
    }, wait)
  }
}

export function getQueryVariable (variable, defaultValue) {
  const search = location.search;
  const query = (search || window.location.search).substring(1);
  const vars = query.split('&');
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split('=');
    if (pair[0] === variable) {
      return pair[1];
    }
  }
  return defaultValue;
}

/**
 * 从 ng 基座迁移过来的方法，START
 */
export function isBlank (a) {
  return isFalsely(a) || a === '' || a === 'null'
}

export function isFalsely (a) {
  return isNil(a) || isNaN(a)
}

export function isNotBlank(str) {
  if (str instanceof Array) {
      if (isBlank(str)) {
          return false;
      }
      for (let i = 0; i < str.length; i++) {
          if (isBlank(str[i])) {
              return false;
          }
      }
      return true;
  } else {
      return !isBlank(str);
  }
}

export function downloadFile(resp) {
  let data = resp.data;

  let url = window.URL.createObjectURL(new Blob([data]));
  let link = document.createElement('a');
  link.style.display = 'none';
  link.href = url;
  // 文件名在后端设置
  let fileName = resp.headers['filename'];
  if (isBlank(fileName)) {
      fileName = (
          resp.headers['content-disposition']
          || resp.headers['Content-disposition']
          || resp.headers['Content-Disposition']
          || resp.headers['content-Disposition']
      ).split(';')[1].split('=')[1];
  }
  link.setAttribute('download', decodeURI(fileName));
  document.body.appendChild(link);
  link.click();
}

/**
 * 从 ng 基座迁移过来的方法，END
 */

export function getQuery(search) {
  const reg = new RegExp('(^|&)' + search + '=([^&]*)(&|$)');
  const group = location.search.substring(1).match(reg);
  return group !== null ? group[2] : null;
}
