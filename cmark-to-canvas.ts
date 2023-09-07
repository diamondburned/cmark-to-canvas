#!/usr/bin/env -S deno run -A
import { html } from "https://deno.land/x/literal_html@1.1.0/mod.ts";
import * as comrak from "https://deno.land/x/comrak@0.1.1/mod.ts";

await comrak.init();

async function main() {
  let input = await Deno.readTextFile(Deno.args[0]);

  // Replace Graphviz blocks.
  input = input.replaceAll(/```graphviz\n([\s\S]*?)\n```/gm, (_, graph) => {
    graph = unescapeHTML(graph);
    return html`<p>
      <img src="${{ attr: graphvizImageURL(graph) }}" />
    </p>`;
  });

  // Replace math blocks.
  input = input.replaceAll(/\$\$\s*([\s\S]*?)\s*\$\$/gm, (_, math) => {
    math = unescapeHTML(math);
    return html`<p>
      <img src="${{ attr: latexImageURL(math) }}" />
    </p>`;
  });

  // Replace inline math segments.
  input = input.replaceAll(/\$([\s\S]+?)\$/gm, (_, math) => {
    math = unescapeHTML(math);
    return html`<img src="${{ attr: latexImageURL(math) }}" />`.replaceAll(
      /[\n\t]+/g,
      " "
    );
  });

  // console.log(input);
  // return;

  const output = comrak.markdownToHTML(input, {
    parse: { smart: true },
    render: { unsafe: true },
    extension: {
      strikethrough: true,
      table: true,
      autolink: true,
    },
  });
  console.log(output);
}

function latexImageURL(latex: string): string {
  return (
    "https://pi998nv7pc.execute-api.us-east-1.amazonaws.com/production/svg" +
    `?tex=${encodeURIComponent(latex)}&scale=1`
  );
}

function graphvizImageURL(graph: string): string {
  return `https://quickchart.io/graphviz?graph=${encodeURIComponent(graph)}`;
}

function unescapeHTML(html: string): string {
  return html
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&apos;", "'");
}

await main();
