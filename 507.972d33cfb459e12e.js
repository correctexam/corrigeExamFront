(()=>{"use strict";var l,ye={4681:(l,C,n)=>{var S=n(4942),w=n(5e3),R=n(2076),m=n(4968),$=n(4004),A=n(9300),Z=n(971),H=n(4351),i=n(4469);var Ae=n(9751);!function q(L){const e=new L,t=(0,m.R)(self,"message");return function le(L,e){const t=e.pipe((0,$.U)(r=>r.data),(0,$.U)(r=>new w.P_(r.kind,r.value,r.error)),(0,A.h)(r=>"C"!==r.kind),(0,Z.D)());return function ge(L){return!!L.workUnit}(L)?t.pipe((0,H.b)(r=>(0,R.D)(L.workUnit(r)).pipe((0,i.i)()))):L.work(t).pipe((0,i.i)())}(e,t).subscribe(r=>{const g=postMessage;(function M(L){return!!L.selectTransferables})(e)&&r.hasValue?g(r,e.selectTransferables(r.value)):g(r)})}(class Ce{constructor(){(0,S.Z)(this,"opencvready",new Promise(e=>{const t=self;t.Module={scriptUrl:"content/opencv/4/opencv.js",onRuntimeInitialized(){cv.then(r=>{cv=r,cv.ready.then(()=>{e()}).catch(g=>{console.log(g)})})}},t.importScripts(t.Module.scriptUrl)}))}workUnit(e){return new Ae.y(t=>{this.opencvready.then(()=>{if(e.marker){const r=this.alignImageBasedOnCircle(e.imageA,e.imageB,e.widthA,e.heightA,e.widthB,e.heightB,e.pageNumber,e.preference);r.pageNumber=e.pageNumber,t.next(r),t.complete()}else try{const r=this.alignImage(e.imageA,e.imageB,e.widthA,e.heightA,e.widthB,e.heightB,!1,e.preference.numberofpointToMatch,e.preference.numberofpointToMatch,e.pageNumber);e.imageA=void 0,e.imageB=void 0,r.pageNumber=e.pageNumber,t.next(r),t.complete()}catch(r){console.error(r)}}).catch(r=>{console.log(r)})})}selectTransferables(e){return[e.imageAligned]}imageDataFromMat(e){const t=new cv.Mat,r=e.type()%8,g=r<=cv.CV_8S?1:r<=cv.CV_32S?1/256:255,d=r===cv.CV_8S||r===cv.CV_16S?128:0;switch(e.convertTo(t,cv.CV_8U,g,d),t.type()){case cv.CV_8UC1:cv.cvtColor(t,t,cv.COLOR_GRAY2RGBA);break;case cv.CV_8UC3:cv.cvtColor(t,t,cv.COLOR_RGB2RGBA);break;case cv.CV_8UC4:break;default:throw new Error("Bad number of channels (Source image must have 1, 3 or 4 channels)")}const N=new ImageData(new Uint8ClampedArray(t.data),t.cols,t.rows);return t.delete(),N}roi(e,t){const r=e.size().width,g=e.size().height;return t.x+t.width>r&&(t.width=r-t.x),t.y+t.height>g&&(t.height=g-t.y),t.x<0&&(t.x=0),t.y<0&&(t.y=0),e.roi(t)}alignImage(e,t,r,g,d,N,T,b,X,E){const F=new ImageData(new Uint8ClampedArray(e),r,g),B=new ImageData(new Uint8ClampedArray(t),d,N),c=cv.matFromImageData(F);let j=cv.matFromImageData(B),y=new cv.Mat,x=new cv.Mat;cv.cvtColor(j,y,cv.COLOR_BGRA2GRAY),cv.cvtColor(c,x,cv.COLOR_BGRA2GRAY);const z=Math.trunc(c.size().width/20);let K=[],_=[],G={},Y=!1,h=!1,u=!1,P=!1;const I=Math.min(y.size().width,x.size().width),O=Math.min(y.size().height,x.size().height);if(T){let s=new cv.Rect(0,0,I,O);Y=this.matchSmallImage(y,x,K,_,s,1,b,X,E),h=!0,u=!0,P=!0}else{let s=z;for(;!Y&&s<3*I/4&&s<2*O/3;){let D=new cv.Rect(0,0,s,s);Y=this.matchSmallImage(y,x,K,_,D,1,b,X,E),Y||(s+=Math.trunc(I/10))}for(s=z;!h&&s<3*I/4&&s<2*O/3;){let D=new cv.Rect(I-s,0,I,s);h=this.matchSmallImage(y,x,K,_,D,2,b,X,E),h||(s+=Math.trunc(I/10))}for(s=z;!u&&s<3*I/4&&s<2*O/3;){let D=new cv.Rect(0,O-s,s,O);u=this.matchSmallImage(y,x,K,_,D,3,b,X,E),u||(s+=Math.trunc(I/10))}for(s=z;!P&&s<3*I/4&&s<2*O/3;){let D=new cv.Rect(I-s,O-s,I,O);P=this.matchSmallImage(y,x,K,_,D,4,b,X,E),P||(s+=Math.trunc(I/10))}}if(Y&&h&&u&&P){let s=cv.matFromArray(K.length/2,1,cv.CV_32FC2,K),D=cv.matFromArray(_.length/2,1,cv.CV_32FC2,_),Q=cv.findHomography(s,D,cv.RANSAC),U=new cv.Mat;cv.warpPerspective(j,U,Q,c.size()),G.imageAligned=this.imageDataFromMat(U).data.buffer,G.imageAlignedWidth=U.size().width,G.imageAlignedHeight=U.size().height,s.delete(),D.delete(),Q.delete(),U.delete(),console.log("Good match for page "+E)}else G.imageAligned=t.slice(0),G.imageAlignedWidth=d,G.imageAlignedHeight=N,console.log("no match for page "+E);return j.delete(),c.delete(),y.delete(),x.delete(),G}matchSmallImage(e,t,r,g,d,N,T,b,X){let E=new cv.Mat;E=this.roi(e,d);let F=new cv.Mat;F=this.roi(t,d);let B=new cv.KeyPointVector,c=new cv.KeyPointVector,j=new cv.Mat,y=new cv.Mat,x=new cv.AKAZE,z=new cv.Mat,K=new cv.Mat;x.detectAndCompute(E,z,B,j),x.detectAndCompute(F,K,c,y);let _=new cv.DMatchVector,G=new cv.BFMatcher,Y=new cv.DMatchVectorVector;G.knnMatch(j,y,Y,2);for(let a=0;a<Y.size();++a){let V=Y.get(a),J=V.get(0),v=V.get(1);void 0!==J&&void 0!==v&&J.distance<=v.distance*parseFloat("0.7")&&_.push_back(J)}let h=[],u=[];for(let a=0;a<_.size();a++)h.push(B.get(_.get(a).queryIdx).pt.x+d.x),h.push(B.get(_.get(a).queryIdx).pt.y+d.y),u.push(c.get(_.get(a).trainIdx).pt.x+d.x),u.push(c.get(_.get(a).trainIdx).pt.y+d.y);let P=0,I=[];if(0===_.size())return x.delete(),B.delete(),c.delete(),j.delete(),y.delete(),z.delete(),K.delete(),E.delete(),F.delete(),Y.delete(),_.delete(),G.delete(),!1;const O=[];for(let a=0;a<_.size();a++){let V=(h[2*a]-u[2*a])*(h[2*a]-u[2*a])+(h[2*a+1]-u[2*a+1])*(h[2*a+1]-u[2*a+1]);V<Math.trunc(3*E.size().width/20)*Math.trunc(3*E.size().height/20)&&(I.push(V),P+=1,O.push(a))}const s=this.numAverage(I);let D=this.dev(I);if(D<1&&(D=1),P<=T)return x.delete(),B.delete(),c.delete(),j.delete(),y.delete(),z.delete(),K.delete(),E.delete(),F.delete(),Y.delete(),_.delete(),G.delete(),!1;let Q=0,U=[];for(let a=0;a<O.length;a++){let V=(h[2*O[a]]-u[2*O[a]])*(h[2*O[a]]-u[2*O[a]])+(h[2*O[a]+1]-u[2*O[a]+1])*(h[2*O[a]+1]-u[2*O[a]+1]);V<=s+1*D&&V>=s-1*D&&(Q+=1,U.push(O[a]))}if(console.error("first realgoodmatchtokeep",Q,b),Q<=b)return x.delete(),B.delete(),c.delete(),j.delete(),y.delete(),z.delete(),K.delete(),E.delete(),F.delete(),Y.delete(),_.delete(),G.delete(),!1;{let a=[];const V=[];U.forEach(v=>{V.push((h[2*v]-u[2*v])*(h[2*v]-u[2*v])+(h[2*v+1]-u[2*v+1])*(h[2*v+1]-u[2*v+1]))});const J=this.numAverage(V);return U.sort((v,k)=>Math.abs((h[2*v]-u[2*v])*(h[2*v]-u[2*v])+(h[2*v+1]-u[2*v+1])*(h[2*v+1]-u[2*v+1])-J)-Math.abs((h[2*k]-u[2*k])*(h[2*k]-u[2*k])+(h[2*k+1]-u[2*k+1]*(h[2*k+1]-u[2*k+1]))-J)),a.push(U[0]),a.push(U[1]),a.push(U[2]),a.push(U[3]),a.push(U[4]),console.error("last realgoodmatchtokeep",a.length,b),a.forEach(v=>{r.push(B.get(_.get(+v).queryIdx).pt.x+d.x),r.push(B.get(_.get(+v).queryIdx).pt.y+d.y),g.push(c.get(_.get(+v).trainIdx).pt.x+d.x),g.push(c.get(_.get(+v).trainIdx).pt.y+d.y)}),x.delete(),B.delete(),c.delete(),j.delete(),y.delete(),z.delete(),K.delete(),E.delete(),F.delete(),Y.delete(),_.delete(),G.delete(),!0}}numAverage(e){return e.reduce((t,r)=>t+r,0)/e.length}dev(e){let t=e.reduce((g,d)=>g+d,0)/e.length,r=(e=e.map(g=>(g-t)**2)).reduce((g,d)=>g+d,0);return Math.sqrt(r/e.length)}alignImageBasedOnCircle(e,t,r,g,d,N,T,b){const X=new ImageData(new Uint8ClampedArray(e),r,g),E=new ImageData(new Uint8ClampedArray(t),d,N);let x,z,K,_,G,Y,h,u,P,I,O,s,F=cv.matFromImageData(X),B=new cv.Mat,c=new cv.Mat;cv.cvtColor(F,F,cv.COLOR_RGBA2GRAY),cv.HoughCircles(F,c,cv.HOUGH_GRADIENT,1,45,75,20,F.cols*b.minCircle/1e3,F.cols*b.maxCircle/1e3),c.cols>0&&(x=c.data32F[0],z=c.data32F[1],K=c.data32F[2],_=c.data32F[0],G=c.data32F[1],Y=c.data32F[2],h=c.data32F[0],u=c.data32F[1],P=c.data32F[2],I=c.data32F[0],O=c.data32F[1],s=c.data32F[2]);const D=F.size().width,Q=F.size().height;if(c.cols>0)for(let W=1;W<c.cols;W++){let f=c.data32F[3*W],p=c.data32F[3*W+1],ee=c.data32F[3*W+2];f*f+p*p<=x*x+z*z&&(x=f,z=p,K=ee),f*f+p*p>=I*I+O*O&&(I=f,O=p,s=ee),(D-f)*(D-f)+p*p<=(D-_)*(D-_)+G*G&&(_=f,G=p,Y=ee),f*f+(Q-p)*(Q-p)<=h*h+(Q-u)*(Q-u)&&(h=f,u=p,P=ee)}let U=cv.matFromImageData(E),a=new cv.Mat,V=new cv.Mat;cv.cvtColor(U,a,cv.COLOR_RGBA2GRAY);const J=a.size().width,v=a.size().height;cv.HoughCircles(a,V,cv.HOUGH_GRADIENT,1,45,75,15,P-3,P+3);let k=[],ie=[];const Me=180*(4*P*P-3.14159*P*P)/100;for(let W=0;W<V.cols;W++){let f=V.data32F[3*W],p=V.data32F[3*W+1];const ee=f-P,ae=p-P;let te=2*P,re=2*P;ee+te>J&&(te=J-ee),ae+re>v&&(re=v-ae);let pe=new cv.Rect(f-P,p-P,te,re),ne=new cv.Mat;ne=this.roi(a,pe),cv.threshold(ne,ne,0,255,cv.THRESH_OTSU+cv.THRESH_BINARY),cv.countNonZero(ne)<Me&&(k.push(f),ie.push(p)),ne.delete()}let se,ce,oe,de,he,ue,fe,me;if(k.length>0&&(se=k[0],ce=ie[0],oe=k[0],de=ie[0],he=k[0],ue=ie[0],fe=k[0],me=ie[0]),k.length>1)for(let W=0;W<k.length;W++){let f=k[W],p=ie[W];f*f+p*p<=se*se+ce*ce&&(se=f,ce=p),f*f+p*p>=fe*fe+me*me&&(fe=f,me=p),(J-f)*(J-f)+p*p<=(J-oe)*(J-oe)+de*de&&(oe=f,de=p),f*f+(v-p)*(v-p)<=he*he+(v-ue)*(v-ue)&&(he=f,ue=p)}if(k.length>=4){let W=cv.matFromArray(4,1,cv.CV_32FC2,[x,z,_,G,h,u,I,O]),f=cv.matFromArray(4,1,cv.CV_32FC2,[se,ce,oe,de,he,ue,fe,me]),p=cv.getPerspectiveTransform(f,W),ee=new cv.Size(F.cols,F.rows);for(let re=0;re<W.rows;++re){let xe=15,Oe=new cv.Point(f.data32F[2*re],f.data32F[2*re+1]);cv.circle(U,Oe,xe,[0,0,255,255],1)}cv.warpPerspective(U,B,p,ee,cv.INTER_LINEAR,cv.BORDER_CONSTANT,new cv.Scalar);let ae=B.clone(),te={};return te.imageAligned=this.imageDataFromMat(ae).data.buffer,te.imageAlignedWidth=ae.size().width,te.imageAlignedHeight=ae.size().height,F.delete(),B.delete(),c.delete(),a.delete(),U.delete(),V.delete(),W.delete(),f.delete(),ae.delete(),te}return F.delete(),B.delete(),c.delete(),a.delete(),U.delete(),V.delete(),this.alignImage(e,t,r,g,d,N,!1,b.numberofpointToMatch,b.numberofgoodpointToMatch,T)}})},6921:(l,C,n)=>{n.d(C,{Nn:()=>A,w0:()=>m});var S=n(576),w=n(7896),R=n(8737);class m{constructor(i){this.initialTeardown=i,this.closed=!1,this._parentage=null,this._finalizers=null}unsubscribe(){let i;if(!this.closed){this.closed=!0;const{_parentage:M}=this;if(M)if(this._parentage=null,Array.isArray(M))for(const q of M)q.remove(this);else M.remove(this);const{initialTeardown:ge}=this;if((0,S.m)(ge))try{ge()}catch(q){i=q instanceof w.B?q.errors:[q]}const{_finalizers:le}=this;if(le){this._finalizers=null;for(const q of le)try{Z(q)}catch(ve){i=i??[],ve instanceof w.B?i=[...i,...ve.errors]:i.push(ve)}}if(i)throw new w.B(i)}}add(i){var M;if(i&&i!==this)if(this.closed)Z(i);else{if(i instanceof m){if(i.closed||i._hasParent(this))return;i._addParent(this)}(this._finalizers=null!==(M=this._finalizers)&&void 0!==M?M:[]).push(i)}}_hasParent(i){const{_parentage:M}=this;return M===i||Array.isArray(M)&&M.includes(i)}_addParent(i){const{_parentage:M}=this;this._parentage=Array.isArray(M)?(M.push(i),M):M?[M,i]:i}_removeParent(i){const{_parentage:M}=this;M===i?this._parentage=null:Array.isArray(M)&&(0,R.P)(M,i)}remove(i){const{_finalizers:M}=this;M&&(0,R.P)(M,i),i instanceof m&&i._removeParent(this)}}function A(H){return H instanceof m||H&&"closed"in H&&(0,S.m)(H.remove)&&(0,S.m)(H.add)&&(0,S.m)(H.unsubscribe)}function Z(H){(0,S.m)(H)?H():H.unsubscribe()}m.EMPTY=(()=>{const H=new m;return H.closed=!0,H})()},3269:(l,C,n)=>{n.d(C,{yG:()=>m});var S=n(3532);function m(A){return(0,S.K)(function w(A){return A[A.length-1]}(A))?A.pop():void 0}},4482:(l,C,n)=>{n.d(C,{e:()=>R});var S=n(576);function R(m){return $=>{if(function w(m){return(0,S.m)(m?.lift)}($))return $.lift(function(A){try{return m(A,this)}catch(Z){this.error(Z)}});throw new TypeError("Unable to lift unknown Observable type")}}},9635:(l,C,n)=>{n.d(C,{U:()=>R});var S=n(4671);function R(m){return 0===m.length?S.y:1===m.length?m[0]:function(A){return m.reduce((Z,H)=>H(Z),A)}}}},_e={};function o(l){var C=_e[l];if(void 0!==C)return C.exports;var n=_e[l]={exports:{}};return ye[l](n,n.exports,o),n.exports}o.m=ye,o.x=()=>{var l=o.O(void 0,[696],()=>o(4681));return o.O(l)},l=[],o.O=(C,n,S,w)=>{if(!n){var m=1/0;for(R=0;R<l.length;R++){for(var[n,S,w]=l[R],$=!0,A=0;A<n.length;A++)(!1&w||m>=w)&&Object.keys(o.O).every(le=>o.O[le](n[A]))?n.splice(A--,1):($=!1,w<m&&(m=w));if($){l.splice(R--,1);var Z=S();void 0!==Z&&(C=Z)}}return C}w=w||0;for(var R=l.length;R>0&&l[R-1][2]>w;R--)l[R]=l[R-1];l[R]=[n,S,w]},o.d=(l,C)=>{for(var n in C)o.o(C,n)&&!o.o(l,n)&&Object.defineProperty(l,n,{enumerable:!0,get:C[n]})},o.f={},o.e=l=>Promise.all(Object.keys(o.f).reduce((C,n)=>(o.f[n](l,C),C),[])),o.u=l=>l+".9359b519a07dd466.js",o.miniCssF=l=>{},o.o=(l,C)=>Object.prototype.hasOwnProperty.call(l,C),(()=>{var l;o.tt=()=>(void 0===l&&(l={createScriptURL:C=>C},typeof trustedTypes<"u"&&trustedTypes.createPolicy&&(l=trustedTypes.createPolicy("angular#bundler",l))),l)})(),o.tu=l=>o.tt().createScriptURL(l),o.p="",(()=>{var l={507:1};o.f.i=(w,R)=>{l[w]||importScripts(o.tu(o.p+o.u(w)))};var n=self.webpackChunkgrade_scope_istic=self.webpackChunkgrade_scope_istic||[],S=n.push.bind(n);n.push=w=>{var[R,m,$]=w;for(var A in m)o.o(m,A)&&(o.m[A]=m[A]);for($&&$(o);R.length;)l[R.pop()]=1;S(w)}})(),(()=>{var l=o.x;o.x=()=>o.e(696).then(l)})(),o.x()})();