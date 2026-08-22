const ts = require("typescript");
const path = require("path");

const filePath = path.join(process.cwd(), "src/components/admin/RitualGuideForm.tsx");
const program = ts.createProgram([filePath], { noEmit: true, jsx: ts.JsxEmit.ReactJSX });
const diagnostics = ts.getPreEmitDiagnostics(program);

console.log(`Found ${diagnostics.length} diagnostics:`);

diagnostics.forEach(diag => {
  if (diag.file && diag.file.fileName.includes("RitualGuideForm.tsx")) {
    const { line, character } = diag.file.getLineAndCharacterOfPosition(diag.start);
    const message = ts.flattenDiagnosticMessageText(diag.messageText, "\n");
    console.log(`Error ${diag.code} at line ${line + 1}, col ${character + 1}: ${message}`);
  }
});
