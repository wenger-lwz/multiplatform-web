/**
 * FormData转换函数
 * @param {Object} paramsData 需要转化为FormData的对象
 * @returns {FormData}
 */
export const toFormData = (paramsData) => {
  let data = new FormData();
  Object.keys(paramsData).forEach((key) => {
    // console.log('key---------', paramsData[key])
    if (paramsData[key] instanceof File) {
      paramsData[key] = new Blob([paramsData[key]], {
        type: paramsData[key].type,
      });
    }
    data.append(key, paramsData[key]);
  });
  return data;
};
