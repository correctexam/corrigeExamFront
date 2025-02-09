/* eslint-disable no-console */
/* eslint-disable spaced-comment */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

/// <reference lib="webworker" />

const dbs = new Map<number, DB>();
let _sqlite3: any;
let portopenCvWorker: any;
const portWorkerPool: any[] = [];

addEventListener('message', e => {
  /* if (e.data?.payload?.examId) {
    [...dbs.keys()]
      .filter(k => k !== e.data.payload.examId)
      .forEach(k => {
        dbs.get(k)!.closeOther();
      });
  } */

  switch (e.data.msg) {
    case 'hello': {
      const response = `worker response to ${e.data.msg}`;
      postMessage({ msg: response });

      break;
    }
    case 'shareWorker': {
      const port = e.data.port; // (C)
      port.onmessage = (e1: any) => {
        switch (e1.data.msg) {
          case 'getFirstNonAlignImage': {
            let db1 = dbs.get(e1.data.payload.examId);
            if (db1 === undefined) {
              db1 = new DB(e1.data.payload.examId);
              db1.initemptyDb(_sqlite3);
              dbs.set(e1.data.payload.examId, db1);
            }
            db1.getFirstNonAlignImage(_sqlite3, e1.data, port);
            break;
          }
          case 'getFirstAlignImage': {
            let db1 = dbs.get(e1.data.payload.examId);
            if (db1 === undefined) {
              db1 = new DB(e1.data.payload.examId);
              db1.initemptyDb(_sqlite3);
              dbs.set(e1.data.payload.examId, db1);
            }
            db1.getFirstAlignImage(_sqlite3, e1.data, port);
            break;
          }
          case 'getFirstTemplate': {
            let db1 = dbs.get(e1.data.payload.examId);
            if (db1 === undefined) {
              db1 = new DB(e1.data.payload.examId);
              db1.initemptyDb(_sqlite3);
              dbs.set(e1.data.payload.examId, db1);
            }
            db1.getFirstTemplate(_sqlite3, e1.data, port);
            break;
          }
          case 'getAllTemplate': {
            let db1 = dbs.get(e1.data.payload.examId);
            if (db1 === undefined) {
              db1 = new DB(e1.data.payload.examId);
              db1.initemptyDb(_sqlite3);
              dbs.set(e1.data.payload.examId, db1);
            }
            db1.getAllTemplate(_sqlite3, e1.data, port);
            break;
          }
        }
        // (A)
        //        console.error(e1.data);
        //        port.postMessage(['hello', 'world']);
      };
      if (e.data.uid === '-1') {
        portopenCvWorker = port;
      } else {
        portWorkerPool.push(port);
      }

      break;
    }
    case 'load': {
      // Import let script
      try {
        const self1 = self as any;
        self1['Module'] = {
          scriptUrl: 'content/sqlite/sqlite3.js',
        };

        // Load and await the .js OpenCV
        self1.importScripts(self1['Module'].scriptUrl);
        // const db1 = new DB(e.data.exam);
        // dbs.set(e.data.exam, db1);
        self1
          .sqlite3InitModule({
            print: console.log,
            printErr: console.error,
          })
          .then(function (sqlite3var: any) {
            _sqlite3 = sqlite3var;
            postMessage({ msg: 'databaseReady', uid: '0' });
            portopenCvWorker.postMessage({ msg: 'databaseReady', uid: '0' });
          });
      } finally {
        //       postMessage({ msg: 'databaseNotReady', uid: '0'});
      }
      break;
    }
    case 'addAligneImage': {
      let db1 = dbs.get(e.data.payload.examId);
      if (db1 === undefined) {
        db1 = new DB(e.data.payload.examId);
        dbs.set(e.data.payload.examId, db1);
      }
      db1.addAligneImage(_sqlite3, e.data);
      break;
    }
    case 'addNonAligneImage': {
      let db1 = dbs.get(e.data.payload.examId);
      if (db1 === undefined) {
        db1 = new DB(e.data.payload.examId);
        db1.initemptyDb(_sqlite3);
        dbs.set(e.data.payload.examId, db1);
      }
      db1.addNonAligneImage(_sqlite3, e.data);
      break;
    }

    case 'resetDatabase': {
      let db1 = dbs.get(e.data.payload.examId);
      if (db1 === undefined) {
        db1 = new DB(e.data.payload.examId);
        db1.initemptyDb(_sqlite3);
        dbs.set(e.data.payload.examId, db1);
      }
      db1.resetDatabase(_sqlite3, e.data);
      break;
    }
    case 'removeExam': {
      let db1 = dbs.get(e.data.payload.examId);
      if (db1 === undefined) {
        db1 = new DB(e.data.payload.examId);
        db1.initemptyDb(_sqlite3);
        dbs.set(e.data.payload.examId, db1);
      }
      db1.removeExam(_sqlite3, e.data);
      break;
    }
    case 'removeElementForExam': {
      let db1 = dbs.get(e.data.payload.examId);
      if (db1 === undefined) {
        db1 = new DB(e.data.payload.examId);
        db1.initemptyDb(_sqlite3);
        dbs.set(e.data.payload.examId, db1);
      }
      db1.removeElementForExam(_sqlite3, e.data);
      break;
    }
    case 'removePageAlignForExam': {
      let db1 = dbs.get(e.data.payload.examId);
      if (db1 === undefined) {
        db1 = new DB(e.data.payload.examId);
        db1.initemptyDb(_sqlite3);
        dbs.set(e.data.payload.examId, db1);
      }
      db1.removePageAlignForExam(_sqlite3, e.data);
      break;
    }
    case 'removeElementForExamForPages': {
      let db1 = dbs.get(e.data.payload.examId);
      if (db1 === undefined) {
        db1 = new DB(e.data.payload.examId);
        db1.initemptyDb(_sqlite3);
        dbs.set(e.data.payload.examId, db1);
      }
      db1.removeElementForExamForPages(_sqlite3, e.data);
      break;
    }
    case 'removePageAlignForExamForPages': {
      let db1 = dbs.get(e.data.payload.examId);
      if (db1 === undefined) {
        db1 = new DB(e.data.payload.examId);
        db1.initemptyDb(_sqlite3);
        dbs.set(e.data.payload.examId, db1);
      }
      db1.removePageAlignForExamForPages(_sqlite3, e.data);
      break;
    }
    case 'removePageAlignForExamForPage': {
      let db1 = dbs.get(e.data.payload.examId);
      if (db1 === undefined) {
        db1 = new DB(e.data.payload.examId);
        db1.initemptyDb(_sqlite3);
        dbs.set(e.data.payload.examId, db1);
      }
      db1.removePageAlignForExamForPage(_sqlite3, e.data);
      break;
    }
    case 'removePageNonAlignForExamForPage': {
      let db1 = dbs.get(e.data.payload.examId);
      if (db1 === undefined) {
        db1 = new DB(e.data.payload.examId);
        db1.initemptyDb(_sqlite3);
        dbs.set(e.data.payload.examId, db1);
      }
      db1.removePageNonAlignForExamForPage(_sqlite3, e.data);
      break;
    }

    case 'removePageNonAlignForExamForPages': {
      let db1 = dbs.get(e.data.payload.examId);
      if (db1 === undefined) {
        db1 = new DB(e.data.payload.examId);
        db1.initemptyDb(_sqlite3);
        dbs.set(e.data.payload.examId, db1);
      }
      db1.removePageNonAlignForExamForPages(_sqlite3, e.data);
      break;
    }
    case 'export': {
      let db1 = dbs.get(e.data.payload.examId);
      if (db1 === undefined) {
        db1 = new DB(e.data.payload.examId);
        db1.initemptyDb(_sqlite3);
        dbs.set(e.data.payload.examId, db1);
      }
      db1.export(_sqlite3, e.data);
      break;
    }
    case 'import': {
      let db1 = dbs.get(e.data.payload.examId);
      if (db1 === undefined) {
        db1 = new DB(e.data.payload.examId);
        db1.initemptyDb(_sqlite3);
        dbs.set(e.data.payload.examId, db1);
      }
      db1.import(_sqlite3, e.data);
      break;
    }
    case 'countPageTemplate': {
      let db1 = dbs.get(e.data.payload.examId);
      if (db1 === undefined) {
        db1 = new DB(e.data.payload.examId);
        db1.initemptyDb(_sqlite3);
        dbs.set(e.data.payload.examId, db1);
      }
      db1.countPageTemplate(_sqlite3, e.data);
      break;
    }
    case 'countAlignImage': {
      let db1 = dbs.get(e.data.payload.examId);
      if (db1 === undefined) {
        db1 = new DB(e.data.payload.examId);
        db1.initemptyDb(_sqlite3);
        dbs.set(e.data.payload.examId, db1);
      }
      db1.countAlignImage(_sqlite3, e.data);
      break;
    }
    case 'countNonAlignImage': {
      let db1 = dbs.get(e.data.payload.examId);
      if (db1 === undefined) {
        db1 = new DB(e.data.payload.examId);
        db1.initemptyDb(_sqlite3);
        dbs.set(e.data.payload.examId, db1);
      }
      db1.countNonAlignImage(_sqlite3, e.data);
      break;
    }
    case 'getFirstNonAlignImage': {
      let db1 = dbs.get(e.data.payload.examId);
      if (db1 === undefined) {
        db1 = new DB(e.data.payload.examId);
        db1.initemptyDb(_sqlite3);
        dbs.set(e.data.payload.examId, db1);
      }
      db1.getFirstNonAlignImage(_sqlite3, e.data);
      break;
    }
    case 'getFirstAlignImage': {
      let db1 = dbs.get(e.data.payload.examId);
      if (db1 === undefined) {
        db1 = new DB(e.data.payload.examId);
        db1.initemptyDb(_sqlite3);
        dbs.set(e.data.payload.examId, db1);
      }
      db1.getFirstAlignImage(_sqlite3, e.data);
      break;
    }
    case 'getFirstTemplate': {
      let db1 = dbs.get(e.data.payload.examId);
      if (db1 === undefined) {
        db1 = new DB(e.data.payload.examId);
        db1.initemptyDb(_sqlite3);
        dbs.set(e.data.payload.examId, db1);
      }
      db1.getFirstTemplate(_sqlite3, e.data);
      break;
    }
    case 'getAllTemplate': {
      let db1 = dbs.get(e.data.payload.examId);
      if (db1 === undefined) {
        db1 = new DB(e.data.payload.examId);
        db1.initemptyDb(_sqlite3);
        dbs.set(e.data.payload.examId, db1);
      }
      db1.getAllTemplate(_sqlite3, e.data);
      break;
    }
    case 'getNonAlignImageBetweenAndSortByPageNumber': {
      let db1 = dbs.get(e.data.payload.examId);
      if (db1 === undefined) {
        db1 = new DB(e.data.payload.examId);
        db1.initemptyDb(_sqlite3);
        dbs.set(e.data.payload.examId, db1);
      }
      db1.getNonAlignImageBetweenAndSortByPageNumber(_sqlite3, e.data);
      break;
    }

    case 'getAlignImageBetweenAndSortByPageNumber': {
      let db1 = dbs.get(e.data.payload.examId);
      if (db1 === undefined) {
        db1 = new DB(e.data.payload.examId);
        db1.initemptyDb(_sqlite3);
        dbs.set(e.data.payload.examId, db1);
      }
      db1.getAlignImageBetweenAndSortByPageNumber(_sqlite3, e.data);
      break;
    }

    case 'getNonAlignImagesForPageNumbers': {
      let db1 = dbs.get(e.data.payload.examId);
      if (db1 === undefined) {
        db1 = new DB(e.data.payload.examId);
        db1.initemptyDb(_sqlite3);
        dbs.set(e.data.payload.examId, db1);
      }
      db1.getNonAlignImagesForPageNumbers(_sqlite3, e.data);
      break;
    }

    case 'getAlignImagesForPageNumbers': {
      let db1 = dbs.get(e.data.payload.examId);
      if (db1 === undefined) {
        db1 = new DB(e.data.payload.examId);
        db1.initemptyDb(_sqlite3);
        dbs.set(e.data.payload.examId, db1);
      }
      db1.getAlignImagesForPageNumbers(_sqlite3, e.data);
      break;
    }

    case 'getNonAlignSortByPageNumber': {
      let db1 = dbs.get(e.data.payload.examId);
      if (db1 === undefined) {
        db1 = new DB(e.data.payload.examId);
        db1.initemptyDb(_sqlite3);
        dbs.set(e.data.payload.examId, db1);
      }
      db1.getNonAlignSortByPageNumber(_sqlite3, e.data);
      break;
    }

    case 'getAlignSortByPageNumber': {
      let db1 = dbs.get(e.data.payload.examId);
      if (db1 === undefined) {
        db1 = new DB(e.data.payload.examId);
        db1.initemptyDb(_sqlite3);
        dbs.set(e.data.payload.examId, db1);
      }
      db1.getAlignSortByPageNumber(_sqlite3, e.data);
      break;
    }
    case 'addExam': {
      let db1 = dbs.get(e.data.payload.examId);
      if (db1 === undefined) {
        db1 = new DB(e.data.payload.examId);
        db1.initemptyDb(_sqlite3);
        dbs.set(e.data.payload.examId, db1);
      }
      db1.addExam(_sqlite3, e.data);
      break;
    }
    case 'addTemplate': {
      let db1 = dbs.get(e.data.payload.examId);
      if (db1 === undefined) {
        db1 = new DB(e.data.payload.examId);
        db1.initemptyDb(_sqlite3);
        dbs.set(e.data.payload.examId, db1);
      }
      db1.addTemplate(_sqlite3, e.data);
      break;
    }
    case 'countNonAlignWithPageNumber': {
      let db1 = dbs.get(e.data.payload.examId);
      if (db1 === undefined) {
        db1 = new DB(e.data.payload.examId);
        db1.initemptyDb(_sqlite3);
        dbs.set(e.data.payload.examId, db1);
      }
      db1.countNonAlignWithPageNumber(_sqlite3, e.data);
      break;
    }
    case 'countAlignWithPageNumber': {
      let db1 = dbs.get(e.data.payload.examId);
      if (db1 === undefined) {
        db1 = new DB(e.data.payload.examId);
        db1.initemptyDb(_sqlite3);
        dbs.set(e.data.payload.examId, db1);
      }
      db1.countAlignWithPageNumber(_sqlite3, e.data);
      break;
    }
    case 'moveNonAlignPages': {
      let db1 = dbs.get(e.data.payload.examId);
      if (db1 === undefined) {
        db1 = new DB(e.data.payload.examId);
        db1.initemptyDb(_sqlite3);
        dbs.set(e.data.payload.examId, db1);
      }
      db1.moveNonAlignPages(_sqlite3, e.data);
      break;
    }
    case 'moveAlignPages': {
      let db1 = dbs.get(e.data.payload.examId);
      if (db1 === undefined) {
        db1 = new DB(e.data.payload.examId);
        db1.initemptyDb(_sqlite3);
        dbs.set(e.data.payload.examId, db1);
      }
      db1.moveAlignPages(_sqlite3, e.data);
      break;
    }
    case 'removePageAlignForExamForPagesAndReorder': {
      let db1 = dbs.get(e.data.payload.examId);
      if (db1 === undefined) {
        db1 = new DB(e.data.payload.examId);
        db1.initemptyDb(_sqlite3);
        dbs.set(e.data.payload.examId, db1);
      }
      db1.removePageAlignForExamForPagesAndReorder(_sqlite3, e.data);
      break;
    }
    case 'removePageNonAlignForExamForPagesAndReorder': {
      let db1 = dbs.get(e.data.payload.examId);
      if (db1 === undefined) {
        db1 = new DB(e.data.payload.examId);
        db1.initemptyDb(_sqlite3);
        dbs.set(e.data.payload.examId, db1);
      }
      db1.removePageNonAlignForExamForPagesAndReorder(_sqlite3, e.data);
      break;
    }

    case 'moveTemplatePages': {
      let db1 = dbs.get(e.data.payload.examId);
      if (db1 === undefined) {
        db1 = new DB(e.data.payload.examId);
        db1.initemptyDb(_sqlite3);
        dbs.set(e.data.payload.examId, db1);
      }
      db1.moveTemplatePages(_sqlite3, e.data);
      break;
    }

    case 'removePageTemplateForExamForPage': {
      let db1 = dbs.get(e.data.payload.examId);
      if (db1 === undefined) {
        db1 = new DB(e.data.payload.examId);
        db1.initemptyDb(_sqlite3);
        dbs.set(e.data.payload.examId, db1);
      }
      db1.removePageTemplateForExamForPage(_sqlite3, e.data);
      break;
    }
  }
});

