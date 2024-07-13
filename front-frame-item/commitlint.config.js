module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-empty": [0, "always"],
    "subject-case": [0, "never"],
    "subject-empty": [0, "never"],
    "gerp-rule": [2, "always"],
  },
  plugins: [
    {
      rules: {
        "gerp-rule": ({ header }) => {
          const reg =
            /(^--bug=[0-9]{1,12} --user=[A-Za-z0-9\u4e00-\u9fa5a-zA-Z][\u4e00-\u9fa5a-zA-Z0-9_\-/\s]{1,30} 备注：)|(^--task=[0-9]{1,12} --user=[A-Za-z0-9\u4e00-\u9fa5a-zA-Z][\u4e00-\u9fa5a-zA-Z0-9_\-/\s]{1,30} 备注：)|(^--story=[0-9]{1,12} --user=[A-Za-z0-9\u4e00-\u9fa5a-zA-Z][\u4e00-\u9fa5a-zA-Z0-9_\-/\s]{1,30} 备注：)|(^【[\u4e00-\u9fa5a-zA-Z][\u4e00-\u9fa5a-zA-Z0-9_\-/\s]{1,}】 备注：)/;
          return [
            reg.test(header),
            `--bug=1018104 --user=tangbing 备注：筛选平台时点击'全部'系统响应与预期不一致 或者 --story=1018104 --user=tangbing 备注：eaby新建商品静态页面编写 或者 【全局 - 样式】 备注：ele样式修改`,
          ];
        },
      },
    },
  ],
};
