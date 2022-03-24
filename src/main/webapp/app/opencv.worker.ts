/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable no-console */
/* eslint-disable prefer-const */
/* eslint-disable spaced-comment */
/* eslint-disable @typescript-eslint/restrict-template-expressions */

/// <reference lib="webworker" />
declare let cv: any;

/**
 * This exists to capture all the events that are thrown out of the worker
 * into the worker. Without this, there would be no communication possible
 * with our project.
 */

addEventListener('message', e => {
  switch (e.data.msg) {
    case 'hello': {
      const response = `worker response to ${e.data.msg}`;
      postMessage({ msg: response, uid: e.data.uid });
      break;
    }
    case 'load': {
      // Import Webassembly script
      //self.importScripts('./content/opencv/4/opencv.js')
      const self1 = self as any;
      self1['Module'] = {
        scriptUrl: 'content/opencv/4/opencv.js',
        onRuntimeInitialized() {
          cv.then((cv1: any) => {
            cv = cv1;
            cv1.ready.then(() => postMessage({ msg: 'opencvready', uid: e.data.uid }));
          });
        },
      };

      //Load and await the .js OpenCV
      self.importScripts(self1['Module'].scriptUrl);

      break;
    }
    case 'imageProcessing':
      return imageProcessing(e.data);
    case 'imageAlignement':
      return imageAlignement(e.data);
    case 'imageCrop':
      return imageCrop(e.data);
    default:
      break;
  }
});

/**
 * With OpenCV we have to work the images as cv.Mat (matrices),
 * so the first thing we have to do is to transform the
 * ImageData to a type that openCV can recognize.
 */
function imageProcessing(p: { msg: any; payload: any; uid: string }): void {
  const img = cv.matFromImageData(p.payload);
  let result = new cv.Mat();

  // What this does is convert the image to a grey scale.
  cv.cvtColor(img, result, cv.COLOR_BGR2GRAY);
  postMessage({ msg: p.msg, payload: imageDataFromMat(result), uid: p.uid });
  img.delete();
  result.delete();
}

/**
 * With OpenCV we have to work the images as cv.Mat (matrices),
 * so the first thing we have to do is to transform the
 * ImageData to a type that openCV can recognize.
 */
function imageAlignement(p: { msg: any; payload: any; uid: string }): void {
  // What this does is convert the image to a grey scale.
  const resultat = alignImage(p.payload.imageA, p.payload.imageB);
  postMessage({ msg: p.msg, payload: resultat, uid: p.uid });
}

function imageCrop(p: { msg: any; payload: any; uid: string }): void {
  // You can try more different parameters
  let rect = new cv.Rect(p.payload.x, p.payload.y, p.payload.width, p.payload.height);
  let dst = new cv.Mat();
  let src = cv.matFromImageData(p.payload.image);

  dst = src.roi(rect);
  postMessage({ msg: p.msg, payload: imageDataFromMat(dst), uid: p.uid });
  dst.delete();
  src.delete();
}
/**
 * This function is to convert again from cv.Mat to ImageData
 */
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

