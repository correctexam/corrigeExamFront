// CorrectExam exam package (T25, ADR 0004).
//
// A subject written with this package gives, in one compilation:
// - the sheets to print: alignment circles in the four corners and a page code (Data Matrix) on every page;
// - the exact position of every zone (identity, answers, MCQ boxes, numeric cells), exposed as
//   `metadata` labelled <ce-zone>. The platform reads them with a query (`typst query main.typ "<ce-zone>"`)
//   and turns them into CorrectExam zones (1/100000 of the page) without anybody drawing a zone.
//
// Variability is driven from the outside: the platform computes the order of the questions and of the
// MCQ choices of each version (seeded, tested TypeScript code) and passes it as the JSON input `ce-plan`
// (`--input ce-plan=...`). This package only applies it: there is no randomness in Typst.

#import "@preview/tiaoma:0.4.0": data-matrix

// ---------------------------------------------------------------------------------------------------
// Inputs

#let _plan = if "ce-plan" in sys.inputs { json(bytes(sys.inputs.at("ce-plan"))) } else { (:) }

/// Version of the zone metadata. Bump it when the shape of a <ce-zone> value changes.
#let ZONE_FORMAT = 1

// Geometry shared with the scan pipeline. Changing it requires checking the alignment (circles) and the
// MCQ detection (squares) again: see content/typst/README.md.
#let _geom = (
  // filled circles, center at `mark-inset` from the side edges and from the bottom edge; the top circles are
  // lower (`exam(marks-top: …)`) so that a corner cut with a guillotine to remove the staples leaves them intact
  mark-radius: 2.5mm,
  mark-inset: 9mm,
  marks-top: 22mm,
  // the server worker looks for each circle in a corner square of 300 px on a page 2000 px high (44,6 mm):
  // the whole circle must stay inside it
  marks-top-max: 40mm,
  // page code (Data Matrix) at the bottom center
  code-size: 11mm,
  // MCQ and numeric bubbles: squares, drawn with a dark thin stroke (detected as CARRE)
  box-size: 4.2mm,
  box-stroke: 0.8pt + black,
  // handwritten cells (identity, numeric digits)
  cell-width: 7mm,
  cell-height: 8.5mm,
  cell-gap: 1.2mm,
  cell-stroke: 0.6pt + luma(90),
  // identity: light grey, so that the frames disturb the reading of the handwriting as little as possible
  identity-stroke: 0.6pt + luma(185),
  identity-free-height: 11mm,
)

// ---------------------------------------------------------------------------------------------------
// State

#let _copy = state("ce-copy", none)
#let _current = state("ce-question", none)
#let _parts = state("ce-parts", (:))
#let _qnum = counter("ce-question-number")

// ---------------------------------------------------------------------------------------------------
// Zone metadata

// Emits the metadata of a zone whose top-left corner is the current position. Must be called inside a
// `place(top + left, ...)` of the zone so that `here()` is the corner of the zone.
#let _mark(kind, w, h, ..extra) = context {
  let p = here().position()
  [#metadata((
      format: ZONE_FORMAT,
      kind: kind,
      copy: _copy.get(),
      question: _current.get(),
      page: p.page,
      // page-relative page number: the page counter restarts for every copy
      page-in-copy: counter(page).get().first(),
      x: p.x.pt(),
      y: p.y.pt(),
      w: w.pt(),
      h: h.pt(),
      page-width: page.width.pt(),
      page-height: page.height.pt(),
    ) + extra.named()) <ce-zone>]
}

// Index (1-based) of the next part of the current question: a question can have several zones.
#let _next-part() = context {
  let k = _current.get()
  _parts.update(d => {
    d.insert(k, d.at(k, default: 0) + 1)
    d
  })
}

// A rectangle of fixed size that is a zone of the current question.
#let _zone-box(kind, width, height, stroke: none, inset: 0pt, body: none, ..extra) = box(
  width: width,
  height: height,
  stroke: stroke,
  inset: inset,
  {
    place(top + left, dx: -inset, dy: -inset, _mark(kind, width, height, ..extra))
    body
  },
)

// ---------------------------------------------------------------------------------------------------
// Page furniture: alignment circles and page code

// Copy of the current page. The state is not usable here: in the page background, it still has its value
// from before the first element of the page, which is the `copy-start` marker on the first page of a copy.
// Same for the page counter, which is reset by that marker: the page number in the copy is computed.
#let _copy-of-page() = {
  let starts = query(<ce-copy>).filter(m => m.value.kind == "copy-start" and m.location().page() <= here().page())
  if starts.len() == 0 {
    (copy: none, page: here().page())
  } else {
    (copy: starts.last().value.copy, page: here().page() - starts.last().location().page() + 1)
  }
}

