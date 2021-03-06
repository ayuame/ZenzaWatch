import {workerUtil} from './workerUtil';
//===BEGIN===
const IndexedDbStorage = (() => {
  const workerFunc = function(self) {
    const db = {};

    const controller = {
      async init({name, ver, stores}) {
        if (db[name]) {
          return Promise.resolve(db[name]);
        }
        return new Promise((resolve, reject) => {
          const req = indexedDB.open(name, ver);
          req.onupgradeneeded = e => {
            const _db = e.target.result;

            for (const meta of stores) {
              if(_db.objectStoreNames.contains(meta.name)) {
                _db.deleteObjectStore(meta.name);
              }
              const store = _db.createObjectStore(meta.name, meta.definition);
              const indexes = meta.indexes || [];
              for (const idx of indexes) {
                store.createIndex(idx.name, idx.keyPath, idx.params);
              }
              store.transaction.oncomplete = () => {
                console.log('store.transaction.complete', JSON.stringify({name, ver, store: meta}));
              };
            }
          };
          req.onsuccess = e => {
            db[name] = e.target.result;
            resolve(db[name]);
          };
          req.onerror = reject;
        });
      },
      close({name}) {
        if (!db[name]) {
          return;
        }
        db[name].close();
        db[name] = null;
      },
      async getStore({name, storeName, mode = 'readonly'}) {
        const db = await this.init({name});
        return new Promise(async (resolve, reject) => {
          const tx = db.transaction(storeName, mode);
          tx.onerror = reject;
          return resolve({
            store: tx.objectStore(storeName),
            transaction: tx
          });
        });
      },
      async put({name, storeName, data}) {
        const {store, transaction} = await this.getStore({name, storeName, mode: 'readwrite'});
        return new Promise((resolve, reject) => {
          const req = store.put(data);
          req.onsuccess = e => {
            transaction.commit && transaction.commit();
            resolve(e.target.result);
          };
          req.onerror = reject;
        });
      },
      async get({name, storeName, data: {key, index, timeout}}) {
        const {store} = await this.getStore({name, storeName});
        // console.log('get', {name, storeName, key, index, timeout});
        return new Promise((resolve, reject) => {
          const req =
            index ?
              store.index(index).get(key) : store.get(key);
          req.onsuccess = e => resolve(e.target.result);
          req.onerror = reject;
          if (timeout) {
            setTimeout(() => {
              reject(`timeout: key${key}`);
            }, timeout);
          }
        });
      },
      // データ取得しつつupdatedAt更新
      async updateTime({name, storeName, data: {key, index, timeout}}) {
        const record = await this.get({name, storeName, data: {key, index, timeout}});
        if (!record) {
          return null;
        }
        record.updatedAt = Date.now();
        this.put({name, storeName, data: record});
        return record;
      },
      async delete({name, storeName, data: {key, index}}) {
        const {store, transaction} = await this.getStore({name, storeName, mode: 'readwrite'});
        return new Promise((resolve, reject) => {
          let remove = 0;
          let range = IDBKeyRange.only(key);
          let req =
            index ?
              store.index(index).openCursor(range) : store.openCursor(range);
          req.onsuccess = e =>  {
            const result = e.target.result;
            if (!result) {
              transaction.commit && transaction.commit();
              return resolve(remove > 0);
            }
            result.delete();
            remove++;
            result.continue();
          };
          req.onerror = reject;
        });
      },
      async clear({name, storeName}) {
        const {store} = await this.getStore({name, storeName, mode: 'readwrite'});
        return new Promise((resolve, reject) => {
          const req = store.clear();
          req.onsuccess = e => {
            console.timeEnd('storage clear');
            resolve();
          };
          req.onerror = e => {
            console.timeEnd('storage clear');
            reject(e);
          };
        });
      },
      async gc({name, storeName, data: {expireTime, index}}) {
        index = index || 'updatedAt';
        const {store, transaction} = await this.getStore({name, storeName, mode: 'readwrite'});
        const now = Date.now(), ptime = performance.now();
        const expiresAt = (index !== 'expiresAt') ? (now - expireTime) : now;
        const expireDateTime = new Date(expiresAt).toLocaleString();
        const timekey = `GC [DELETE FROM ${name}.${storeName} WHERE ${index} < '${expireDateTime}'] `;
        console.time(timekey);
        let count = 0;
        return new Promise((resolve, reject) => {
          const range = IDBKeyRange.upperBound(expiresAt);
          const idx = store.index(index);
          const req = idx.openCursor(range);
          req.onsuccess = e => {
            const cursor = e.target.result;
            if (cursor) {
              count++;
              cursor.delete();
              return cursor.continue();
            }
            console.timeEnd(timekey);
            resolve({status: 'ok', count, time: performance.now() - ptime});
            count && console.log('deleted %s records.', count);
          };
          req.onerror = reject;
        }).catch(e => {
          console.error('gc fail', {name, storeName, data: {expireTime, index}, timekey}, e);
          store.clear();
        });
      }

    };

    self.onmessage = async ({command, params}) => {
      try {
      switch (command) {
        case 'init':
          await controller[command](params);
          return 'ok';
        case 'put':
          return controller.put(params);
        case 'updateTime':
        case 'get':
          return controller[command](params);
        default:
          return controller[command](params) || 'ok';
        }
      } catch (err) {
        console.warn('command failed: ', {command, params});
        throw err;
      }
    };
    return controller;
  };

  const workers = new Map;
  const open = async ({name, ver, stores}, func) => {
    let worker;
    if (func) {
      let _func = workerFunc;
      if (func) {
        _func = `
        (() => {
        const controller = (${workerFunc.toString()})(self);
        (${func.toString()})(self)
        })
        `;
      }
      worker = workers.get(func) || workerUtil.createCrossMessageWorker(_func, {name: `IndexedDb[${name}]`});
      workers.set(func, worker);
    } else {
      worker = workers.get(workerFunc) || workerUtil.createCrossMessageWorker(workerFunc, {name: 'IndexedDb'});
      workers.set(workerFunc, worker);
    }

    worker.post({command: 'init', params: {name, ver, stores}});

    const post = (command, data, storeName, transfer) => {
      const params = {data, name, storeName, transfer};
      return worker.post({command, params}, transfer);
    };

    const result = {worker};
    for (const meta of stores) {
      const storeName = meta.name;
      result[storeName] = (storeName => {
        return {
          close: params => post('close', params, storeName),
          put: (record, transfer) => post('put', record, storeName, transfer),
          get: ({key, index, timeout}) => post('get', {key, index, timeout}, storeName),
          updateTime: ({key, index, timeout}) => post('updateTime', {key, index, timeout}, storeName),
          delete: ({key, index, timeout}) => post('delete', {key, index, timeout}, storeName),
          gc: (expireTime = 30 * 24 * 60 * 60 * 1000, index = 'updatedAt') => post('gc', {expireTime, index}, storeName)
        };
      })(storeName);
    }
    return result;
  };
  return {open};
})();


//===END===

export {IndexedDbStorage};