function alignImage(image_A: any, image_B: any): any {
  //im2 is the original reference image we are trying to align to
  let im2 = cv.matFromImageData(image_A);
  let im1 = cv.matFromImageData(image_B);
  let im1Gray = new cv.Mat();
  let im2Gray = new cv.Mat();
  cv.cvtColor(im1, im1Gray, cv.COLOR_BGRA2GRAY);
  cv.cvtColor(im2, im2Gray, cv.COLOR_BGRA2GRAY);

  //22    Variables to store keypoints and descriptors
  //23    std::vector<KeyPoint> keypoints1, keypoints2;
  //24    Mat descriptors1, descriptors2;
  let keypoints1 = new cv.KeyPointVector();
  let keypoints2 = new cv.KeyPointVector();
  let descriptors1 = new cv.Mat();
  let descriptors2 = new cv.Mat();

  //26    Detect ORB features and compute descriptors.
  //27    Ptr<Feature2D> orb = ORB::create(MAX_FEATURES);
  //28    orb->detectAndCompute(im1Gray, Mat(), keypoints1, descriptors1);
  //29    orb->detectAndCompute(im2Gray, Mat(), keypoints2, descriptors2);

  let orb = new cv.AKAZE();
  let tmp1 = new cv.Mat();
  let tmp2 = new cv.Mat();
  orb.detectAndCompute(im1Gray, tmp1, keypoints1, descriptors1);
  orb.detectAndCompute(im2Gray, tmp2, keypoints2, descriptors2);

  /*console.log('Total of ', keypoints1.size(), ' keypoints1 (img to align) and ', keypoints2.size(), ' keypoints2 (reference)');
  console.log('here are the first 5 keypoints for keypoints1:');
  for (let i = 0; i < keypoints1.size(); i++) {
    console.log('keypoints1: [', i, ']', keypoints1.get(i).pt.x, keypoints1.get(i).pt.y);
    if (i === 5) {
      break;
    }
  }*/

  //31    Match features.
  //32    std::vector<DMatch> matches;
  //33    Ptr<DescriptorMatcher> matcher = DescriptorMatcher::create("BruteForce-Hamming");
  //34    matcher->match(descriptors1, descriptors2, matches, Mat());

  let good_matches = new cv.DMatchVector();

  //36    Sort matches by score
  //37    std::sort(matches.begin(), matches.end());

  //39    Remove not so good matches
  //40    const int numGoodMatches = matches.size() * GOOD_MATCH_PERCENT;
  //41    matches.erase(matches.begin()+numGoodMatches, matches.end());

  let bf = new cv.BFMatcher();
  let matches = new cv.DMatchVectorVector();

  bf.knnMatch(descriptors1, descriptors2, matches, 2);

  //  let counter = 0;
  for (let i = 0; i < matches.size(); ++i) {
    let match = matches.get(i);
    let dMatch1 = match.get(0);
    let dMatch2 = match.get(1);
    // console.log("[", i, "] ", "dMatch1: ", dMatch1, "dMatch2: ", dMatch2);
    let knnDistance_option = '0.7';
    if (dMatch1.distance <= dMatch2.distance * parseFloat(knnDistance_option)) {
      //console.log("***Good Match***", "dMatch1.distance: ", dMatch1.distance, "was less than or = to: ", "dMatch2.distance * parseFloat(knnDistance_option)", dMatch2.distance * parseFloat(knnDistance_option), "dMatch2.distance: ", dMatch2.distance, "knnDistance", knnDistance_option);
      good_matches.push_back(dMatch1);
      //     counter++;
    }
  }

  /*  console.log('keeping ', counter, ' points in good_matches vector out of ', matches.size(), ' contained in this match vector:', matches);
  console.log('here are first 5 matches');
  for (let t = 0; t < matches.size(); ++t) {
    console.log('[' + t + ']', 'matches: ', matches.get(t));
    if (t === 5) {
      break;
    }
  }

  console.log('here are first 5 good_matches');
  for (let r = 0; r < good_matches.size(); ++r) {
    console.log('[' + r + ']', 'good_matches: ', good_matches.get(r));
    if (r === 5) {
      break;
    }
  }
*/
  //44    Draw top matches
  //45    Mat imMatches;
  //46    drawMatches(im1, keypoints1, im2, keypoints2, matches, imMatches);
  //47    imwrite("matches.jpg", imMatches);
  let imMatches = new cv.Mat();
  let color = new cv.Scalar(0, 255, 0, 255);
  cv.drawMatches(im1, keypoints1, im2, keypoints2, good_matches, imMatches, color);
  // TODO pass the canvas

  let result = {} as any;

  result['imageCompareMatches'] = imageDataFromMat(imMatches);
  result['imageCompareMatchesWidth'] = imMatches.size().width;
  result['imageCompareMatchesHeight'] = imMatches.size().height;

  let keypoints1_img = new cv.Mat();
  let keypoints2_img = new cv.Mat();
  let keypointcolor = new cv.Scalar(0, 255, 0, 255);
  cv.drawKeypoints(im1Gray, keypoints1, keypoints1_img, keypointcolor);
  cv.drawKeypoints(im2Gray, keypoints2, keypoints2_img, keypointcolor);

  result['keypoints1'] = imageDataFromMat(keypoints1_img);
  result['keypoints1Width'] = keypoints1_img.size().width;
  result['keypoints1Height'] = keypoints1_img.size().height;
  result['keypoints2'] = imageDataFromMat(keypoints2_img);
  result['keypoints2Width'] = keypoints2_img.size().width;
  result['keypoints2Height'] = keypoints2_img.size().height;

  //50    Extract location of good matches
  //51    std::vector<Point2f> points1, points2;
  //53    for( size_t i = 0; i < matches.size(); i++ )
  //54    {
  //55        points1.push_back( keypoints1[ matches[i].queryIdx ].pt );
  //56        points2.push_back( keypoints2[ matches[i].trainIdx ].pt );
  //57    }
  let points1 = [];
  let points2 = [];
  for (let i = 0; i < good_matches.size(); i++) {
    points1.push(keypoints1.get(good_matches.get(i).queryIdx).pt.x);
    points1.push(keypoints1.get(good_matches.get(i).queryIdx).pt.y);
    points2.push(keypoints2.get(good_matches.get(i).trainIdx).pt.x);
    points2.push(keypoints2.get(good_matches.get(i).trainIdx).pt.y);
  }

  //  console.log('points1:', points1, 'points2:', points2);

  let mat1 = new cv.Mat(points1.length, 1, cv.CV_32FC2);
  mat1.data32F.set(points1);
  let mat2 = new cv.Mat(points2.length, 1, cv.CV_32FC2);
  mat2.data32F.set(points2);

  //59    Find homography
  //60    h = findHomography( points1, points2, RANSAC );
  let h = cv.findHomography(mat1, mat2, cv.RANSAC);

  if (h.empty()) {
    console.log('homography matrix empty!');
    return;
  } else {
    console.log('h:', h);
    //    console.log('[', h.data64F[0], ',', h.data64F[1], ',', h.data64F[2]);
    //    console.log('', h.data64F[3], ',', h.data64F[4], ',', h.data64F[5]);
    //    console.log('', h.data64F[6], ',', h.data64F[7], ',', h.data64F[8], ']');
  }

  //62  Use homography to warp image
  //63  warpPerspective(im1, im1Reg, h, im2.size());

  let image_B_final_result = new cv.Mat();
  cv.warpPerspective(im1, image_B_final_result, h, im2.size());

  result['imageAligned'] = imageDataFromMat(image_B_final_result);
  result['imageAlignedWidth'] = image_B_final_result.size().width;
  result['imageAlignedHeight'] = image_B_final_result.size().height;

  image_B_final_result.delete();
  mat1.delete();
  mat2.delete();
  keypoints1_img.delete();
  keypoints2_img.delete();
  imMatches.delete();
  matches.delete();
  bf.delete();
  good_matches.delete();
  orb.delete();
  im1Gray.delete();
  keypoints1.delete();
  im2Gray.delete();
  keypoints2.delete();
  descriptors1.delete();
  descriptors2.delete();
  tmp1.delete();
  tmp2.delete();
  //h.delete();
  return result;
}

