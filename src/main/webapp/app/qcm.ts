/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable prefer-const */
declare let cv: any;
export interface IQCMInput {
  imageTemplate?: ImageData;
  pages?: IQCMImageInput[];
  widthZone?: number;
  heightZone?: number;
  preference: IPreference;
}

export interface IQCMOutput {
  solutions?: IQCMSolution[];
}
export interface IQCMImageInput {
  imageInput?: ImageData;
  numero?: number;
}

export interface IQCMSolution {
  imageSolution?: ImageData;
  numero?: number;
  solution?: string;
}

export interface IPreference {
  qcm_min_width_shape: number;
  qcm_min_height_shape: number;
  qcm_epsilon: number;
  qcm_differences_avec_case_blanche: number;
  linelength: number;
  repairsize: number;
  dilatesize: number;
  morphsize: number;
  drawcontoursizeh: number;
  drawcontoursizev: number;
  minCircle: number;
  maxCircle: number;
  numberofpointToMatch: number;
  numberofgoodpointToMatch: number;
  defaultAlignAlgowithMarker: boolean;
}

/* const MIN_WIDTH_SHAPE = 10;
const MIN_HEIGHT_SHAPE = 10;
const EPSILON = 0.0145; // 0.03
// Interprétation
const DIFFERENCES_AVEC_CASE_BLANCHE = 0.22;*/

function imageDataFromMat(mat: any): any {
  // convert the mat type to cv.CV_8U
  const img = new cv.Mat();
  const depth = mat.type() % 8;
  const scale = depth <= cv.CV_8S ? 1.0 : depth <= cv.CV_32S ? 1.0 / 256.0 : 255.0;
  const shift = depth === cv.CV_8S || depth === cv.CV_16S ? 128.0 : 0.0;
  mat.convertTo(img, cv.CV_8U, scale, shift);

  // convert the img type to cv.CV_8UC4
  switch (img.type()) {
    case cv.CV_8UC1:
      cv.cvtColor(img, img, cv.COLOR_GRAY2RGBA);
      break;
    case cv.CV_8UC3:
      cv.cvtColor(img, img, cv.COLOR_RGB2RGBA);
      break;
    case cv.CV_8UC4:
      break;
    default:
      throw new Error('Bad number of channels (Source image must have 1, 3 or 4 channels)');
  }
  const clampedArray = new ImageData(new Uint8ClampedArray(img.data), img.cols, img.rows);
  img.delete();
  return clampedArray;
}

export function doQCMResolution(p: { msg: any; payload: IQCMInput; uid: string }): void {
  const p1: IQCMOutput = {};
  p1.solutions = [];

  // let src = cv.imread("canvasInput0");
  let src = cv.matFromImageData(p.payload.imageTemplate);
  let gray = new cv.Mat();
  cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);
  const res = trouveCases(gray, p.payload.preference);
  // drawRectangle(src,res.cases)

  p.payload.pages?.forEach((srcEE, i) => {
    let grayE = new cv.Mat();
    let srcE = cv.matFromImageData(srcEE.imageInput);
    cv.cvtColor(srcE, grayE, cv.COLOR_RGBA2GRAY, 0);
    const casesvideseleves = trouveCases(grayE, p.payload.preference);
    const decalage = computeDecallage(casesvideseleves, res);

    const dstE = applyTranslation(srcE, decalage);
    let results = analyseStudentSheet(res, src, dstE, p.payload.preference);
    let e = imageDataFromMat(dstE);
    let solution: string[] = [];

    results.forEach((v, k) => {
      if (v.verdict) {
        solution.push(String.fromCharCode(97 + k));
      }
    });
    p1.solutions?.push({
      imageSolution: e,
      numero: i,
      solution: solution.join('&'),
    });
    grayE.delete();
    srcE.delete();
    if (dstE !== srcE) {
      dstE.delete();
    }

    casesvideseleves.cases.forEach((ca: any) => ca.delete());
    casesvideseleves.img_cases.forEach((ca: any) => ca.delete());
  });

  src.delete();
  gray.delete();
  res.cases.forEach((ca: any) => ca.delete());
  res.img_cases.forEach((ca: any) => ca.delete());
  postMessage({ msg: p.msg, payload: p1, uid: p.uid });
}

// Installation/Settup

function getDimensions(forme: any): any {
  const rect = cv.boundingRect(forme);
  return {
    w: rect.width,
    h: rect.height,
  };
}

function __moy(coordonnees: any[]): any {
  if (coordonnees.length > 0) {
    let x_sum = 0;
    let y_sum = 0;
    coordonnees.forEach(e => {
      x_sum += e.x;
      y_sum += e.y;
    });
    return { x: x_sum / coordonnees.length, y: y_sum / coordonnees.length };
  } else {
    return { x: 0, y: 0 };
  }
}

function getPosition(forme: any): any {
  const rect = cv.boundingRect(forme);
  return { x: rect.x, y: rect.y };
}

