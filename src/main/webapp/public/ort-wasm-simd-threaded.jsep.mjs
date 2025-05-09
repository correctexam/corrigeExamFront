var ortWasmThreaded = (() => {
  var _scriptName = import.meta.url;

  return async function (moduleArg = {}) {
    var moduleRtn;

    function e() {
      l.buffer != q.buffer && t();
      return q;
    }
    function w() {
      l.buffer != q.buffer && t();
      return ba;
    }
    function ca() {
      l.buffer != q.buffer && t();
      return da;
    }
    function ea() {
      l.buffer != q.buffer && t();
      return fa;
    }
    function z() {
      l.buffer != q.buffer && t();
      return ha;
    }
    function A() {
      l.buffer != q.buffer && t();
      return ia;
    }
    function ja() {
      l.buffer != q.buffer && t();
      return ka;
    }
    function la() {
      l.buffer != q.buffer && t();
      return ma;
    }
    var B = Object.assign({}, moduleArg),
      na,
      oa,
      pa = new Promise((a, b) => {
        na = a;
        oa = b;
      }),
      qa = 'object' == typeof window,
      C = 'function' == typeof importScripts,
      D = 'object' == typeof process && 'object' == typeof process.versions && 'string' == typeof process.versions.node,
      E = C && 'em-pthread' == self.name;
    if (D) {
      const { createRequire: a } = await import('module');
      var require = a(import.meta.url),
        ra = require('worker_threads');
      global.Worker = ra.Worker;
      E = (C = !ra.pc) && 'em-pthread' == ra.workerData;
    }
    ('use strict');
    B.mountExternalData = (a, b) => {
      a.startsWith('./') && (a = a.substring(2));
      (B.Fb || (B.Fb = new Map())).set(a, b);
    };
    B.unmountExternalData = () => {
      delete B.Fb;
    };
    var SharedArrayBuffer =
      globalThis.SharedArrayBuffer ?? new WebAssembly.Memory({ initial: 0, maximum: 0, shared: !0 }).buffer.constructor;
    ('use strict');
    let ta = () => {
      const a =
          (c, d, f) =>
          (...g) => {
            const k = F,
              m = d?.();
            g = c(...g);
            const p = d?.();
            m !== p && ((c = p), f(m), (d = f = null));
            return F != k ? sa() : g;
          },
        b =
          c =>
          async (...d) => {
            try {
              if (B.Eb) throw Error('Session already started');
              const f = (B.Eb = { fc: d[0], errors: [] }),
                g = await c(...d);
              if (B.Eb !== f) throw Error('Session mismatch');
              B.Gb?.flush();
              const k = f.errors;
              if (0 < k.length) {
                let m = await Promise.all(k);
                m = m.filter(p => p);
                if (0 < m.length) throw Error(m.join('\n'));
              }
              return g;
            } finally {
              B.Eb = null;
            }
          };
      B._OrtCreateSession = a(
        B._OrtCreateSession,
        () => B._OrtCreateSession,
        c => (B._OrtCreateSession = c),
      );
      B._OrtRun = b(
        a(
          B._OrtRun,
          () => B._OrtRun,
          c => (B._OrtRun = c),
        ),
      );
      B._OrtRunWithBinding = b(
        a(
          B._OrtRunWithBinding,
          () => B._OrtRunWithBinding,
          c => (B._OrtRunWithBinding = c),
        ),
      );
      B._OrtBindInput = a(
        B._OrtBindInput,
        () => B._OrtBindInput,
        c => (B._OrtBindInput = c),
      );
      ta = void 0;
    };
    B.jsepInit = (a, b) => {
      ta?.();
      if ('webgpu' === a) {
        [B.Gb, B.Ub, B.Yb, B.Nb, B.Xb, B.jb, B.Zb, B.bc, B.Vb, B.Wb, B.$b] = b;
        const c = B.Gb;
        B.jsepRegisterBuffer = (d, f, g, k) => c.registerBuffer(d, f, g, k);
        B.jsepGetBuffer = d => c.getBuffer(d);
        B.jsepCreateDownloader = (d, f, g) => c.createDownloader(d, f, g);
        B.jsepOnReleaseSession = d => {
          c.onReleaseSession(d);
        };
        B.jsepOnRunStart = d => c.onRunStart(d);
        B.cc = (d, f) => {
          c.upload(d, f);
        };
      } else if ('webnn' === a) {
        [B.Gb, B.ac, B.Ob, B.jsepEnsureTensor, B.dc, B.jsepDownloadTensor] = b;
        B.jsepReleaseTensorId = B.Ob;
        const c = B.Gb;
        B.jsepOnRunStart = d => c.onRunStart(d);
        B.jsepRegisterMLContext = (d, f) => {
          c.registerMLContext(d, f);
        };
        B.jsepOnReleaseSession = d => {
          c.onReleaseSession(d);
        };
        B.jsepCreateMLTensorDownloader = (d, f) => c.createMLTensorDownloader(d, f);
        B.jsepRegisterMLTensor = (d, f, g) => c.registerMLTensor(d, f, g);
      }
    };
    var ua = Object.assign({}, B),
      va = './this.program',
      wa = (a, b) => {
        throw b;
      },
      G = '',
      xa,
      ya,
      za;
    if (D) {
      var fs = require('fs'),
        Aa = require('path');
      G = require('url').fileURLToPath(new URL('./', import.meta.url));
      xa = (a, b) => {
        a = Ba(a) ? new URL(a) : Aa.normalize(a);
        return fs.readFileSync(a, b ? void 0 : 'utf8');
      };
      za = a => {
        a = xa(a, !0);
        a.buffer || (a = new Uint8Array(a));
        return a;
      };
      ya = (a, b, c, d = !0) => {
        a = Ba(a) ? new URL(a) : Aa.normalize(a);
        fs.readFile(a, d ? void 0 : 'utf8', (f, g) => {
          f ? c(f) : b(d ? g.buffer : g);
        });
      };
      !B.thisProgram && 1 < process.argv.length && (va = process.argv[1].replace(/\\/g, '/'));
      process.argv.slice(2);
      wa = (a, b) => {
        process.exitCode = a;
        throw b;
      };
    } else if (qa || C)
      C ? (G = self.location.href) : 'undefined' != typeof document && document.currentScript && (G = document.currentScript.src),
        _scriptName && (G = _scriptName),
        G.startsWith('blob:') ? (G = '') : (G = G.substr(0, G.replace(/[?#].*/, '').lastIndexOf('/') + 1)),
        D ||
          ((xa = a => {
            var b = new XMLHttpRequest();
            b.open('GET', a, !1);
            b.send(null);
            return b.responseText;
          }),
          C &&
            (za = a => {
              var b = new XMLHttpRequest();
              b.open('GET', a, !1);
              b.responseType = 'arraybuffer';
              b.send(null);
              return new Uint8Array(b.response);
            }),
          (ya = (a, b, c) => {
            var d = new XMLHttpRequest();
            d.open('GET', a, !0);
            d.responseType = 'arraybuffer';
            d.onload = () => {
              200 == d.status || (0 == d.status && d.response) ? b(d.response) : c();
            };
            d.onerror = c;
            d.send(null);
          }));
    D && 'undefined' == typeof performance && (global.performance = require('perf_hooks').performance);
    var Ca = console.log.bind(console),
      Da = console.error.bind(console);
    D && ((Ca = (...a) => fs.writeSync(1, a.join(' ') + '\n')), (Da = (...a) => fs.writeSync(2, a.join(' ') + '\n')));
    var Ea = Ca,
      H = Da;
    Object.assign(B, ua);
    ua = null;
    if (E) {
      var Fa;
      if (D) {
        var Ga = ra.parentPort;
        Ga.on('message', b => onmessage({ data: b }));
        Object.assign(globalThis, {
          self: global,
          importScripts: () => {},
          postMessage: b => Ga.postMessage(b),
          performance: global.performance || { now: Date.now },
        });
      }
      var Ha = !1;
      H = function (...b) {
        b = b.join(' ');
        D ? fs.writeSync(2, b + '\n') : console.error(b);
      };
      self.alert = function (...b) {
        postMessage({ Mb: 'alert', text: b.join(' '), qc: Ia() });
      };
      B.instantiateWasm = (b, c) =>
        new Promise(d => {
          Fa = f => {
            f = new WebAssembly.Instance(f, Ja());
            c(f);
            d();
          };
        });
      self.onunhandledrejection = b => {
        throw b.reason || b;
      };
      function a(b) {
        try {
          var c = b.data,
            d = c.cmd;
          if ('load' === d) {
            let f = [];
            self.onmessage = g => f.push(g);
            self.startWorker = () => {
              postMessage({ cmd: 'loaded' });
              for (let g of f) a(g);
              self.onmessage = a;
            };
            for (const g of c.handlers)
              if (!B[g] || B[g].proxy)
                (B[g] = (...k) => {
                  postMessage({ Mb: 'callHandler', oc: g, args: k });
                }),
                  'print' == g && (Ea = B[g]),
                  'printErr' == g && (H = B[g]);
            l = c.wasmMemory;
            t();
            Fa(c.wasmModule);
          } else if ('run' === d) {
            Ka(c.pthread_ptr, 0, 0, 1, 0, 0);
            La(c.pthread_ptr);
            Ma();
            Na();
            Ha || (Oa(), (Ha = !0));
            try {
              Pa(c.start_routine, c.arg);
            } catch (f) {
              if ('unwind' != f) throw f;
            }
          } else
            'cancel' === d
              ? Ia() && Qa(-1)
              : 'setimmediate' !== c.target &&
                ('checkMailbox' === d ? Ha && Ra() : d && (H(`worker: received unknown command ${d}`), H(c)));
        } catch (f) {
          throw (Sa(), f);
        }
      }
      self.onmessage = a;
    }
    var Ta;
    B.wasmBinary && (Ta = B.wasmBinary);
    var l,
      Ua,
      I = !1,
      Va,
      q,
      ba,
      da,
      fa,
      ha,
      ia,
      ka,
      J,
      Wa,
      ma;
    function t() {
      var a = l.buffer;
      B.HEAP8 = q = new Int8Array(a);
      B.HEAP16 = da = new Int16Array(a);
      B.HEAPU8 = ba = new Uint8Array(a);
      B.HEAPU16 = fa = new Uint16Array(a);
      B.HEAP32 = ha = new Int32Array(a);
      B.HEAPU32 = ia = new Uint32Array(a);
      B.HEAPF32 = ka = new Float32Array(a);
      B.HEAPF64 = ma = new Float64Array(a);
      B.HEAP64 = J = new BigInt64Array(a);
      B.HEAPU64 = Wa = new BigUint64Array(a);
    }
    if (!E) {
      l = new WebAssembly.Memory({ initial: 256, maximum: 65536, shared: !0 });
      if (!(l.buffer instanceof SharedArrayBuffer))
        throw (
          (H(
            'requested a shared WebAssembly.Memory but the returned buffer is not a SharedArrayBuffer, indicating that while the browser has SharedArrayBuffer it does not have WebAssembly threads support - you may need to set a flag',
          ),
          D && H('(on node you may need: --experimental-wasm-threads --experimental-wasm-bulk-memory and/or recent version)'),
          Error('bad memory'))
        );
      t();
    }
    var Xa = [],
      Ya = [],
      Za = [],
      $a = 0,
      ab = null,
      bb = null;
    function cb() {
      $a--;
      if (0 == $a && (null !== ab && (clearInterval(ab), (ab = null)), bb)) {
        var a = bb;
        bb = null;
        a();
      }
    }
    function db(a) {
      a = 'Aborted(' + a + ')';
      H(a);
      I = !0;
      Va = 1;
      a = new WebAssembly.RuntimeError(a + '. Build with -sASSERTIONS for more info.');
      oa(a);
      throw a;
    }
    var eb = a => a.startsWith('data:application/octet-stream;base64,'),
      Ba = a => a.startsWith('file://'),
      fb;
    function gb(a) {
      if (a == fb && Ta) return new Uint8Array(Ta);
      if (za) return za(a);
      throw 'both async and sync fetching of the wasm failed';
    }
    function hb(a) {
      if (!Ta && (qa || C)) {
        if ('function' == typeof fetch && !Ba(a))
          return fetch(a, { credentials: 'same-origin' })
            .then(b => {
              if (!b.ok) throw `failed to load wasm binary file at '${a}'`;
              return b.arrayBuffer();
            })
            .catch(() => gb(a));
        if (ya)
          return new Promise((b, c) => {
            ya(a, d => b(new Uint8Array(d)), c);
          });
      }
      return Promise.resolve().then(() => gb(a));
    }
    function ib(a, b, c) {
      return hb(a)
        .then(d => WebAssembly.instantiate(d, b))
        .then(c, d => {
          H(`failed to asynchronously prepare wasm: ${d}`);
          db(d);
        });
    }
    function jb(a, b) {
      var c = fb;
      return Ta || 'function' != typeof WebAssembly.instantiateStreaming || eb(c) || Ba(c) || D || 'function' != typeof fetch
        ? ib(c, a, b)
        : fetch(c, { credentials: 'same-origin' }).then(d =>
            WebAssembly.instantiateStreaming(d, a).then(b, function (f) {
              H(`wasm streaming compile failed: ${f}`);
              H('falling back to ArrayBuffer instantiation');
              return ib(c, a, b);
            }),
          );
    }
    function Ja() {
      kb = {
        O: lb,
        Aa: mb,
        b: nb,
        aa: ob,
        B: pb,
        qa: qb,
        Y: rb,
        _: sb,
        ra: tb,
        oa: ub,
        ha: vb,
        na: wb,
        L: xb,
        Z: yb,
        W: zb,
        pa: Ab,
        X: Bb,
        wa: Cb,
        F: Db,
        Q: Eb,
        P: Fb,
        E: Gb,
        u: Hb,
        q: Ib,
        G: Jb,
        A: Kb,
        R: Lb,
        ua: Mb,
        ka: Nb,
        U: Ob,
        ba: Pb,
        H: Qb,
        ja: La,
        ta: Rb,
        t: Sb,
        x: Tb,
        o: Ub,
        l: Vb,
        c: Wb,
        n: Xb,
        j: Yb,
        w: Zb,
        p: $b,
        g: ac,
        s: bc,
        m: cc,
        e: dc,
        k: ec,
        i: fc,
        h: gc,
        d: hc,
        ea: ic,
        fa: jc,
        ga: kc,
        ca: lc,
        da: mc,
        T: nc,
        f: oc,
        D: pc,
        I: qc,
        M: rc,
        y: sc,
        sa: tc,
        V: uc,
        v: vc,
        z: wc,
        N: xc,
        S: yc,
        za: zc,
        ya: Ac,
        la: Bc,
        ma: Cc,
        $: Dc,
        C: Ec,
        K: Fc,
        ia: Gc,
        J: Hc,
        a: l,
        xa: Ic,
        va: Jc,
        r: Kc,
      };
      return { a: kb };
    }
    var Lc = {
      868340: (a, b, c, d, f) => {
        if ('undefined' == typeof B || !B.Fb) return 1;
        a = K(a >>> 0);
        a.startsWith('./') && (a = a.substring(2));
        a = B.Fb.get(a);
        if (!a) return 2;
        b >>>= 0;
        c >>>= 0;
        d >>>= 0;
        if (b + c > a.byteLength) return 3;
        try {
          const g = a.subarray(b, b + c);
          switch (f) {
            case 0:
              w().set(g, d >>> 0);
              break;
            case 1:
              B.cc(d, g);
              break;
            default:
              return 4;
          }
          return 0;
        } catch {
          return 4;
        }
      },
      869023: (a, b, c) => {
        B.dc(a, w().subarray(b >>> 0, (b + c) >>> 0));
      },
      869086: () => B.ac(),
      869127: a => {
        B.Ob(a);
      },
      869163: () => {
        B.Vb();
      },
      869194: () => {
        B.Wb();
      },
      869223: () => {
        B.$b();
      },
      869248: a => B.Ub(a),
      869281: a => B.Yb(a),
      869313: (a, b, c) => {
        B.Nb(a, b, c, !0);
      },
      869352: (a, b, c) => {
        B.Nb(a, b, c);
      },
      869385: () => 'undefined' !== typeof wasmOffsetConverter,
      869442: a => {
        B.jb('Abs', a, void 0);
      },
      869493: a => {
        B.jb('Neg', a, void 0);
      },
      869544: a => {
        B.jb('Floor', a, void 0);
      },
      869597: a => {
        B.jb('Ceil', a, void 0);
      },
      869649: a => {
        B.jb('Reciprocal', a, void 0);
      },
      869707: a => {
        B.jb('Sqrt', a, void 0);
      },
      869759: a => {
        B.jb('Exp', a, void 0);
      },
      869810: a => {
        B.jb('Erf', a, void 0);
      },
      869861: a => {
        B.jb('Sigmoid', a, void 0);
      },
      869916: (a, b, c) => {
        B.jb('HardSigmoid', a, { alpha: b, beta: c });
      },
      869995: a => {
        B.jb('Log', a, void 0);
      },
      870046: a => {
        B.jb('Sin', a, void 0);
      },
      870097: a => {
        B.jb('Cos', a, void 0);
      },
      870148: a => {
        B.jb('Tan', a, void 0);
      },
      870199: a => {
        B.jb('Asin', a, void 0);
      },
      870251: a => {
        B.jb('Acos', a, void 0);
      },
      870303: a => {
        B.jb('Atan', a, void 0);
      },
      870355: a => {
        B.jb('Sinh', a, void 0);
      },
      870407: a => {
        B.jb('Cosh', a, void 0);
      },
      870459: a => {
        B.jb('Asinh', a, void 0);
      },
      870512: a => {
        B.jb('Acosh', a, void 0);
      },
      870565: a => {
        B.jb('Atanh', a, void 0);
      },
      870618: a => {
        B.jb('Tanh', a, void 0);
      },
      870670: a => {
        B.jb('Not', a, void 0);
      },
      870721: (a, b, c) => {
        B.jb('Clip', a, { min: b, max: c });
      },
      870790: a => {
        B.jb('Clip', a, void 0);
      },
      870842: (a, b) => {
        B.jb('Elu', a, { alpha: b });
      },
      870900: a => {
        B.jb('Gelu', a, void 0);
      },
      870952: a => {
        B.jb('Relu', a, void 0);
      },
      871004: (a, b) => {
        B.jb('LeakyRelu', a, { alpha: b });
      },
      871068: (a, b) => {
        B.jb('ThresholdedRelu', a, { alpha: b });
      },
      871138: (a, b) => {
        B.jb('Cast', a, { to: b });
      },
      871196: a => {
        B.jb('Add', a, void 0);
      },
      871247: a => {
        B.jb('Sub', a, void 0);
      },
      871298: a => {
        B.jb('Mul', a, void 0);
      },
      871349: a => {
        B.jb('Div', a, void 0);
      },
      871400: a => {
        B.jb('Pow', a, void 0);
      },
      871451: a => {
        B.jb('Equal', a, void 0);
      },
      871504: a => {
        B.jb('Greater', a, void 0);
      },
      871559: a => {
        B.jb('GreaterOrEqual', a, void 0);
      },
      871621: a => {
        B.jb('Less', a, void 0);
      },
      871673: a => {
        B.jb('LessOrEqual', a, void 0);
      },
      871732: (a, b, c, d, f) => {
        B.jb('ReduceMean', a, { keepDims: !!b, noopWithEmptyAxes: !!c, axes: d ? Array.from(z().subarray(d >>> 0, f >>> 0)) : [] });
      },
      871891: (a, b, c, d, f) => {
        B.jb('ReduceMax', a, { keepDims: !!b, noopWithEmptyAxes: !!c, axes: d ? Array.from(z().subarray(d >>> 0, f >>> 0)) : [] });
      },
      872049: (a, b, c, d, f) => {
        B.jb('ReduceMin', a, { keepDims: !!b, noopWithEmptyAxes: !!c, axes: d ? Array.from(z().subarray(d >>> 0, f >>> 0)) : [] });
      },
      872207: (a, b, c, d, f) => {
        B.jb('ReduceProd', a, { keepDims: !!b, noopWithEmptyAxes: !!c, axes: d ? Array.from(z().subarray(d >>> 0, f >>> 0)) : [] });
      },
      872366: (a, b, c, d, f) => {
        B.jb('ReduceSum', a, { keepDims: !!b, noopWithEmptyAxes: !!c, axes: d ? Array.from(z().subarray(d >>> 0, f >>> 0)) : [] });
      },
      872524: (a, b, c, d, f) => {
        B.jb('ReduceL1', a, { keepDims: !!b, noopWithEmptyAxes: !!c, axes: d ? Array.from(z().subarray(d >>> 0, f >>> 0)) : [] });
      },
      872681: (a, b, c, d, f) => {
        B.jb('ReduceL2', a, { keepDims: !!b, noopWithEmptyAxes: !!c, axes: d ? Array.from(z().subarray(d >>> 0, f >>> 0)) : [] });
      },
      872838: (a, b, c, d, f) => {
        B.jb('ReduceLogSum', a, { keepDims: !!b, noopWithEmptyAxes: !!c, axes: d ? Array.from(z().subarray(d >>> 0, f >>> 0)) : [] });
      },
      872999: (a, b, c, d, f) => {
        B.jb('ReduceSumSquare', a, { keepDims: !!b, noopWithEmptyAxes: !!c, axes: d ? Array.from(z().subarray(d >>> 0, f >>> 0)) : [] });
      },
      873163: (a, b, c, d, f) => {
        B.jb('ReduceLogSumExp', a, { keepDims: !!b, noopWithEmptyAxes: !!c, axes: d ? Array.from(z().subarray(d >>> 0, f >>> 0)) : [] });
      },
      873327: a => {
        B.jb('Where', a, void 0);
      },
      873380: (a, b, c) => {
        B.jb('Transpose', a, { perm: b ? Array.from(z().subarray(b >>> 0, c >>> 0)) : [] });
      },
      873488: (a, b, c, d) => {
        B.jb('DepthToSpace', a, { blocksize: b, mode: K(c), format: d ? 'NHWC' : 'NCHW' });
      },
      873621: (a, b, c, d) => {
        B.jb('DepthToSpace', a, { blocksize: b, mode: K(c), format: d ? 'NHWC' : 'NCHW' });
      },
      873754: (a, b, c, d, f, g, k, m, p, n, r, v, x, h, u) => {
        B.jb('ConvTranspose', a, {
          format: p ? 'NHWC' : 'NCHW',
          autoPad: b,
          dilations: [c],
          group: d,
          kernelShape: [f],
          pads: [g, k],
          strides: [m],
          wIsConst: () => !!e()[n >>> 0],
          outputPadding: r ? Array.from(z().subarray(r >>> 0, v >>> 0)) : [],
          outputShape: x ? Array.from(z().subarray(x >>> 0, h >>> 0)) : [],
          activation: K(u),
        });
      },
      874155: (a, b, c, d, f, g, k, m, p, n, r, v, x, h) => {
        B.jb('ConvTranspose', a, {
          format: m ? 'NHWC' : 'NCHW',
          autoPad: b,
          dilations: Array.from(z().subarray(c >>> 0, ((c >>> 0) + 2) >>> 0)),
          group: d,
          kernelShape: Array.from(z().subarray(f >>> 0, ((f >>> 0) + 2) >>> 0)),
          pads: Array.from(z().subarray(g >>> 0, ((g >>> 0) + 4) >>> 0)),
          strides: Array.from(z().subarray(k >>> 0, ((k >>> 0) + 2) >>> 0)),
          wIsConst: () => !!e()[p >>> 0],
          outputPadding: n ? Array.from(z().subarray(n >>> 0, r >>> 0)) : [],
          outputShape: v ? Array.from(z().subarray(v >>> 0, x >>> 0)) : [],
          activation: K(h),
        });
      },
      874720: (a, b, c, d, f, g, k, m, p, n, r, v, x, h, u) => {
        B.jb('ConvTranspose', a, {
          format: p ? 'NHWC' : 'NCHW',
          autoPad: b,
          dilations: [c],
          group: d,
          kernelShape: [f],
          pads: [g, k],
          strides: [m],
          wIsConst: () => !!e()[n >>> 0],
          outputPadding: r ? Array.from(z().subarray(r >>> 0, v >>> 0)) : [],
          outputShape: x ? Array.from(z().subarray(x >>> 0, h >>> 0)) : [],
          activation: K(u),
        });
      },
      875121: (a, b, c, d, f, g, k, m, p, n, r, v, x, h) => {
        B.jb('ConvTranspose', a, {
          format: m ? 'NHWC' : 'NCHW',
          autoPad: b,
          dilations: Array.from(z().subarray(c >>> 0, ((c >>> 0) + 2) >>> 0)),
          group: d,
          kernelShape: Array.from(z().subarray(f >>> 0, ((f >>> 0) + 2) >>> 0)),
          pads: Array.from(z().subarray(g >>> 0, ((g >>> 0) + 4) >>> 0)),
          strides: Array.from(z().subarray(k >>> 0, ((k >>> 0) + 2) >>> 0)),
          wIsConst: () => !!e()[p >>> 0],
          outputPadding: n ? Array.from(z().subarray(n >>> 0, r >>> 0)) : [],
          outputShape: v ? Array.from(z().subarray(v >>> 0, x >>> 0)) : [],
          activation: K(h),
        });
      },
      875686: (a, b) => {
        B.jb('GlobalAveragePool', a, { format: b ? 'NHWC' : 'NCHW' });
      },
      875777: (a, b, c, d, f, g, k, m, p, n, r, v, x, h) => {
        B.jb('AveragePool', a, {
          format: h ? 'NHWC' : 'NCHW',
          auto_pad: b,
          ceil_mode: c,
          count_include_pad: d,
          storage_order: f,
          dilations: g ? Array.from(z().subarray(g >>> 0, k >>> 0)) : [],
          kernel_shape: m ? Array.from(z().subarray(m >>> 0, p >>> 0)) : [],
          pads: n ? Array.from(z().subarray(n >>> 0, r >>> 0)) : [],
          strides: v ? Array.from(z().subarray(v >>> 0, x >>> 0)) : [],
        });
      },
      876192: (a, b) => {
        B.jb('GlobalAveragePool', a, { format: b ? 'NHWC' : 'NCHW' });
      },
      876283: (a, b, c, d, f, g, k, m, p, n, r, v, x, h) => {
        B.jb('AveragePool', a, {
          format: h ? 'NHWC' : 'NCHW',
          auto_pad: b,
          ceil_mode: c,
          count_include_pad: d,
          storage_order: f,
          dilations: g ? Array.from(z().subarray(g >>> 0, k >>> 0)) : [],
          kernel_shape: m ? Array.from(z().subarray(m >>> 0, p >>> 0)) : [],
          pads: n ? Array.from(z().subarray(n >>> 0, r >>> 0)) : [],
          strides: v ? Array.from(z().subarray(v >>> 0, x >>> 0)) : [],
        });
      },
      876698: (a, b) => {
        B.jb('GlobalMaxPool', a, { format: b ? 'NHWC' : 'NCHW' });
      },
      876785: (a, b, c, d, f, g, k, m, p, n, r, v, x, h) => {
        B.jb('MaxPool', a, {
          format: h ? 'NHWC' : 'NCHW',
          auto_pad: b,
          ceil_mode: c,
          count_include_pad: d,
          storage_order: f,
          dilations: g ? Array.from(z().subarray(g >>> 0, k >>> 0)) : [],
          kernel_shape: m ? Array.from(z().subarray(m >>> 0, p >>> 0)) : [],
          pads: n ? Array.from(z().subarray(n >>> 0, r >>> 0)) : [],
          strides: v ? Array.from(z().subarray(v >>> 0, x >>> 0)) : [],
        });
      },
      877196: (a, b) => {
        B.jb('GlobalMaxPool', a, { format: b ? 'NHWC' : 'NCHW' });
      },
      877283: (a, b, c, d, f, g, k, m, p, n, r, v, x, h) => {
        B.jb('MaxPool', a, {
          format: h ? 'NHWC' : 'NCHW',
          auto_pad: b,
          ceil_mode: c,
          count_include_pad: d,
          storage_order: f,
          dilations: g ? Array.from(z().subarray(g >>> 0, k >>> 0)) : [],
          kernel_shape: m ? Array.from(z().subarray(m >>> 0, p >>> 0)) : [],
          pads: n ? Array.from(z().subarray(n >>> 0, r >>> 0)) : [],
          strides: v ? Array.from(z().subarray(v >>> 0, x >>> 0)) : [],
        });
      },
      877694: (a, b, c, d, f) => {
        B.jb('Gemm', a, { alpha: b, beta: c, transA: d, transB: f });
      },
      877798: a => {
        B.jb('MatMul', a, void 0);
      },
      877852: (a, b, c, d) => {
        B.jb('ArgMax', a, { keepDims: !!b, selectLastIndex: !!c, axis: d });
      },
      877960: (a, b, c, d) => {
        B.jb('ArgMin', a, { keepDims: !!b, selectLastIndex: !!c, axis: d });
      },
      878068: (a, b) => {
        B.jb('Softmax', a, { axis: b });
      },
      878131: (a, b) => {
        B.jb('Concat', a, { axis: b });
      },
      878191: (a, b, c, d, f) => {
        B.jb('Split', a, { axis: b, numOutputs: c, splitSizes: d ? Array.from(z().subarray(d >>> 0, f >>> 0)) : [] });
      },
      878331: a => {
        B.jb('Expand', a, void 0);
      },
      878385: (a, b) => {
        B.jb('Gather', a, { axis: Number(b) });
      },
      878456: (a, b) => {
        B.jb('GatherElements', a, { axis: Number(b) });
      },
      878535: (a, b, c, d, f, g, k, m, p, n, r) => {
        B.jb('Resize', a, {
          antialias: b,
          axes: c ? Array.from(z().subarray(c >>> 0, d >>> 0)) : [],
          coordinateTransformMode: K(f),
          cubicCoeffA: g,
          excludeOutside: k,
          extrapolationValue: m,
          keepAspectRatioPolicy: K(p),
          mode: K(n),
          nearestMode: K(r),
        });
      },
      878881: (a, b, c, d, f, g, k) => {
        B.jb('Slice', a, {
          starts: b ? Array.from(z().subarray(b >>> 0, c >>> 0)) : [],
          ends: d ? Array.from(z().subarray(d >>> 0, f >>> 0)) : [],
          axes: g ? Array.from(z().subarray(g >>> 0, k >>> 0)) : [],
        });
      },
      879097: a => {
        B.jb('Tile', a, void 0);
      },
      879149: (a, b, c) => {
        B.jb('InstanceNormalization', a, { epsilon: b, format: c ? 'NHWC' : 'NCHW' });
      },
      879263: (a, b, c) => {
        B.jb('InstanceNormalization', a, { epsilon: b, format: c ? 'NHWC' : 'NCHW' });
      },
      879377: a => {
        B.jb('Range', a, void 0);
      },
      879430: (a, b) => {
        B.jb('Einsum', a, { equation: K(b) });
      },
      879511: (a, b, c, d, f) => {
        B.jb('Pad', a, { mode: b, value: c, pads: d ? Array.from(z().subarray(d >>> 0, f >>> 0)) : [] });
      },
      879638: (a, b, c, d, f, g) => {
        B.jb('BatchNormalization', a, { epsilon: b, momentum: c, spatial: !!f, trainingMode: !!d, format: g ? 'NHWC' : 'NCHW' });
      },
      879807: (a, b, c, d, f, g) => {
        B.jb('BatchNormalization', a, { epsilon: b, momentum: c, spatial: !!f, trainingMode: !!d, format: g ? 'NHWC' : 'NCHW' });
      },
      879976: (a, b, c) => {
        B.jb('CumSum', a, { exclusive: Number(b), reverse: Number(c) });
      },
      880073: (a, b, c) => {
        B.jb('DequantizeLinear', a, { axis: b, blockSize: c });
      },
      880163: (a, b, c, d, f, g, k, m, p) => {
        B.jb('Attention', a, {
          numHeads: b,
          isUnidirectional: c,
          maskFilterValue: d,
          scale: f,
          doRotary: g,
          qkvHiddenSizes: k ? Array.from(z().subarray(Number(m) >>> 0, (Number(m) + k) >>> 0)) : [],
          pastPresentShareBuffer: !!p,
        });
      },
      880435: a => {
        B.jb('BiasAdd', a, void 0);
      },
      880490: a => {
        B.jb('BiasSplitGelu', a, void 0);
      },
      880551: a => {
        B.jb('FastGelu', a, void 0);
      },
      880607: (a, b, c, d, f, g, k, m, p, n, r, v, x, h, u, y) => {
        B.jb('Conv', a, {
          format: v ? 'NHWC' : 'NCHW',
          auto_pad: b,
          dilations: c ? Array.from(z().subarray(c >>> 0, d >>> 0)) : [],
          group: f,
          kernel_shape: g ? Array.from(z().subarray(g >>> 0, k >>> 0)) : [],
          pads: m ? Array.from(z().subarray(m >>> 0, p >>> 0)) : [],
          strides: n ? Array.from(z().subarray(n >>> 0, r >>> 0)) : [],
          w_is_const: () => !!e()[x >>> 0],
          activation: K(h),
          activation_params: u ? Array.from(ja().subarray(u >>> 0, y >>> 0)) : [],
        });
      },
      881103: a => {
        B.jb('Gelu', a, void 0);
      },
      881155: (a, b, c, d) => {
        B.jb('GroupQueryAttention', a, { numHeads: b, kvNumHeads: c, scale: d });
      },
      881268: (a, b, c, d) => {
        B.jb('LayerNormalization', a, { axis: b, epsilon: c, simplified: !!d });
      },
      881379: (a, b, c, d) => {
        B.jb('LayerNormalization', a, { axis: b, epsilon: c, simplified: !!d });
      },
      881490: (a, b, c, d, f, g) => {
        B.jb('MatMulNBits', a, { k: b, n: c, accuracyLevel: d, bits: f, blockSize: g });
      },
      881617: (a, b, c, d, f, g) => {
        B.jb('MultiHeadAttention', a, { numHeads: b, isUnidirectional: c, maskFilterValue: d, scale: f, doRotary: g });
      },
      881776: (a, b) => {
        B.jb('QuickGelu', a, { alpha: b });
      },
      881840: (a, b, c, d, f) => {
        B.jb('RotaryEmbedding', a, { interleaved: !!b, numHeads: c, rotaryEmbeddingDim: d, scale: f });
      },
      881979: (a, b, c) => {
        B.jb('SkipLayerNormalization', a, { epsilon: b, simplified: !!c });
      },
      882081: (a, b, c) => {
        B.jb('SkipLayerNormalization', a, { epsilon: b, simplified: !!c });
      },
      882183: (a, b, c, d) => {
        B.jb('GatherBlockQuantized', a, { gatherAxis: b, quantizeAxis: c, blockSize: d });
      },
      882304: a => {
        B.Zb(a);
      },
      882338: (a, b) => B.bc(a, b, B.Eb.fc, B.Eb.errors),
    };
    function mb(a, b, c) {
      return Mc(async () => {
        await B.Xb(a, b, c);
      });
    }
    function lb() {
      return 'undefined' !== typeof wasmOffsetConverter;
    }
    function Nc(a) {
      this.name = 'ExitStatus';
      this.message = `Program terminated with exit(${a})`;
      this.status = a;
    }
    var Oc = a => {
        a.terminate();
        a.onmessage = () => {};
      },
      Rc = a => {
        0 == L.length && (Pc(), Qc(L[0]));
        var b = L.pop();
        if (!b) return 6;
        M.push(b);
        N[a.Ab] = b;
        b.Ab = a.Ab;
        var c = { cmd: 'run', start_routine: a.hc, arg: a.Qb, pthread_ptr: a.Ab };
        D && b.unref();
        b.postMessage(c, a.mc);
        return 0;
      },
      O = 0,
      P = (a, b, ...c) => {
        for (var d = 2 * c.length, f = Sc(), g = Tc(8 * d), k = g >>> 3, m = 0; m < c.length; m++) {
          var p = c[m];
          'bigint' == typeof p ? ((J[k + 2 * m] = 1n), (J[k + 2 * m + 1] = p)) : ((J[k + 2 * m] = 0n), (la()[(k + 2 * m + 1) >>> 0] = p));
        }
        a = Vc(a, 0, d, g, b);
        Wc(f);
        return a;
      };
    function Ic(a) {
      if (E) return P(0, 1, a);
      Va = a;
      if (!(0 < O)) {
        for (var b of M) Oc(b);
        for (b of L) Oc(b);
        L = [];
        M = [];
        N = [];
        I = !0;
      }
      wa(a, new Nc(a));
    }
    function Xc(a) {
      if (E) return P(1, 0, a);
      Dc(a);
    }
    var Dc = a => {
        Va = a;
        if (E) throw (Xc(a), 'unwind');
        Ic(a);
      },
      L = [],
      M = [],
      Yc = [],
      N = {};
    function Zc() {
      for (var a = B.numThreads - 1; a--; ) Pc();
      Xa.unshift(() => {
        $a++;
        $c(() => cb());
      });
    }
    var bd = a => {
      var b = a.Ab;
      delete N[b];
      L.push(a);
      M.splice(M.indexOf(a), 1);
      a.Ab = 0;
      ad(b);
    };
    function Na() {
      Yc.forEach(a => a());
    }
    var Qc = a =>
      new Promise(b => {
        a.onmessage = g => {
          g = g.data;
          var k = g.cmd;
          if (g.targetThread && g.targetThread != Ia()) {
            var m = N[g.targetThread];
            m
              ? m.postMessage(g, g.transferList)
              : H(`Internal error! Worker sent a message "${k}" to target pthread ${g.targetThread}, but that thread no longer exists!`);
          } else if ('checkMailbox' === k) Ra();
          else if ('spawnThread' === k) Rc(g);
          else if ('cleanupThread' === k) bd(N[g.thread]);
          else if ('killThread' === k) (g = g.thread), (k = N[g]), delete N[g], Oc(k), ad(g), M.splice(M.indexOf(k), 1), (k.Ab = 0);
          else if ('cancelThread' === k) N[g.thread].postMessage({ cmd: 'cancel' });
          else if ('loaded' === k) (a.loaded = !0), D && !a.Ab && a.unref(), b(a);
          else if ('alert' === k) alert(`Thread ${g.threadId}: ${g.text}`);
          else if ('setimmediate' === g.target) a.postMessage(g);
          else if ('callHandler' === k) B[g.handler](...g.args);
          else k && H(`worker sent an unknown command ${k}`);
        };
        a.onerror = g => {
          H(`${'worker sent an error!'} ${g.filename}:${g.lineno}: ${g.message}`);
          throw g;
        };
        D && (a.on('message', g => a.onmessage({ data: g })), a.on('error', g => a.onerror(g)));
        var c = [],
          d = [],
          f;
        for (f of d) B.hasOwnProperty(f) && c.push(f);
        a.postMessage({ cmd: 'load', handlers: c, wasmMemory: l, wasmModule: Ua });
      });
    function $c(a) {
      E ? a() : Promise.all(L.map(Qc)).then(a);
    }
    function Pc() {
      var a = new Worker(new URL(import.meta.url), { type: 'module', workerData: 'em-pthread', name: 'em-pthread' });
      L.push(a);
    }
    var cd = a => {
        for (; 0 < a.length; ) a.shift()(B);
      },
      Ma = () => {
        var a = Ia(),
          b = A()[((a + 52) >>> 2) >>> 0];
        a = A()[((a + 56) >>> 2) >>> 0];
        dd(b, b - a);
        Wc(b);
      },
      Pa = (a, b) => {
        O = 0;
        a = ed(a, b);
        0 < O ? (Va = a) : Qa(a);
      };
    class fd {
      constructor(a) {
        this.Jb = a - 24;
      }
    }
    var gd = 0,
      hd = 0;
    function nb(a, b, c) {
      a >>>= 0;
      var d = new fd(a);
      b >>>= 0;
      c >>>= 0;
      A()[((d.Jb + 16) >>> 2) >>> 0] = 0;
      A()[((d.Jb + 4) >>> 2) >>> 0] = b;
      A()[((d.Jb + 8) >>> 2) >>> 0] = c;
      gd = a;
      hd++;
      throw gd;
    }
    function jd(a, b, c, d) {
      return E ? P(2, 1, a, b, c, d) : ob(a, b, c, d);
    }
    function ob(a, b, c, d) {
      a >>>= 0;
      b >>>= 0;
      c >>>= 0;
      d >>>= 0;
      if ('undefined' == typeof SharedArrayBuffer)
        return H('Current environment does not support SharedArrayBuffer, pthreads are not available!'), 6;
      var f = [];
      if (E && 0 === f.length) return jd(a, b, c, d);
      a = { hc: c, Ab: a, Qb: d, mc: f };
      return E ? ((a.Mb = 'spawnThread'), postMessage(a, f), 0) : Rc(a);
    }
    var kd = 'undefined' != typeof TextDecoder ? new TextDecoder('utf8') : void 0,
      ld = (a, b, c) => {
        b >>>= 0;
        var d = b + c;
        for (c = b; a[c] && !(c >= d); ) ++c;
        if (16 < c - b && a.buffer && kd) return kd.decode(a.buffer instanceof SharedArrayBuffer ? a.slice(b, c) : a.subarray(b, c));
        for (d = ''; b < c; ) {
          var f = a[b++];
          if (f & 128) {
            var g = a[b++] & 63;
            if (192 == (f & 224)) d += String.fromCharCode(((f & 31) << 6) | g);
            else {
              var k = a[b++] & 63;
              f = 224 == (f & 240) ? ((f & 15) << 12) | (g << 6) | k : ((f & 7) << 18) | (g << 12) | (k << 6) | (a[b++] & 63);
              65536 > f ? (d += String.fromCharCode(f)) : ((f -= 65536), (d += String.fromCharCode(55296 | (f >> 10), 56320 | (f & 1023))));
            }
          } else d += String.fromCharCode(f);
        }
        return d;
      },
      K = (a, b) => ((a >>>= 0) ? ld(w(), a, b) : '');
    function pb(a, b, c) {
      return E ? P(3, 1, a, b, c) : 0;
    }
    function qb(a, b) {
      if (E) return P(4, 1, a, b);
    }
    var md = a => {
        for (var b = 0, c = 0; c < a.length; ++c) {
          var d = a.charCodeAt(c);
          127 >= d ? b++ : 2047 >= d ? (b += 2) : 55296 <= d && 57343 >= d ? ((b += 4), ++c) : (b += 3);
        }
        return b;
      },
      nd = (a, b, c, d) => {
        c >>>= 0;
        if (!(0 < d)) return 0;
        var f = c;
        d = c + d - 1;
        for (var g = 0; g < a.length; ++g) {
          var k = a.charCodeAt(g);
          if (55296 <= k && 57343 >= k) {
            var m = a.charCodeAt(++g);
            k = (65536 + ((k & 1023) << 10)) | (m & 1023);
          }
          if (127 >= k) {
            if (c >= d) break;
            b[c++ >>> 0] = k;
          } else {
            if (2047 >= k) {
              if (c + 1 >= d) break;
              b[c++ >>> 0] = 192 | (k >> 6);
            } else {
              if (65535 >= k) {
                if (c + 2 >= d) break;
                b[c++ >>> 0] = 224 | (k >> 12);
              } else {
                if (c + 3 >= d) break;
                b[c++ >>> 0] = 240 | (k >> 18);
                b[c++ >>> 0] = 128 | ((k >> 12) & 63);
              }
              b[c++ >>> 0] = 128 | ((k >> 6) & 63);
            }
            b[c++ >>> 0] = 128 | (k & 63);
          }
        }
        b[c >>> 0] = 0;
        return c - f;
      },
      od = (a, b, c) => nd(a, w(), b, c);
    function rb(a, b) {
      if (E) return P(5, 1, a, b);
    }
    function sb(a, b, c) {
      if (E) return P(6, 1, a, b, c);
    }
    function tb(a, b, c) {
      return E ? P(7, 1, a, b, c) : 0;
    }
    function ub(a, b) {
      if (E) return P(8, 1, a, b);
    }
    function vb(a, b, c) {
      if (E) return P(9, 1, a, b, c);
    }
    function wb(a, b, c, d) {
      if (E) return P(10, 1, a, b, c, d);
    }
    function xb(a, b, c, d) {
      if (E) return P(11, 1, a, b, c, d);
    }
    function yb(a, b, c, d) {
      if (E) return P(12, 1, a, b, c, d);
    }
    function zb(a) {
      if (E) return P(13, 1, a);
    }
    function Ab(a, b) {
      if (E) return P(14, 1, a, b);
    }
    function Bb(a, b, c) {
      if (E) return P(15, 1, a, b, c);
    }
    var Cb = () => {
        db('');
      },
      pd,
      Q = a => {
        for (var b = ''; w()[a >>> 0]; ) b += pd[w()[a++ >>> 0]];
        return b;
      },
      qd = {},
      rd = {},
      sd = {},
      R;
    function td(a, b, c = {}) {
      var d = b.name;
      if (!a) throw new R(`type "${d}" must have a positive integer typeid pointer`);
      if (rd.hasOwnProperty(a)) {
        if (c.Sb) return;
        throw new R(`Cannot register type '${d}' twice`);
      }
      rd[a] = b;
      delete sd[a];
      qd.hasOwnProperty(a) && ((b = qd[a]), delete qd[a], b.forEach(f => f()));
    }
    function S(a, b, c = {}) {
      if (!('argPackAdvance' in b)) throw new TypeError('registerType registeredInstance requires argPackAdvance');
      return td(a, b, c);
    }
    var ud = (a, b, c) => {
      switch (b) {
        case 1:
          return c ? d => e()[d >>> 0] : d => w()[d >>> 0];
        case 2:
          return c ? d => ca()[(d >>> 1) >>> 0] : d => ea()[(d >>> 1) >>> 0];
        case 4:
          return c ? d => z()[(d >>> 2) >>> 0] : d => A()[(d >>> 2) >>> 0];
        case 8:
          return c ? d => J[d >>> 3] : d => Wa[d >>> 3];
        default:
          throw new TypeError(`invalid integer width (${b}): ${a}`);
      }
    };
    function Db(a, b, c) {
      a >>>= 0;
      c >>>= 0;
      b = Q(b >>> 0);
      S(a, {
        name: b,
        fromWireType: d => d,
        toWireType: function (d, f) {
          if ('bigint' != typeof f && 'number' != typeof f)
            throw (
              (null === f
                ? (f = 'null')
                : ((d = typeof f), (f = 'object' === d || 'array' === d || 'function' === d ? f.toString() : '' + f)),
              new TypeError(`Cannot convert "${f}" to ${this.name}`))
            );
          'number' == typeof f && (f = BigInt(f));
          return f;
        },
        argPackAdvance: T,
        readValueFromPointer: ud(b, c, -1 == b.indexOf('u')),
        Db: null,
      });
    }
    var T = 8;
    function Eb(a, b, c, d) {
      a >>>= 0;
      b = Q(b >>> 0);
      S(a, {
        name: b,
        fromWireType: function (f) {
          return !!f;
        },
        toWireType: function (f, g) {
          return g ? c : d;
        },
        argPackAdvance: T,
        readValueFromPointer: function (f) {
          return this.fromWireType(w()[f >>> 0]);
        },
        Db: null,
      });
    }
    var vd = [],
      U = [];
    function Wb(a) {
      a >>>= 0;
      9 < a && 0 === --U[a + 1] && ((U[a] = void 0), vd.push(a));
    }
    var V = a => {
        if (!a) throw new R('Cannot use deleted val. handle = ' + a);
        return U[a];
      },
      W = a => {
        switch (a) {
          case void 0:
            return 2;
          case null:
            return 4;
          case !0:
            return 6;
          case !1:
            return 8;
          default:
            const b = vd.pop() || U.length;
            U[b] = a;
            U[b + 1] = 1;
            return b;
        }
      };
    function wd(a) {
      return this.fromWireType(A()[(a >>> 2) >>> 0]);
    }
    var xd = {
      name: 'emscripten::val',
      fromWireType: a => {
        var b = V(a);
        Wb(a);
        return b;
      },
      toWireType: (a, b) => W(b),
      argPackAdvance: T,
      readValueFromPointer: wd,
      Db: null,
    };
    function Fb(a) {
      return S(a >>> 0, xd);
    }
    var yd = (a, b) => {
      switch (b) {
        case 4:
          return function (c) {
            return this.fromWireType(ja()[(c >>> 2) >>> 0]);
          };
        case 8:
          return function (c) {
            return this.fromWireType(la()[(c >>> 3) >>> 0]);
          };
        default:
          throw new TypeError(`invalid float width (${b}): ${a}`);
      }
    };
    function Gb(a, b, c) {
      a >>>= 0;
      c >>>= 0;
      b = Q(b >>> 0);
      S(a, { name: b, fromWireType: d => d, toWireType: (d, f) => f, argPackAdvance: T, readValueFromPointer: yd(b, c), Db: null });
    }
    function Hb(a, b, c, d, f) {
      a >>>= 0;
      c >>>= 0;
      b = Q(b >>> 0);
      -1 === f && (f = 4294967295);
      f = m => m;
      if (0 === d) {
        var g = 32 - 8 * c;
        f = m => (m << g) >>> g;
      }
      var k = b.includes('unsigned')
        ? function (m, p) {
            return p >>> 0;
          }
        : function (m, p) {
            return p;
          };
      S(a, { name: b, fromWireType: f, toWireType: k, argPackAdvance: T, readValueFromPointer: ud(b, c, 0 !== d), Db: null });
    }
    function Ib(a, b, c) {
      function d(g) {
        var k = A()[(g >>> 2) >>> 0];
        g = A()[((g + 4) >>> 2) >>> 0];
        return new f(e().buffer, g, k);
      }
      a >>>= 0;
      var f = [
        Int8Array,
        Uint8Array,
        Int16Array,
        Uint16Array,
        Int32Array,
        Uint32Array,
        Float32Array,
        Float64Array,
        BigInt64Array,
        BigUint64Array,
      ][b];
      c = Q(c >>> 0);
      S(a, { name: c, fromWireType: d, argPackAdvance: T, readValueFromPointer: d }, { Sb: !0 });
    }
    function Jb(a, b) {
      a >>>= 0;
      b = Q(b >>> 0);
      var c = 'std::string' === b;
      S(a, {
        name: b,
        fromWireType: function (d) {
          var f = A()[(d >>> 2) >>> 0],
            g = d + 4;
          if (c)
            for (var k = g, m = 0; m <= f; ++m) {
              var p = g + m;
              if (m == f || 0 == w()[p >>> 0]) {
                k = K(k, p - k);
                if (void 0 === n) var n = k;
                else (n += String.fromCharCode(0)), (n += k);
                k = p + 1;
              }
            }
          else {
            n = Array(f);
            for (m = 0; m < f; ++m) n[m] = String.fromCharCode(w()[(g + m) >>> 0]);
            n = n.join('');
          }
          X(d);
          return n;
        },
        toWireType: function (d, f) {
          f instanceof ArrayBuffer && (f = new Uint8Array(f));
          var g = 'string' == typeof f;
          if (!(g || f instanceof Uint8Array || f instanceof Uint8ClampedArray || f instanceof Int8Array))
            throw new R('Cannot pass non-string to std::string');
          var k = c && g ? md(f) : f.length;
          var m = zd(4 + k + 1),
            p = m + 4;
          A()[(m >>> 2) >>> 0] = k;
          if (c && g) od(f, p, k + 1);
          else if (g)
            for (g = 0; g < k; ++g) {
              var n = f.charCodeAt(g);
              if (255 < n) throw (X(p), new R('String has UTF-16 code units that do not fit in 8 bits'));
              w()[(p + g) >>> 0] = n;
            }
          else for (g = 0; g < k; ++g) w()[(p + g) >>> 0] = f[g];
          null !== d && d.push(X, m);
          return m;
        },
        argPackAdvance: T,
        readValueFromPointer: wd,
        Db(d) {
          X(d);
        },
      });
    }
    var Ad = 'undefined' != typeof TextDecoder ? new TextDecoder('utf-16le') : void 0,
      Bd = (a, b) => {
        var c = a >> 1;
        for (var d = c + b / 2; !(c >= d) && ea()[c >>> 0]; ) ++c;
        c <<= 1;
        if (32 < c - a && Ad) return Ad.decode(w().slice(a, c));
        c = '';
        for (d = 0; !(d >= b / 2); ++d) {
          var f = ca()[((a + 2 * d) >>> 1) >>> 0];
          if (0 == f) break;
          c += String.fromCharCode(f);
        }
        return c;
      },
      Cd = (a, b, c) => {
        c ??= 2147483647;
        if (2 > c) return 0;
        c -= 2;
        var d = b;
        c = c < 2 * a.length ? c / 2 : a.length;
        for (var f = 0; f < c; ++f) {
          var g = a.charCodeAt(f);
          ca()[(b >>> 1) >>> 0] = g;
          b += 2;
        }
        ca()[(b >>> 1) >>> 0] = 0;
        return b - d;
      },
      Dd = a => 2 * a.length,
      Ed = (a, b) => {
        for (var c = 0, d = ''; !(c >= b / 4); ) {
          var f = z()[((a + 4 * c) >>> 2) >>> 0];
          if (0 == f) break;
          ++c;
          65536 <= f ? ((f -= 65536), (d += String.fromCharCode(55296 | (f >> 10), 56320 | (f & 1023)))) : (d += String.fromCharCode(f));
        }
        return d;
      },
      Fd = (a, b, c) => {
        b >>>= 0;
        c ??= 2147483647;
        if (4 > c) return 0;
        var d = b;
        c = d + c - 4;
        for (var f = 0; f < a.length; ++f) {
          var g = a.charCodeAt(f);
          if (55296 <= g && 57343 >= g) {
            var k = a.charCodeAt(++f);
            g = (65536 + ((g & 1023) << 10)) | (k & 1023);
          }
          z()[(b >>> 2) >>> 0] = g;
          b += 4;
          if (b + 4 > c) break;
        }
        z()[(b >>> 2) >>> 0] = 0;
        return b - d;
      },
      Gd = a => {
        for (var b = 0, c = 0; c < a.length; ++c) {
          var d = a.charCodeAt(c);
          55296 <= d && 57343 >= d && ++c;
          b += 4;
        }
        return b;
      };
    function Kb(a, b, c) {
      a >>>= 0;
      b >>>= 0;
      c >>>= 0;
      c = Q(c);
      if (2 === b) {
        var d = Bd;
        var f = Cd;
        var g = Dd;
        var k = m => ea()[(m >>> 1) >>> 0];
      } else 4 === b && ((d = Ed), (f = Fd), (g = Gd), (k = m => A()[(m >>> 2) >>> 0]));
      S(a, {
        name: c,
        fromWireType: m => {
          for (var p = A()[(m >>> 2) >>> 0], n, r = m + 4, v = 0; v <= p; ++v) {
            var x = m + 4 + v * b;
            if (v == p || 0 == k(x)) (r = d(r, x - r)), void 0 === n ? (n = r) : ((n += String.fromCharCode(0)), (n += r)), (r = x + b);
          }
          X(m);
          return n;
        },
        toWireType: (m, p) => {
          if ('string' != typeof p) throw new R(`Cannot pass non-string to C++ string type ${c}`);
          var n = g(p),
            r = zd(4 + n + b);
          A()[(r >>> 2) >>> 0] = n / b;
          f(p, r + 4, n + b);
          null !== m && m.push(X, r);
          return r;
        },
        argPackAdvance: T,
        readValueFromPointer: wd,
        Db(m) {
          X(m);
        },
      });
    }
    function Lb(a, b) {
      a >>>= 0;
      b = Q(b >>> 0);
      S(a, { Tb: !0, name: b, argPackAdvance: 0, fromWireType: () => {}, toWireType: () => {} });
    }
    var Mb = () => 1;
    function Nb(a) {
      Ka(a >>> 0, !C, 1, !qa, 131072, !1);
      Na();
    }
    var Hd = a => {
      if (!I)
        try {
          if ((a(), !(0 < O)))
            try {
              E ? Qa(Va) : Dc(Va);
            } catch (b) {
              b instanceof Nc || 'unwind' == b || wa(1, b);
            }
        } catch (b) {
          b instanceof Nc || 'unwind' == b || wa(1, b);
        }
    };
    function La(a) {
      a >>>= 0;
      'function' === typeof Atomics.nc && (Atomics.nc(z(), a >>> 2, a).value.then(Ra), (a += 128), Atomics.store(z(), a >>> 2, 1));
    }
    var Ra = () => {
      var a = Ia();
      a && (La(a), Hd(Id));
    };
    function Ob(a, b) {
      a >>>= 0;
      a == b >>> 0
        ? setTimeout(Ra)
        : E
          ? postMessage({ targetThread: a, cmd: 'checkMailbox' })
          : (a = N[a]) && a.postMessage({ cmd: 'checkMailbox' });
    }
    var Jd = [];
    function Pb(a, b, c, d, f) {
      b >>>= 0;
      d /= 2;
      Jd.length = d;
      c = (f >>> 0) >>> 3;
      for (f = 0; f < d; f++) Jd[f] = J[c + 2 * f] ? J[c + 2 * f + 1] : la()[(c + 2 * f + 1) >>> 0];
      return (b ? Lc[b] : Kd[a])(...Jd);
    }
    function Qb(a) {
      a >>>= 0;
      E ? postMessage({ cmd: 'cleanupThread', thread: a }) : bd(N[a]);
    }
    function Rb(a) {
      D && N[a >>> 0].ref();
    }
    var Md = (a, b) => {
        var c = rd[a];
        if (void 0 === c) throw ((a = Ld(a)), (c = Q(a)), X(a), new R(`${b} has unknown type ${c}`));
        return c;
      },
      Nd = (a, b, c) => {
        var d = [];
        a = a.toWireType(d, c);
        d.length && (A()[(b >>> 2) >>> 0] = W(d));
        return a;
      };
    function Sb(a, b, c) {
      b >>>= 0;
      c >>>= 0;
      a = V(a >>> 0);
      b = Md(b, 'emval::as');
      return Nd(b, c, a);
    }
    var Od = a => {
      try {
        a();
      } catch (b) {
        db(b);
      }
    };
    function Pd() {
      var a = Y,
        b = {};
      for (let [c, d] of Object.entries(a))
        b[c] =
          'function' == typeof d
            ? (...f) => {
                Qd.push(c);
                try {
                  return d(...f);
                } finally {
                  I ||
                    (Qd.pop(), F && 1 === Z && 0 === Qd.length && ((Z = 0), (O += 1), Od(Rd), 'undefined' != typeof Fibers && Fibers.sc()));
                }
              }
            : d;
      return b;
    }
    var Z = 0,
      F = null,
      Sd = 0,
      Qd = [],
      Td = {},
      Ud = {},
      Vd = 0,
      Wd = null,
      Xd = [];
    function sa() {
      return new Promise((a, b) => {
        Wd = { resolve: a, reject: b };
      });
    }
    function Yd() {
      var a = zd(65548),
        b = a + 12;
      A()[(a >>> 2) >>> 0] = b;
      A()[((a + 4) >>> 2) >>> 0] = b + 65536;
      b = Qd[0];
      var c = Td[b];
      void 0 === c && ((c = Vd++), (Td[b] = c), (Ud[c] = b));
      b = c;
      z()[((a + 8) >>> 2) >>> 0] = b;
      return a;
    }
    function Zd() {
      var a = z()[((F + 8) >>> 2) >>> 0];
      a = Y[Ud[a]];
      --O;
      return a();
    }
    function $d(a) {
      if (!I) {
        if (0 === Z) {
          var b = !1,
            c = !1;
          a((d = 0) => {
            if (!I && ((Sd = d), (b = !0), c)) {
              Z = 2;
              Od(() => ae(F));
              'undefined' != typeof Browser && Browser.Kb.Rb && Browser.Kb.resume();
              d = !1;
              try {
                var f = Zd();
              } catch (m) {
                (f = m), (d = !0);
              }
              var g = !1;
              if (!F) {
                var k = Wd;
                k && ((Wd = null), (d ? k.reject : k.resolve)(f), (g = !0));
              }
              if (d && !g) throw f;
            }
          });
          c = !0;
          b || ((Z = 1), (F = Yd()), 'undefined' != typeof Browser && Browser.Kb.Rb && Browser.Kb.pause(), Od(() => be(F)));
        } else 2 === Z ? ((Z = 0), Od(ce), X(F), (F = null), Xd.forEach(Hd)) : db(`invalid state: ${Z}`);
        return Sd;
      }
    }
    function Mc(a) {
      return $d(b => {
        a().then(b);
      });
    }
    function Tb(a) {
      a >>>= 0;
      return Mc(() => {
        a = V(a);
        return a.then(W);
      });
    }
    var de = [];
    function Ub(a, b, c, d) {
      c >>>= 0;
      d >>>= 0;
      a = de[a >>> 0];
      b = V(b >>> 0);
      return a(null, b, c, d);
    }
    var ee = {},
      fe = a => {
        var b = ee[a];
        return void 0 === b ? Q(a) : b;
      };
    function Vb(a, b, c, d, f) {
      c >>>= 0;
      d >>>= 0;
      f >>>= 0;
      a = de[a >>> 0];
      b = V(b >>> 0);
      c = fe(c);
      return a(b, b[c], d, f);
    }
    var ge = () => ('object' == typeof globalThis ? globalThis : Function('return this')());
    function Xb(a) {
      a >>>= 0;
      if (0 === a) return W(ge());
      a = fe(a);
      return W(ge()[a]);
    }
    var he = a => {
        var b = de.length;
        de.push(a);
        return b;
      },
      ie = (a, b) => {
        for (var c = Array(a), d = 0; d < a; ++d) c[d] = Md(A()[((b + 4 * d) >>> 2) >>> 0], 'parameter ' + d);
        return c;
      },
      je = (a, b) => Object.defineProperty(b, 'name', { value: a });
    function ke(a) {
      var b = Function;
      if (!(b instanceof Function)) throw new TypeError(`new_ called with constructor type ${typeof b} which is not a function`);
      var c = je(b.name || 'unknownFunctionName', function () {});
      c.prototype = b.prototype;
      c = new c();
      a = b.apply(c, a);
      return a instanceof Object ? a : c;
    }
    function Yb(a, b, c) {
      b = ie(a, b >>> 0);
      var d = b.shift();
      a--;
      var f = 'return function (obj, func, destructorsRef, args) {\n',
        g = 0,
        k = [];
      0 === c && k.push('obj');
      for (var m = ['retType'], p = [d], n = 0; n < a; ++n)
        k.push('arg' + n),
          m.push('argType' + n),
          p.push(b[n]),
          (f += `  var arg${n} = argType${n}.readValueFromPointer(args${g ? '+' + g : ''});\n`),
          (g += b[n].argPackAdvance);
      f += `  var rv = ${1 === c ? 'new func' : 'func.call'}(${k.join(', ')});\n`;
      d.Tb || (m.push('emval_returnValue'), p.push(Nd), (f += '  return emval_returnValue(retType, destructorsRef, rv);\n'));
      m.push(f + '};\n');
      a = ke(m)(...p);
      c = `methodCaller<(${b.map(r => r.name).join(', ')}) => ${d.name}>`;
      return he(je(c, a));
    }
    function Zb(a) {
      a = fe(a >>> 0);
      return W(B[a]);
    }
    function $b(a, b) {
      b >>>= 0;
      a = V(a >>> 0);
      b = V(b);
      return W(a[b]);
    }
    function ac(a) {
      a >>>= 0;
      9 < a && (U[a + 1] += 1);
    }
    function bc() {
      return W([]);
    }
    function cc(a) {
      a = V(a >>> 0);
      for (var b = Array(a.length), c = 0; c < a.length; c++) b[c] = a[c];
      return W(b);
    }
    function dc(a) {
      return W(fe(a >>> 0));
    }
    function ec() {
      return W({});
    }
    function fc(a) {
      a >>>= 0;
      for (var b = V(a); b.length; ) {
        var c = b.pop();
        b.pop()(c);
      }
      Wb(a);
    }
    function gc(a, b, c) {
      b >>>= 0;
      c >>>= 0;
      a = V(a >>> 0);
      b = V(b);
      c = V(c);
      a[b] = c;
    }
    function hc(a, b) {
      b >>>= 0;
      a = Md(a >>> 0, '_emval_take_value');
      a = a.readValueFromPointer(b);
      return W(a);
    }
    function ic(a, b) {
      a = -9007199254740992 > a || 9007199254740992 < a ? NaN : Number(a);
      b >>>= 0;
      a = new Date(1e3 * a);
      z()[(b >>> 2) >>> 0] = a.getUTCSeconds();
      z()[((b + 4) >>> 2) >>> 0] = a.getUTCMinutes();
      z()[((b + 8) >>> 2) >>> 0] = a.getUTCHours();
      z()[((b + 12) >>> 2) >>> 0] = a.getUTCDate();
      z()[((b + 16) >>> 2) >>> 0] = a.getUTCMonth();
      z()[((b + 20) >>> 2) >>> 0] = a.getUTCFullYear() - 1900;
      z()[((b + 24) >>> 2) >>> 0] = a.getUTCDay();
      a = ((a.getTime() - Date.UTC(a.getUTCFullYear(), 0, 1, 0, 0, 0, 0)) / 864e5) | 0;
      z()[((b + 28) >>> 2) >>> 0] = a;
    }
    var le = a => 0 === a % 4 && (0 !== a % 100 || 0 === a % 400),
      me = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335],
      ne = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
    function jc(a, b) {
      a = -9007199254740992 > a || 9007199254740992 < a ? NaN : Number(a);
      b >>>= 0;
      a = new Date(1e3 * a);
      z()[(b >>> 2) >>> 0] = a.getSeconds();
      z()[((b + 4) >>> 2) >>> 0] = a.getMinutes();
      z()[((b + 8) >>> 2) >>> 0] = a.getHours();
      z()[((b + 12) >>> 2) >>> 0] = a.getDate();
      z()[((b + 16) >>> 2) >>> 0] = a.getMonth();
      z()[((b + 20) >>> 2) >>> 0] = a.getFullYear() - 1900;
      z()[((b + 24) >>> 2) >>> 0] = a.getDay();
      var c = ((le(a.getFullYear()) ? me : ne)[a.getMonth()] + a.getDate() - 1) | 0;
      z()[((b + 28) >>> 2) >>> 0] = c;
      z()[((b + 36) >>> 2) >>> 0] = -(60 * a.getTimezoneOffset());
      c = new Date(a.getFullYear(), 6, 1).getTimezoneOffset();
      var d = new Date(a.getFullYear(), 0, 1).getTimezoneOffset();
      a = (c != d && a.getTimezoneOffset() == Math.min(d, c)) | 0;
      z()[((b + 32) >>> 2) >>> 0] = a;
    }
    function kc(a) {
      a >>>= 0;
      var b = new Date(
          z()[((a + 20) >>> 2) >>> 0] + 1900,
          z()[((a + 16) >>> 2) >>> 0],
          z()[((a + 12) >>> 2) >>> 0],
          z()[((a + 8) >>> 2) >>> 0],
          z()[((a + 4) >>> 2) >>> 0],
          z()[(a >>> 2) >>> 0],
          0,
        ),
        c = z()[((a + 32) >>> 2) >>> 0],
        d = b.getTimezoneOffset(),
        f = new Date(b.getFullYear(), 6, 1).getTimezoneOffset(),
        g = new Date(b.getFullYear(), 0, 1).getTimezoneOffset(),
        k = Math.min(g, f);
      0 > c
        ? (z()[((a + 32) >>> 2) >>> 0] = Number(f != g && k == d))
        : 0 < c != (k == d) && ((f = Math.max(g, f)), b.setTime(b.getTime() + 6e4 * ((0 < c ? k : f) - d)));
      z()[((a + 24) >>> 2) >>> 0] = b.getDay();
      c = ((le(b.getFullYear()) ? me : ne)[b.getMonth()] + b.getDate() - 1) | 0;
      z()[((a + 28) >>> 2) >>> 0] = c;
      z()[(a >>> 2) >>> 0] = b.getSeconds();
      z()[((a + 4) >>> 2) >>> 0] = b.getMinutes();
      z()[((a + 8) >>> 2) >>> 0] = b.getHours();
      z()[((a + 12) >>> 2) >>> 0] = b.getDate();
      z()[((a + 16) >>> 2) >>> 0] = b.getMonth();
      z()[((a + 20) >>> 2) >>> 0] = b.getYear();
      a = b.getTime();
      return BigInt(isNaN(a) ? -1 : a / 1e3);
    }
    function lc(a, b, c, d, f, g, k) {
      return E ? P(16, 1, a, b, c, d, f, g, k) : -52;
    }
    function mc(a, b, c, d, f, g) {
      if (E) return P(17, 1, a, b, c, d, f, g);
    }
    function nc(a, b, c, d) {
      a >>>= 0;
      b >>>= 0;
      c >>>= 0;
      d >>>= 0;
      var f = new Date().getFullYear(),
        g = new Date(f, 0, 1),
        k = new Date(f, 6, 1);
      f = g.getTimezoneOffset();
      var m = k.getTimezoneOffset(),
        p = Math.max(f, m);
      A()[(a >>> 2) >>> 0] = 60 * p;
      z()[(b >>> 2) >>> 0] = Number(f != m);
      a = n => n.toLocaleTimeString(void 0, { hour12: !1, timeZoneName: 'short' }).split(' ')[1];
      g = a(g);
      k = a(k);
      m < f ? (od(g, c, 17), od(k, d, 17)) : (od(g, d, 17), od(k, c, 17));
    }
    var oe = [],
      pe = (a, b) => {
        oe.length = 0;
        for (var c; (c = w()[a++ >>> 0]); ) {
          var d = 105 != c;
          d &= 112 != c;
          b += d && b % 8 ? 4 : 0;
          oe.push(112 == c ? A()[(b >>> 2) >>> 0] : 106 == c ? J[b >>> 3] : 105 == c ? z()[(b >>> 2) >>> 0] : la()[(b >>> 3) >>> 0]);
          b += d ? 8 : 4;
        }
        return oe;
      };
    function oc(a, b, c) {
      a >>>= 0;
      b = pe(b >>> 0, c >>> 0);
      return Lc[a](...b);
    }
    function pc(a, b, c) {
      a >>>= 0;
      b = pe(b >>> 0, c >>> 0);
      return Lc[a](...b);
    }
    var qc = () => {},
      rc = () => Date.now();
    function sc(a, b) {
      return H(K(a >>> 0, b >>> 0));
    }
    var tc = () => {
      O += 1;
      throw 'unwind';
    };
    function uc() {
      return 4294901760;
    }
    var vc;
    vc = () => performance.timeOrigin + performance.now();
    var wc = () => (D ? require('os').cpus().length : navigator.hardwareConcurrency);
    function xc() {
      db('Cannot use emscripten_pc_get_function without -sUSE_OFFSET_CONVERTER');
      return 0;
    }
    function yc(a) {
      a >>>= 0;
      var b = w().length;
      if (a <= b || 4294901760 < a) return !1;
      for (var c = 1; 4 >= c; c *= 2) {
        var d = b * (1 + 0.2 / c);
        d = Math.min(d, a + 100663296);
        var f = Math;
        d = Math.max(a, d);
        a: {
          f = (f.min.call(f, 4294901760, d + ((65536 - (d % 65536)) % 65536)) - l.buffer.byteLength + 65535) / 65536;
          try {
            l.grow(f);
            t();
            var g = 1;
            break a;
          } catch (k) {}
          g = void 0;
        }
        if (g) return !0;
      }
      return !1;
    }
    var qe = () => {
        db('Cannot use convertFrameToPC (needed by __builtin_return_address) without -sUSE_OFFSET_CONVERTER');
        return 0;
      },
      re = {},
      se = a => {
        a.forEach(b => {
          var c = qe();
          c && (re[c] = b);
        });
      };
    function zc() {
      var a = Error().stack.toString().split('\n');
      'Error' == a[0] && a.shift();
      se(a);
      re.Pb = qe();
      re.ec = a;
      return re.Pb;
    }
    function Ac(a, b, c) {
      a >>>= 0;
      b >>>= 0;
      if (re.Pb == a) var d = re.ec;
      else (d = Error().stack.toString().split('\n')), 'Error' == d[0] && d.shift(), se(d);
      for (var f = 3; d[f] && qe() != a; ) ++f;
      for (a = 0; a < c && d[a + f]; ++a) z()[((b + 4 * a) >>> 2) >>> 0] = qe();
      return a;
    }
    var te = {},
      ve = () => {
        if (!ue) {
          var a = {
              USER: 'web_user',
              LOGNAME: 'web_user',
              PATH: '/',
              PWD: '/',
              HOME: '/home/web_user',
              LANG: (('object' == typeof navigator && navigator.languages && navigator.languages[0]) || 'C').replace('-', '_') + '.UTF-8',
              _: va || './this.program',
            },
            b;
          for (b in te) void 0 === te[b] ? delete a[b] : (a[b] = te[b]);
          var c = [];
          for (b in a) c.push(`${b}=${a[b]}`);
          ue = c;
        }
        return ue;
      },
      ue;
    function Bc(a, b) {
      if (E) return P(18, 1, a, b);
      a >>>= 0;
      b >>>= 0;
      var c = 0;
      ve().forEach((d, f) => {
        var g = b + c;
        f = A()[((a + 4 * f) >>> 2) >>> 0] = g;
        for (g = 0; g < d.length; ++g) e()[f++ >>> 0] = d.charCodeAt(g);
        e()[f >>> 0] = 0;
        c += d.length + 1;
      });
      return 0;
    }
    function Cc(a, b) {
      if (E) return P(19, 1, a, b);
      a >>>= 0;
      b >>>= 0;
      var c = ve();
      A()[(a >>> 2) >>> 0] = c.length;
      var d = 0;
      c.forEach(f => (d += f.length + 1));
      A()[(b >>> 2) >>> 0] = d;
      return 0;
    }
    function Ec(a) {
      return E ? P(20, 1, a) : 52;
    }
    function Fc(a, b, c, d) {
      return E ? P(21, 1, a, b, c, d) : 52;
    }
    function Gc(a, b, c, d) {
      return E ? P(22, 1, a, b, c, d) : 70;
    }
    var we = [null, [], []];
    function Hc(a, b, c, d) {
      if (E) return P(23, 1, a, b, c, d);
      b >>>= 0;
      c >>>= 0;
      d >>>= 0;
      for (var f = 0, g = 0; g < c; g++) {
        var k = A()[(b >>> 2) >>> 0],
          m = A()[((b + 4) >>> 2) >>> 0];
        b += 8;
        for (var p = 0; p < m; p++) {
          var n = w()[(k + p) >>> 0],
            r = we[a];
          0 === n || 10 === n ? ((1 === a ? Ea : H)(ld(r, 0)), (r.length = 0)) : r.push(n);
        }
        f += m;
      }
      A()[(d >>> 2) >>> 0] = f;
      return 0;
    }
    var xe = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
      ye = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    function ze(a) {
      var b = Array(md(a) + 1);
      nd(a, b, 0, b.length);
      return b;
    }
    var Ae = (a, b) => {
      e().set(a, b >>> 0);
    };
    function Jc(a, b, c, d) {
      function f(h, u, y) {
        for (h = 'number' == typeof h ? h.toString() : h || ''; h.length < u; ) h = y[0] + h;
        return h;
      }
      function g(h, u) {
        return f(h, u, '0');
      }
      function k(h, u) {
        function y(Uc) {
          return 0 > Uc ? -1 : 0 < Uc ? 1 : 0;
        }
        var aa;
        0 === (aa = y(h.getFullYear() - u.getFullYear())) &&
          0 === (aa = y(h.getMonth() - u.getMonth())) &&
          (aa = y(h.getDate() - u.getDate()));
        return aa;
      }
      function m(h) {
        switch (h.getDay()) {
          case 0:
            return new Date(h.getFullYear() - 1, 11, 29);
          case 1:
            return h;
          case 2:
            return new Date(h.getFullYear(), 0, 3);
          case 3:
            return new Date(h.getFullYear(), 0, 2);
          case 4:
            return new Date(h.getFullYear(), 0, 1);
          case 5:
            return new Date(h.getFullYear() - 1, 11, 31);
          case 6:
            return new Date(h.getFullYear() - 1, 11, 30);
        }
      }
      function p(h) {
        var u = h.Bb;
        for (h = new Date(new Date(h.Cb + 1900, 0, 1).getTime()); 0 < u; ) {
          var y = h.getMonth(),
            aa = (le(h.getFullYear()) ? xe : ye)[y];
          if (u > aa - h.getDate())
            (u -= aa - h.getDate() + 1), h.setDate(1), 11 > y ? h.setMonth(y + 1) : (h.setMonth(0), h.setFullYear(h.getFullYear() + 1));
          else {
            h.setDate(h.getDate() + u);
            break;
          }
        }
        y = new Date(h.getFullYear() + 1, 0, 4);
        u = m(new Date(h.getFullYear(), 0, 4));
        y = m(y);
        return 0 >= k(u, h) ? (0 >= k(y, h) ? h.getFullYear() + 1 : h.getFullYear()) : h.getFullYear() - 1;
      }
      a >>>= 0;
      b >>>= 0;
      c >>>= 0;
      d >>>= 0;
      var n = A()[((d + 40) >>> 2) >>> 0];
      d = {
        kc: z()[(d >>> 2) >>> 0],
        jc: z()[((d + 4) >>> 2) >>> 0],
        Hb: z()[((d + 8) >>> 2) >>> 0],
        Lb: z()[((d + 12) >>> 2) >>> 0],
        Ib: z()[((d + 16) >>> 2) >>> 0],
        Cb: z()[((d + 20) >>> 2) >>> 0],
        ub: z()[((d + 24) >>> 2) >>> 0],
        Bb: z()[((d + 28) >>> 2) >>> 0],
        rc: z()[((d + 32) >>> 2) >>> 0],
        ic: z()[((d + 36) >>> 2) >>> 0],
        lc: n ? K(n) : '',
      };
      c = K(c);
      n = {
        '%c': '%a %b %d %H:%M:%S %Y',
        '%D': '%m/%d/%y',
        '%F': '%Y-%m-%d',
        '%h': '%b',
        '%r': '%I:%M:%S %p',
        '%R': '%H:%M',
        '%T': '%H:%M:%S',
        '%x': '%m/%d/%y',
        '%X': '%H:%M:%S',
        '%Ec': '%c',
        '%EC': '%C',
        '%Ex': '%m/%d/%y',
        '%EX': '%H:%M:%S',
        '%Ey': '%y',
        '%EY': '%Y',
        '%Od': '%d',
        '%Oe': '%e',
        '%OH': '%H',
        '%OI': '%I',
        '%Om': '%m',
        '%OM': '%M',
        '%OS': '%S',
        '%Ou': '%u',
        '%OU': '%U',
        '%OV': '%V',
        '%Ow': '%w',
        '%OW': '%W',
        '%Oy': '%y',
      };
      for (var r in n) c = c.replace(new RegExp(r, 'g'), n[r]);
      var v = 'Sunday Monday Tuesday Wednesday Thursday Friday Saturday'.split(' '),
        x = 'January February March April May June July August September October November December'.split(' ');
      n = {
        '%a': h => v[h.ub].substring(0, 3),
        '%A': h => v[h.ub],
        '%b': h => x[h.Ib].substring(0, 3),
        '%B': h => x[h.Ib],
        '%C': h => g(((h.Cb + 1900) / 100) | 0, 2),
        '%d': h => g(h.Lb, 2),
        '%e': h => f(h.Lb, 2, ' '),
        '%g': h => p(h).toString().substring(2),
        '%G': p,
        '%H': h => g(h.Hb, 2),
        '%I': h => {
          h = h.Hb;
          0 == h ? (h = 12) : 12 < h && (h -= 12);
          return g(h, 2);
        },
        '%j': h => {
          for (var u = 0, y = 0; y <= h.Ib - 1; u += (le(h.Cb + 1900) ? xe : ye)[y++]);
          return g(h.Lb + u, 3);
        },
        '%m': h => g(h.Ib + 1, 2),
        '%M': h => g(h.jc, 2),
        '%n': () => '\n',
        '%p': h => (0 <= h.Hb && 12 > h.Hb ? 'AM' : 'PM'),
        '%S': h => g(h.kc, 2),
        '%t': () => '\t',
        '%u': h => h.ub || 7,
        '%U': h => g(Math.floor((h.Bb + 7 - h.ub) / 7), 2),
        '%V': h => {
          var u = Math.floor((h.Bb + 7 - ((h.ub + 6) % 7)) / 7);
          2 >= (h.ub + 371 - h.Bb - 2) % 7 && u++;
          if (u) 53 == u && ((y = (h.ub + 371 - h.Bb) % 7), 4 == y || (3 == y && le(h.Cb)) || (u = 1));
          else {
            u = 52;
            var y = (h.ub + 7 - h.Bb - 1) % 7;
            (4 == y || (5 == y && le((h.Cb % 400) - 1))) && u++;
          }
          return g(u, 2);
        },
        '%w': h => h.ub,
        '%W': h => g(Math.floor((h.Bb + 7 - ((h.ub + 6) % 7)) / 7), 2),
        '%y': h => (h.Cb + 1900).toString().substring(2),
        '%Y': h => h.Cb + 1900,
        '%z': h => {
          h = h.ic;
          var u = 0 <= h;
          h = Math.abs(h) / 60;
          return (u ? '+' : '-') + String('0000' + ((h / 60) * 100 + (h % 60))).slice(-4);
        },
        '%Z': h => h.lc,
        '%%': () => '%',
      };
      c = c.replace(/%%/g, '\x00\x00');
      for (r in n) c.includes(r) && (c = c.replace(new RegExp(r, 'g'), n[r](d)));
      c = c.replace(/\0\0/g, '%');
      r = ze(c);
      if (r.length > b) return 0;
      Ae(r, a);
      return r.length - 1;
    }
    function Kc(a, b, c, d) {
      return Jc(a >>> 0, b >>> 0, c >>> 0, d >>> 0);
    }
    E || Zc();
    for (var Be = Array(256), Ce = 0; 256 > Ce; ++Ce) Be[Ce] = String.fromCharCode(Ce);
    pd = Be;
    R = B.BindingError = class extends Error {
      constructor(a) {
        super(a);
        this.name = 'BindingError';
      }
    };
    B.InternalError = class extends Error {
      constructor(a) {
        super(a);
        this.name = 'InternalError';
      }
    };
    U.push(0, 1, void 0, 1, null, 1, !0, 1, !1, 1);
    B.count_emval_handles = () => U.length / 2 - 5 - vd.length;
    var Kd = [Ic, Xc, jd, pb, qb, rb, sb, tb, ub, vb, wb, xb, yb, zb, Ab, Bb, lc, mc, Bc, Cc, Ec, Fc, Gc, Hc],
      kb,
      Y = (function () {
        function a(c, d) {
          Y = c.exports;
          Y = Pd();
          Y = De();
          Yc.push(Y.ib);
          Ya.unshift(Y.Ba);
          Ua = d;
          cb();
          return Y;
        }
        var b = Ja();
        $a++;
        if (B.instantiateWasm)
          try {
            return B.instantiateWasm(b, a);
          } catch (c) {
            H(`Module.instantiateWasm callback failed with error: ${c}`), oa(c);
          }
        fb ||= B.locateFile
          ? eb('ort-wasm-simd-threaded.jsep.wasm')
            ? 'ort-wasm-simd-threaded.jsep.wasm'
            : B.locateFile
              ? B.locateFile('ort-wasm-simd-threaded.jsep.wasm', G)
              : G + 'ort-wasm-simd-threaded.jsep.wasm'
          : new URL('ort-wasm-simd-threaded.jsep.wasm', import.meta.url).href;
        jb(b, function (c) {
          a(c.instance, c.module);
        }).catch(oa);
        return {};
      })(),
      Ld = a => (Ld = Y.Ca)(a),
      Oa = () => (Oa = Y.Da)();
    B._OrtInit = (a, b) => (B._OrtInit = Y.Ea)(a, b);
    B._OrtGetLastError = (a, b) => (B._OrtGetLastError = Y.Fa)(a, b);
    B._OrtCreateSessionOptions = (a, b, c, d, f, g, k, m, p, n) => (B._OrtCreateSessionOptions = Y.Ga)(a, b, c, d, f, g, k, m, p, n);
    B._OrtAppendExecutionProvider = (a, b) => (B._OrtAppendExecutionProvider = Y.Ha)(a, b);
    B._OrtAddFreeDimensionOverride = (a, b, c) => (B._OrtAddFreeDimensionOverride = Y.Ia)(a, b, c);
    B._OrtAddSessionConfigEntry = (a, b, c) => (B._OrtAddSessionConfigEntry = Y.Ja)(a, b, c);
    B._OrtReleaseSessionOptions = a => (B._OrtReleaseSessionOptions = Y.Ka)(a);
    B._OrtCreateSession = (a, b, c) => (B._OrtCreateSession = Y.La)(a, b, c);
    B._OrtReleaseSession = a => (B._OrtReleaseSession = Y.Ma)(a);
    B._OrtGetInputOutputCount = (a, b, c) => (B._OrtGetInputOutputCount = Y.Na)(a, b, c);
    B._OrtGetInputName = (a, b) => (B._OrtGetInputName = Y.Oa)(a, b);
    B._OrtGetOutputName = (a, b) => (B._OrtGetOutputName = Y.Pa)(a, b);
    B._OrtFree = a => (B._OrtFree = Y.Qa)(a);
    B._OrtCreateTensor = (a, b, c, d, f, g) => (B._OrtCreateTensor = Y.Ra)(a, b, c, d, f, g);
    B._OrtGetTensorData = (a, b, c, d, f) => (B._OrtGetTensorData = Y.Sa)(a, b, c, d, f);
    B._OrtReleaseTensor = a => (B._OrtReleaseTensor = Y.Ta)(a);
    B._OrtCreateRunOptions = (a, b, c, d) => (B._OrtCreateRunOptions = Y.Ua)(a, b, c, d);
    B._OrtAddRunConfigEntry = (a, b, c) => (B._OrtAddRunConfigEntry = Y.Va)(a, b, c);
    B._OrtReleaseRunOptions = a => (B._OrtReleaseRunOptions = Y.Wa)(a);
    B._OrtCreateBinding = a => (B._OrtCreateBinding = Y.Xa)(a);
    B._OrtBindInput = (a, b, c) => (B._OrtBindInput = Y.Ya)(a, b, c);
    B._OrtBindOutput = (a, b, c, d) => (B._OrtBindOutput = Y.Za)(a, b, c, d);
    B._OrtClearBoundOutputs = a => (B._OrtClearBoundOutputs = Y._a)(a);
    B._OrtReleaseBinding = a => (B._OrtReleaseBinding = Y.$a)(a);
    B._OrtRunWithBinding = (a, b, c, d, f) => (B._OrtRunWithBinding = Y.ab)(a, b, c, d, f);
    B._OrtRun = (a, b, c, d, f, g, k, m) => (B._OrtRun = Y.bb)(a, b, c, d, f, g, k, m);
    B._OrtEndProfiling = a => (B._OrtEndProfiling = Y.cb)(a);
    B._JsepOutput = (a, b, c) => (B._JsepOutput = Y.db)(a, b, c);
    B._JsepGetNodeName = a => (B._JsepGetNodeName = Y.eb)(a);
    var Ia = () => (Ia = Y.fb)(),
      zd = (B._malloc = a => (zd = B._malloc = Y.gb)(a)),
      X = (B._free = a => (X = B._free = Y.hb)(a)),
      Ka = (a, b, c, d, f, g) => (Ka = Y.kb)(a, b, c, d, f, g),
      Sa = () => (Sa = Y.lb)(),
      Vc = (a, b, c, d, f) => (Vc = Y.mb)(a, b, c, d, f),
      ad = a => (ad = Y.nb)(a),
      Qa = a => (Qa = Y.ob)(a),
      Id = () => (Id = Y.pb)(),
      dd = (a, b) => (dd = Y.qb)(a, b),
      Wc = a => (Wc = Y.rb)(a),
      Tc = a => (Tc = Y.sb)(a),
      Sc = () => (Sc = Y.tb)(),
      ed = (B.dynCall_ii = (a, b) => (ed = B.dynCall_ii = Y.vb)(a, b)),
      be = a => (be = Y.wb)(a),
      Rd = () => (Rd = Y.xb)(),
      ae = a => (ae = Y.yb)(a),
      ce = () => (ce = Y.zb)();
    B.___start_em_js = 882450;
    B.___stop_em_js = 882672;
    function De() {
      var a = Y;
      a = Object.assign({}, a);
      var b = d => f => d(f) >>> 0,
        c = d => () => d() >>> 0;
      a.Ca = b(a.Ca);
      a.fb = c(a.fb);
      a.gb = b(a.gb);
      a.emscripten_main_runtime_thread_id = c(a.emscripten_main_runtime_thread_id);
      a.sb = b(a.sb);
      a.tb = c(a.tb);
      return a;
    }
    B.stackSave = () => Sc();
    B.stackRestore = a => Wc(a);
    B.stackAlloc = a => Tc(a);
    B.UTF8ToString = K;
    B.stringToUTF8 = od;
    B.lengthBytesUTF8 = md;
    var Ee;
    bb = function Fe() {
      Ee || Ge();
      Ee || (bb = Fe);
    };
    function Ge() {
      0 < $a ||
        (E
          ? (na(B), E || cd(Ya), startWorker(B))
          : (cd(Xa), 0 < $a || Ee || ((Ee = !0), (B.calledRun = !0), I || (E || cd(Ya), na(B), E || cd(Za)))));
    }
    Ge();
    moduleRtn = pa;

    return moduleRtn;
  };
})();
export default ortWasmThreaded;
var isPthread = globalThis.self?.name === 'em-pthread';
var isNode = typeof globalThis.process?.versions?.node == 'string';
if (isNode) isPthread = (await import('worker_threads')).workerData === 'em-pthread';

// When running as a pthread, construct a new instance on startup
isPthread && ortWasmThreaded();
