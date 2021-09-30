(() => {
  // src/edit.js
  var { __ } = wp.i18n;
  var { useBlockProps } = wp.blockEditor;
  function Edit() {
    return /* @__PURE__ */ wp.element.createElement("p", {
      ...useBlockProps()
    }, __("\u{1F44B} Hello from the editor!", "create-block-esbuild"));
  }

  // src/save.js
  var { __: __2 } = wp.i18n;
  var { useBlockProps: useBlockProps2 } = wp.blockEditor;
  function save() {
    return /* @__PURE__ */ wp.element.createElement("p", {
      ...useBlockProps2.save()
    }, __2("Hello from the saved content!", "create-block-esbuild"));
  }

  // src/index.js
  var { registerBlockType } = wp.blocks;
  registerBlockType("create-block-esbuild", {
    edit: Edit,
    save
  });
})();