/*
  addTemplate(elt: AlignImage ): Promise<number>;
  countNonAlignWithPageNumber(examId:number, pageInscan:number): Promise<number>;
  countAlignWithPageNumber(examId:number, pageInscan:number): Promise<number>;
}*/

class DB {
  db: any;

  constructor(public examName: number) {}

  error(...args: string[]) {
    console.error(...args);
  }

  initDb(sqlite3: any) {
    if (this.db === undefined || !this.db.isOpen()) {
      const oo = sqlite3.oo1; /*high-level OO API*/
      if (sqlite3.opfs) {
        //        console.time('open');
        this.db = new oo.OpfsDb('/' + this.examName + '.sqlite3');
        //        console.timeEnd('open');
      } else {
        this.db = new oo.DB('/' + this.examName + '.sqlite3', 'ct');
      }
    }
  }

  close() {
    this.db.close();
  }
  closeOther() {
    //  this.db.close();
  }
  initemptyDb(sqlite3: any) {
    this.initDb(sqlite3);
    try {
      this.db.exec('CREATE TABLE IF NOT EXISTS template(page INTEGER NOT NULL PRIMARY KEY,imageData CLOB NOT NULL)');
      this.db.exec('CREATE TABLE IF NOT EXISTS align(page INTEGER NOT NULL PRIMARY KEY,imageData CLOB NOT NULL)');
      this.db.exec('CREATE TABLE IF NOT EXISTS nonalign(page INTEGER NOT NULL PRIMARY KEY,imageData CLOB NOT NULL)');
      //  this.db.exec('CREATE UNIQUE INDEX templatepage ON template(page)');
      //   this.db.exec('CREATE UNIQUE INDEX alignpage ON align(page)');
      //  this.db.exec('CREATE UNIQUE INDEX nonalignpage ON nonalign(page)');
    } finally {
      this.close();
    }
  }