function decoupe(img: any, pos: any, dims: any): any {
  let dst = new cv.Mat();
  // You can try more different parameters
  const rect = new cv.Rect(pos.x, pos.y, dims.w - 2, dims.h - 2);
  dst = img.roi(rect);
  return dst;
}

function interpretationForme(contour: any, preference: IPreference): any {
  const eps = preference.qcm_epsilon * cv.arcLength(contour, true);
  const forme = new cv.Mat();
  cv.approxPolyDP(contour, forme, eps, true);
  let nom = undefined;
  const dims = getDimensions(forme);

  if (dims.w >= preference.qcm_min_width_shape && dims.h >= preference.qcm_min_height_shape) {
    //        console.log(forme)
    //        console.log(forme.data.length)
    const nbCotes = forme.rows; // len(forme)
    if (nbCotes === 1) {
      nom = 'LIGNE';
    } else if (nbCotes === 3) {
      nom = 'TRIANGLE';
    } else if (nbCotes === 4) {
      const ratio = dims.w / dims.h;
      if (ratio >= 0.95 && ratio <= 1.05) {
        nom = 'CARRE';
      } else {
        nom = 'RECTANGLE';
      }
    } else {
      nom = undefined;
    }
  }
  // eslint-disable-next-line object-shorthand
  return { nom: nom, forme: forme };
}

function detectFormes(img: any, nomsFormes: string[] = [], preference: IPreference): any[] {
  const thrash = new cv.Mat();
  cv.threshold(img, thrash, 240, 255, cv.THRESH_BINARY);
  let contours = new cv.MatVector();
  let hierarchy = new cv.Mat();
  cv.findContours(thrash, contours, hierarchy, cv.RETR_TREE, cv.CHAIN_APPROX_NONE);
  const formes: any[] = [];
  // approximates each contour to polygon
  for (let i = 0; i < contours.size(); ++i) {
    let contour = contours.get(i);
    // contours.forEach(contour=> {
    const res = interpretationForme(contour, preference);
    if (nomsFormes.includes(res.nom)) {
      // affiche(img,forme=forme)
      formes.push(res.forme);
    }
  }

  // Tri des formes pour que l'ordre des cases détecté soit intuitif
  formes.sort(__comparePosition);
  //    formes.sort(key=functools.cmp_to_key(__comparePosition))
  // Filtrage des 'doublons' : opencv a souvent tendance à repérer 2 carrés (très proches) au lieu d'un
  const res: any[] = [];
  const todelete: any[] = [];
  formes.forEach((x, i) => {
    if (!faitDoublon(i, formes)) {
      res.push(x);
    } else {
      todelete.push(x);
    }
  });
  todelete.forEach(x => {
    x.delete();
  });
  return res;
}

// Comparaison personnalisée de positions (lecture haut-bas,gauche-droite)
function __comparePosition(f1: any, f2: any): number {
  let p1 = getPosition(f1);
  let p2 = getPosition(f2);
  if (p1.y < p2.y) {
    return -1;
  } else if (p1.y > p2.y) {
    return 1;
  } else {
    return p1.x - p2.x;
  }
}

// Indique si une forme contient (entièrement ou partiellement) une autre
function intersection(f1: any, f2: any): boolean {
  return __f2Inf1(f1, f2) || __f2Inf1(f2, f1);
}

function __f2Inf1(f1: any, f2: any): boolean {
  let pos1 = getPosition(f1);
  let pos2 = getPosition(f2);
  let dim1 = getDimensions(f1);
  let dim2 = getDimensions(f2);
  const inter_x = (pos2.x >= pos1.x && pos2.x <= pos1.x + dim1.w) || (pos2.x + dim2.w >= pos1.x && pos2.x + dim2.w <= pos1.x + dim1.w);
  const inter_y = (pos2.y >= pos1.y && pos2.y <= pos1.y + dim1.h) || (pos2.y + dim2.h >= pos1.y && pos2.y + dim2.h <= pos1.y + dim1.h);
  return inter_x && inter_y;
}

// Indique si une forme est en intersection avec une autre et est moins intéressante
function faitDoublon(indice: any, formes: any): boolean {
  let f = formes[indice];
  let res = false;
  formes.forEach((f_: any, i: number) => {
    if (indice < i && intersection(f, f_)) {
      res = true; // || res
    }
  });
  return res;
}

// Trouve les cases qui composent l'image désignée par le chemin
function trouveCases(img: any, preference: IPreference): any {
  const formes_cases = detectFormes(img, ['CARRE', 'RECTANGLE'], preference);
  const cases: any[] = [];
  const img_cases: any[] = [];
  // Enregistrement des cases de l'image (tous les carrés détectés)
  formes_cases.forEach(forme => {
    const dim = getDimensions(forme);
    const pos = getPosition(forme);
    cases.push(forme);
    img_cases.push(decoupe(img, pos, dim));
  });
  // eslint-disable-next-line object-shorthand
  return { cases: cases, img_cases: img_cases };
}

