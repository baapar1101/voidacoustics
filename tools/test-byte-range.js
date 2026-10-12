const fs = require('fs');
const parse5 = require('parse5');

const sampleHtml = fs.readFileSync('mirror/en/index.html', 'utf8');
const doc = parse5.parse(sampleHtml, { sourceCodeLocationInfo: true });

let textNodes = 0;
let textWithLoc = 0;
let titleLoc = null;

function walk(node) {
  if (node.nodeName === '#text') {
    textNodes++;
    if (node.sourceCodeLocation) textWithLoc++;
  }
  if (node.nodeName === 'title' && node.childNodes && node.childNodes[0]) {
    titleLoc = node.childNodes[0].sourceCodeLocation;
  }
  if (node.childNodes) {
    for (const c of node.childNodes) walk(c);
  }
}

walk(doc);

console.log('Total text nodes:', textNodes, 'with sourceCodeLocation:', textWithLoc);
console.log('Title node location:', titleLoc);
if (titleLoc) {
  const orig = sampleHtml.slice(titleLoc.startOffset, titleLoc.endOffset);
  console.log('Original title from offset:', orig);
}
