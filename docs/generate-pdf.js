const markdownpdf = require("markdown-pdf");
const fs = require("fs");
const path = require("path");

const options = {
  cssPath: path.join(__dirname, "pdf-style.css"),
  remarkable: {
    html: true,
    breaks: true,
    syntax: ["highlight", "superscript", "footnote"],
  },
  paperBorder: "1cm",
};

// Configurações de estilo para o PDF
fs.writeFileSync(
  path.join(__dirname, "pdf-style.css"),
  `
  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    color: #333;
    margin: 0;
    padding: 0;
  }
  
  h1, h2, h3, h4, h5, h6 {
    color: #2563eb;
    margin-top: 1.5em;
    margin-bottom: 0.5em;
  }
  
  h1 {
    font-size: 2.2em;
    text-align: center;
    border-bottom: 2px solid #e5e7eb;
    padding-bottom: 0.5em;
    margin-bottom: 1em;
  }
  
  h2 {
    font-size: 1.8em;
    border-bottom: 1px solid #e5e7eb;
    padding-bottom: 0.3em;
  }
  
  h3 {
    font-size: 1.5em;
  }
  
  ul, ol {
    margin-left: 1.5em;
    margin-bottom: 1.5em;
  }
  
  li {
    margin-bottom: 0.5em;
  }
  
  p {
    margin-bottom: 1em;
  }
  
  strong {
    color: #1e40af;
  }
  
  code {
    background-color: #f3f4f6;
    padding: 0.2em 0.4em;
    border-radius: 3px;
    font-family: monospace;
    font-size: 0.9em;
  }
  
  blockquote {
    border-left: 4px solid #e5e7eb;
    padding-left: 1em;
    margin-left: 0;
    color: #6b7280;
  }
  
  hr {
    border: none;
    border-top: 1px solid #e5e7eb;
    margin: 2em 0;
  }
  
  a {
    color: #2563eb;
    text-decoration: none;
  }
  
  a:hover {
    text-decoration: underline;
  }
  
  img {
    max-width: 100%;
    height: auto;
    display: block;
    margin: 1.5em auto;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 1.5em;
  }
  
  th, td {
    border: 1px solid #e5e7eb;
    padding: 0.5em;
  }
  
  th {
    background-color: #f9fafb;
    font-weight: bold;
  }
  
  tr:nth-child(even) {
    background-color: #f9fafb;
  }
  
  .page-break {
    page-break-after: always;
  }
  `
);

console.log("Gerando PDF...");

// Caminho de entrada e saída
const inputFile = path.join(__dirname, "certguard-manual.md");
const outputFile = path.join(__dirname, "CertGuard-Manual-do-Usuario.pdf");

// Converter markdown para PDF
markdownpdf(options)
  .from(inputFile)
  .to(outputFile, function () {
    console.log(`PDF gerado com sucesso: ${outputFile}`);
  });