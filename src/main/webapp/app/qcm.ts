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

export function trace(message: any): void {
  postMessage({ msg: { log: message }, uid: '-2' });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function debugImage(imageData: ImageData): void {
  try {
    const c = new OffscreenCanvas(imageData.width, imageData.height);
    const ctx = c.getContext('2d');
    if (ctx) {
      ctx.putImageData(imageData, 0, 0);
      c.convertToBlob().then(blob => {
        //        const dataUri = new FileReader().readAsDataURL(blob);

        const reader = new FileReader();

        reader.onloadend = function () {
          const style = `font-size: 300px; background-image: url("${reader.result}"); background-size: contain; background-repeat: no-repeat;`;
          console.error('%c     ', style);
        };
        reader.readAsDataURL(blob);
      });
    }
  } catch (e) {
    console.error(e);
  }
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
    let _srcE = cv.matFromImageData(srcEE.imageInput);
    let srcE = new cv.Mat();
    let dsize1 = new cv.Size(src.size().width, src.size().height);
    // You can try more different parameters
    cv.resize(_srcE, srcE, dsize1, 0, 0, cv.INTER_AREA);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let mat1 = new cv.Mat(src.rows, src.cols, src.type(), [255, 255, 255, 255]);
    // debugImage(imageDataFromMat(mat1))
    // debugImage(imageDataFromMat(srcE))
    const boundings = res.cases.map((c: any) => cv.boundingRect(c));
    let casesvideseleves = undefined;
    if (boundings.length > 0) {
      const minX = Math.min(...boundings.map((e: any) => e.x));
      const minY = Math.min(...boundings.map((e: any) => e.y));
      const maxX = Math.max(...boundings.map((e: any) => e.x + e.width));
      const maxY = Math.max(...boundings.map((e: any) => e.y + e.height));
      let dst1 = decoupe(srcE, { x: minX, y: minY }, { w: maxX - minX, h: maxY - minY });
      let dst4 = new cv.Mat();
      let dst6 = new cv.Mat();
      const s = new cv.Scalar(255, 255, 255, 255);
      // cv.copyMakeBorder(dst1, dst4, minY,srcE.size().height-maxY , minX,srcE.size().width - maxX , cv.BORDER_CONSTANT, s);
      const bord = Math.min(5, minX, src.size().width - maxX, minY, src.size().height - maxY);
      cv.copyMakeBorder(dst1, dst4, bord, bord, bord, bord, cv.BORDER_CONSTANT, s);
      let dst5 = dst4.clone();
      cv.copyMakeBorder(
        dst5,
        dst6,
        minY - bord,
        srcE.size().height - maxY - bord,
        minX - bord,
        srcE.size().width - maxX - bord,
        cv.BORDER_CONSTANT,
        s,
      );

      cv.cvtColor(dst6, grayE, cv.COLOR_RGBA2GRAY, 0);

      const elevePref = { ...p.payload.preference };
      elevePref.qcm_epsilon = Math.max(0.05, elevePref.qcm_epsilon);
      elevePref.qcm_differences_avec_case_blanche = Math.min(0.1, elevePref.qcm_differences_avec_case_blanche);
      casesvideseleves = trouveCases(grayE, elevePref);

      dst1.delete();
      dst4.delete();
      dst5.delete();
      dst6.delete();
    }

    let dstE;
    if (casesvideseleves !== undefined && casesvideseleves.cases !== undefined && casesvideseleves.cases.length > 0) {
      const decalage = /* { x: 0, y: 0 }; // */ computeDecallage(casesvideseleves, res);
      dstE = applyTranslation(srcE, decalage);
      // dstE = srcE
    } else {
      dstE = srcE;
    }

    const elevePref = { ...p.payload.preference };
    elevePref.qcm_differences_avec_case_blanche = Math.max(0.1, elevePref.qcm_differences_avec_case_blanche);

    let results = analyseStudentSheet(res, src, dstE, elevePref);
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
    _srcE.delete();

    if (dstE !== srcE) {
      dstE.delete();
    }

    casesvideseleves.cases.forEach((ca: any) => ca.delete());
    casesvideseleves.img_cases.forEach((ca: any) => ca.delete());
  });

  src.delete();
  gray.delete();
  // res.cases.forEach((ca: any) => ca.delete());
  res.img_cases.forEach((ca: any) => ca.delete());
  postMessage({ msg: p.msg, payload: p1, uid: p.uid });
}

