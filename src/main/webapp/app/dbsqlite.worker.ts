/* eslint-disable object-shorthand */
/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable no-console */
/* eslint-disable spaced-comment */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/// <reference lib="webworker" />

const dbs = new Map<number, DB>();
let _sqlite3: any;
addEventListener('message', e => {
  switch (e.data.msg) {
    case 'hello': {
      const response = `worker response to ${e.data.msg}`;
      postMessage({ msg: response });
      break;
    }
    case 'load': {
      // Import let script
      const self1 = self as any;
      self1['Module'] = {
        scriptUrl: 'content/sqlite/sqlite3.js',
      };

      // Load and await the .js OpenCV
      self1.importScripts(self1['Module'].scriptUrl);
      const db1 = new DB(e.data.exam);
      dbs.set(e.data.exam, db1);
      self1
        .sqlite3InitModule({
          print: console.log,
          printErr: db1.error,
        })
        .then(function (sqlite3var: any) {
          _sqlite3 = sqlite3var;
          console.log('Done initializing. Running demo...');
          try {
            db1.start(_sqlite3);
          } catch (e1: any) {
            db1.error('Exception:', e1.message);
          }
        });

      break;
    }
    case 'addAligneImage': {
      const db1 = dbs.get(e.data.payload.examId);
      if (db1 !== undefined) {
        db1.addAligneImage(_sqlite3, e.data);
      } else {
        postMessage({
          msg: e.data.msg,
          uid: e.data.uid,
        });
      }
      break;
    }
    case 'addNonAligneImage': {
      const db1 = dbs.get(e.data.payload.examId);
      if (db1 !== undefined) {
        db1.addNonAligneImage(_sqlite3, e.data);
      } else {
        postMessage({
          msg: e.data.msg,
          uid: e.data.uid,
        });
      }
      break;
    }

    case 'resetDatabase': {
      const db1 = dbs.get(e.data.payload.examId);
      if (db1 !== undefined) {
        db1.resetDatabase(_sqlite3, e.data);
      } else {
        postMessage({
          msg: e.data.msg,
          uid: e.data.uid,
        });
      }
      break;
    }
    case 'removeExam': {
      const db1 = dbs.get(e.data.payload.examId);
      if (db1 !== undefined) {
        db1.removeExam(_sqlite3, e.data);
      } else {
        postMessage({
          msg: e.data.msg,
          uid: e.data.uid,
        });
      }
      break;
    }
    case 'removeElementForExam': {
      const db1 = dbs.get(e.data.payload.examId);
      if (db1 !== undefined) {
        db1.removeElementForExam(_sqlite3, e.data);
      } else {
        postMessage({
          msg: e.data.msg,
          uid: e.data.uid,
        });
      }
      break;
    }
    case 'export': {
      const db1 = dbs.get(e.data.payload.examId);
      if (db1 !== undefined) {
        db1.export(_sqlite3, e.data);
      } else {
        postMessage({
          msg: e.data.msg,
          uid: e.data.uid,
        });
      }
      break;
    }
    case 'import': {
      const db1 = dbs.get(e.data.payload.examId);
      if (db1 !== undefined) {
        db1.import(_sqlite3, e.data);
      } else {
        postMessage({
          msg: e.data.msg,
          uid: e.data.uid,
        });
      }
      break;
    }
    case 'countPageTemplate': {
      const db1 = dbs.get(e.data.payload.examId);
      if (db1 !== undefined) {
        db1.countPageTemplate(_sqlite3, e.data);
      } else {
        postMessage({
          msg: e.data.msg,
          uid: e.data.uid,
        });
      }
      break;
    }
    case 'countAlignImage': {
      const db1 = dbs.get(e.data.payload.examId);
      if (db1 !== undefined) {
        db1.countAlignImage(_sqlite3, e.data);
      } else {
        postMessage({
          msg: e.data.msg,
          uid: e.data.uid,
        });
      }
      break;
    }
    case 'countNonAlignImage': {
      const db1 = dbs.get(e.data.payload.examId);
      if (db1 !== undefined) {
        db1.countNonAlignImage(_sqlite3, e.data);
      } else {
        postMessage({
          msg: e.data.msg,
          uid: e.data.uid,
        });
      }
      break;
    }
    case 'getFirstNonAlignImage': {
      const db1 = dbs.get(e.data.payload.examId);
      if (db1 !== undefined) {
        db1.getFirstNonAlignImage(_sqlite3, e.data);
      } else {
        postMessage({
          msg: e.data.msg,
          uid: e.data.uid,
        });
      }
      break;
    }
    case 'getFirstAlignImage': {
      const db1 = dbs.get(e.data.payload.examId);
      if (db1 !== undefined) {
        db1.getFirstAlignImage(_sqlite3, e.data);
      } else {
        postMessage({
          msg: e.data.msg,
          uid: e.data.uid,
        });
      }
      break;
    }
    case 'getFirstTemplate': {
      const db1 = dbs.get(e.data.payload.examId);
      if (db1 !== undefined) {
        db1.getFirstTemplate(_sqlite3, e.data);
      } else {
        postMessage({
          msg: e.data.msg,
          uid: e.data.uid,
        });
      }
      break;
    }
    case 'getNonAlignImageBetweenAndSortByPageNumber': {
      const db1 = dbs.get(e.data.payload.examId);
      if (db1 !== undefined) {
        db1.getNonAlignImageBetweenAndSortByPageNumber(_sqlite3, e.data);
      } else {
        postMessage({
          msg: e.data.msg,
          uid: e.data.uid,
        });
      }
      break;
    }

    case 'getAlignImageBetweenAndSortByPageNumber': {
      const db1 = dbs.get(e.data.payload.examId);
      if (db1 !== undefined) {
        db1.getAlignImageBetweenAndSortByPageNumber(_sqlite3, e.data);
      } else {
        postMessage({
          msg: e.data.msg,
          uid: e.data.uid,
        });
      }
      break;
    }
    case 'getNonAlignSortByPageNumber': {
      const db1 = dbs.get(e.data.payload.examId);
      if (db1 !== undefined) {
        db1.getNonAlignSortByPageNumber(_sqlite3, e.data);
      } else {
        postMessage({
          msg: e.data.msg,
          uid: e.data.uid,
        });
      }
      break;
    }
    case 'getAlignSortByPageNumber': {
      const db1 = dbs.get(e.data.payload.examId);
      if (db1 !== undefined) {
        db1.getAlignSortByPageNumber(_sqlite3, e.data);
      } else {
        postMessage({
          msg: e.data.msg,
          uid: e.data.uid,
        });
      }
      break;
    }
    case 'addExam': {
      const db1 = dbs.get(e.data.payload.examId);
      if (db1 !== undefined) {
        db1.addExam(_sqlite3, e.data);
      } else {
        postMessage({
          msg: e.data.msg,
          uid: e.data.uid,
        });
      }
      break;
    }
    case 'addTemplate': {
      const db1 = dbs.get(e.data.payload.examId);
      if (db1 !== undefined) {
        db1.addTemplate(_sqlite3, e.data);
      } else {
        postMessage({
          msg: e.data.msg,
          uid: e.data.uid,
        });
      }
      break;
    }
    case 'countNonAlignWithPageNumber': {
      const db1 = dbs.get(e.data.payload.examId);
      if (db1 !== undefined) {
        db1.countNonAlignWithPageNumber(_sqlite3, e.data);
      } else {
        postMessage({
          msg: e.data.msg,
          uid: e.data.uid,
        });
      }
      break;
    }
    case 'countAlignWithPageNumber': {
      const db1 = dbs.get(e.data.payload.examId);
      if (db1 !== undefined) {
        db1.countAlignWithPageNumber(_sqlite3, e.data);
      } else {
        postMessage({
          msg: e.data.msg,
          uid: e.data.uid,
        });
      }
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
  counter = 0;

  constructor(public examName: number) {}

  error(...args: string[]) {
    console.error(...args);
  }

  initDb(sqlite3: any) {
    const oo = sqlite3.oo1; /*high-level OO API*/
    if (sqlite3.opfs) {
      this.db = new oo.OpfsDb('/' + this.examName + '.sqlite3');
      console.log('The OPFS is available.');
    } else {
      this.db = new oo.DB('/' + this.examName + '.sqlite3', 'ct');
      console.log('The OPFS is not available.');
    }
  }

  initemptyDb(sqlite3: any) {
    this.initDb(sqlite3);

    try {
      this.db.exec('CREATE TABLE IF NOT EXISTS template(page INTEGER NOT NULL PRIMARY KEY,imageData CLOB NOT NULL)');
      this.db.exec('CREATE TABLE IF NOT EXISTS align(page INTEGER NOT NULL PRIMARY KEY,imageData CLOB NOT NULL)');
      this.db.exec('CREATE TABLE IF NOT EXISTS nonalign(page INTEGER NOT NULL PRIMARY KEY,imageData CLOB NOT NULL)');
    } finally {
      this.db.close();
    }
  }

  start(sqlite3: any) {
    this.initDb(sqlite3);

    try {
      this.db.exec('CREATE TABLE IF NOT EXISTS template(page INTEGER NOT NULL PRIMARY KEY,imageData CLOB NOT NULL)');
      this.db.exec('CREATE TABLE IF NOT EXISTS align(page INTEGER NOT NULL PRIMARY KEY,imageData CLOB NOT NULL)');
      this.db.exec('CREATE TABLE IF NOT EXISTS nonalign(page INTEGER NOT NULL PRIMARY KEY,imageData CLOB NOT NULL)');
    } finally {
      this.db.close();
      postMessage({ msg: 'databaseReady', uid: '0', examId: +this.examName });
    }
  }

  //   addAligneImage(elt: AlignImage) :Promise<any>;

  addAligneImage(sqlite3: any, data: any) {
    const payload = data.payload;
    this.initDb(sqlite3);

    try {
      if (this.db.selectValue('select count(*) from align where page=' + payload.pageNumber) > 0) {
        this.db.exec({
          sql: 'delete from align where page=' + payload.pageNumber,
        });
      }
      this.db.exec({
        //          sql: 'INSERT INTO align(page,imageData, width, height,colorSpace ) VALUES (?,?,?,?,?)',
        sql: 'INSERT INTO align(page,imageData ) VALUES (?,?)',
        bind: [payload.pageNumber, payload.value],
        //          bind: [payload.pageNumber, payload.data.buffer, payload.width,payload.height,payload.colorSpace ],
      });
    } finally {
      this.db.close();
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
      this.db.exec({
        //        sql: 'INSERT INTO nonalign(page,imageData, width, height,colorSpace ) VALUES (?,?,?,?,?)',
        sql: 'INSERT INTO nonalign(page,imageData ) VALUES (?,?)',
        bind: [payload.pageNumber, payload.value],
        //          bind: [payload.pageNumber, payload.data.buffer, payload.width,payload.height,payload.colorSpace ],
      });
    } finally {
      this.db.close();
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
      this.db.exec({
        sql: 'INSERT INTO template(page,imageData ) VALUES (?,?)',
        bind: [payload.pageNumber, payload.value],
      });
    } finally {
      this.db.close();
      postMessage({
        msg: data.msg,
        uid: data.uid,
      });
    }
  }

  //  resetDatabase(examId : number) : Promise<void> ;

  async resetDatabase(sqlite3: any, data: any) {
    try {
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
    } finally {
      postMessage({
        msg: data.msg,
        uid: data.uid,
      });
    }
  }

  // export(examId: number,options?: ExportOptions) :Promise<Blob>;

  export(sqlite3: any, data: any) {
    const payload = data.payload;
    this.initDb(sqlite3);
    try {
    } finally {
      this.db.close();
      postMessage({
        msg: data.msg,
        uid: data.uid,
      });
    }
  }

  // import(examId: number,blob: Blob, options?: ImportOptions):Promise<void>;
  import(sqlite3: any, data: any) {
    const payload = data.payload;
    this.initDb(sqlite3);
    try {
    } finally {
      this.db.close();
      postMessage({
        msg: data.msg,
        uid: data.uid,
      });
    }
  }

  // countPageTemplate(examId:number):Promise<number>;

  countPageTemplate(sqlite3: any, data: any) {
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
      this.db.close();
    }
  }

  // countAlignImage(examId:number):Promise<number>;
  countAlignImage(sqlite3: any, data: any) {
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
      this.db.close();
    }
  }

  // countNonAlignImage(examId:number):Promise<number>;
  countNonAlignImage(sqlite3: any, data: any) {
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
      this.db.close();
    }
  }

  // getFirstNonAlignImage(examId:number,pageInscan:number ):Promise<ImageDB|undefined>;
  getFirstNonAlignImage(sqlite3: any, data: any) {
    const payload = data.payload;
    this.initDb(sqlite3);
    try {
      const value = this.db.selectValue('select imageData from nonalign where pageNumber=' + payload.pageInscan);
      postMessage({
        msg: data.msg,
        uid: data.uid,
        payload: {
          value: value,
          examId: payload.examId,
          pageNumber: payload.pageNumber,
        },
      });
    } finally {
      this.db.close();
    }
  }

  // getFirstAlignImage(examId:number,pageInscan:number ):Promise<ImageDB|undefined>;
  getFirstAlignImage(sqlite3: any, data: any) {
    const payload = data.payload;
    this.initDb(sqlite3);
    try {
      const value = this.db.selectValue('select imageData from align where pageNumber=' + payload.pageInscan);
      postMessage({
        msg: data.msg,
        uid: data.uid,
        payload: {
          value: value,
          examId: payload.examId,
          pageNumber: payload.pageNumber,
        },
      });
    } finally {
      this.db.close();
    }
  }

  // getFirstTemplate(examId:number,pageInscan:number ):Promise<Template|undefined>;

  getFirstTemplate(sqlite3: any, data: any) {
    const payload = data.payload;
    this.initDb(sqlite3);
    try {
      const value = this.db.selectValue('select imageData from template where pageNumber=' + payload.pageInscan);
      postMessage({
        msg: data.msg,
        uid: data.uid,
        payload: {
          value: value,
          examId: payload.examId,
          pageNumber: payload.pageNumber,
        },
      });
    } finally {
      this.db.close();
    }
  }

  // getNonAlignImageBetweenAndSortByPageNumber(examId:number,p1:number, p2:number ):Promise<ImageDB[]>;

  getNonAlignImageBetweenAndSortByPageNumber(sqlite3: any, data: any) {
    const payload = data.payload;
    this.initDb(sqlite3);
    try {
    } finally {
      this.db.close();
      postMessage({
        msg: data.msg,
        uid: data.uid,
      });
    }
  }

  // getAlignImageBetweenAndSortByPageNumber(examId:number,p1:number, p2:number ): Promise<ImageDB[]>;
  getAlignImageBetweenAndSortByPageNumber(sqlite3: any, data: any) {
    const payload = data.payload;
    this.initDb(sqlite3);
    try {
    } finally {
      this.db.close();
      postMessage({
        msg: data.msg,
        uid: data.uid,
      });
    }
  }

  // getNonAlignSortByPageNumber(examId:number): Promise<ImageDB[]>;

  getNonAlignSortByPageNumber(sqlite3: any, data: any) {
    // const payload = data.payload
    this.initDb(sqlite3);
    try {
    } finally {
      this.db.close();
      postMessage({
        msg: data.msg,
        uid: data.uid,
      });
    }
  }

  // getAlignSortByPageNumber(examId:number): Promise<ImageDB[]>;

  getAlignSortByPageNumber(sqlite3: any, data: any) {
    const payload = data.payload;
    this.initDb(sqlite3);
    try {
    } finally {
      this.db.close();
      postMessage({
        msg: data.msg,
        uid: data.uid,
      });
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
    const payload = data.payload;
    this.initDb(sqlite3);
    try {
    } finally {
      this.db.close();
      postMessage({
        msg: data.msg,
        uid: data.uid,
      });
    }
  }
  // countAlignWithPageNumber(examId:number, pageInscan:number): Promise<number>;

  countAlignWithPageNumber(sqlite3: any, data: any) {
    const payload = data.payload;
    this.initDb(sqlite3);
    try {
    } finally {
      this.db.close();
      postMessage({
        msg: data.msg,
        uid: data.uid,
      });
    }
  }
}
