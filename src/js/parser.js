// parser.js
// Liefert { ast, error }

function parseCode(source) {
  if (!source || !source.trim()) {
    return { ast: null, error: "Kein Code eingegeben." };
  }

  try {
    const ast = acorn.parse(source, {
      ecmaVersion: 2020,
      locations: false,
      ranges: true
    });
    return { ast, error: null };
  } catch (err) {
    return { ast: null, error: "Syntaxfehler: " + err.message };
  }
}
