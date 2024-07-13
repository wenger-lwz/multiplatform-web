export const compatibilityPrototype = {
  //点击
  clickedIndeterminate(nub, child, data) {
    let childStatus = false; //当前层级下级
    let ischilden = []; //是否有多个子集（多选）
    let isIndeterminate = false; //选中的上级半选
    let parentLen = [];
    let list = data;
    let cuntPrant = nub - 1;
    // 当前村级
    list.forEach((item) => {
      if (Number(item.displaySeq) == nub) {
        childStatus = child.isChecked;
        ischilden = item.childern.filter((i) => i.isChecked);
      }
      if (Number(item.displaySeq) == cuntPrant) {
        // 当前村级的摸一个上一级
        parentLen = item.childern.filter(
          (i) => i.isChecked && i.queryCompatibilityValue !== child.parent
        );
      }
    });

    list.forEach((item) => {
      // 当前村级的所有上级
      if (Number(item.displaySeq) < nub && Number(item.displaySeq) > 1) {
        item.childern = item.childern.map((flag) => {
          if (flag.isWhether) {
            let bool = false;
            let checkedBool = false;
            if (Number(item.displaySeq) == cuntPrant) {
              bool = isIndeterminate
                ? false
                : ischilden.length > 0
                ? true
                : false;
            } else {
              // 判断当前村级和当前村级上级
              bool =
                parentLen.length > 0
                  ? true
                  : ischilden.length > 0
                  ? true
                  : false;
            }

            return {
              ...flag,
              indeterminate: child.isChecked ? checkedBool : bool,
              isChecked: child.isChecked,
            };
          } else {
            return {
              isChecked: false,
              ...flag,
            };
          }
        });
      } else {
        // 当前村级所有的下级
        if (Number(item.displaySeq) > nub) {
          item.childern = item.childern.map((flag) => {
            return {
              ...flag,
              indeterminate: childStatus ? false : flag.indeterminate, //处理半选时全选
              isChecked: childStatus,
            };
          });
        }
      }
    });
    return list;
  },
  //未点击
  notClickedIndeterminate(nub, child, data) {
    let currentChilden = [];
    let list = data;
    let cunterParent = nub - 1;
    let parentFast = [];
    // 当前村级
    list.forEach((item) => {
      if (Number(item.displaySeq) == nub) {
        currentChilden = item.childern.filter((i) => i.isChecked);
      }
      if (Number(item.displaySeq) == cunterParent) {
        // 当前村级的摸一个上一级
        parentFast = item.childern.filter((i) => i.isChecked);
      }
    });
    // 当前村级的上级
    list.forEach((item) => {
      if (Number(item.displaySeq) < nub && Number(item.displaySeq) > 1) {
        item.childern = item.childern.map((flag) => {
          if (flag.isWhether) {
            let isBool = false;
            // let checkedBool = false;
            if (Number(item.displaySeq) == cunterParent) {
              isBool = currentChilden.length > 0 ? true : false;
              console.log(item, isBool, "当前村级的上级");
            } else {
              isBool =
                currentChilden.length > 0
                  ? true
                  : parentFast > 0
                  ? true
                  : false;
              console.log(
                item,
                isBool,
                currentChilden,
                parentFast,
                "当前村级的所有上级"
              );
            }
            //当前选中的所有上级
            return {
              ...flag,
              indeterminate: child.isChecked ? child.isChecked : isBool,
              isChecked: child.isChecked,
            };
          } else {
            return {
              isChecked: false,
              ...flag,
            };
          }
        });
      }
    });
    return list;
  },

  // 树转扁平化
  treeChildern(list) {
    let res = [];
    for (const item of list) {
      let { childList, ...i } = item;
      if (childList && childList.length) {
        i = {
          ...i,
          sum: 0,
        };
        res = res.concat(compatibilityPrototype.treeChildern(childList));
      }
      res.push(i);
    }
    return res;
  },
  treeTable(list, tabData) {
    let res = [];
    let max = tabData.length;
    let tableData = [];
    const columns = [];
    const initColumns = [
      {
        title: "compatibilityNotes",
        dataIndex: "compatibilityNotes",
      },
      {
        title: "operation",
        dataIndex: "operation",
      },
    ];
    for (const item of list) {
      const { childList, ...i } = item;
      if (childList && childList.length) {
        res = res.concat(compatibilityPrototype.treeChildern(childList));
      }
      res.push(i);
    }
    // 和并数据
    res.forEach((element) => {
      if (element.fatherList.length + 1 == max) {
        element.fatherList.push(element.queryCompatibilityValue);
        let b = element.fatherList.map((item, index) => {
          columns.push({
            title: tabData[index].propertyName,
            dataIndex: tabData[index].propertyName,
            laver: Number(tabData[index].displaySeq),
          });
          return {
            [tabData[index].propertyName]: item,
          };
        });
        columns.push({
          title: element.queryCompatibilityType,
          dataIndex: element.queryCompatibilityType,
          laver: tabData.length,
        });
        let tempObj = {};
        b.reduce((prev, cur) => {
          Object.assign(prev, cur);
          return prev;
        }, tempObj);

        // console.log(tableData, "00000");
        tableData.push({
          ...tempObj,
          compatibilityNotes: "",
        });
      }
    });
    let setData = [...columns, ...initColumns];
    let tableColumns = [...compatibilityPrototype.unique(setData, "dataIndex")];

    return { tableData, tableColumns };
  },
  // 过滤当前选中所有层级选中的数据
  compatibilityListFun(data) {
    let table = [];
    data.forEach((item) => {
      item.childern.forEach((flag) => {
        if (flag.isChecked || flag.isWhether) {
          table.push({ ...flag, displaySeq: Number(item.displaySeq) });
        }
      });
    });
    return table;
  },
  // 勾选末级生成表格数据
  tableTree(arr) {
    // console.log(arr, "addlist");
    let list = [];
    let result = [];
    let tableColumns = [];
    arr
      .sort((a, b) => a.displaySeq - b.displaySeq)
      .forEach((v) => {
        if (v.displaySeq == 1 || (v.isChecked && v.isWhether)) {
          //当前勾选的数据
          let obj = {};
          let columns = {};
          obj = {
            [v.queryCompatibilityType]: v.queryCompatibilityValue,
            compatibilityNotes: "",
          };
          columns = {
            title: v.queryCompatibilityType,
            dataIndex: v.queryCompatibilityType,
            laver: v.displaySeq,
          };
          list.push(obj);
          tableColumns.push(columns);
        }
      });
    let tempObj = {};
    list.reduce((prev, cur) => {
      Object.assign(prev, cur);
      return prev;
    }, tempObj);
    result.push(tempObj);
    let initColumns = [
      {
        title: "compatibilityNotes",
        dataIndex: "compatibilityNotes",
      },
      {
        title: "operation",
        dataIndex: "operation",
      },
    ];
    let setData = [...tableColumns, ...initColumns];
    tableColumns = [...compatibilityPrototype.unique(setData, "dataIndex")];
    return {
      result,
      tableColumns,
    };
  },
  // 去重
  unique(val, id) {
    return val.reduce((prev, cur) => {
      let temp = prev.map((i) => i[id]);
      return temp.includes(cur[id]) ? prev : [...prev, cur];
    }, []);
  },
  // 取消勾选删除表格数据
  remoteTable(child, dataCurrentSource) {
    let dataCurrentSourceArr = [];
    dataCurrentSource.flat().forEach((item, index) => {
      if (
        item[child.queryCompatibilityType] == child.queryCompatibilityValue &&
        item[child.parentValue].toString().replace(/\s/g, "") ==
          child.parent.toString().replace(/\s/g, "")
      ) {
        // proxy存在bug为解决
        dataCurrentSource.flat().splice(index, 1);
      } else {
        dataCurrentSourceArr.push(item);
      }
    });
    return {
      // dataSource,
      // dataSelectSource,
      dataCurrentSourceArr,
    };
  },
  // 表格单个删除
  operationRemote(row, data, columns, table, currentTable, selectTable) {
    //表格头和表格数据合并
    let setColumns = [];
    columns.forEach((item) => {
      if (item.laver) {
        let b = table.map((i) => {
          return i[item.title];
        }); //选中的条数
        let obj = {
          ...item,
          value: row[item.title],
          len: [...new Set(b)], //每一集选中的条树
        };
        setColumns.push(obj);
      }
    });
    // console.log(setColumns, columns);
    // 删除从末级查找
    let arr = setColumns.sort((a, b) => b.laver - a.laver);
    let talto = arr[0].laver;
    let isFast = false;
    data.forEach((item) => {
      arr.forEach((i) => {
        if (i.laver == talto) {
          if (i.len.length > 1) {
            isFast = true;
          }
          item.childern = item.childern.map((val) => {
            return {
              ...val,
              isChecked:
                val.queryCompatibilityValue == i.value ? false : val.isChecked,
            };
          });
        }
      });
    });
    //
    let all = arr.map((item) => {
      return item.len.length == 1 ? 1 : 2;
    });
    // console.log(arr, data, isFast);
    // 是否存在半选
    if (all.includes(2)) {
      // 判断是否由上级半选状态
      if (isFast) {
        data.forEach((item) => {
          if (
            Number(item.displaySeq) > 1 &&
            Number(item.displaySeq) < arr[0].laver
          ) {
            let b = Number(item.displaySeq); //定位到具体的值
            // console.log(b, item, arr, arr[b].value);
            let name = "";
            arr.forEach((i) => {
              if (i.laver == b) {
                name = i.value;
              }
            });
            item.childern = item.childern.map((val) => {
              return {
                ...val,
                indeterminate:
                  val.queryCompatibilityValue == name
                    ? true
                    : val.indeterminate,
              };
            });
          }
        });
      }
    } else {
      // 只有一条数据
      data.forEach((item) => {
        item.childern = item.childern.map((val) => {
          return {
            ...val,
            indeterminate: false,
            isChecked: false,
          };
        });
      });
    }
    table.forEach((item, index) => {
      if (row.id == item.id) {
        table.splice(index, 1);
      }
    });
    currentTable.forEach((item, index) => {
      if (row.id == item.id) {
        table.splice(index, 1);
      }
    });
    selectTable.forEach((item, index) => {
      if (row.id == item.id) {
        table.splice(index, 1);
      }
    });
    return {
      table,
      currentTable,
      selectTable,
    };
  },
  // 处理后台需要的格式
  initParamstable(data, columnParams) {
    let paramsData = [];
    data.forEach((item) => {
      let list = [];
      for (var key in item) {
        list.push({
          compatibilityName: key,
          compatibilityValue: item[key],
        });
      }
      let obj = {
        compatibilityNameValues: list,
        compatibilityNotes: item.compatibilityNotes,
        dataState: 1, //1正常、2删除,编辑时必传 ,
        id: "", //编辑时必传
        productId: "",
      };
      paramsData.push(obj);
    });
    let paramsColumn = columnParams.map((item) => {
      return item.propertyName;
    });
    return {
      paramsData,
      paramsColumn,
    };
    // [
    //   //兼容性列表
    //   {
    //     compatibilityNameValues: [
    //       {
    //         compatibilityName: 'mack',
    //         compatibilityValue: 'a',
    //       },
    //       {
    //         compatibilityName: 'Model',
    //         compatibilityValue: '707',
    //       },
    //     ],
    //     compatibilityNotes: 'modul',
    //     dataState: 1, //1正常、2删除,编辑时必传 ,
    //     id: '', //编辑时必传
    //     productId: '',
    //   },
    // ],includes

    // ["mack",'module']
  },
  // 删除
  deletlObjArr(obj, arr, type = "omit") {
    if (typeof obj !== "object" || !Array.isArray(arr)) return;
    let tempArr = [];
    if (type === "omit") {
      tempArr = Object.keys(obj).filter((i) => !arr.includes(i));
    } else {
      tempArr = [...arr];
    }
    return JSON.parse(JSON.stringify(obj, tempArr));
  },
};

