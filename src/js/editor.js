// editor.js

let editorInstance = null;

/**
 * Initialisiert den Monaco-Editor im #editor-Element.
 * Gibt ein Promise zurück, das resolved, wenn alles fertig ist.
 */
function initEditor() {
  return new Promise((resolve) => {
    // Monaco AMD-Konfiguration
    require.config({
      paths: {
        vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.52.0/min/vs"
      }
    });

    require(["vs/editor/editor.main"], function () {
      editorInstance = monaco.editor.create(document.getElementById("editor"), {
        value: "",
        language: "javascript",
        theme: "vs-dark",
        automaticLayout: true,
        fontSize: 13,
        minimap: { enabled: false }
      });
      resolve(editorInstance);
    });
  });
}

function getEditorCode() {
  return editorInstance ? editorInstance.getValue() : "";
}

function setEditorCode(text) {
  if (editorInstance) {
    editorInstance.setValue(text);
  }
}
