import { isNumber } from "@arco-design/web-vue/es/_utils/is";
import { columnKeysMap } from "../config";

// const getOptionsWithTotalLeaves = (options) => {
//   const _options = [];

//   for (const item of options) {
//     const data = { ...item };
//     if (data.children) {
//       data.children = getOptionsWithTotalLeaves(data.children);
//       data.totalLeafOptions = data.children.reduce((pre, item) => {
//         if (isNumber(item.totalLeafOptions)) {
//           return pre + item.totalLeafOptions;
//         }

//         return pre + (item.isLeaf || !item.children ? 1 : 0);
//       }, 0);
//     }
//     _options.push(data);
//   }

//   return _options;
// };

export const getOptionInfos = (
  options,
  {
    optionMap,
    leafOptionMap,
    leafOptionValueMap,
    leafOptionSet,
    totalLevel: innerLevel,
    checkStrictly,
    enabledLazyLoad,
    lazyLoadOptions,
    fieldNames,
  }
) => {
  // const _options = getOptionsWithTotalLeaves(options); 旧
  let totalLevel = 0;

  const travelOptions = (options, parent, level) => {
    const parentPath = parent?.path ?? [];
    totalLevel = Math.max(totalLevel, level ?? 1);

    return options.map((item, index) => {
      const data = {
        raw: item,
        level: parentPath.length,
        index,
        value: item[fieldNames.value],
        label: item[fieldNames.label] ?? String(item[fieldNames.value]),
        disabled: Boolean(item[fieldNames.disabled]),
        isLeaf: item[fieldNames.isLeaf],
        parent,
      };
      const path = parentPath.concat(data);
      const key = path.map((item) => item.value).join("-");
      data.path = path;
      data.key = key;
      if (
        item[fieldNames.children] &&
        item[fieldNames.children].length &&
        !lazyLoadOptions[key]
      ) {
        data.isLeaf = false;
        // added code
        const name = item.children[0]?.enName || item.children[0]?.name;
        console.log("name", name);
        const isColumn = columnKeysMap.includes(name);
        const children = isColumn
          ? item.children?.[0].children ?? []
          : item.children ?? [];
        data.children = travelOptions(children, data, (level ?? 1) + 1);
        // if (children && children.length) {
        //   data.children = travelOptions(children, data, (level ?? 1) + 1);
        // } else {
        //   data.isLeaf = true;
        //   data.disabled = true;
        // }
      } else if (enabledLazyLoad && !data.isLeaf) {
        data.isLeaf = false;
        if (lazyLoadOptions[key]) {
          data.children = travelOptions(
            lazyLoadOptions[key],
            data,
            (level ?? 1) + 1
          );
        }
      } else {
        data.isLeaf = true;
      }
      // arco new
      if (data.children) {
        data.totalLeafOptions = data.children.reduce((pre, item) => {
          if (isNumber(item.totalLeafOptions)) {
            return pre + item.totalLeafOptions;
          }

          return pre + (item.isLeaf || !item.children ? 1 : 0);
        }, 0);
      }
      // arco new end
      optionMap.set(data.key, data);

      if (data.isLeaf || checkStrictly.value) {
        leafOptionSet.add(data);
        leafOptionMap.set(data.key, data);
        if (!leafOptionValueMap.has(data.value)) {
          leafOptionValueMap.set(data.value, data);
        }
      }

      return data;
    });
  };

  const result = travelOptions(options); // _options
  innerLevel.value = totalLevel;
  return result;
};

export const getCheckedStatus = (option, computedKeys, checkedKeysMap) => {
  let checked = false;
  let indeterminate = false;
  let checkedChildNumbers = 0;
  let optionKey;
  if (option.isLeaf) {
    if (computedKeys.includes(option.key)) {
      checked = true;
    } else {
      delete checkedKeysMap[option.key];
    }
  } else {
    const reg = new RegExp(`^${option.key}(-|$)`);
    const checkedLeafOptionNumber = computedKeys.reduce((pre, key) => {
      if (reg.test(key)) {
        return pre + 1;
      }
      return pre;
    }, 0);

    if (
      checkedLeafOptionNumber > 0 &&
      checkedLeafOptionNumber >= (option.totalLeafOptions ?? 1)
    ) {
      checked = true;
    } else if (checkedLeafOptionNumber > 0) {
      indeterminate = true;
    }
  }
  // added code
  if (option?.children?.length) {
    checkedChildNumbers = computedKeys.reduce((pre, key) => {
      const hasOne = option?.children?.some((item) => {
        optionKey = item.key;
        return key.includes(optionKey) && !checkedKeysMap[optionKey];
      });
      if (hasOne) {
        checkedKeysMap[optionKey] = optionKey;
        return pre + 1;
      }
      if (!checked) {
        if (checkedKeysMap[optionKey]) {
          delete checkedKeysMap[optionKey];
        }
      }

      return pre;
    }, 0);
  }

  return {
    checked,
    indeterminate,
    checkedChildNumbers,
  };
};

export const getOptionLabel = (option) => {
  return option.path.map((item) => item.label).join(" / ");
};
