import { httpErrorCode } from "./httpErrorCode";
import { infrastructure } from "./infrastructure";

export default {
  zh: {
    ...infrastructure.zh,
    ...httpErrorCode.zh,
  },
  en: {
    ...infrastructure.en,
    ...httpErrorCode.en,
  },
};
