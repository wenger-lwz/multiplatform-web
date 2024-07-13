export default [
  {
    path: "/allocationRules",
    name: "AllocationRules",
    meta: {
      key: "PLAT_customerTools/allocationRules",
    },
    component: () =>
      import(
        "@pagesSystem/customerService/infrastructure/allocationRulesPage/index.vue"
      ),
  },
  {
    path: "/classificationLabel",
    name: "ClassificationLabel",
    meta: {
      key: "PLAT_customerTools/classificationLabel",
    },
    component: () =>
      import(
        "@pagesSystem/customerService/infrastructure/classificationLabelPage/index.vue"
      ),
  },
  {
    path: "/treatmentAging",
    name: "TreatmentAging",
    meta: {
      key: "PLAT_customerTools/treatmentAging",
    },
    component: () =>
      import(
        "@pagesSystem/customerService/infrastructure/treatmentAgingPage/index.vue"
      ),
  },
  {
    path: "/evaluationLabel",
    name: "EvaluationLabel",
    meta: {
      key: "PLAT_customerTools/evaluationLabel",
    },
    component: () =>
      import(
        "@pagesSystem/customerService/infrastructure/evaluationLabelPage/index.vue"
      ),
  },
  {
    path: "/commonWords",
    name: "CommonWords",
    meta: {
      key: "PLAT_customerTools/commonWords",
    },
    component: () =>
      import(
        "@pagesSystem/customerService/infrastructure/commonWordsPage/index.vue"
      ),
  },
];
