#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const targets = [
  path.join(__dirname, "../PsychDispo-CaringCompass-fixed/public/psychdispo.html"),
  path.join(__dirname, "../psychdispo.html"),
];

function patch(html) {
  // Repair duplicate quote only in static HTML button tags (not JS string literals).
  html = html.replace(/<button type="button" class="opt" data-val="([^"]+)""/g, '<button type="button" class="opt" data-val="$1"');

  // div.opt → button.opt (all option toggles, including JS-generated strings)
  html = html.replace(
    /<div (class="opt[^"]*"[^>]*)>([^<]*)<\/div>/g,
    '<button type="button" $1>$2</button>'
  );

  // Button reset + reliable touch targets
  html = html.replace(
    /\.opt\{border:1px solid var\(--line\);/,
    'button.opt{font:inherit;line-height:inherit;text-align:inherit;margin:0;display:inline-block;-webkit-appearance:none;appearance:none;touch-action:manipulation}' +
      '.opt{border:1px solid var(--line);'
  );

  // Cleared field: accessible group + labelled buttons
  html = html.replace(
    '<label class="qlabel">Medically cleared?</label>\n   <div class="opts yesno" data-field="cleared">',
    '<label class="qlabel" id="lblCleared">Medically cleared?</label>\n   <div class="opts yesno" data-field="cleared" role="group" aria-labelledby="lblCleared">'
  );

  // syncOptsFromS: expose pressed state to assistive tech
  html = html.replace(
    "   o.classList.toggle(\"warn\",on&&o.classList.contains(\"warnv\"));\n  });",
    "   o.classList.toggle(\"warn\",on&&o.classList.contains(\"warnv\"));\n   o.setAttribute(\"aria-pressed\",on?\"true\":\"false\");\n  });"
  );

  // Flag toggles: aria-pressed on click
  html = html.replace(
    "var fl=opt.dataset.flag;S.flags[fl]=S.flags[fl]?0:1;opt.classList.toggle(\"sel\",!!S.flags[fl]);render();\n } else if(opt.dataset.flag!==undefined){",
    "var fl=opt.dataset.flag;S.flags[fl]=S.flags[fl]?0:1;opt.classList.toggle(\"sel\",!!S.flags[fl]);opt.setAttribute(\"aria-pressed\",!!S.flags[fl]?\"true\":\"false\");render();\n } else if(opt.dataset.flag!==undefined){"
  );

  // Click handler: keep aria-pressed in sync on field opts
  html = html.replace(
    "  $$(\".opt\",opt.parentElement).forEach(function(o){o.classList.toggle(\"sel\",o===opt);\n   o.classList.toggle(\"danger\",o===opt&&o.classList.contains(\"dangerv\"));\n   o.classList.toggle(\"warn\",o===opt&&o.classList.contains(\"warnv\"));});",
    "  $$(\".opt\",opt.parentElement).forEach(function(o){var on=o===opt;o.classList.toggle(\"sel\",on);\n   o.classList.toggle(\"danger\",on&&o.classList.contains(\"dangerv\"));\n   o.classList.toggle(\"warn\",on&&o.classList.contains(\"warnv\"));o.setAttribute(\"aria-pressed\",on?\"true\":\"false\");});"
  );

  return { html, changed: true };
}

for (const p of targets) {
  if (!fs.existsSync(p)) {
    console.log("skip (missing):", p);
    continue;
  }
  const raw = fs.readFileSync(p, "utf8");
  const { html } = patch(raw);
  const remaining = (html.match(/<div class="opt/g) || []).length;
  if (remaining) {
    console.error("WARN:", remaining, "div.opt remain in", p);
  }
  fs.writeFileSync(p, html);
  console.log("patched:", p);
}
