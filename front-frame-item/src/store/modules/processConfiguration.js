import { Modeler } from "@/pages/systemPages/public/processConfiguration/nodeModel.js";
import { createUuid } from "@/pages/systemPages/public/processConfiguration/utils.js";

const state = {
  // 流程数据源
  processList: [
    {
      id: "0",
      nodeType: "start",
      isCreated: true,
      name: "开始节点",
      processFeedback: false,
      withdraw: false,
      viewLog: false,
      transfer: false,
      back: false,
      reject: false,
      nextNodeIdList: [],
    },
    {
      id: "1",
      nodeType: "examineAndApprove",
      isCreated: true,
      name: "测试节点",
      processFeedback: false,
      withdraw: false,
      viewLog: false,
      transfer: false,
      back: false,
      reject: false,
      nextNodeIdList: [],
    },
  ],
  // 映射数据源的Map
  processListMap: {},
  // 储存被删除节点之后的流程节点列表
  childNodes: null,
  // 节点剪切的标记 记录剪切节点的id
  pasteId: null,
  // 选中（编辑）的当前节点对象
  selectedNode: null,
  // 编辑对话框的显示 节点编辑为'drawer' 分支节点编辑为 'dialog'
  editDialogVisible: false,
};
const mutations = {
  SET_PROCESS_LIST(state, data) {
    state.processList = data;
  },
  SET_PASTE_ID(state, id) {
    state.pasteId = id || null;
  },

  // 修改节点属性
  SET_NODE_ATTR(state, { id, key, value }) {
    state.processListMap[id][key] = value;
  },
  // 修改分支节点 条件筛选列表
  SET_BRANCHNODE_CONDITIONS(state, data) {
    state.selectedNode.conditions = data;
  },

  // 数据源转Map
  ARR_TO_MAP(state) {
    // const { processList, processListMap } = state
    // processListMap = {}
    // console.log(state.processListMap === processListMap) // false
    const { processList } = state;
    state.processListMap = {};
    const stack = [];
    stack.push(...processList);
    while (stack.length) {
      const item = stack[0];
      state.processListMap[item.id] = item;
      stack.shift();
      if (item.children && item.children.length) {
        stack.push(...item.children);
      }
    }
  },

  // 创建插入子节点
  INSERT_CHIILD_NODE(
    { processList, processListMap, pasteId },
    { id, index, type }
  ) {
    console.log({ id, index, type });
    if (!id) {
      addItem(processList, index, undefined, type);
    } else {
      if (processListMap[id].children) {
        addItem(processListMap[id].children, index, id, type);
      } else {
        createList(processListMap[id], type);
      }
    }
    // 创建单个子节点插入
    function addItem(list, index, id, type) {
      // 创建子分支
      if (type === "branch") {
        let item = new Modeler("branch", id);
        item.children = [
          new Modeler("branch", item.id),
          new Modeler("branch", item.id),
        ];
        list.splice(index + 1, 0, item);
        list[index].nextNodeIdList = [item.children[0].id, item.children[1].id];
        processListMap[list[index + 1].id] = list[index + 1];
        processListMap[item.children[0].id] = list[index + 1].children[0];
        processListMap[item.children[1].id] = list[index + 1].children[1];
      } else {
        // 判断是否是粘贴节点
        if (type === "paste" && pasteId) {
          const key = processListMap[pasteId].parentId;
          // console.log(key, id)
          let pindex;
          if (key) {
            pindex = processListMap[key].children.findIndex(
              (item) => item.id === processListMap[pasteId].id
            );
            processListMap[key].children.splice(pindex, 1);
          } else {
            pindex = processList.findIndex(
              (item) => item.id === processListMap[pasteId].id
            );
            processList.splice(pindex, 1);
          }
          processListMap[pasteId].parentId = id;
          // console.log('pindex-----------', pindex)
          // console.log('index-----------', index)
          // console.log('key-----------', key)
          // console.log('id-----------', id)
          if (pindex === index && key === id) {
            list.splice(index, 0, processListMap[pasteId]);
          } else {
            list.splice(index + 1, 0, processListMap[pasteId]);
          }
          // pasteId = null
        } else {
          list.splice(index + 1, 0, new Modeler(type, id));
          processListMap[list[index + 1].id] = list[index + 1];
        }
      }
    }
    // 创建新的children
    function createList(item, type) {
      // console.log('创建新的children')
      if (type === "branch") {
        item.children = [
          {
            ...item,
            parentId: item.id,
            id: createUuid(),
          },
        ];
        processListMap[item.children[0].id] = item.children[0];
        addItem(item.children, 0, item.id, "branch");
      } else {
        // 判断是否是粘贴节点
        if (type === "paste" && pasteId) {
          const key = processListMap[pasteId].parentId;
          if (key) {
            let pindex = processListMap[key].children.findIndex(
              (item) => item.id === processListMap[pasteId].id
            );
            processListMap[key].children.splice(pindex, 1);
          } else {
            let pindex = processList.findIndex(
              (item) => item.id === processListMap[pasteId].id
            );
            processList.splice(pindex, 1);
          }
          processListMap[pasteId].parentId = item.id;
          item.children = [
            {
              ...item,
              parentId: item.id,
              id: createUuid(),
            },
            processListMap[pasteId],
          ];
          processListMap[item.children[0].id] = item.children[0];
          // pasteId = null
        } else {
          item.children = [
            {
              ...item,
              parentId: item.id,
              id: createUuid(),
            },
            new Modeler(type, item.id),
          ];
          processListMap[item.children[0].id] = item.children[0];
          processListMap[item.children[1].id] = item.children[1];
        }
      }
    }
  },
  // 直接添加分支节点
  ADD_CHILD_NODE({ processListMap }, id) {
    // console.log(id)
    processListMap[id].children.push(new Modeler("branch", id));
    let item =
      processListMap[id].children[processListMap[id].children.length - 1];
    processListMap[item.id] = item;
  },

  // 删除子节点
  REMOVE_CHILD_NODE(state, { id, index, isLc }) {
    const { processList, processListMap } = state;
    console.log("删除前的Map:---", JSON.parse(JSON.stringify(processListMap)));
    // 删除节点
    function removeBranch(id, index, isLc) {
      // console.log(id, index)
      let parentId = id && processListMap[id].parentId;
      // 判断有无父级
      if (parentId) {
        // 判断分支数量是否等于2 如果等于2 需要合并分支
        // 如果分支大于2 则不需要合并分支，删除此分支及此分支下的所有节点即可
        if (processListMap[parentId].children.length === 2) {
          // console.log('isLc--------------', isLc)
          // 判断是否需要向上级合并
          if (isLc) {
            let pid = processListMap[parentId].parentId;
            // 判断删除后的兄弟分支下是否有其他节点
            if (processListMap[parentId].children[Number(!index)].children) {
              // 如果有其他节点 保存后删除的时候插入
              state.childNodes =
                processListMap[parentId].children[
                  Number(!index)
                ].children.splice(1);
              // console.log(state.childNodes)
            }
            // 判断父级的父级是否存在
            if (pid) {
              index = processListMap[pid].children.findIndex(
                (item) => item.id === parentId
              );
              // 不传入isLc 这里只会递归一次
              removeBranch(parentId, index);
            } else {
              index = processList.findIndex((item) => item.id === parentId);
              if (state.childNodes) {
                state.childNodes.forEach((item) => {
                  item.parentId = "";
                });
                processList.splice(index, 1, ...state.childNodes);
                state.childNodes = null;
              } else {
                processList.splice(index, 1);
              }
            }
          } else {
            if (state.childNodes) {
              state.childNodes.forEach((item) => {
                item.parentId = parentId;
              });
              processListMap[parentId].children.splice(
                1,
                1,
                ...state.childNodes
              );
              state.childNodes = null;
            } else {
              processListMap[parentId].children = null;
            }
          }
        } else {
          if (state.childNodes) {
            state.childNodes.forEach((item) => {
              item.parentId = parentId;
            });
            processListMap[parentId].children.splice(
              index,
              1,
              ...state.childNodes
            );
            state.childNodes = null;
          } else {
            processListMap[parentId].children.splice(index, 1);
          }
        }
      } else {
        // 判断有无删除后需要插入的子节点
        if (state.childNodes) {
          state.childNodes.forEach((item) => {
            item.parentId = "";
          });
          processList.splice(index, 1, ...state.childNodes);
          state.childNodes = null;
        } else {
          processList.splice(index, 1);
        }
      }
    }
    // 判断是否为分支的开始节点 并且该分支下面有其他节点
    if (id && index === 0 && !isLc) {
      const parentId = processListMap[id].parentId || "";
      // 判断有无父级节点
      if (parentId) {
        index = processListMap[
          processListMap[parentId].parentId
        ].children.findIndex((item) => item.id === parentId);
        console.log(!isLc);
        removeBranch(parentId, index, !isLc);
      } else {
        // 如果父级节点不存在 直接在最上层级删除
        index = processList.findIndex((item) => item.id === id);
        removeBranch(false, index, false);
      }
    } else {
      removeBranch(id, index, isLc);
    }
  },

  // 编辑子节点
  EDIT_CHILD_NODE(state, id) {
    state.selectedNode = state.processListMap[id];
    if (state.selectedNode.nodeType === "branch") {
      state.editDialogVisible = "dialog";
    } else {
      state.editDialogVisible = "drawer";
    }
  },
  // 编辑关闭
  EDIT_CLOS(state) {
    state.editDialogVisible = false;
  },
};
const actions = {
  // 获取流程数据
  getProcessData({ commit, state }) {
    // 接收接口请求回来的数据
    // commit('SET_PROCESS_LIST', res.data)
    commit("ARR_TO_MAP");
    console.log(state);
  },
  // 删除子节点
  removeChildNode({ commit, state }, { id, index, isLc }) {
    commit("REMOVE_CHILD_NODE", { id, index, isLc });
    // 重置map
    commit("ARR_TO_MAP");
    console.log("删除后的Map", state.processListMap);
  },
};
export default {
  state,
  mutations,
  actions,
};