/*function detectLetters( img : any): any{
  let src = cv.matFromImageData(img);
  let dst = new cv.Mat() //.zeros(src.rows, src.cols, cv.CV_8UC3);
  let grey = new cv.Mat() //.zeros(src.rows, src.cols, cv.CV_8UC3);
  cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
  cv.cvtColor(src, grey, cv.COLOR_RGBA2GRAY);
  cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY);
  let ksize = new cv.Size(5,5)
//  cv.GaussianBlur(src, src, ksize, 0, 0, cv.BORDER_DEFAULT);
let fillColor = new cv.Scalar(255, 255, 255);

cv.adaptiveThreshold(grey, grey, 255, cv.THRESH_BINARY_INV, cv.THRESH_OTSU, 11, 2);
// thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)[1]

// # Remove horizontal lines
let ksize1 = new cv.Size(40, 1);
// You can try more different parameters
let horizontal_kernel = cv.getStructuringElement(cv.MORPH_RECT, ksize1);
cv.morphologyEx(grey, grey, cv.MORPH_OPEN, horizontal_kernel,2);
let contours1 = new cv.MatVector();
let hierarchy1 = new cv.Mat();
cv.findContours(src, contours1, hierarchy1, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
let contour1
if (contours1.size() ===2){
  contour1 = contours1.get(0)
}else {
  contour1 = contours1.get(1)
}

for (let i = 0; i < contour1.size(); ++i) {
  let cnt = contour1.get(i);
  cv.drawContours(grey, cnt,-1,fillColor,5)
}




// Remove vertical lines
let ksize2 = new cv.Size(1, 40);
// You can try more different parameters
let vertical_kernel = cv.getStructuringElement(cv.MORPH_RECT, ksize2);
cv.morphologyEx(grey, grey, cv.MORPH_OPEN, vertical_kernel,2);
let contours2 = new cv.MatVector();
let hierarchy2 = new cv.Mat();
cv.findContours(src, contours2, hierarchy2, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
let contour2
if (contours1.size() ===2){
  contour2 = contours2.get(0)
}else {
  contour2 = contours2.get(1)
}

for (let i = 0; i < contour2.size(); ++i) {
  let cnt = contour2.get(i);
  cv.drawContours(grey, cnt,-1,fillColor,5)
}



  cv.adaptiveThreshold(grey, grey, 255, cv.ADAPTIVE_THRESH_MEAN_C, cv.THRESH_BINARY, 11, 2);
  let contours = new cv.MatVector();
  let hierarchy = new cv.Mat();
  cv.findContours(src, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);
  let rectangleColor = new cv.Scalar(0, 0, 0);


  for (let i = 0; i < contours.size(); ++i) {
  let cnt = contours.get(i);
  let rect = cv.boundingRect(cnt);
  if (rect.width*rect.height >= 200){

  let point1 = new cv.Point(rect.x, rect.y);
  let point2 = new cv.Point(rect.x + rect.width, rect.y + rect.height);
  cv.rectangle(dst, point1, point2, rectangleColor, 2, cv.LINE_AA, 0);
  }
  cnt.delete();
  }


  const res = imageDataFromMat(dst);
  src.delete(); dst.delete(); contours.delete(); hierarchy.delete();
  return res;

}*/

