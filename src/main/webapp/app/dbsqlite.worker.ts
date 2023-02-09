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
            console.log('Done initializing. Running demo...');
            postMessage({ msg: 'databaseReady', uid: '0' });
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
        dbs.set(e.data.exam, db1);
      }
      db1.addAligneImage(_sqlite3, e.data);
      break;
    }
    case 'addNonAligneImage': {
      let db1 = dbs.get(e.data.payload.examId);
      if (db1 === undefined) {
        db1 = new DB(e.data.payload.examId);
        db1.initemptyDb(_sqlite3);
        dbs.set(e.data.exam, db1);
      }
      db1.addNonAligneImage(_sqlite3, e.data);
      break;
    }

    case 'resetDatabase': {
      let db1 = dbs.get(e.data.payload.examId);
      if (db1 === undefined) {
        db1 = new DB(e.data.payload.examId);
        db1.initemptyDb(_sqlite3);
        dbs.set(e.data.exam, db1);
      }
      db1.resetDatabase(_sqlite3, e.data);
      break;
    }
    case 'removeExam': {
      let db1 = dbs.get(e.data.payload.examId);
      if (db1 === undefined) {
        db1 = new DB(e.data.payload.examId);
        db1.initemptyDb(_sqlite3);
        dbs.set(e.data.exam, db1);
      }
      db1.removeExam(_sqlite3, e.data);
      break;
    }
    case 'removeElementForExam': {
      let db1 = dbs.get(e.data.payload.examId);
      if (db1 === undefined) {
        db1 = new DB(e.data.payload.examId);
        db1.initemptyDb(_sqlite3);
        dbs.set(e.data.exam, db1);
      }
      db1.removeElementForExam(_sqlite3, e.data);
      break;
    }
    case 'export': {
      let db1 = dbs.get(e.data.payload.examId);
      if (db1 === undefined) {
        db1 = new DB(e.data.payload.examId);
        db1.initemptyDb(_sqlite3);
        dbs.set(e.data.exam, db1);
      }
      db1.export(_sqlite3, e.data);
      break;
    }
    case 'import': {
      let db1 = dbs.get(e.data.payload.examId);
      if (db1 === undefined) {
        db1 = new DB(e.data.payload.examId);
        db1.initemptyDb(_sqlite3);
        dbs.set(e.data.exam, db1);
      }
      db1.import(_sqlite3, e.data);
      break;
    }
    case 'countPageTemplate': {
      let db1 = dbs.get(e.data.payload.examId);
      if (db1 === undefined) {
        db1 = new DB(e.data.payload.examId);
        db1.initemptyDb(_sqlite3);
        dbs.set(e.data.exam, db1);
      }
      db1.countPageTemplate(_sqlite3, e.data);
      break;
    }
    case 'countAlignImage': {
      let db1 = dbs.get(e.data.payload.examId);
      if (db1 === undefined) {
        db1 = new DB(e.data.payload.examId);
        db1.initemptyDb(_sqlite3);
        dbs.set(e.data.exam, db1);
      }
      db1.countAlignImage(_sqlite3, e.data);
      break;
    }
    case 'countNonAlignImage': {
      let db1 = dbs.get(e.data.payload.examId);
      if (db1 === undefined) {
        db1 = new DB(e.data.payload.examId);
        db1.initemptyDb(_sqlite3);
        dbs.set(e.data.exam, db1);
      }
      db1.countNonAlignImage(_sqlite3, e.data);
      break;
    }
    case 'getFirstNonAlignImage': {
      let db1 = dbs.get(e.data.payload.examId);
      if (db1 === undefined) {
        db1 = new DB(e.data.payload.examId);
        db1.initemptyDb(_sqlite3);
        dbs.set(e.data.exam, db1);
      }
      db1.getFirstNonAlignImage(_sqlite3, e.data);
      break;
    }
    case 'getFirstAlignImage': {
      let db1 = dbs.get(e.data.payload.examId);
      if (db1 === undefined) {
        db1 = new DB(e.data.payload.examId);
        db1.initemptyDb(_sqlite3);
        dbs.set(e.data.exam, db1);
      }
      db1.getFirstAlignImage(_sqlite3, e.data);
      break;
    }
    case 'getFirstTemplate': {
      let db1 = dbs.get(e.data.payload.examId);
      if (db1 === undefined) {
        db1 = new DB(e.data.payload.examId);
        db1.initemptyDb(_sqlite3);
        dbs.set(e.data.exam, db1);
      }
      db1.getFirstTemplate(_sqlite3, e.data);
      break;
    }

    case 'getNonAlignImageBetweenAndSortByPageNumber': {
      let db1 = dbs.get(e.data.payload.examId);
      if (db1 === undefined) {
        db1 = new DB(e.data.payload.examId);
        db1.initemptyDb(_sqlite3);
        dbs.set(e.data.exam, db1);
      }
      db1.getNonAlignImageBetweenAndSortByPageNumber(_sqlite3, e.data);
      break;
    }

    case 'getAlignImageBetweenAndSortByPageNumber': {
      let db1 = dbs.get(e.data.payload.examId);
      if (db1 === undefined) {
        db1 = new DB(e.data.payload.examId);
        db1.initemptyDb(_sqlite3);
        dbs.set(e.data.exam, db1);
      }
      db1.getAlignImageBetweenAndSortByPageNumber(_sqlite3, e.data);
      break;
    }

    case 'getNonAlignImagesForPageNumbers': {
      let db1 = dbs.get(e.data.payload.examId);
      if (db1 === undefined) {
        db1 = new DB(e.data.payload.examId);
        db1.initemptyDb(_sqlite3);
        dbs.set(e.data.exam, db1);
      }
      db1.getNonAlignImagesForPageNumbers(_sqlite3, e.data);
      break;
    }

    case 'getAlignImagesForPageNumbers': {
      let db1 = dbs.get(e.data.payload.examId);
      if (db1 === undefined) {
        db1 = new DB(e.data.payload.examId);
        db1.initemptyDb(_sqlite3);
        dbs.set(e.data.exam, db1);
      }
      db1.getAlignImagesForPageNumbers(_sqlite3, e.data);
      break;
    }

    case 'getNonAlignSortByPageNumber': {
      let db1 = dbs.get(e.data.payload.examId);
      if (db1 === undefined) {
        db1 = new DB(e.data.payload.examId);
        db1.initemptyDb(_sqlite3);
        dbs.set(e.data.exam, db1);
      }
      db1.getNonAlignSortByPageNumber(_sqlite3, e.data);
      break;
    }

    case 'getAlignSortByPageNumber': {
      let db1 = dbs.get(e.data.payload.examId);
      if (db1 === undefined) {
        db1 = new DB(e.data.payload.examId);
        db1.initemptyDb(_sqlite3);
        dbs.set(e.data.exam, db1);
      }
      db1.getAlignSortByPageNumber(_sqlite3, e.data);
      break;
    }
    case 'addExam': {
      let db1 = dbs.get(e.data.payload.examId);
      if (db1 === undefined) {
        db1 = new DB(e.data.payload.examId);
        db1.initemptyDb(_sqlite3);
        dbs.set(e.data.exam, db1);
      }
      db1.addExam(_sqlite3, e.data);
      break;
    }
    case 'addTemplate': {
      let db1 = dbs.get(e.data.payload.examId);
      if (db1 === undefined) {
        db1 = new DB(e.data.payload.examId);
        db1.initemptyDb(_sqlite3);
        dbs.set(e.data.exam, db1);
      }
      db1.addTemplate(_sqlite3, e.data);
      break;
    }
    case 'countNonAlignWithPageNumber': {
      let db1 = dbs.get(e.data.payload.examId);
      if (db1 === undefined) {
        db1 = new DB(e.data.payload.examId);
        db1.initemptyDb(_sqlite3);
        dbs.set(e.data.exam, db1);
      }
      db1.countNonAlignWithPageNumber(_sqlite3, e.data);
      break;
    }
    case 'countAlignWithPageNumber': {
      let db1 = dbs.get(e.data.payload.examId);
      if (db1 === undefined) {
        db1 = new DB(e.data.payload.examId);
        db1.initemptyDb(_sqlite3);
        dbs.set(e.data.exam, db1);
      }
      db1.countAlignWithPageNumber(_sqlite3, e.data);
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
      //       console.log('The OPFS is available.');
    } else {
      this.db = new oo.DB('/' + this.examName + '.sqlite3', 'ct');
      //      console.log('The OPFS is not available.');
    }
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
      this.db.close();
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
      if (this.db.selectValue('select count(*) from template where page=' + payload.elt.pageNumber) > 0) {
        this.db.exec({
          sql: 'delete from template where page=' + payload.elt.pageNumber,
        });
      }
      this.db.exec({
        sql: 'INSERT INTO template(page,imageData ) VALUES (?,?)',
        bind: [payload.elt.pageNumber, payload.elt.value],
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
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
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
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
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
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
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

  // export(examId: number,options?: ExportOptions) :Promise<Blob>;

  async export(sqlite3: any, data: any) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
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
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
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
    this.db.close();
    postMessage({
      msg: data.msg,
      uid: data.uid,
    });
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
      const value = this.db.selectValue('select imageData from nonalign where page=' + payload.pageInscan);
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
      const value = this.db.selectValue('select imageData from align where page=' + payload.pageInscan);
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
      const value = this.db.selectValue('select imageData from template where page=' + payload.pageInscan);

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

  getNonAlignImagesForPageNumbers(sqlite3: any, data: any) {
    const payload = data.payload;
    // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
    if (payload.pages !== undefined && payload.pages.joins !== undefined) {
      this.initDb(sqlite3);
      try {
        const value = this.db.selectArrays(
          'select page,imageData from nonalign where page in (' + payload.pages.join(',') + ') order by page asc'
        );
        const res: any[] = [];
        value.forEach((e: any) => {
          res.push({
            pageNumber: e[0],
            examId: this.examName,
            value: e[1],
          });
        });

        postMessage({
          msg: data.msg,
          uid: data.uid,
          payload: res,
        });
      } finally {
        this.db.close();
      }
    }
  }

  getAlignImagesForPageNumbers(sqlite3: any, data: any) {
    const payload = data.payload;
    // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
    if (payload.pages !== undefined && payload.pages.joins !== undefined) {
      this.initDb(sqlite3);
      try {
        const value = this.db.selectArrays(
          'select page,imageData from align where page in (' + payload.pages.join(',') + ') order by page asc'
        );
        const res: any[] = [];
        value.forEach((e: any) => {
          res.push({
            pageNumber: e[0],
            examId: this.examName,
            value: e[1],
          });
        });

        postMessage({
          msg: data.msg,
          uid: data.uid,
          payload: res,
        });
      } finally {
        this.db.close();
      }
    }
  }

  getNonAlignImageBetweenAndSortByPageNumber(sqlite3: any, data: any) {
    const payload = data.payload;
    /*
    this.alignImages
      .where({ examId: this.examId })
      .filter(e2 => e2.pageNumber <= p1 && e2.pageNumber < p2)
      .sortBy('pageNumber');
    */
    this.initDb(sqlite3);
    try {
      const value = this.db.selectArrays(
        'select page,imageData from nonalign where page>=' + payload.p1 + ' and page <= ' + payload.p2 + ' order by page asc'
      );
      const res: any[] = [];
      value.forEach((e: any) => {
        res.push({
          pageNumber: e[0],
          examId: this.examName,
          value: e[1],
        });
      });

      postMessage({
        msg: data.msg,
        uid: data.uid,
        payload: res,
      });
    } finally {
      this.db.close();
    }
  }

  // getAlignImageBetweenAndSortByPageNumber(examId:number,p1:number, p2:number ): Promise<ImageDB[]>;
  getAlignImageBetweenAndSortByPageNumber(sqlite3: any, data: any) {
    const payload = data.payload;
    this.initDb(sqlite3);
    try {
      const value = this.db.selectArrays(
        'select page,imageData from align where page>=' + payload.p1 + ' and page <= ' + payload.p2 + ' order by page asc'
      );
      const res: any[] = [];
      value.forEach((e: any) => {
        res.push({
          pageNumber: e[0],
          examId: this.examName,
          value: e[1],
        });
      });

      postMessage({
        msg: data.msg,
        uid: data.uid,
        payload: res,
      });
    } finally {
      this.db.close();
    }
  }

  // getNonAlignSortByPageNumber(examId:number): Promise<ImageDB[]>;

  getNonAlignSortByPageNumber(sqlite3: any, data: any) {
    // const payload = data.payload
    this.initDb(sqlite3);
    try {
      const value = this.db.selectArrays('select page,imageData from nonalign order by page asc');
      const res: any[] = [];
      value.forEach((e: any) => {
        res.push({
          pageNumber: e[0],
          examId: this.examName,
          value: e[1],
        });
      });
      postMessage({
        msg: data.msg,
        uid: data.uid,
        payload: res,
      });
    } finally {
      this.db.close();
    }
  }

  // getAlignSortByPageNumber(examId:number): Promise<ImageDB[]>;

  getAlignSortByPageNumber(sqlite3: any, data: any) {
    this.initDb(sqlite3);
    try {
      const value = this.db.selectArrays('select page,imageData from align order by page asc');
      const res: any[] = [];
      value.forEach((e: any) => {
        res.push({
          pageNumber: e[0],
          examId: this.examName,
          value: e[1],
        });
      });
      postMessage({
        msg: data.msg,
        uid: data.uid,
        payload: res,
      });
    } finally {
      this.db.close();
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
      const count = this.db.selectValue('select count(*) from nonalign where page=' + payload.pageInscan);
      postMessage({
        msg: data.msg,
        uid: data.uid,
        payload: count,
      });
    } finally {
      this.db.close();
    }
  }
  // countAlignWithPageNumber(examId:number, pageInscan:number): Promise<number>;

  countAlignWithPageNumber(sqlite3: any, data: any) {
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
      this.db.close();
    }
  }
}
