import { DIRECTION } from './enum';

export const getOffset = (elDom, type) => {
  const { width, height, left, top } = elDom.getBoundingClientRect();
  switch (type) {
    case DIRECTION.right:
      return [ left + width, top + height / 2 ]
    case DIRECTION.br:
      return [ left + width, top + height ]
    case DIRECTION.bl:
      return [ left - width, top + height ]
    case DIRECTION.tr:
      return [ left + width, top - height ]
    case DIRECTION.bottom:
      return [ left + width / 2, top + height ]
    default: // elDom 的中心点
      return [ width / 2 + left, height / 2 + top ]
  };
}

export const addMask = (isAdd) => {
  const maskDom = '#app'
  const name = 'guide-box-shadow';
  if (isAdd) {
    addClass(maskDom, name)
  } else {
    removeClass(maskDom, name)
  }
}


const highLightClassName = 'guide-high-light';
export const highLight = (el) => {
  addClass(el, highLightClassName);
  disableDom(el);
}
export const removeHightLight = (el = '') => {
  removeClass(el || '.' + highLightClassName, highLightClassName);
  enableDom(el || '.' + highLightClassName, highLightClassName)
}

const disableClassName = 'guide-disabled-events'
export const disableDom = (el) => {
  addClass(el, disableClassName)
}
export const enableDom = (el) => {
  removeClass(el, disableClassName)
}

let styleMap = {}
export const addStyleForEl = (el, style) => {
  const elDom = document.querySelector(el);
  if (elDom && style) {
    styleMap[el] = {}
    Object.entries(style).forEach(([key, val]) => {
      styleMap[el][key] = elDom.style[key];
      elDom.style[key] = val;
    })
  }
}

export const removeStyleForAdd = (el) => {
  const elDom = document.querySelector(el);
  const style = styleMap[el]
  if (elDom && style) {
    Object.entries(style).forEach(([key, val]) => {
      elDom.style[key] = val;
    })
  }
}

export const clearStyle = () => {
  Object.entries(styleMap).forEach((item) => {
    const [el, style] = item
    const elDom = document.querySelector(el)
    console.log('styleMap', styleMap)
    if (elDom) {
      Object.entries(style).forEach(([key, val]) => {
        elDom.style[key] = val;
      })
    }
  })
  styleMap = {}
}

export const getMaxZIndex = () => {
  return Math.max(
    ...Array.from(document.body.querySelectorAll('*')).map(i => window.getComputedStyle(i).zIndex).filter(v => Number.isFinite(Number(v)))
  )
}


function addClass (el, cl) {
  const elDom = document.querySelector(el);
  if (elDom) elDom.classList.add(cl);
}
function removeClass (el, cl) {
  const elDom = document.querySelector(el);
  if (elDom) elDom.classList.remove(cl)
}