  //   addAligneImage(elt: AlignImage) :Promise<any>;

  addAligneImage(sqlite3: any, data: any) {
    const payload = data.payload;
    //    console.error("addAligneImage", data.payload.pageNumber, t)
    this.initDb(sqlite3);

    try {
      if (this.db.selectValue('select count(*) from align where page=' + payload.pageNumber) > 0) {
        this.db.exec({
          sql: 'delete from align where page=' + payload.pageNumber,
        });
      }
      const enc = new TextDecoder('utf-8');
      const arr = new Uint8Array(payload.value);
      this.db.exec({
        //          sql: 'INSERT INTO align(page,imageData, width, height,colorSpace ) VALUES (?,?,?,?,?)',
        sql: 'INSERT INTO align(page,imageData ) VALUES (?,?)',
        bind: [payload.pageNumber, enc.decode(arr)],
        //          bind: [payload.pageNumber, payload.data.buffer, payload.width,payload.height,payload.colorSpace ],
      });
    } finally {
      this.close();
      postMessage({
        msg: data.msg,
        uid: data.uid,
      });
    }
  }

  //   addNonAligneImage(elt: AlignImage):Promise<any> ;

  addNonAligneImage(sqlite3: any, data: any) {
    const payload = data.payload;

    this.initDb(sqlite3);

    try {
      if (this.db.selectValue('select count(*) from nonalign where page=' + payload.pageNumber) > 0) {
        this.db.exec({
          sql: 'delete from nonalign where page=' + payload.pageNumber,
        });
      }
      const enc = new TextDecoder('utf-8');
      const arr = new Uint8Array(payload.value);
      this.db.exec({
        //        sql: 'INSERT INTO nonalign(page,imageData, width, height,colorSpace ) VALUES (?,?,?,?,?)',
        sql: 'INSERT INTO nonalign(page,imageData ) VALUES (?,?)',
        bind: [payload.pageNumber, enc.decode(arr)],
        //          bind: [payload.pageNumber, payload.data.buffer, payload.width,payload.height,payload.colorSpace ],
      });
    } finally {
      this.close();
      postMessage({
        msg: data.msg,
        uid: data.uid,
      });
    }
  }

