// renderer.js

let _currentCode = "";

/**
 * Hauptfunktion: AST + Quelltext → Struktogramm in container
 */
function renderDiagram(ast, code, container) {
  _currentCode = code || "";
  container.innerHTML = "";

  const info = document.createElement("div");
  info.className = "info-box";
  info.textContent =
    "Unterstützt: Sequenz (Zuweisung/Ausdruck), if/else, for, while, return. " +
    "Andere Konstrukte werden als 'Nicht unterstützt' markiert.";
  container.appendChild(info);

  if (!ast) {
    return;
  }

  const root = document.createElement("div");
  root.className = "block-root";

  const title = document.createElement("div");
  title.className = "block-root-title";
  title.textContent = "Programm";
  root.appendChild(title);

  const stmts = renderStatements(ast.body);
  root.appendChild(stmts);

  container.appendChild(root);
}

/**
 * Liste von Statements rendern.
 */
function renderStatements(statements) {
  const container = document.createElement("div");
  statements.forEach((stmt) => {
    const block = renderNode(stmt);
    container.appendChild(block);
  });
  return container;
}

function renderNode(node) {
  switch (node.type) {
    case "VariableDeclaration":
    case "ExpressionStatement":
      return renderSimpleStatement(node);

    case "ReturnStatement":
      return renderReturn(node);

    case "IfStatement":
      return renderIfAngled(node);

    case "ForStatement":
      return renderLoop(node, "für");

    case "WhileStatement":
      return renderLoop(node, "solange");

    case "BlockStatement":
      return renderStatements(node.body);

    default:
      return renderUnsupported(node);
  }
}

function codeSlice(node) {
  if (!_currentCode || node == null) return "";
  if (typeof node.start !== "number" || typeof node.end !== "number") return "";
  return _currentCode.slice(node.start, node.end);
}

/* Einfache Anweisungen */
function renderSimpleStatement(node) {
  const block = document.createElement("div");
  block.className = "block";
  const text = document.createElement("div");
  text.className = "statement-text";
  text.textContent = codeSlice(node).trim();
  block.appendChild(text);
  return block;
}

function renderReturn(node) {
  const block = document.createElement("div");
  block.className = "block";
  const text = document.createElement("div");
  text.className = "statement-text";
  text.textContent = codeSlice(node).trim() || "return;";
  block.appendChild(text);
  return block;
}

/* If-Alternative mit J/N und schrägen Linien */
function renderIfAngled(node) {
  const wrapper = document.createElement("div");
  wrapper.className = "if-block-angled";

  // Kopf mit Bedingung
  const header = document.createElement("div");
  header.className = "if-header-angled";
  header.textContent = "wenn (" + codeSlice(node.test).trim() + ")";
  wrapper.appendChild(header);

  // Entscheidungsbereich mit J/N
  const decision = document.createElement("div");
  decision.className = "if-decision-area";

  const leftLabel = document.createElement("div");
  leftLabel.className = "if-label-left";
  leftLabel.textContent = "J";

  const rightLabel = document.createElement("div");
  rightLabel.className = "if-label-right";
  rightLabel.textContent = "N";

  decision.appendChild(leftLabel);
  decision.appendChild(rightLabel);
  wrapper.appendChild(decision);

  // Untere beiden Blöcke
  const branches = document.createElement("div");
  branches.className = "if-branches-angled";

  const trueBranch = document.createElement("div");
  trueBranch.className = "if-branch";
  trueBranch.appendChild(renderStatements(toStatements(node.consequent)));

  const falseBranch = document.createElement("div");
  falseBranch.className = "if-branch";
  if (node.alternate) {
    falseBranch.appendChild(renderStatements(toStatements(node.alternate)));
  } else {
    const empty = document.createElement("div");
    empty.className = "statement-text";
    empty.textContent = "—";
    falseBranch.appendChild(empty);
  }

  branches.appendChild(trueBranch);
  branches.appendChild(falseBranch);
  wrapper.appendChild(branches);

  return wrapper;
}

function toStatements(node) {
  if (!node) return [];
  if (node.type === "BlockStatement") return node.body;
  return [node];
}

/* Schleifen */
function renderLoop(node, labelPrefix) {
  const wrapper = document.createElement("div");
  wrapper.className = "loop-block";

  const header = document.createElement("div");
  header.className = "loop-header";

  if (node.type === "ForStatement") {
    const init = node.init ? codeSlice(node.init).trim() : "";
    const test = node.test ? codeSlice(node.test).trim() : "";
    const update = node.update ? codeSlice(node.update).trim() : "";
    header.textContent = `${labelPrefix} (${init}; ${test}; ${update})`;
  } else if (node.type === "WhileStatement") {
    const test = node.test ? codeSlice(node.test).trim() : "";
    header.textContent = `${labelPrefix} (${test})`;
  } else {
    header.textContent = labelPrefix;
  }

  wrapper.appendChild(header);

  const body = document.createElement("div");
  body.className = "loop-body";
  body.appendChild(renderStatements(toStatements(node.body)));

  wrapper.appendChild(body);
  return wrapper;
}

/* Fallback: nicht unterstützte Konstrukte */
function renderUnsupported(node) {
  const block = document.createElement("div");
  block.className = "block unsupported";
  const header = document.createElement("div");
  header.className = "block-header";
  header.textContent = "Nicht unterstütztes Konstrukt";
  const text = document.createElement("div");
  text.className = "statement-text";
  text.textContent = node.type;
  block.appendChild(header);
  block.appendChild(text);
  return block;
}
