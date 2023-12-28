import type { editorFormProps, elementProps } from "~/lib/utils.interfaces";

export const useEditorStore = defineStore("editor", {
  state: (): editorFormProps => {
    return {
      id: "",
      name: "",
      elements: [],
    };
  },
  getters: {
    formId: (state) => state.id,
    formName: (state) => state.name,
    formElements: (state) => state.elements,
  },
  actions: {
    setFormId(formId: string) {
      this.id = formId;
    },
    setFormName(formName: string) {
      this.name = formName;
    },
    addElement(payload: elementProps) {
      this.elements.push(payload);
    },
    removeElement(payloadId: string) {
      this.elements = this.elements.filter((element) => element.id !== payloadId);
    },
    updateElement(payload: elementProps) {
      this.elements = this.elements.map((element) => (element.id === payload.id ? payload : element));
    },
    reset() {
      this.id = "";
      this.name = "";
      this.elements = [];
    },
  },
});