  //   addTemplate(elt: AlignImage ): Promise<number>;

  addTemplate(sqlite3: any, data: any) {
    const payload = data.payload;
    this.initDb(sqlite3);
    try {
      if (this.db.selectValue('select count(*) from template where page=' + payload.pageNumber) > 0) {
        this.db.exec({
          sql: 'delete from template where page=' + payload.pageNumber,
        });
      }
      const enc = new TextDecoder('utf-8');
      const arr = new Uint8Array(payload.value);
      this.db.exec({
        sql: 'INSERT INTO template(page,imageData ) VALUES (?,?)',
        bind: [payload.pageNumber, enc.decode(arr)],
      });
    } finally {
      this.close();
      postMessage({
        msg: data.msg,
        uid: data.uid,
      });
    }
  }

  //  resetDatabase(examId : number) : Promise<void> ;

  async resetDatabase(sqlite3: any, data: any) {
    try {
      if (navigator.storage.getDirectory !== undefined) {
        const root = await navigator.storage.getDirectory();
        const keys = (root as any).keys();
        let next = await keys.next();
        while (next.value !== undefined) {
          if (next.value.endsWith('.sqlite3')) {
            await root.removeEntry(next.value);
          } else if (next.value.endsWith('sqlite3-journal')) {
            await root.removeEntry(next.value);
          }
          next = await keys.next();
        }
        this.initemptyDb(sqlite3);
      }
    } finally {
      postMessage({
        msg: data.msg,
        uid: data.uid,
      });
    }
  }

  // removeExam(examId: number) :Promise<void>;
  async removeExam(sqlite3: any, data: any) {
    try {
      if (navigator.storage.getDirectory !== undefined) {
        const root = await navigator.storage.getDirectory();
        const keys = (root as any).keys();
        let next = await keys.next();
        while (next.value !== undefined) {
          if (next.value === this.examName + '.sqlite3') {
            await root.removeEntry(this.examName + '.sqlite3');
          } else if (next.value === this.examName + '.sqlite3-journal') {
            await root.removeEntry(this.examName + '.sqlite3-journal');
          }
          next = await keys.next();
        }
        this.initemptyDb(sqlite3);
      }
    } finally {
      postMessage({
        msg: data.msg,
        uid: data.uid,
      });
    }
  }