//处理数据
export const compatibilityCommonFun = {
  // 兼容性列表
  getCompatibilityInfoData(row, type, goodsRowData) {
    console.log(row, type, goodsRowData, "123");
    // console.log(type, "操作类型 dataState: 0,1正常、2删除,编辑时必传");
    let compatibilityInfoData = [];
    if (type == "edit") {
      compatibilityInfoData = goodsRowData.compatibilityPage?.records.map(
        (item) => {
          return {
            ...item,
            dataState: 2,
          };
        }
      );
    } else {
      compatibilityInfoData = row || [];
      compatibilityInfoData.forEach((item) => {
        item.dataState = type == "edit" ? 2 : 1;
        item.compatibilityNameValues.forEach((i) => {
          for (const key in i) {
            if (key == "id" || key == "compatibilityNotes") {
              item[key] = i[key];
              delete i[key];
            }
          }
        });
      });
    }

    return compatibilityInfoData;
  },
  // 处理变体属性组装图片数据
  getVariantInfoData(obj) {
    let setVariantAttrs = [];
    if (obj.variantInfo?.templateData.length !== 0) {
      setVariantAttrs = obj.variantInfo?.templateData.map((item) => {
        if (item.attrName == obj.pictureInfo.valueImageList[0]?.parentName) {
          let cunter = obj.pictureInfo.valueImageList.map((flag) => {
            return {
              attrImages: flag.listImg,
              attrValue: flag.attrValue,
            };
          });

          return {
            mainAttr:
              item.attrName == obj.pictureInfo.valueImageList[0].parentName
                ? true
                : false,
            attrName: item.attrName,
            attrValues: cunter,
          };
        } else {
          console.log(item, "234");
          return {
            mainAttr: false,
            attrName: item.attrName,
            attrValues: item.list.map((i) => {
              return {
                attrImages: [],
                attrValue: i,
              };
            }),
          };
        }
      });
    }
    console.log(setVariantAttrs, "属性图片组装");
    return setVariantAttrs || [];
    //  [
    //   //存储用户选择的变体属性
    //   {
    //     attrName: "string",
    //     attrValues: [
    //       {
    //         attrImages: [
    //           {
    //             contentType: "string",
    //             hashCode: "string",
    //             height: 0,
    //             mainImage: false,
    //             platformUrlFlag: false,
    //             resource: "string", //URL ID
    //             size: 0,
    //             width: 0,
    //           },
    //         ],
    //         attrValue: "string",
    //       },
    //     ],
    //     mainAttr: false,
    //   },
    // ],
  },
  // 处理变体表格
  getVariantInfoTableData(obj) {
    let tableDataAttrs = obj.variantInfo?.tableData.map((item) => {
      return {
        ...item,
        eanCode: "",
        isbnCode: "",
        recommendPriceUnit: obj.basicInfo.priceUnit,
        spu: item.sku,
        upcCode: item.upc,
      };
    });
    return tableDataAttrs || [];
    // [
    //   {
    //     eanCode: 'usa',
    //     isbnCode: 'asd',
    //     recommendPrice: 0,
    //     recommendPriceUnit: '人名币',
    //     spu: 'spu',
    //     upcCode: 'upcCode',
    //     skuAttrs: [
    //       {
    //         attrCustom: false,
    //         attrName: '2021',
    //         attrValue: 'value2',
    //       },
    //       {
    //         attrCustom: false,
    //         attrName: 'Submodel',
    //         attrValue: 'ABOUT',
    //       },
    //     ],
    //   },
    // ],
  },
  // 编辑回显处理数据
  editSetTableData(data, column, laverData, type) {
    let tableData = data;
    let tableColumn = [
      {
        title: "compatibilityNotes",
        dataIndex: "compatibilityNotes",
      },
      {
        title: "operation",
        dataIndex: "operation",
      },
    ];
    let setColumn = column.map((col) => {
      let b = laverData.filter((i) => i.propertyName == col);
      return {
        title: col,
        dataIndex: col,
        laver: Number(b[0].displaySeq), //层级
      };
    });
    let columnAll = [...setColumn, ...tableColumn].flat();
    let tableAll = [];
    if (type == "edit") {
      tableAll = tableData?.records.map((item) => {
        let obj = {};
        item.compatibilityNameValues.forEach((note) => {
          if (note.compatibilityName == "compatibilityNotes") {
            obj.compatibilityNotes = note.compatibilityValue;
          } else if (note.compatibilityName == "id") {
            obj.id = item.id;
          } else {
            obj[note.compatibilityName] = note.compatibilityValue;
          }
        });
        return obj;
      });
    } else {
      tableAll = tableData.map((item) => {
        let obj = {};
        item.compatibilityNameValues.forEach((note) => {
          if (note.compatibilityName == "compatibilityNotes") {
            obj.compatibilityNotes = note.compatibilityValue;
          } else if (note.compatibilityName == "id") {
            obj.id = item.id;
          } else {
            obj[note.compatibilityName] = note.compatibilityValue;
          }
        });
        return obj;
      });
    }

    return {
      columnAll,
      tableAll,
    };
  },
  // 编辑回显自动勾选
  setAutoCheck(hierarchyData, compatibilityPage, type) {
    let tableAll = [];
    if (type == "edit") {
      tableAll = compatibilityPage?.records.map((item) => {
        let obj = {};
        item.compatibilityNameValues.forEach((note) => {
          if (note.compatibilityName == "compatibilityNotes") {
            obj.compatibilityNotes = note.compatibilityValue;
          } else if (note.compatibilityName == "id") {
            obj.id = item.id;
          } else {
            obj[note.compatibilityName] = note.compatibilityValue;
          }
        });
        return obj;
      });
    } else {
      tableAll = compatibilityPage.map((item) => {
        let obj = {};
        item.compatibilityNameValues.forEach((note) => {
          if (note.compatibilityName == "compatibilityNotes") {
            obj.compatibilityNotes = note.compatibilityValue;
          } else if (note.compatibilityName == "id") {
            obj.id = item.id;
          } else {
            obj[note.compatibilityName] = note.compatibilityValue;
          }
        });
        return obj;
      });
    }

    hierarchyData.map((item) => {
      tableAll.forEach((vol) => {
        Object.keys(vol).forEach((key) => {
          if (item.propertyName == key) {
            item.childern = item.childern.map((child) => {
              return {
                ...child,
                isChecked:
                  child.queryCompatibilityValue == vol[key]
                    ? true
                    : child.isChecked,
                // indeterminate:isChecked
              };
            });
            // console.log(item.childern);
          }
        });
      });
      item.childern = compatibilityPrototype.unique(
        item.childern,
        "queryCompatibilityValue"
      );
    });
    return {
      hierarchyData,
    };
  },
};
export default { compatibilityPrototype, compatibilityCommonFun };
