import dayjs from "dayjs";
export const ebayPrototype = {
  formatDateTime(dateTime) {
    if (dateTime) {
      return dayjs(dateTime).format("YYYY-MM-DD hh:mm:ss");
    } else {
      return "--";
    }
  },
  copyColum(row) {
    const clipBoardData = row.spu;
    const input = document.createElement("input");
    input.setAttribute("readonly", "readonly");
    input.setAttribute("value", clipBoardData);
    document.body.appendChild(input);
    input.select();
    if (document.execCommand("copy")) {
      console.log("复制成功");
    }
    document.body.removeChild(input);
  },
};

export default { ebayPrototype };
