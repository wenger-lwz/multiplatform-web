import { createApp } from 'vue'
import App from './App.vue';
import i18n from './i18n';
import "@gj/atom/theme-chalk/index.css";
import '@gj/biz/theme-chalk/index.css';
import './assets/css/index.scss';
import * as Sentry from "@sentry/vue";
import { BrowserTracing } from "@sentry/tracing";

import router from './router';
import store from './store';
import GjAtom from "@gj/atom";
import directive from './directive';
import {GbModal} from "@gj/biz";
import { setEnvParams, sentryRelease, useVirtualEnv } from '@gj/env-cli/virtual-env.base'


const app = createApp(App);

app
  .use(router)
  .use(i18n)
  .use(GjAtom)
  .use(store)
  .use(directive)
  .use(GbModal)
  .mount('#app');

setEnvParams();

if (process.env.NODE_ENV === 'production') {
  const {env: {sentry}} = useVirtualEnv();
  const {env} = sentry || {};
  const release = sentryRelease();
  release && ['prod', 'preProd'].includes(env) && Sentry.init({
    app,
    dsn: "https://8b479d5e128f47ec912e0d9a017a1b85@sentry.app.gerpgo.com/6",
    integrations: [
      new BrowserTracing({
        routingInstrumentation: Sentry.vueRouterInstrumentation(router)
        // tracingOrigins: ["localhost", "my-site-url.com", /^\//],
      })
    ],
    tracesSampleRate: 0.3,
    release,
    environment: env
  });

}