function drawRectangle(img: any, formes: any, couleur: any = new cv.Scalar(255, 0, 0, 128), epaisseur = 2): any {
  // Attention on est ici en bgr et non en rgb
  formes.forEach((forme: any) => {
    const pos = getPosition(forme);
    const dim = getDimensions(forme);
    dim.h = dim.h - 2;
    dim.w = dim.w - 2;
    let pointMin = new cv.Point(pos.x, pos.y);
    let pointMax = new cv.Point(pos.x + dim.w, pos.y + dim.h);
    cv.rectangle(img, pointMin, pointMax, couleur, epaisseur, 0);
  });
  return img;
}

function analyseStudentSheet(casesExamTemplate: any, templateimage: any, studentScanImage: any, preference: IPreference): Map<number, any> {
  const cases_remplies: any[] = [];
  const cases_vides: any[] = [];
  let infos_cases: Map<number, any> = new Map<number, any>();
  // imgs_template =[]
  /* casesExamTemplate.cases.forEach((case1,k)=> {
      imgs_template.push(decoupeMoins1(templateimage,getPosition(case1),getDimensions(case1)))
    })*/
  casesExamTemplate.cases.forEach((case1: any, k: number) => {
    // Pour chaque (x,y) associé à une case du template, on récupère la zone située au même endroit sur la copie
    // et on la compare avec celle du template
    const img_case_eleve = decoupe(studentScanImage, getPosition(case1), getDimensions(case1));
    const diff = diffCouleurAvecCaseBlanche(img_case_eleve);

    if (diff > preference.qcm_differences_avec_case_blanche) {
      infos_cases.set(k, { verdict: true, prediction: diff });
      cases_remplies.push(case1);
    } else {
      infos_cases.set(k, { verdict: false, prediction: diff });
      cases_vides.push(case1);
    }
    if (diff > 0.16 && diff < 0.25) {
      cv.putText(
        studentScanImage,
        '' + diff.toFixed(2),
        { x: getPosition(case1).x, y: getPosition(case1).y - 5 },
        cv.FONT_HERSHEY_COMPLEX,
        0.5,
        new cv.Scalar(255, 0, 0, 128),
        1
      );
    } else {
      cv.putText(
        studentScanImage,
        '' + diff.toFixed(2),
        { x: getPosition(case1).x, y: getPosition(case1).y - 5 },
        cv.FONT_HERSHEY_COMPLEX,
        0.33,
        new cv.Scalar(255, 0, 0, 128),
        1
      );
    }
    img_case_eleve.delete();
  });

  drawRectangle(studentScanImage, cases_remplies, new cv.Scalar(0, 255, 0, 128));
  drawRectangle(studentScanImage, cases_vides, new cv.Scalar(0, 0, 255, 128));
  /* imgs_template.forEach(img=> {
      //  img.delete();
    })*/
  return infos_cases;
}

function computeDecallage(casesvideseleves: any, casesvidesexamtemplate: any): any {
  const decalages: any[] = [];
  casesvideseleves.cases.forEach((casevideeleve: any) => {
    let smalldist = 500;
    let currentBox = undefined;
    casesvidesexamtemplate.cases.forEach((c: any) => {
      const dist = __dist(casevideeleve, c);
      if (smalldist > dist && dist < 25) {
        smalldist = dist;
        currentBox = c;
      }
    });
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (currentBox !== undefined) {
      // m.set(casevideeleve, currentBox)
      let poseleve = getPosition(casevideeleve);
      let posref = getPosition(currentBox);
      let decalage = { x: poseleve.x - posref.x, y: poseleve.y - posref.y };
      decalages.push(decalage);
    }
  });
  return __moy(decalages);
}

function applyTranslation(src1: any, decalage: any): any {
  let dst = new cv.Mat();
  if (decalage.x !== 0 || decalage.y !== 0) {
    let M = cv.matFromArray(2, 3, cv.CV_64FC1, [1, 0, -decalage.x, 0, 1, -decalage.y]);
    let dsize = new cv.Size(src1.cols, src1.rows);
    // You can try more different parameters
    cv.warpAffine(src1, dst, M, dsize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar());
    return dst;
  } else {
    return src1;
  }
}

function __dist(case1: any, case2: any): number {
  const rect1 = cv.boundingRect(case1);
  const rect2 = cv.boundingRect(case2);
  let x1 = rect1.x + rect1.width / 2;
  let y1 = rect1.y + rect1.height / 2;

  let x2 = rect2.x + rect2.width / 2;
  let y2 = rect2.y + rect2.height / 2;

  return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
}

// Renvoie un pourcentage de différences entre une image de case et une considérée comme vide
function diffCouleurAvecCaseBlanche(img_case: any): number {
  let gray = new cv.Mat();
  cv.cvtColor(img_case, gray, cv.COLOR_RGBA2GRAY, 0);
  let thresh = new cv.Mat();
  cv.threshold(gray, thresh, 0, 255, cv.THRESH_BINARY_INV + cv.THRESH_OTSU);
  let nonzerorationforeleve = cv.countNonZero(thresh) / (img_case.rows * img_case.cols);

  return nonzerorationforeleve;
}