  // removeElementForExam(examId: number) :Promise<void>;
  async removeElementForExam(sqlite3: any, data: any) {
    try {
      if (navigator.storage.getDirectory !== undefined) {
        const root = await navigator.storage.getDirectory();
        const keys = (root as any).keys();
        let next = await keys.next();
        while (next.value !== undefined) {
          if (next.value === this.examName + '.sqlite3') {
            await root.removeEntry(this.examName + '.sqlite3');
          } else if (next.value === this.examName + '.sqlite3-journal') {
            await root.removeEntry(this.examName + '.sqlite3-journal');
          }
          next = await keys.next();
        }
        this.initemptyDb(sqlite3);
      }
    } finally {
      postMessage({
        msg: data.msg,
        uid: data.uid,
      });
    }
  }

  // removeElementForExam(examId: number) :Promise<void>;
  removePageAlignForExam(sqlite3: any, data: any) {
    this.initDb(sqlite3);
    try {
      this.db.exec('delete from align');
      postMessage({
        msg: data.msg,
        uid: data.uid,
        payload: {},
      });
    } finally {
      this.close();
    }
  }

  removeElementForExamForPages(sqlite3: any, data: any) {
    const payload = data.payload;

    this.initDb(sqlite3);
    try {
      this.db.exec('delete from nonalign where page>=' + payload.pageStart + ' and page <= ' + payload.pageEnd + '');
      this.db.exec('delete from align where page>=' + payload.pageStart + ' and page <= ' + payload.pageEnd + '');
      postMessage({
        msg: data.msg,
        uid: data.uid,
        payload: {},
      });
    } finally {
      this.close();
    }
  }

  removePageAlignForExamForPages(sqlite3: any, data: any) {
    const payload = data.payload;

    this.initDb(sqlite3);
    try {
      this.db.exec('delete from align where page>=' + payload.pageStart + ' and page <= ' + payload.pageEnd + '');
      postMessage({
        msg: data.msg,
        uid: data.uid,
        payload: {},
      });
    } finally {
      this.close();
    }
  }

  removePageAlignForExamForPage(sqlite3: any, data: any) {
    const payload = data.payload;

    this.initDb(sqlite3);
    try {
      this.db.exec('delete from align where page=' + payload.page);
      postMessage({
        msg: data.msg,
        uid: data.uid,
        payload: {},
      });
    } finally {
      this.close();
    }
  }
  removePageNonAlignForExamForPage(sqlite3: any, data: any) {
    const payload = data.payload;

    this.initDb(sqlite3);
    try {
      this.db.exec('delete from nonalign where page=' + payload.page);
      postMessage({
        msg: data.msg,
        uid: data.uid,
        payload: {},
      });
    } finally {
      this.close();
    }
  }

  removePageNonAlignForExamForPages(sqlite3: any, data: any) {
    const payload = data.payload;

    this.initDb(sqlite3);
    try {
      this.db.exec('delete from nonalign where page>=' + payload.pageStart + ' and page <= ' + payload.pageEnd + '');
      postMessage({
        msg: data.msg,
        uid: data.uid,
        payload: {},
      });
    } finally {
      this.close();
    }
  }

  // export(examId: number,options?: ExportOptions) :Promise<Blob>;

  async export(sqlite3: any, data: any) {
    if (navigator.storage.getDirectory !== undefined) {
      const root = await navigator.storage.getDirectory();
      const keys = (root as any).keys();
      let next = await keys.next();
      while (next.value !== undefined) {
        if (next.value === this.examName + '.sqlite3') {
          const savedFile = await root.getFileHandle(this.examName + '.sqlite3'); // Surprisingly there isn't a "fileExists()" function: instead you need to iterate over all files, which is odd... https://wicg.github.io/file-system-access/
          const dbFile = await savedFile.getFile();
          const arrayBuffer = await dbFile.arrayBuffer();

          const blob = new Blob([new Uint8Array(arrayBuffer)], { type: dbFile.type });
          postMessage({
            msg: data.msg,
            uid: data.uid,
            payload: blob,
          });
          break;
        }
        next = await keys.next();
      }
    } else {
      postMessage({
        msg: data.msg,
        uid: data.uid,
      });
    }
  }

  // import(examId: number,blob: Blob, options?: ImportOptions):Promise<void>;
  async import(sqlite3: any, data: any) {
    const payload = data.payload;
    const blob = payload.blob;

    if (navigator.storage.getDirectory !== undefined) {
      const root = await navigator.storage.getDirectory();
      const keys = (root as any).keys();
      let next = await keys.next();
      while (next.value !== undefined) {
        if (next.value === this.examName + '.sqlite3') {
          await root.removeEntry(this.examName + '.sqlite3');
        } else if (next.value === this.examName + '.sqlite3-journal') {
          await root.removeEntry(this.examName + '.sqlite3-journal');
        }
        next = await keys.next();
      }

      const newFile = await root.getFileHandle(this.examName + '.sqlite3', { create: true });

      // Open the `mywaifu.png` file as a writable stream ( FileSystemWritableFileStream ):
      const wtr = await (newFile as any).createWritable();
      try {
        // Then write the Blob object directly:
        await wtr.write(blob);
      } finally {
        // And safely close the file stream writer:
        await wtr.close();
      }
    }

    //    const payload = data.payload;
    this.initDb(sqlite3);
    this.close();
    postMessage({
      msg: data.msg,
      uid: data.uid,
    });
  }

