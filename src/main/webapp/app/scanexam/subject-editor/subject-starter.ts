/** Subject proposed to a teacher who starts writing in Typst (T25b). */
export const SUBJECT_STARTER = `#import "@local/correctexam:0.1.0": *
// paquets disponibles hors ligne : codly (code), diagraph (Graphviz), chronos (séquence),
// fletcher et cetz (dessins), mitex (formules LaTeX), pintorita
#import "@preview/codly:1.3.0": codly, codly-init
#import "@preview/diagraph:0.3.8": raw-render

#show: codly-init
#codly(zebra-fill: none, stroke: 0.5pt + luma(150))

#show: exam.with(
  title: [Titre de l'examen],
  subtitle: [Formation — année],
  duration: "2 h",
  // nom et prénom : "cells" (une lettre par case) ou "free" (cadre libre, écriture attachée)
  identity-style: "cells",
  // un avertissement « seules les réponses dans les cadres sont corrigées » est imprimé par défaut ;
  // notice: none le retire, notice: [...] le remplace
  instructions: [Documents interdits.],
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

#section("p2", title: [Partie 2 — Code et modélisation])[
  #question("q4", points: 3)[
    On considère la méthode suivante.

    \`\`\`java
    static int somme(int[] t) {
        int s = 0;
        for (int i = 0; i <= t.length; i++) {
            s += t[i];
        }
        return s;
    }
    \`\`\`

    Quelle erreur contient-elle ? Corrigez la ligne fautive, puis donnez un cas de test qui la révèle.

    #answer(height: 4cm, style: "lines")
  ]
][
  #question("q5", points: 2)[
    Le diagramme ci-dessous décrit les états d'une commande (Graphviz, écrit en texte).

    #align(center, raw-render(\`\`\`dot
      digraph commande {
        rankdir=LR; node [shape=box, style=rounded];
        Créée -> Payée [label="payer"];
        Payée -> Expédiée [label="expédier"];
        Créée -> Annulée [label="annuler"];
        Payée -> Annulée [label="annuler / rembourser"];
      }
    \`\`\`, width: 80%))

    Ajoutez l'état _Livrée_ et ses transitions, puis indiquez quels états sont finaux.

    #answer(height: 5cm, style: "grid")
  ]
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
  { key: 'variant', code: '#variant("vX")[Première formulation][Deuxième formulation]\n' },
];
