import has from './modules/hasPermission';

const directives = [
  has,
];

export default {
  install (app) {
    directives.forEach(v => {
      app.use(v);
    });
  }
};