  // countPageTemplate(examId:number):Promise<number>;

  countPageTemplate(sqlite3: any, data: any) {
    //    console.error("countPageTemplate")

    // const payload = data.payload
    this.initDb(sqlite3);
    try {
      const count = this.db.selectValue('select count(*) from template');
      postMessage({
        msg: data.msg,
        uid: data.uid,
        payload: count,
      });
    } finally {
      this.close();
    }
  }

  // countAlignImage(examId:number):Promise<number>;
  countAlignImage(sqlite3: any, data: any) {
    //    console.error("countAlignImage")

    //  const payload = data.payload
    this.initDb(sqlite3);
    try {
      const count = this.db.selectValue('select count(*) from align');
      postMessage({
        msg: data.msg,
        uid: data.uid,
        payload: count,
      });
    } finally {
      this.close();
    }
  }

  // countNonAlignImage(examId:number):Promise<number>;
  countNonAlignImage(sqlite3: any, data: any) {
    //    console.error("countNonAlignImage")

    // const payload = data.payload
    this.initDb(sqlite3);
    try {
      const count = this.db.selectValue('select count(*) from nonalign');
      postMessage({
        msg: data.msg,
        uid: data.uid,
        payload: count,
      });
    } finally {
      this.close();
    }
  }

  // getFirstNonAlignImage(examId:number,pageInscan:number ):Promise<ImageDB|undefined>;
  getFirstNonAlignImage(sqlite3: any, data: any, port?: any) {
    //    console.error("getFirstNonAlignImage",data.payload.pageInscan, t)

    const payload = data.payload;
    this.initDb(sqlite3);
    try {
      const value = this.db.selectValue('select imageData from nonalign where page=' + payload.pageInscan);
      const enc = new TextEncoder(); // always utf-8
      const v = enc.encode(value).buffer;
      if (port) {
        port.postMessage(
          {
            msg: data.msg,
            uid: data.uid,
            payload: {
              value: v,
              examId: payload.examId,
              pageNumber: payload.pageNumber,
            },
          },
          [v],
        );
      } else {
        postMessage(
          {
            msg: data.msg,
            uid: data.uid,
            payload: {
              value: v,
              examId: payload.examId,
              pageNumber: payload.pageNumber,
            },
          },
          [v],
        );
      }
    } finally {
      this.close();
    }
  }

  // getFirstAlignImage(examId:number,pageInscan:number ):Promise<ImageDB|undefined>;
  getFirstAlignImage(sqlite3: any, data: any, port?: any) {
    const payload = data.payload;
    this.initDb(sqlite3);
    try {
      const value = this.db.selectValue('select imageData from align where page=' + payload.pageInscan);
      const enc = new TextEncoder(); // always utf-8
      const v = enc.encode(value).buffer;
      if (port) {
        port.postMessage(
          {
            msg: data.msg,
            uid: data.uid,
            payload: {
              value: v,
              examId: payload.examId,
              pageNumber: payload.pageNumber,
            },
          },
          [v],
        );
      } else {
        postMessage(
          {
            msg: data.msg,
            uid: data.uid,
            payload: {
              value: v,
              examId: payload.examId,
              pageNumber: payload.pageNumber,
            },
          },
          [v],
        );
      }
    } finally {
      this.close();
    }
  }

  // getFirstTemplate(examId:number,pageInscan:number ):Promise<Template|undefined>;

  getFirstTemplate(sqlite3: any, data: any, port?: any) {
    const payload = data.payload;
    this.initDb(sqlite3);
    try {
      const value = this.db.selectValue('select imageData from template where page=' + payload.pageInscan);
      const enc = new TextEncoder(); // always utf-8
      const v = enc.encode(value).buffer;
      if (port) {
        port.postMessage(
          {
            msg: data.msg,
            uid: data.uid,
            payload: {
              value: v,
              examId: payload.examId,
              pageNumber: payload.pageNumber,
            },
          },
          [v],
        );
      } else {
        postMessage(
          {
            msg: data.msg,
            uid: data.uid,
            payload: {
              value: v,
              examId: payload.examId,
              pageNumber: payload.pageNumber,
            },
          },
          [v],
        );
      }
    } finally {
      this.close();
    }
  }

  getAllTemplate(sqlite3: any, data: any, port?: any) {
    //    const payload = data.payload;
    this.initDb(sqlite3);
    try {
      const value = this.db.selectArrays('select page,imageData from template order by page asc');
      const res: any[] = [];
      const enc = new TextEncoder(); // always utf-8
      const transfarable: any[] = [];

      value.forEach((e: any) => {
        const v = enc.encode(e[1]).buffer;
        transfarable.push(v);
        res.push({
          pageNumber: e[0],
          examId: this.examName,
          value: v,
        });
      });

      if (port) {
        port.postMessage(
          {
            msg: data.msg,
            uid: data.uid,
            payload: res,
          },
          transfarable,
        );
      } else {
        postMessage(
          {
            msg: data.msg,
            uid: data.uid,
            payload: res,
          },
          transfarable,
        );
      }
    } finally {
      this.close();
    }
  }

  // getNonAlignImageBetweenAndSortByPageNumber(examId:number,p1:number, p2:number ):Promise<ImageDB[]>;

  getNonAlignImagesForPageNumbers(sqlite3: any, data: any) {
    const payload = data.payload;

    if (payload.pages !== undefined && payload.pages.joins !== undefined) {
      this.initDb(sqlite3);
      try {
        const value = this.db.selectArrays(
          'select page,imageData from nonalign where page in (' + payload.pages.join(',') + ') order by page asc',
        );
        const res: any[] = [];
        const enc = new TextEncoder(); // always utf-8
        const transfarable: any[] = [];

        value.forEach((e: any) => {
          const v = enc.encode(e[1]).buffer;
          transfarable.push(v);
          res.push({
            pageNumber: e[0],
            examId: this.examName,
            value: v,
          });
        });

        postMessage(
          {
            msg: data.msg,
            uid: data.uid,
            payload: res,
          },
          transfarable,
        );
      } finally {
        this.close();
      }
    } else {
      postMessage({
        msg: data.msg,
        uid: data.uid,
      });
    }
  }