// Installation/Settup

export function getDimensions(forme: any): any {
  const rect = cv.boundingRect(forme);
  return {
    w: rect.width,
    h: rect.height,
  };
}

function __closest(coordonnees: any[]): any {
  if (coordonnees.length > 0) {
    const min = Math.min(
      ...coordonnees.map(
        item =>
          Math.abs(item.deltaw) * Math.abs(item.deltaw) +
          Math.abs(item.deltah) * Math.abs(item.deltah) +
          Math.abs(item.x) +
          Math.abs(item.y),
      ),
    );
    const p = coordonnees.filter(
      item =>
        Math.abs(item.deltaw) * Math.abs(item.deltaw) +
          Math.abs(item.deltah) * Math.abs(item.deltah) +
          Math.abs(item.x) +
          Math.abs(item.y) ===
        min,
    )[0];
    return { x: p.x, y: p.y };
  } else {
    return { x: 0, y: 0 };
  }
}

export function getPosition(forme: any): any {
  const rect = cv.boundingRect(forme);
  return { x: rect.x, y: rect.y };
}

function interpretationForme(contour: any, preference: IPreference): any {
  const eps = preference.qcm_epsilon * cv.arcLength(contour, true);
  const forme = new cv.Mat();
  cv.approxPolyDP(contour, forme, eps, true);
  let nom = undefined;
  const dims = getDimensions(forme);

  if (dims.w >= preference.qcm_min_width_shape && dims.h >= preference.qcm_min_height_shape) {
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

export function detectFormes(img: any, nomsFormes: string[] = [], preference: IPreference): any[] {
  const thrash = new cv.Mat();
  cv.threshold(img, thrash, 248, 255, cv.THRESH_BINARY);
  //  cv.adaptiveThreshold(img, thrash, 255, cv.ADAPTIVE_THRESH_MEAN_C, cv.THRESH_BINARY_INV, 3, 2);

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
  const tokeep: any[] = [];

  formes.forEach(x => {
    if (getPosition(x).x === 0 && getPosition(x).y === 0) {
      todelete.push(x);
    } else if (((getDimensions(x).w * 100) / getDimensions(img).w + (getDimensions(x).h * 100) / getDimensions(img).h) / 2 > 80) {
      todelete.push(x);
    } else {
      tokeep.push(x);
    }
  });
  tokeep.forEach((x, i) => {
    if (!faitDoublon(i, tokeep)) {
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

function detectFormesQCM(img: any, nomsFormes: string[] = [], preference: IPreference): any[] {
  const thrash = new cv.Mat();
  cv.threshold(img, thrash, 245, 255, cv.THRESH_BINARY);
  //  cv.adaptiveThreshold(img, thrash, 255, cv.ADAPTIVE_THRESH_MEAN_C, cv.THRESH_BINARY_INV, 3, 2);

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
  const tokeep: any[] = [];

  formes.forEach(x => {
    if (getPosition(x).x === 0 && getPosition(x).y === 0) {
      todelete.push(x);
    } else if (((getDimensions(x).w * 100) / getDimensions(img).w + (getDimensions(x).h * 100) / getDimensions(img).h) / 2 > 80) {
      todelete.push(x);
    } else {
      tokeep.push(x);
    }
  });
  tokeep.forEach((x, i) => {
    if (!faitDoublon(i, tokeep)) {
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

// Comparaison personnalisée de positions (lecture haut-bas,gauche-droite)
export function __comparePositionX(f1: any, f2: any): number {
  let p1 = getPosition(f1);
  let p2 = getPosition(f2);
  return p1.x - p2.x;
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
  const formes_cases = detectFormesQCM(img, ['CARRE', 'RECTANGLE'], preference);
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

export function decoupe(img: any, pos: any, dims: any): any {
  let dst = new cv.Mat();

  let x = pos.x;
  let y = pos.y;
  let width = dims.w;
  let height = dims.h;
  if (x < 0) {
    x = 0;
  }
  if (y < 0) {
    y = 0;
  }

  if (x + width > img.size().width) {
    width = img.size().width - x;
  }
  if (height + y > img.size().height) {
    height = img.size().height - y;
  }

  // You can try more different parameters
  const rect = new cv.Rect(x, y, width, height);

  if (width <= 0 || height <= 0) {
    return img;
  } else {
    dst = img.roi(rect);
    return dst;
  }
}

function drawRectangle(img: any, formes: any, couleur: any = new cv.Scalar(255, 0, 0, 128), epaisseur = 2): any {
  // Attention on est ici en bgr et non en rgb
  formes.forEach((forme: any) => {
    const pos = getPosition(forme);
    const dim = getDimensions(forme);
    //    dim.h = dim.h;
    //    dim.w = dim.w - 4;
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
  const imgs_templatediffblank: Map<number, number> = new Map();
  const imgs_templatediffblankAdaptive: Map<number, number> = new Map();
  const gray = new cv.Mat();
  cv.cvtColor(templateimage, gray, cv.COLOR_RGBA2GRAY, 0);
  let thresh = new cv.Mat();
  let threshAdaptive = new cv.Mat();

  cv.adaptiveThreshold(gray, threshAdaptive, 255, cv.ADAPTIVE_THRESH_GAUSSIAN_C, cv.THRESH_BINARY, 11, 2);
  cv.threshold(gray, thresh, 0, 255, cv.THRESH_BINARY + cv.THRESH_OTSU);

  const gray_st = new cv.Mat();
  cv.cvtColor(studentScanImage, gray_st, cv.COLOR_RGBA2GRAY, 0);
  let thresh_st = new cv.Mat();
  let thresh_stAdaptive = new cv.Mat();
  cv.threshold(gray_st, thresh_st, 0, 255, cv.THRESH_BINARY + cv.THRESH_OTSU);
  cv.adaptiveThreshold(gray_st, thresh_stAdaptive, 255, cv.ADAPTIVE_THRESH_GAUSSIAN_C, cv.THRESH_BINARY, 11, 2);

  for (const [k, case1] of casesExamTemplate.cases.entries()) {
    const imgTemplate = decoupe(thresh, getPosition(case1), getDimensions(case1));
    const diff = diffCouleurAvecCaseBlanche(imgTemplate);
    imgs_templatediffblank.set(k, diff);
    const imgTemplateAdaptative = decoupe(threshAdaptive, getPosition(case1), getDimensions(case1));
    const diff1 = diffCouleurAvecCaseBlanche(imgTemplateAdaptative);
    imgs_templatediffblankAdaptive.set(k, diff1);
    imgTemplate.delete();
    imgTemplateAdaptative.delete();
  }

  gray.delete();
  thresh.delete();
  threshAdaptive.delete();
  for (const [k, case1] of casesExamTemplate.cases.entries()) {
    // casesExamTemplate.cases.forEach((case1: any, k: number) => {
    // Pour chaque (x,y) associé à une case du template, on récupère la zone située au même endroit sur la copie
    // et on la compare avec celle du template

    const img_case_eleve = decoupe(thresh_st, getPosition(case1), getDimensions(case1));
    const img_case_eleveAdaptive = decoupe(thresh_stAdaptive, getPosition(case1), getDimensions(case1));

    const diff1 = diffCouleurAvecCaseBlanche(img_case_eleve);
    const diff2 = diffCouleurAvecCaseBlanche(img_case_eleveAdaptive);
    //    img_case_eleve.delete();
    let diff = diff1 - imgs_templatediffblank.get(k)!;
    let diffAdaptive = diff2 - imgs_templatediffblankAdaptive.get(k)!;

    if (diff < 0) {
      diff = 0;
    }
    if (diffAdaptive < 0) {
      diff = 0;
    }
    // console.error('diff',k,diff1-imgs_templatediffblank.get(k)!,diff1, imgs_templatediffblank.get(k));
    infos_cases.set(k, { prediction: diff, predictionAdaptative: diffAdaptive });
    img_case_eleve.delete();
    img_case_eleveAdaptive.delete();
  }

  const diffs = Array.from(infos_cases.values()).map(ee => ee.prediction);
  const diffsAdaptative = Array.from(infos_cases.values()).map(ee => ee.predictionAdaptative);
  const km = kMeans(diffs, 100);
  const kmAdaptative = kMeans(diffsAdaptative, 100);

  //  preference.qcm_differences_avec_case_blanche;

  const score1 = scoreKmean(km, diffs);
  const score2 = scoreKmean(kmAdaptative, diffsAdaptative);
  //  console.error('score kmean', score1, score2);
  const maxScore = score1 > score2 ? score1 : score2;
  for (const [k, case1] of casesExamTemplate.cases.entries()) {
    const r = infos_cases.get(k);
    const diff = score1 > score2 ? r.prediction : r.predictionAdaptative;
    const km1 = score1 > score2 ? km : kmAdaptative;
    if (km1.clusters[k] === 1 && maxScore > preference.qcm_differences_avec_case_blanche) {
      infos_cases.set(k, { verdict: true, prediction: diff });

      cv.putText(
        studentScanImage,
        '' + diff.toFixed(2),
        { x: getPosition(case1).x + 15, y: getPosition(case1).y + 10 },
        cv.FONT_HERSHEY_COMPLEX,
        0.5,
        new cv.Scalar(255, 0, 0, 128),
        1,
      );
      cases_remplies.push(case1);
    } else {
      infos_cases.set(k, { verdict: false, prediction: diff });

      cv.putText(
        studentScanImage,
        '' + diff.toFixed(2),
        { x: getPosition(case1).x + 15, y: getPosition(case1).y + 10 },
        cv.FONT_HERSHEY_COMPLEX,
        0.33,
        new cv.Scalar(255, 0, 0, 128),
        1,
      );
      cases_vides.push(case1);
    }
  }
  gray_st.delete();
  thresh_st.delete();
  thresh_stAdaptive.delete();

  drawRectangle(studentScanImage, cases_remplies, new cv.Scalar(0, 255, 0, 128), 2);
  drawRectangle(studentScanImage, cases_vides, new cv.Scalar(0, 0, 255, 128), 2);
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

    if (currentBox !== undefined) {
      // m.set(casevideeleve, currentBox)
      const poseleve = getPosition(casevideeleve);
      const posref = getPosition(currentBox);
      const dimeleve = getDimensions(casevideeleve);
      const dimref = getDimensions(currentBox);
      const decalage = { x: poseleve.x - posref.x, y: poseleve.y - posref.y, deltaw: dimeleve.w - dimref.w, deltah: dimeleve.h - dimref.h };
      decalages.push(decalage);
    }
  });
  return __closest(decalages);
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
  // let gray = new cv.Mat();
  // cv.cvtColor(img_case, gray, cv.COLOR_RGBA2GRAY, 0);
  // let thresh = new cv.Mat();
  // cv.threshold(gray, thresh, 200, 255, cv.THRESH_BINARY);
  // console.error('computetemplate', cv.countNonZero(img_case), img_case.rows, img_case.cols, img_case.rows * img_case.cols);
  const nonzerorationforeleve = 1.0 - cv.countNonZero(img_case) / (img_case.rows * img_case.cols);
  return nonzerorationforeleve;
}

export function diffGrayAvecCaseBlanche(img_case: any): number {
  let thresh = new cv.Mat();
  //     cv.threshold(img_case, thresh, 230, 255, cv.THRESH_BINARY_INV );
  cv.adaptiveThreshold(img_case, thresh, 255, cv.ADAPTIVE_THRESH_MEAN_C, cv.THRESH_BINARY_INV, 3, 2);

  let contours = new cv.MatVector();
  let hierarchy = new cv.Mat();
  cv.findContours(thresh, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);

  let finalrect = undefined;

  for (let i = 0; i < contours.size(); ++i) {
    let cnt = contours.get(i);
    let rect = cv.boundingRect(cnt);
    if (rect.width > 1 && rect.height > 1) {
      if (!(finalrect !== undefined && (finalrect.width > rect.width || finalrect.height > rect.height))) {
        finalrect = rect;
      }
    }
  }

  if (finalrect !== undefined) {
    let dst = new cv.Mat();
    dst = thresh.roi(finalrect);
    let nonzerorationforeleve = cv.countNonZero(dst) / (finalrect.width * finalrect.height);
    dst.delete();
    thresh.delete();
    return nonzerorationforeleve;
  } else {
    thresh.delete();
    return 0;
  }
}

// Fonction pour calculer la distance entre deux nombres
function distance(value1: number, value2: number): number {
  return Math.abs(value1 - value2);
}

// Fonction pour initialiser aléatoirement les centroids
function initializeCentroids(data: number[]): number[] {
  const centroids = [];
  // Prends la plus grande et la plus petite valeur

  centroids.push(Math.min(...data));
  centroids.push(Math.max(...data));
  return centroids;
}

// Fonction pour attribuer chaque valeur au cluster le plus proche
function assignClusters(data: number[], centroids: number[]): number[] {
  const clusters = new Array(data.length);

  for (let i = 0; i < data.length; i++) {
    let closestCentroidIndex = 0;
    let minDistance = 1;
    for (let j = 0; j < centroids.length; j++) {
      const dist = distance(data[i], centroids[j]);

      if (dist < minDistance) {
        minDistance = dist;
        closestCentroidIndex = j;
      }
    }
    clusters[i] = closestCentroidIndex;
  }

  return clusters;
}

// Fonction pour mettre à jour les centroids en fonction des valeurs assignées
function updateCentroids(data: number[], clusters: number[], k: number): number[] {
  const newCentroids = new Array(k).fill(0);
  const counts = new Array(k).fill(0);

  for (let i = 0; i < data.length; i++) {
    const clusterIndex = clusters[i];
    counts[clusterIndex]++;
    newCentroids[clusterIndex] += data[i];
  }

  for (let i = 0; i < k; i++) {
    if (counts[i] !== 0) {
      newCentroids[i] /= counts[i];
    }
  }

  return newCentroids;
}

// Fonction principale de l'algorithme K-means
function kMeans(data: number[], maxIterations = 100): { clusters: number[]; centroids: number[] } {
  let centroids = initializeCentroids(data);
  let clusters: number[] = [];
  let hasConverged = false;
  let iterations = 0;

  while (!hasConverged && iterations < maxIterations) {
    const newClusters = assignClusters(data, centroids);
    const newCentroids = updateCentroids(data, newClusters, 2);

    hasConverged = JSON.stringify(clusters) === JSON.stringify(newClusters);
    clusters = newClusters;
    centroids = newCentroids;
    iterations++;
  }

  return { clusters, centroids };
}

function scoreKmean(km: { clusters: number[]; centroids: number[] }, infos_cases: number[]): number {
  let centroidmin = km.centroids[0];
  let centroidmax = km.centroids[1];
  let diffCentroidsMin: number[] = [];
  let diffCentroidsMax: number[] = [];
  km.clusters.forEach((c1, index) => {
    if (c1 === 0) {
      diffCentroidsMin.push(Math.abs(centroidmin - infos_cases[index]));
    } else {
      diffCentroidsMax.push(Math.abs(centroidmax - infos_cases[index]));
    }
  });
  let sumdiffcentroidMin = 0;
  for (let i = 0; i < diffCentroidsMin.length; i++) {
    sumdiffcentroidMin += diffCentroidsMin[i];
  }
  if (diffCentroidsMin.length > 0) {
    sumdiffcentroidMin = sumdiffcentroidMin / diffCentroidsMin.length;
  }
  let sumdiffcentroidMax = 0;
  for (let i = 0; i < diffCentroidsMax.length; i++) {
    sumdiffcentroidMax += diffCentroidsMax[i];
  }
  if (diffCentroidsMax.length > 0) {
    sumdiffcentroidMax = sumdiffcentroidMax / diffCentroidsMax.length;
  }

  const score = centroidmax - sumdiffcentroidMax - (centroidmin + sumdiffcentroidMin);
  return score;
}
/*
// Exemple d'utilisation
const data = [
  0.05, 0.04, 0.4,
  0.01, 0.5,0.6
];
const k = 2;
const result = kMeans(data);

console.log('Clusters:', result.clusters);
console.log('Centroids:', result.centroids);
*/