#let _page-code() = context {
  let (copy, page: n) = _copy-of-page()
  if _plan.at("stamp", default: false) {
    // the platform stamps the code of each copy afterwards (pdf-lib): keep the area empty
    none
  } else if copy == none {
    // preview: no code, so that a preview can never be scanned as a real copy
    text(size: 7pt, fill: luma(120))[aperçu — p. #n]
  } else {
    let edition = _plan.at("edition", default: "0")
    // CE1 = format of the code. Opaque for a human: no student, the version is a short label.
    let payload = "CE1|" + str(edition) + "|" + str(copy) + "|" + str(n)
    stack(
      dir: ltr,
      spacing: 2mm,
      data-matrix(payload, width: _geom.code-size, height: _geom.code-size),
      align(horizon, text(size: 7pt, fill: luma(80))[#copy · p. #n]),
    )
  }
}

#let _background(marks-top) = {
  let r = _geom.mark-radius
  let i = _geom.mark-inset
  for (ax, ay) in ((left, top), (right, top), (left, bottom), (right, bottom)) {
    let dx = if ax == left { i - r } else { -(i - r) }
    let dy = if ay == top { marks-top - r } else { -(i - r) }
    place(ax + ay, dx: dx, dy: dy, circle(radius: r, fill: black))
  }
  place(bottom + center, dy: -(_geom.mark-inset - _geom.code-size / 2), _page-code())
}

// ---------------------------------------------------------------------------------------------------
// Identity header

// One row of handwritten cells; the zone covers the cells only (the label stays outside).
#let _cells-zone(kind, count, stroke: _geom.cell-stroke, ..extra) = {
  let w = count * _geom.cell-width + (count - 1) * _geom.cell-gap
  _zone-box(kind, w, _geom.cell-height, ..extra, body: stack(
    dir: ltr,
    spacing: _geom.cell-gap,
    ..range(count).map(_ => box(width: _geom.cell-width, height: _geom.cell-height, stroke: stroke)),
  ))
}

// One free frame, as wide as `count` cells, for cursive handwriting.
#let _free-zone(kind, count, ..extra) = {
  let w = count * _geom.cell-width + (count - 1) * _geom.cell-gap
  _zone-box(kind, w, _geom.identity-free-height, stroke: _geom.identity-stroke, ..extra)
}

/// Last name, first name and student number, read by the existing identity association.
/// `style`: "cells" (one letter per cell, recognised letter by letter) or "free" (one frame per line, for
/// cursive handwriting, recognised as a whole). The student number always uses cells (digits).
/// Nothing about the student is ever printed (T25 decision): the student fills these zones.
#let identity(style: "cells", name-cells: 18, firstname-cells: 18, id-cells: 8, id-label: [N° étudiant]) = {
  assert(style in ("cells", "free"), message: "identity: style must be \"cells\" or \"free\"")
  let line(role, count) = if style == "cells" {
    _cells-zone("identity", count, stroke: _geom.identity-stroke, role: role, style: style)
  } else {
    _free-zone("identity", count, role: role, style: style)
  }
  block(
    width: 100%,
    breakable: false,
    grid(
      columns: (auto, 1fr),
      column-gutter: 3mm,
      row-gutter: 2.5mm,
      align: (right + horizon, left + horizon),
      text(weight: "bold", size: 9pt)[NOM], line("lastname", name-cells),
      text(weight: "bold", size: 9pt)[PRÉNOM], line("firstname", firstname-cells),
      text(weight: "bold", size: 9pt, id-label),
      _cells-zone("identity", id-cells, stroke: _geom.identity-stroke, role: "stdid", style: "cells"),
    ),
  )
}

// ---------------------------------------------------------------------------------------------------
// Questions

#let _number-of(key, displayed) = _plan.at("numbers", default: (:)).at(key, default: displayed)

// Heading of a question; records it so that the zones that follow belong to it.
#let _question-head(key, points, type, extra: (:)) = {
  _qnum.step()
  _current.update(key)
  context {
    let displayed = _qnum.get().first()
    place(top + left, _mark(
      "question",
      0pt,
      0pt,
      key: key,
      type: type,
      points: points,
      displayed: displayed,
      number: _number-of(key, displayed),
      ..extra,
    ))
    text(weight: "bold")[Question #displayed]
    h(0.5em)
    text(size: 9pt, fill: luma(80))[(#points pt#if points > 1 [s])]
  }
}

/// A question corrected by hand. Put one or more `answer` zones in its body. The question is kept on one
/// page with its zones unless `breakable: true` (long statements). `grade`: "direct", "positive", "negative"
/// or "hybrid" (CorrectExam grading modes); `none` keeps the default of the teacher's preferences.
#let question(key, points: 1, grade: none, breakable: false, body) = block(width: 100%, breakable: breakable, above: 1.4em, {
  _question-head(key, points, "manual", extra: (grade: grade))
  linebreak()
  body
})