  getAlignImagesForPageNumbers(sqlite3: any, data: any) {
    const payload = data.payload;

    if (payload.pages !== undefined && payload.pages.joins !== undefined) {
      this.initDb(sqlite3);
      try {
        const value = this.db.selectArrays(
          'select page,imageData from align where page in (' + payload.pages.join(',') + ') order by page asc',
        );
        const res: any[] = [];
        const enc = new TextEncoder(); // always utf-8
        const transfarable: any[] = [];

        value.forEach((e: any) => {
          const v = enc.encode(e[1]).buffer;
          transfarable.push(v);

          res.push({
            pageNumber: e[0],
            examId: this.examName,
            value: v,
          });
        });

        postMessage(
          {
            msg: data.msg,
            uid: data.uid,
            payload: res,
          },
          transfarable,
        );
      } finally {
        this.close();
      }
    } else {
      postMessage({
        msg: data.msg,
        uid: data.uid,
      });
    }
  }

  getNonAlignImageBetweenAndSortByPageNumber(sqlite3: any, data: any) {
    const payload = data.payload;
    this.initDb(sqlite3);
    try {
      const value = this.db.selectArrays(
        'select page,imageData from nonalign where page>=' + payload.p1 + ' and page <= ' + payload.p2 + ' order by page asc',
      );
      const res: any[] = [];
      const enc = new TextEncoder(); // always utf-8
      const transfarable: any[] = [];

      value.forEach((e: any) => {
        const v = enc.encode(e[1]).buffer;
        transfarable.push(v);
        res.push({
          pageNumber: e[0],
          examId: this.examName,
          value: v,
        });
      });

      postMessage(
        {
          msg: data.msg,
          uid: data.uid,
          payload: res,
        },
        transfarable,
      );
    } finally {
      this.close();
    }
  }

  // getAlignImageBetweenAndSortByPageNumber(examId:number,p1:number, p2:number ): Promise<ImageDB[]>;
  getAlignImageBetweenAndSortByPageNumber(sqlite3: any, data: any) {
    const payload = data.payload;
    this.initDb(sqlite3);
    try {
      const value = this.db.selectArrays(
        'select page,imageData from align where page>=' + payload.p1 + ' and page <= ' + payload.p2 + ' order by page asc',
      );
      const res: any[] = [];
      const enc = new TextEncoder(); // always utf-8
      const transfarable: any[] = [];

      value.forEach((e: any) => {
        const v = enc.encode(e[1]).buffer;
        transfarable.push(v);
        res.push({
          pageNumber: e[0],
          examId: this.examName,
          value: v,
        });
      });

      postMessage(
        {
          msg: data.msg,
          uid: data.uid,
          payload: res,
        },
        transfarable,
      );
    } finally {
      this.close();
    }
  }

  // getNonAlignSortByPageNumber(examId:number): Promise<ImageDB[]>;

  getNonAlignSortByPageNumber(sqlite3: any, data: any) {
    //    console.error("getNonAlignSortByPageNumber")

    // const payload = data.payload
    this.initDb(sqlite3);
    try {
      const value = this.db.selectArrays('select page,imageData from nonalign order by page asc');
      const res: any[] = [];
      const enc = new TextEncoder(); // always utf-8
      const transfarable: any[] = [];

      value.forEach((e: any) => {
        const v = enc.encode(e[1]).buffer;
        transfarable.push(v);

        res.push({
          pageNumber: e[0],
          examId: this.examName,
          value: v,
        });
      });
      postMessage(
        {
          msg: data.msg,
          uid: data.uid,
          payload: res,
        },
        transfarable,
      );
    } finally {
      this.close();
    }
  }

  // getAlignSortByPageNumber(examId:number): Promise<ImageDB[]>;

  getAlignSortByPageNumber(sqlite3: any, data: any) {
    //    console.error("getAlignSortByPageNumber")

    this.initDb(sqlite3);
    try {
      const value = this.db.selectArrays('select page,imageData from align order by page asc');
      const res: any[] = [];
      const enc = new TextEncoder(); // always utf-8
      const transfarable: any[] = [];

      value.forEach((e: any) => {
        const v = enc.encode(e[1]).buffer;
        transfarable.push(v);

        res.push({
          pageNumber: e[0],
          examId: this.examName,
          value: v,
        });
      });
      postMessage(
        {
          msg: data.msg,
          uid: data.uid,
          payload: res,
        },
        transfarable,
      );
    } finally {
      this.close();
    }
  }

  // addExam(examId:number): Promise<number>;

  addExam(sqlite3: any, data: any) {
    try {
      this.initemptyDb(sqlite3);
    } finally {
      postMessage({
        msg: data.msg,
        uid: data.uid,
      });
    }
  }

  // countNonAlignWithPageNumber(examId:number, pageInscan:number): Promise<number>;

  countNonAlignWithPageNumber(sqlite3: any, data: any) {
    //    console.error("countNonAlignWithPageNumber")

    const payload = data.payload;
    this.initDb(sqlite3);
    try {
      const count = this.db.selectValue('select count(*) from nonalign where page=' + payload.pageInscan);
      postMessage({
        msg: data.msg,
        uid: data.uid,
        payload: count,
      });
    } finally {
      this.close();
    }
  }
  // countAlignWithPageNumber(examId:number, pageInscan:number): Promise<number>;

