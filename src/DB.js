export default class DB{
    db = null;
    DBOpenRequest = null;

    constructor(name, version) {
        Object.assign(this, { name, version });
        this.DBOpenRequest = window.indexedDB.open(name, version);
        this.DBOpenRequest.onupgradeneeded = this.onupgradeneeded.bind(this);    
    }

    onReady() {
    
        return new Promise((resolve, reject) => {
            this.DBOpenRequest.onsuccess = () => {
                this.onsuccess.call(this);
                resolve();
            };

            this.DBOpenRequest.onerror = () => {
                this.onerror.call(this);
                reject();
            };
        })
    }

    onsuccess() {

        this.db = this.DBOpenRequest.result;
        console.log('---success---');
    }

    onupgradeneeded(evt) {
        this.db = evt.target.result;
        const { name, db } = this;
        if (!db.objectStoreNames.contains(name)) {
            const objectStore = db.createObjectStore('info', { keyPath: 'id', autoIncrement: true });
            objectStore.createIndex('id', 'id', { unique: true });
            objectStore.createIndex('name', 'name');
            objectStore.createIndex('scope', 'scope');
            objectStore.createIndex('time', 'time');
            objectStore.createIndex('type', '类型');
            objectStore.createIndex('remark', 'remark');
        }
    
        console.log('---onupgradeneeded---');
    }

    onerror() {}

    add(item) {
        const request = this.objectStore.add(item);
        return new Promise((resolve, reject) => {
            request.onsuccess = resolve;
            request.onerror = reject;
        });
    }

    readAll() {
        const request = this.objectStore.openCursor();

        const list = [];

        return new Promise((resolve, reject) => {
            request.onsuccess = evt => {
                const cursor = evt.target.result
    
                if (cursor) {
                    list.push(cursor.value);
                    cursor.continue();
                } else {
                    resolve(list);
                }
            }

            request.onerror = reject;
        })
        
    }

    get objectStore() {
        if (!this.db) {
            return;
        }
        const transaction = this.db.transaction(this.db.objectStoreNames, "readwrite");
        return transaction.objectStore('info');
    }
}