/// Free answer zone of fixed height. `style`: "blank", "lines" or "grid".
#let answer(height: 4cm, style: "blank", spacing: 7mm) = {
  _next-part()
  layout(size => context {
    let part = _parts.get().at(_current.get(), default: 1)
    let lines = if style == "lines" {
      for k in range(1, int(height / spacing) + 1) {
        place(top + left, dy: k * spacing - 1mm, line(length: size.width, stroke: 0.4pt + luma(170)))
      }
    } else if style == "grid" {
      for k in range(1, int(height / 5mm)) {
        place(top + left, dy: k * 5mm, line(length: size.width, stroke: 0.3pt + luma(200)))
      }
      for k in range(1, int(size.width / 5mm)) {
        place(top + left, dx: k * 5mm, line(angle: 90deg, length: height, stroke: 0.3pt + luma(200)))
      }
    }
    block(above: 0.8em, _zone-box("answer", size.width, height, stroke: 0.6pt + luma(60), part: part, body: lines))
  })
}

/// Short answer: one framed line, corrected by hand (similar answers are grouped by the platform).
#let short(key, points: 1, width: 8cm, expected: (), body) = block(width: 100%, breakable: false, above: 1.4em, {
  _question-head(key, points, "short", extra: (expected: expected))
  linebreak()
  body
  h(0.6em)
  _next-part()
  context {
    let part = _parts.get().at(_current.get(), default: 1)
    box(baseline: 30%, _zone-box("short", width, 9mm, stroke: 0.6pt + luma(60), part: part))
  }
})

// ---------------------------------------------------------------------------------------------------
// MCQ

/// A right choice of an MCQ (`right` would hide the alignment of the same name).
#let ok(body) = (correct: true, fixed: false, body: body)
/// A wrong choice of an MCQ.
#let ko(body) = (correct: false, fixed: false, body: body)
/// Keeps a choice at its place when the choices are shuffled ("None of the above").
#let fixed(choice) = choice + (fixed: true)

#let _letters = "abcdefghijklmnopqrstuvwxyz"

/// Multiple choice question. Canonical letters follow the order of the source (a, b, c…); the grading
/// DSL of T20 uses them. The order displayed to a version comes from the plan.
#let qcm(key, points: 1, grading: none, stem, ..choices) = {
  let cs = choices.pos()
  let order = _plan.at("choices", default: (:)).at(key, default: range(cs.len()))
  assert(order.len() == cs.len(), message: "ce-plan: bad choice order for " + key)
  let rights = cs.enumerate().filter(((i, c)) => c.correct).map(((i, c)) => _letters.at(i))
  block(width: 100%, breakable: false, above: 1.4em, {
    _question-head(key, points, "qcm", extra: (
      grading: grading,
      correct: rights.join("&"),
      choices: cs.len(),
    ))
    linebreak()
    stem
    _next-part()
    v(0.4em)
    context {
      let part = _parts.get().at(_current.get(), default: 1)
      grid(
        columns: (5mm, _geom.box-size, 1fr),
        column-gutter: (1.5mm, 3.5mm),
        row-gutter: 2.4mm,
        align: (right + horizon, left + horizon, left + horizon),
        ..order
          .enumerate()
          .map(((displayed, canonical)) => (
            text(size: 9pt)[#_letters.at(displayed).],
            _zone-box(
              "qcm-box",
              _geom.box-size,
              _geom.box-size,
              stroke: _geom.box-stroke,
              part: part,
              displayed: _letters.at(displayed),
              letter: _letters.at(canonical),
            ),
            cs.at(canonical).body,
          ))
          .flatten(),
      )
    }
  })
}

// ---------------------------------------------------------------------------------------------------
// Numeric answer

