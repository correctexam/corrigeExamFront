/** Subject proposed to a teacher who starts writing in Typst (T25b). */
export const SUBJECT_STARTER = `#import "@local/correctexam:0.1.0": *

#show: exam.with(
  title: [Titre de l'examen],
  subtitle: [Formation — année],
  duration: "2 h",
  // nom et prénom : "cells" (une lettre par case) ou "free" (cadre libre, écriture attachée)
  identity-style: "cells",
  instructions: [Répondez dans les cadres. Ce qui dépasse n'est pas lu.],
)

#section("p1", title: [Partie 1])[
  #question("q1", points: 2)[
    Énoncé de la question. Les formules s'écrivent $sum_(i=1)^n i = (n(n+1)) / 2$.

    #answer(height: 4cm, style: "lines")
  ]
][
  #qcm(
    "q2",
    points: 1,
    // barème facultatif, même syntaxe que dans les propriétés des questions QCM
    grading: "a&c=100;a+=50;*=-25",
    [Quelles réponses sont justes ?],
    ok[Première réponse juste],
    ko[Réponse fausse],
    ok[Seconde réponse juste],
    fixed(ko[Aucune de ces réponses]),
  )
][
  #short("q3", points: 1, width: 6cm)[Réponse courte :]
]
`;

/** Typst snippets of the toolbar. */
export const SUBJECT_SNIPPETS: { key: string; code: string }[] = [
  { key: 'question', code: '#question("qX", points: 1)[\n  Énoncé.\n\n  #answer(height: 4cm)\n]\n' },
  { key: 'qcm', code: '#qcm(\n  "qX",\n  points: 1,\n  [Énoncé ?],\n  ok[Juste],\n  ko[Faux],\n)\n' },
  { key: 'numeric', code: '#numeric("qX", points: 1, digits: 2, decimals: 1, expected: 12.5, tolerance: 0.1)[Valeur :]\n' },
  { key: 'short', code: '#short("qX", points: 1, width: 6cm)[Réponse :]\n' },
  { key: 'code', code: '```java\nclass A {\n}\n```\n' },
  { key: 'math', code: '$ integral_0^1 x^2 dif x = 1 / 3 $\n' },
  { key: 'section', code: '#section("pX", title: [Partie], shuffle: false)[\n  // questions\n]\n' },
];