  countAlignWithPageNumber(sqlite3: any, data: any) {
    //    console.error("countAlignWithPageNumber")

    const payload = data.payload;
    this.initDb(sqlite3);
    try {
      const count = this.db.selectValue('select count(*) from align where page=' + payload.pageInscan);
      postMessage({
        msg: data.msg,
        uid: data.uid,
        payload: count,
      });
    } finally {
      this.close();
    }
  }

  moveNonAlignPages(sqlite3: any, data: any) {
    const payload = data.payload;
    this.initDb(sqlite3);
    if (payload.from !== payload.to) {
      try {
        const count = this.db.selectValue('update nonalign  set page=-1000 where page=' + payload.from);
        if (payload.from < payload.to) {
          this.db.selectValue('update nonalign  set page=page-1 where page>' + payload.from + ' and page<=' + payload.to);
          //          console.error(count1);
        } else {
          this.db.selectValue('update nonalign  set page=page+1 where page<' + payload.from + ' and page>=' + payload.to);
          // console.error(count2);
        }
        this.db.selectValue('update nonalign set page=' + payload.to + ' where page=-1000');
        //  console.error(count3);
        postMessage({
          msg: data.msg,
          uid: data.uid,
          payload: count,
        });
      } finally {
        this.close();
      }
    } else {
      postMessage({
        msg: data.msg,
        uid: data.uid,
        payload: 0,
      });
    }
  }
  moveAlignPages(sqlite3: any, data: any) {
    const payload = data.payload;

    this.initDb(sqlite3);
    if (payload.from !== payload.to) {
      try {
        const count = this.db.selectValue('update align  set page=-1000 where page=' + payload.from);
        if (payload.from < payload.to) {
          this.db.selectValue('update align  set page=page-1 where page>' + payload.from + ' and page<=' + payload.to);
        } else {
          this.db.selectValue('update align  set page=page+1 where page<' + payload.from + ' and page>=' + payload.to);
        }
        this.db.selectValue('update align set page=' + payload.to + ' where page=-1000');
        postMessage({
          msg: data.msg,
          uid: data.uid,
          payload: count,
        });
      } finally {
        this.close();
      }
    } else {
      postMessage({
        msg: data.msg,
        uid: data.uid,
        payload: 0,
      });
    }
  }

  removePageAlignForExamForPagesAndReorder(sqlite3: any, data: any) {
    const payload = data.payload;
    this.initDb(sqlite3);
    const pages = payload.pages;
    try {
      const totalpage = this.db.selectValue('select count(*) from align');

      this.db.exec('delete from align where page IN (' + pages.join(',') + ')');

      const pagesorder = pages.sort((a: number, b: number) => a - b);
      for (let i = 0; i < pages.length; i++) {
        let max = totalpage;
        let keepuper = true;
        if (i < pagesorder.length - 1) {
          max = pagesorder[i + 1];
          keepuper = false;
        }
        const min = pagesorder[i];
        if (min !== max) {
          if (keepuper) {
            this.db.selectValue('update align  set page=page-' + (i + 1) + ' where page>' + min + ' and page<=' + max);
          } else {
            this.db.selectValue('update align  set page=page-' + (i + 1) + ' where page>' + min + ' and page<' + max);
          }
        }
      }
      postMessage({
        msg: data.msg,
        uid: data.uid,
      });
    } finally {
      this.close();
    }
  }
  removePageNonAlignForExamForPagesAndReorder(sqlite3: any, data: any) {
    const payload = data.payload;
    this.initDb(sqlite3);
    const pages = payload.pages;
    try {
      const totalpage = this.db.selectValue('select count(*) from nonalign');

      this.db.exec('delete from nonalign where page IN (' + pages.join(',') + ')');

      const pagesorder = pages.sort((a: number, b: number) => a - b);
      for (let i = 0; i < pages.length; i++) {
        let max = totalpage;
        let keepuper = true;
        if (i < pagesorder.length - 1) {
          max = pagesorder[i + 1];
          keepuper = false;
        }
        const min = pagesorder[i];
        if (min !== max) {
          if (keepuper) {
            this.db.selectValue('update nonalign  set page=page-' + (i + 1) + ' where page>' + min + ' and page<=' + max);
          } else {
            this.db.selectValue('update nonalign  set page=page-' + (i + 1) + ' where page>' + min + ' and page<' + max);
          }
        }
      }
      postMessage({
        msg: data.msg,
        uid: data.uid,
      });
    } finally {
      this.close();
    }
  }

  moveTemplatePages(sqlite3: any, data: any) {
    const payload = data.payload;

    this.initDb(sqlite3);
    if (payload.from !== payload.to) {
      try {
        const count = this.db.selectValue('update template  set page=-1000 where page=' + payload.from);
        if (payload.from < payload.to) {
          this.db.selectValue('update template  set page=page-1 where page>' + payload.from + ' and page<=' + payload.to);
        } else {
          this.db.selectValue('update template  set page=page+1 where page<' + payload.from + ' and page>=' + payload.to);
        }
        this.db.selectValue('update template set page=' + payload.to + ' where page=-1000');
        postMessage({
          msg: data.msg,
          uid: data.uid,
          payload: count,
        });
      } finally {
        this.close();
      }
    } else {
      postMessage({
        msg: data.msg,
        uid: data.uid,
      });
    }
  }
  removePageTemplateForExamForPage(sqlite3: any, data: any) {
    const payload = data.payload;

    this.initDb(sqlite3);
    try {
      this.db.exec('delete from template where page>=' + payload.pageStart + ' and page <= ' + payload.pageEnd + '');
      postMessage({
        msg: data.msg,
        uid: data.uid,
        payload: {},
      });
    } finally {
      this.close();
    }
  }
}
