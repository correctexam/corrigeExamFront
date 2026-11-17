import { autocompletion, Completion, CompletionContext, CompletionResult, snippetCompletion } from '@codemirror/autocomplete';
import { bracketMatching, defaultHighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { Extension } from '@codemirror/state';
import {
  TypstHighlightSytle,
  typst_lezer,
  typstLezerFoldService,
  typstLezerIndentService,
  typstLezerListKeymap,
} from 'codemirror-lang-typst/lezer';

/**
 * Functions of the `correctexam` Typst package, proposed after `#` (T25b). Each one inserts a working skeleton;
 * `${n:…}` are the fields reached with Tab, in order.
 */
export const CORRECTEXAM_COMPLETIONS: Completion[] = [
  snippetCompletion('question("${1:q1}", points: ${2:1})[\n  ${3:Énoncé.}\n\n  #answer(height: ${4:4cm})\n]', {
    label: 'question',
    detail: 'correctexam',
    info: 'Question corrigée à la main, avec une ou plusieurs zones answer.',
  }),
  snippetCompletion('answer(height: ${1:4cm}, style: "${2:lines}")', {
    label: 'answer',
    detail: 'correctexam',
    info: 'Zone de réponse libre : style "blank", "lines" ou "grid".',
  }),
  snippetCompletion('qcm(\n  "${1:q1}",\n  points: ${2:1},\n  [${3:Énoncé ?}],\n  ok[${4:Juste}],\n  ko[${5:Faux}],\n)', {
    label: 'qcm',
    detail: 'correctexam',
    info: 'QCM : ok[...] pour une bonne réponse, ko[...] pour une mauvaise, fixed(...) pour un choix qui ne bouge pas ; grading: barème DSL facultatif.',
  }),
  snippetCompletion('numeric("${1:q1}", points: ${2:1}, digits: ${3:2}, decimals: ${4:0}, expected: ${5:0})[${6:Valeur :}]', {
    label: 'numeric',
    detail: 'correctexam',
    info: 'Réponse numérique : style "cells" (chiffres manuscrits) ou "grid" (cases à cocher).',
  }),
  snippetCompletion('short("${1:q1}", points: ${2:1}, width: ${3:6cm})[${4:Réponse :}]', {
    label: 'short',
    detail: 'correctexam',
    info: 'Réponse courte dans un cadre d’une ligne.',
  }),
  snippetCompletion('section("${1:p1}", title: [${2:Partie}], shuffle: ${3:false})[\n  ${4:}\n]', {
    label: 'section',
    detail: 'correctexam',
    info: 'Partie du sujet ; shuffle: true mélange ses questions d’une version à l’autre.',
  }),
  snippetCompletion('solution[${1:Éléments de correction}]', {
    label: 'solution',
    detail: 'correctexam',
    info: 'Contenu imprimé seulement dans le corrigé.',
  }),
  { label: 'ok', type: 'function', detail: 'correctexam', info: 'Bonne réponse d’un QCM.' },
  { label: 'ko', type: 'function', detail: 'correctexam', info: 'Mauvaise réponse d’un QCM.' },
  { label: 'fixed', type: 'function', detail: 'correctexam', info: 'Choix de QCM qui garde sa place quand les choix sont mélangés.' },
  { label: 'group', type: 'function', detail: 'correctexam', info: 'Questions qui restent ensemble et dans l’ordre.' },
];

/** Completes the functions of the package after `#` (markup) or in code. */
export function correctexamCompletionSource(context: CompletionContext): CompletionResult | null {
  const word = context.matchBefore(/#?[a-z][a-z-]*/);
  if (!word || (word.from === word.to && !context.explicit)) {
    return null;
  }
  const from = word.text.startsWith('#') ? word.from + 1 : word.from;
  return { from, options: CORRECTEXAM_COMPLETIONS, validFor: /^[a-z-]*$/ };
}

/**
 * Typst support of the subject editor: syntax highlighting, indentation, folding and completion of Typst
 * (`codemirror-lang-typst`, Lezer parser, no Wasm) and of the `correctexam` package.
 * The linter of `codemirror-lang-typst` is left out on purpose: the diagnostics shown come from the real
 * compiler (`TypstCompilerService`), a second source would replace them.
 */
export function typstEditorLanguage(): Extension[] {
  const typst = typst_lezer();
  return [
    typst.language,
    typst.language.data.of({ autocomplete: correctexamCompletionSource }),
    syntaxHighlighting(TypstHighlightSytle),
    syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
    typstLezerIndentService,
    typstLezerListKeymap,
    typstLezerFoldService,
    bracketMatching(),
    autocompletion(),
  ];
}