/*let src = cv.imread('canvasInput');
  let dst = new cv.Mat() //.zeros(src.rows, src.cols, cv.CV_8UC3);
  let grey = new cv.Mat() //.zeros(src.rows, src.cols, cv.CV_8UC3);
  cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
  cv.cvtColor(src, grey, cv.COLOR_RGBA2GRAY);
  cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY);
  let ksize = new cv.Size(5,5)
//  cv.GaussianBlur(src, src, ksize, 0, 0, cv.BORDER_DEFAULT);
let fillColor = new cv.Scalar(255, 255, 255);

cv.threshold(grey, grey, 0, 255, cv.THRESH_OTSU + cv.THRESH_BINARY_INV);

// thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)[1]

// # Remove horizontal lines
let ksize1 = new cv.Size(15, 1);
// You can try more different parameters
let horizontal_kernel = cv.getStructuringElement(cv.MORPH_RECT, ksize1);
let removeh = new cv.Mat();
cv.morphologyEx(grey, removeh, cv.MORPH_OPEN, horizontal_kernel);
let contours1 = new cv.MatVector();
let hierarchy1 = new cv.Mat();
cv.findContours(removeh, contours1, hierarchy1, cv.RETR_LIST, cv.CHAIN_APPROX_SIMPLE);
cv.drawContours(dst, contours1,-1,fillColor, 1, 20, hierarchy1, 20)

// # Remove vertical lines
let ksize2 = new cv.Size(1, 20);
// You can try more different parameters
let vertical_kernel = cv.getStructuringElement(cv.MORPH_RECT, ksize2);
let removev = new cv.Mat();
cv.morphologyEx(grey, removev, cv.MORPH_OPEN, vertical_kernel);
let contours2 = new cv.MatVector();
let hierarchy2 = new cv.Mat();
cv.findContours(removev, contours2, hierarchy2, cv.RETR_LIST, cv.CHAIN_APPROX_SIMPLE);
cv.drawContours(dst, contours2,-1,fillColor, 1, 20, hierarchy2, 20)



  /*cv.adaptiveThreshold(grey, grey, 255, cv.ADAPTIVE_THRESH_MEAN_C, cv.THRESH_BINARY_INV, 11, 2);
  let contours = new cv.MatVector();
  let hierarchy = new cv.Mat();
  cv.findContours(src, contours, hierarchy, cv.RETR_LIST, cv.CHAIN_APPROX_SIMPLE);
  let rectangleColor = new cv.Scalar(0, 0, 0);


  for (let i = 0; i < contours.size(); ++i) {
  let cnt = contours.get(i);
  let rect = cv.boundingRect(cnt);
  if (rect.width*rect.height >= 200){

  let point1 = new cv.Point(rect.x, rect.y);
  let point2 = new cv.Point(rect.x + rect.width, rect.y + rect.height);
  cv.rectangle(dst, point1, point2, rectangleColor, 2, cv.LINE_AA, 0);
  }
  cnt.delete();
  }

cv.imshow('canvasOutput', dst);
//src.delete(); dst.delete(); contours.delete(); hierarchy.delete();
*/
