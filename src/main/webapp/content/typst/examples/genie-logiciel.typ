// Example subject for the Typst spike (T25): every kind of zone, plus maths, code and diagrams.
// Compile:   typst compile genie-logiciel.typ
// Zones:     typst query genie-logiciel.typ "<ce-zone>" --format json
// Version B: typst compile genie-logiciel.typ --input ce-plan='{"edition":"E1","version":"B","copies":["c001","c002"],"order":{"p2":[2,0,1]},"choices":{"q-patterns":[2,0,1,3]}}'

#import "@local/correctexam:0.1.0": *
#import "@preview/codly:1.3.0": codly, codly-init
#import "@preview/mitex:0.2.7": mi, mitex
#import "@preview/diagraph:0.3.8": raw-render
#import "@preview/chronos:0.3.0"

#show: codly-init
#codly(zebra-fill: none, stroke: 0.5pt + luma(150), number-format: n => text(size: 7pt, fill: luma(110), str(n)))

#show: exam.with(
  title: [Génie logiciel — examen terminal],
  subtitle: [Master 1 informatique],
  duration: "2 h",
  instructions: [Répondez directement dans les cadres. Tout débordement n'est pas lu. Documents interdits.],
)

#section("p1", title: [Partie 1 — Modélisation])[
  #question("q-classes", points: 4)[
    Le diagramme ci-dessous (Graphviz rendu dans Typst ; les diagrammes de classes complets passeront par PlantUML / Kroki) décrit des commandes. Ajoutez la classe
    `Paiement` et ses associations, puis justifiez vos multiplicités.

    #align(center, raw-render(```dot
      digraph G {
        rankdir=LR; node [shape=box];
        Client -> Commande [label="1 .. 0..*", arrowhead=none];
        Commande -> LigneCommande [arrowhead=diamond, dir=back, label="1 .. 1..*"];
      }
    ```, width: 70%))

    #answer(height: 6cm, style: "grid")
  ]
][
  #question("q-sequence", points: 2)[
    Que se passe-t-il si `valider()` échoue ? (diagramme de séquence en texte, paquet `chronos`)

    #align(center, chronos.diagram({
      import chronos: *
      _par("c", display-name: "Client")
      _par("s", display-name: "Service")
      _par("b", display-name: "Banque")
      _seq("c", "s", comment: "commander()")
      _seq("s", "b", comment: "valider()")
      _seq("b", "s", comment: "refus", dashed: true)
    }))

    #answer(height: 3.5cm, style: "lines")
  ]
]

#section("p2", title: [Partie 2 — Programmation], shuffle: true)[
  #question("q-code", points: 3)[
    Quelle est la complexité de `trier` ? Exprimez-la avec la notation $O$, puis montrez que
    #mi(`\sum_{i=1}^{n} i = \frac{n(n+1)}{2}`) (formule saisie en LaTeX).

    ```java
    static void trier(int[] t) {
        for (int i = 1; i < t.length; i++) {
            int x = t[i], j = i - 1;
            while (j >= 0 && t[j] > x) { t[j + 1] = t[j]; j--; }
            t[j + 1] = x;
        }
    }
    ```

    #answer(height: 4.5cm)
    #solution[$O(n^2)$ dans le pire cas, $O(n)$ si le tableau est déjà trié.]
  ]
][
  #qcm(
    "q-patterns",
    points: 2,
    grading: "a&c=100;a+=50;*=-25",
    [Quels patrons de conception sont des patrons de comportement ?],
    ok[Observer],
    ko[Singleton],
    ok[Visiteur],
    fixed(ko[Aucun de ces patrons]),
  )
][
  #numeric(
    "q-temps",
    points: 1,
    digits: 2,
    decimals: 1,
    expected: 12.5,
    tolerance: 0.1,
    [Temps moyen de réponse mesuré, en millisecondes :],
  )
  #numeric(
    "q-nb-classes",
    points: 1,
    digits: 2,
    expected: 7,
    style: "grid",
    [Nombre de classes du diagramme complété (grille à cocher) :],
  )
]

#short("q-pont", points: 1, width: 6cm, expected: ("Pont", "Bridge"))[
  Nom du patron qui découple une abstraction de son implémentation :
]
