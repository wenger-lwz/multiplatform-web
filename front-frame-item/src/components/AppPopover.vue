<script>
import { getCurrentInstance, defineComponent } from "vue";

export default defineComponent({
  name: "AppPopover",
  props: {
    title: {
      type: String,
      default: "",
    },
    position: {
      type: String,
      default: () => {
        return "br";
      },
    },
  },
  emits: ["popupChange"],
  setup(prop, { emit }) {
    const { proxy } = getCurrentInstance();
    const slots = {
      default: () => <span>{proxy.$slots?.default()}</span>,
      content: () => <div>{proxy.$slots?.content()}</div>,
    };
    const popupChange = (bool) => {
      emit("popupChange", bool);
    };
    return () => (
      <gj-popover
        title={prop.title}
        position={prop.position}
        v-slots={slots}
        onPopupVisibleChange={popupChange}
      ></gj-popover>
    );
  },
});
</script>
