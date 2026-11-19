/** Subject proposed to a teacher who starts writing in Typst (T25b). */
export const SUBJECT_STARTER = `#import "@local/correctexam:0.1.0": *
// paquets disponibles hors ligne : codly (code), diagraph (Graphviz), chronos (séquence),
// fletcher et cetz (dessins), mitex (formules LaTeX), pintorita
#import "@preview/codly:1.3.0": codly, codly-init
#import "@preview/diagraph:0.3.8": raw-render

/* ============================================================================================
   AIDE-MÉMOIRE DU PAQUET correctexam (ce commentaire n'est pas imprimé, vous pouvez le supprimer)
   Entre crochets : valeur par défaut. Chaque question a un identifiant unique ("q1", "q-uml"…) :
   il relie la question à ses zones et à sa correction, ne le changez plus après la création.

   #show: exam.with(...)                       mise en page de la copie (une seule fois, en tête)
     title, subtitle                           titre et sous-titre [aucun]
     duration                                  durée affichée, ex. "2 h" [aucune]
     instructions                              consignes encadrées, ex. [Documents interdits.] [aucune]
     identity-header                           cadre nom / prénom / n° étudiant en tête [true]
     identity-style                            "cells" (une lettre par case) ou "free" (écriture attachée) ["cells"]
     notice                                    auto : avertissement « seules les réponses dans les cadres… » ;
                                               none : aucun ; [...] : votre texte [auto]
     marks-top                                 hauteur des repères du haut, entre 9mm et 40mm [9mm]
     lang                                      "fr" ou "en" (césure, avertissement) ["fr"]

   #identity(...)                              cadre d'identité placé à la main (avec identity-header: false)
     style ["cells"], name-cells [18], firstname-cells [18], id-cells [8], id-label [[N° étudiant]]

   #question("clé", points: 1)[énoncé + zones]  question corrigée à la main
     points                                    barème [1]
     grade                                     "direct", "positive", "negative" ou "hybrid" [préférences]
     breakable                                 true : peut être coupée entre deux pages [false]

   #answer(...)                                zone de réponse libre, dans une question (plusieurs possibles)
     height [4cm], style : "blank", "lines" ou "grid" ["blank"], spacing : écart des lignes [7mm]

   #qcm("clé", points: 1, [énoncé], ok[…], ko[…], …)   choix multiples, une case par choix
     ok[…] / ko[…]                             choix juste / faux ; lettres a, b, c… dans l'ordre écrit
     fixed(ko[…])                              choix qui ne bouge pas quand les choix sont mélangés
     grading                                   barème en % des points, ex. "a&c=100;a+=50;*=-25" [aucun] :
                                               a&c = exactement a et c ; a+ = au moins a ; a|b = a ou b ;
                                               [c]=-25 par case ; void= aucune case ; *= tout le reste ;
                                               min= / max= bornes

   #short("clé", points: 1, width: 8cm)[énoncé]       réponse courte sur une ligne (corrigée à la main)
     width [8cm], expected : réponses attendues, ex. ("Pont", "Bridge") [()]

   #numeric("clé", points: 1, digits: 3)[énoncé]      réponse numérique en cases (corrigée à la main pour l'instant)
     digits [3], decimals [0], signed [false], expected [aucune], tolerance [0],
     style : "cells" (un chiffre par case) ou "grid" (colonnes 0–9 à cocher) ["cells"]

   #section("clé", title: [...], shuffle: false)[élément 1][élément 2]…
     regroupe des questions sous un titre ; chaque bloc [...] est UN élément.
     shuffle: true : l'ordre des éléments change d'une version à l'autre (la version A garde l'ordre
     écrit). Des questions dans le même bloc restent ensemble et dans leur ordre.

   #group(a, b, …)                             questions qui restent ensemble dans une section mélangée

   #variant("clé")[formulation 1][formulation 2]…    chaque version imprime une formulation ; ne mettez
     pas de zone de réponse dans une variante, sauf de même hauteur dans toutes les formulations

   #solution[...]                              corrigé, imprimé seulement dans le document de correction

   #diagram("plantuml", \`\`\`plantuml … \`\`\`, width: auto, height: auto, alt: none)
     diagramme rendu par la plateforme : "plantuml", "c4plantuml", "mermaid", "d2", "nomnoml".
     Graphviz (raw-render), fletcher, cetz et chronos se dessinent directement dans Typst.

   Versions (panneau « Versions du sujet ») : ce qui varie = sections shuffle: true, ordre des choix
   de QCM (sauf fixed), variantes. Toutes les versions doivent avoir les mêmes zones, de même taille.
   ============================================================================================ */

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

// shuffle: true : avec plusieurs versions, les trois blocs ci-dessous changent d'ordre (pas en version A)
#section("p1", title: [Partie 1], shuffle: true)[
  #question("q1", points: 2)[
    // une formulation par version (A : la première, B : la seconde, C : de nouveau la première…)
    #variant("v-q1")[Calculez la somme des $n$ premiers entiers.][Calculez la somme des entiers de 1 à $n$.]
    Les formules s'écrivent $sum_(i=1)^n i = (n(n+1)) / 2$.

    #answer(height: 4cm, style: "lines")
    #solution[$n(n+1) / 2$, par récurrence ou en appariant le premier et le dernier terme.]
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
  {
    key: 'section',
    code: '// chaque bloc [...] est un élément ; shuffle: true mélange les éléments d\'une version à l\'autre\n#section("pX", title: [Partie], shuffle: true)[\n  // élément 1\n][\n  // élément 2\n]\n',
  },
  { key: 'variant', code: '#variant("vX")[Première formulation][Deuxième formulation]\n' },
];
