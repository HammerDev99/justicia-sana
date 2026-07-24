/**
 * Divide un campo `richtext` de Strapi en párrafos de texto plano.
 * Deliberadamente no interpreta HTML/Markdown: cada página que la usa
 * interpola el resultado como texto (Astro escapa automáticamente), nunca
 * con `set:html` — mitiga XSS almacenado si una cuenta editora de Strapi
 * es comprometida (ver SPEC_S04_F3_CONTENIDO.md §6).
 */
export function splitRichtextParagraphs(texto: string): readonly string[] {
  return texto
    .split(/(?:\r?\n){2,}/)
    .map((parrafo) => parrafo.trim())
    .filter((parrafo) => parrafo.length > 0);
}