/// Numeric answer, auto-gradable. `style`: "cells" (one handwritten digit per cell) or "grid"
/// (one column of 0–9 boxes per digit, read like an MCQ).
#let numeric(key, points: 1, digits: 3, decimals: 0, signed: false, expected: none, tolerance: 0, style: "cells", body) = block(
  width: 100%,
  breakable: false,
  above: 1.4em,
  {
    _question-head(key, points, "numeric", extra: (
      digits: digits,
      decimals: decimals,
      signed: signed,
      expected: expected,
      tolerance: tolerance,
      style: style,
    ))
    linebreak()
    body
    _next-part()
    v(0.4em)
    context {
      let part = _parts.get().at(_current.get(), default: 1)
      let n = digits + decimals
      if style == "cells" {
        let cell(k) = _zone-box("numeric-digit", _geom.cell-width, _geom.cell-height, stroke: _geom.cell-stroke, part: part, digit: k)
        let items = ()
        if signed { items.push(_zone-box("numeric-sign", _geom.cell-width, _geom.cell-height, stroke: _geom.cell-stroke, part: part)) }
        for k in range(n) {
          if decimals > 0 and k == digits { items.push(align(bottom, text(size: 14pt)[,])) }
          items.push(cell(k))
        }
        stack(dir: ltr, spacing: _geom.cell-gap, ..items)
      } else {
        // one column per digit, values 0..9 from top to bottom; labels on the left, outside the boxes
        grid(
          columns: (5mm,) + (_geom.box-size,) * n,
          column-gutter: 2.4mm,
          row-gutter: 1.6mm,
          align: center + horizon,
          ..range(10)
            .map(v => (
              text(size: 8pt)[#v],
              ..range(n).map(k => _zone-box(
                "numeric-bubble",
                _geom.box-size,
                _geom.box-size,
                stroke: _geom.box-stroke,
                part: part,
                digit: k,
                value: v,
              )),
            ))
            .flatten(),
        )
      }
    }
  },
)

// ---------------------------------------------------------------------------------------------------
// Structure and variability

/// A group of questions. With `shuffle: true`, the plan gives the order of its items for each version
/// (`ce-plan.order.<key>`: list of indices). Without a plan, the source order is kept.
#let section(key, title: none, shuffle: false, ..items) = {
  let its = items.pos()
  let order = if shuffle { _plan.at("order", default: (:)).at(key, default: range(its.len())) } else { range(its.len()) }
  assert(order.len() == its.len(), message: "ce-plan: bad order for section " + key)
  // records the structure so that the platform can compute the plan of each version
  [#metadata((format: ZONE_FORMAT, kind: "section", key: key, shuffle: shuffle, items: its.len())) <ce-section>]
  if title != none { heading(level: 1, title) }
  for i in order { its.at(i) }
}

/// Questions that stay together and in this order when their section is shuffled (case study).
#let group(..items) = items.pos().join()

/// Content shown only in the solution document (`ce-plan.solution = true`).
#let solution(body) = if _plan.at("solution", default: false) {
  block(width: 100%, inset: 2mm, fill: luma(235), stroke: (left: 2pt + luma(120)), body)
}

// ---------------------------------------------------------------------------------------------------
// Document

/// Sets up an exam sheet. With a plan listing `copies`, the subject is repeated once per copy, each copy
/// restarting its page numbers and ending on an even page (recto-verso).
#let exam(
  title: none,
  subtitle: none,
  duration: none,
  instructions: none,
  identity-header: true,
  identity-style: "cells",
  marks-top: _geom.marks-top,
  lang: "fr",
  doc,
) = {
  assert(
    marks-top >= _geom.mark-inset and marks-top <= _geom.marks-top-max,
    message: "exam: marks-top must be between 9mm and 40mm",
  )
  set document(title: title)
  set text(lang: lang, size: 10.5pt)
  set page(
    paper: "a4",
    margin: (top: 18mm, bottom: 24mm, left: 18mm, right: 18mm),
    background: _background(marks-top),
  )
  set par(justify: true)
  // printed in black and white: no information carried by color alone
  set raw(theme: none)
  show raw.where(block: true): set text(size: 9pt)

  let copies = _plan.at("copies", default: (none,))
  for (i, copy) in copies.enumerate() {
    if i > 0 { pagebreak() }
    _copy.update(copy)
    counter(page).update(1)
    _qnum.update(0)
    _parts.update((:))
    _current.update(none)
    [#metadata((format: ZONE_FORMAT, kind: "copy-start", copy: copy)) <ce-copy>]
    align(center, {
      if title != none { text(size: 16pt, weight: "bold", title) }
      if subtitle != none { linebreak(); text(size: 11pt, subtitle) }
      if duration != none { linebreak(); text(size: 9pt, fill: luma(80))[Durée : #duration] }
    })
    v(4mm)
    if identity-header { identity(style: identity-style) }
    if instructions != none {
      v(3mm)
      block(width: 100%, inset: 2.5mm, stroke: 0.6pt, text(size: 9pt, instructions))
    }
    v(3mm)
    doc
    // Number of pages of the copy, read by the platform after a first compilation: the platform then
    // passes `ce-plan.pad` (blank pages to add) so that every copy of every version has the same even
    // number of pages. Padding from an introspected page count would not converge.
    context {
      [#metadata((format: ZONE_FORMAT, kind: "copy-end", copy: copy, pages: counter(page).get().first())) <ce-copy>]
    }
    for _ in range(_plan.at("pad", default: 0)) {
      pagebreak()
      box()
    }
  }
}
