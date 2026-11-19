# Sujets Typst — paquet `correctexam` (T25, prototype V0)

Décision : `corrigeExamBack/docs/adr/0004-sujets-ecrits-en-typst.md`. Le dépôt d'un sujet PDF reste le mode par défaut ; ce dossier ne change rien à ce flux.

## Contenu

| Chemin                              | Rôle                                                                                                                                                                                                                               |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `correctexam/0.1.0/`                | Paquet Typst : en-tête d'identité, `question`, `answer`, `qcm` (`ok` / `ko` / `fixed`), `numeric` (`cells` ou `grid`), `short`, `section` (mélange), `variant` (variantes d'énoncé), `group`, `solution`, repères et code par page |
| `examples/genie-logiciel.typ`       | Sujet d'exemple : tous les types de zones, maths (natives et LaTeX via `mitex`), code (`codly`), Graphviz (`diagraph`), séquence (`chronos`)                                                                                       |
| `app/scanexam/typst/typst-zones.ts` | Lecture des métadonnées `<ce-zone>` → zones CorrectExam (1/100000 de page), lettres canoniques des QCM, propriétés PDF compatibles avec la classe LaTeX                                                                            |

## Essayer en ligne de commande

Le paquet se compile avec Typst 0.14 ou plus récent. Les paquets `@preview` doivent être présents localement (la plateforme les embarquera, voir l'ADR) :

```bash
mkdir -p ~/.local/share/typst/packages/local/correctexam
ln -s "$PWD/correctexam/0.1.0" ~/.local/share/typst/packages/local/correctexam/0.1.0
cd examples
typst compile genie-logiciel.typ                                   # aperçu : pas de code de page
typst eval 'query(<ce-zone>).map(m => (value: m.value))' --in genie-logiciel.typ   # zones
# version B, 2 copies, 1 page blanche ajoutée par copie (4 pages chacune)
typst compile genie-logiciel.typ --input ce-plan='{"edition":"E1","version":"B","copies":["c001","c002"],"pad":1,"order":{"p2":[2,0,1]},"choices":{"q-patterns":[2,0,1,3]}}'
```

## Options de mise en page

- `exam(marks-top: 22mm)` : centre des deux ronds du haut, à 22 mm du bord supérieur (bas : 9 mm), pour qu'un coin coupé au massicot après dégrafage les laisse intacts (vérifié : coupe jusqu'à 25 mm le long de chaque bord). Bornes 9 à 40 mm : au-delà, le worker serveur ne trouve plus le rond dans son carré de coin (300 px sur une page de 2000 px, soit 44,6 mm).
- `exam(identity-style: "cells")` : nom et prénom en cases (une lettre par case, reconnaissance lettre à lettre, `Template.caseboxname = true`) ou `"free"` (cadre libre pour l'écriture attachée, reconnaissance de la ligne entière, `caseboxname = false`). Le numéro étudiant reste en cases. Cadres d'identité en gris clair (`luma(185)`) : toujours détectés par `trouveCases` sur le modèle (18 / 18 / 8 cases à 144 et 300 dpi).

- `exam(notice: auto)` : avertissement imprimé sous l'en-tête (« seules les réponses écrites dans les cadres et les cases prévus sont lues et corrigées »), en français ou en anglais selon `lang` ; `notice: none` le retire, `notice: [...]` le remplace.
- QCM : pas de lettre devant les cases (les lettres n'existent que dans les métadonnées) ; lignes et quadrillage des zones libres en gris clair, cadre de la zone en gris foncé.

## En développement

Le cache de build Angular est dans `target/angular/` (`angular.json`). S'il a été rempli pendant un `npm ci`, il peut garder une copie tronquée du compilateur Wasm (erreur « section … extends past end of the module ») : `npx ng cache clean`, puis relancer `npm start`.

## Contrat `ce-plan` (entrée JSON, tout est facultatif)

| Clé                  | Rôle                                                                                                                             |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `edition`, `version` | Identifiants du tirage et de la version                                                                                          |
| `copies`             | Identifiants opaques des copies ; une copie par entrée, numérotation des pages remise à 1                                        |
| `stamp`              | `true` : zone du code laissée vide, le code de chaque copie est apposé ensuite (voir « Mesures »)                                |
| `pad`                | Pages blanches ajoutées à la fin de chaque copie (calculées par la plateforme après une première compilation : `copy-end.pages`) |
| `order.<section>`    | Ordre des éléments d'une section `shuffle: true` (indices)                                                                       |
| `choices.<question>` | Ordre d'affichage des choix d'un QCM (indices canoniques)                                                                        |
| `variants.<clé>`     | Indice de la formulation retenue pour `#variant("<clé>")[…][…]` (0 par défaut)                                                   |
| `numbers.<question>` | Numéro canonique (`Question.numero`) quand l'ordre affiché diffère                                                               |
| `solution`           | `true` : affiche les blocs `solution` (corrigé)                                                                                  |

Les métadonnées `<ce-zone>` portent `format: 1` ; `typst-zones.ts` refuse un autre format. Les QCM indiquent leurs choix `fixed` (indices) ; `<ce-section>` et `<ce-variant>` (`key`, `count`) décrivent ce qui peut varier entre versions (`subject-versions.ts`).

**Versions (T25e, ADR 0005)** : la version A est le plan identité et porte la correction ; les autres versions doivent garder les mêmes zones (même taille, même nombre de pages, mêmes cases de QCM), seule leur position change. Une zone de réponse placée dans une `variant` doit donc avoir la même hauteur dans toutes les formulations.

## Mesures du prototype (16/11/2026, Typst 0.15.1 natif, 2 cœurs)

- Aperçu du sujet d'exemple (3 pages, diagrammes compris) : 0,9 s.
- Copies générées par Typst : 20 copies en 3,4 s, 60 en 10 s ; 300 copies n'aboutissent pas (arrêt sans message après 54 s). **Retenu : une compilation par version (`stamp: true`), puis duplication des pages et apposition du code par pdf-lib** : 300 copies × 4 pages en 5,3 s (Node), 13 Mo.
- Repères : les 4 ronds sont ceux retenus par `alignImageBasedOnCircle` (paramètres du front) à 144 et 300 dpi.
- Cases : QCM (4/4) et grille numérique (20/20) détectées comme `CARRE` par les paramètres de `qcm.ts` dans la zone générée (boîte englobante + 1,2 mm), dans l'ordre attendu.
- Code de page (Data Matrix 11 mm) : lu sur toutes les pages, propres et dégradées (150 dpi, rotation 0,8°, flou, bruit), y compris quand il est apposé par pdf-lib.
- Plugins Wasm : `diagraph` 1,1 Mo, `tiaoma` 0,8 Mo, `mitex` 0,3 Mo.
- Limites vues : les nœuds `record` de Graphviz ne sont pas rendus par `diagraph` (classes UML complètes → PlantUML via Kroki) ; `chronos` lit aussi la syntaxe PlantUML des diagrammes de séquence (`from-plantuml`).

Scripts de vérification (hors dépôt) : `dev/patches/T25-typst-spike/` (`check_sheet.py`, `stamp.mjs`).
