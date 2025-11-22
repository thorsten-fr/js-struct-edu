// app.js

document.addEventListener("DOMContentLoaded", () => {
  const btnGenerate = document.getElementById("btnGenerate");
  const btnExample = document.getElementById("btnExample");
  const btnExportPng = document.getElementById("btnExportPng");
  const statusEl = document.getElementById("status");
  const diagramRoot = document.getElementById("diagramRoot");

  function setStatus(text, isError = false) {
    statusEl.textContent = text || "";
    statusEl.classList.toggle("error", !!text && isError);
    statusEl.classList.toggle("ok", !!text && !isError);
  }

  // Editor initialisieren
  initEditor().then(() => {
    setStatus("Editor bereit.", false);
  });

  // Beispiel-Code
  const exampleCode = `var arr = [5, 3, 8, 7, 9];

for (let i = 0; i < arr.length; i++) {
  if (arr[i] > 5) {
    arr[i] = arr[i] - 1;
  } else {
    arr[i] = arr[i] + 10;
  }
}

console.log(arr);`;

  btnExample.addEventListener("click", () => {
    setEditorCode(exampleCode);
    setStatus("Beispielcode eingefügt.", false);
  });

  // Struktogramm erzeugen
  btnGenerate.addEventListener("click", () => {
    const code = getEditorCode();
    const { ast, error } = parseCode(code);

    if (error) {
      setStatus(error, true);
      diagramRoot.innerHTML = "";
      return;
    }

    renderDiagram(ast, code, diagramRoot);
    setStatus("Struktogramm erfolgreich erzeugt.", false);
  });

  // PNG-Export
  btnExportPng.addEventListener("click", () => {
    if (!diagramRoot.innerHTML.trim()) {
      setStatus("Kein Struktogramm zum Exportieren.", true);
      return;
    }

    setStatus("Exportiere PNG ...", false);
    html2canvas(diagramRoot).then((canvas) => {
      const link = document.createElement("a");
      link.download = "struktogramm.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
      setStatus("PNG exportiert.", false);
    }).catch((err) => {
      console.error(err);
      setStatus("Fehler beim PNG-Export: " + err.message, true);
    });
  });
});
