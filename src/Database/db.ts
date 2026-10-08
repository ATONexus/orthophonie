const DB_NAME = "LindcombDB";
const DB_VERSION = 1;
const STORE_NAME = "Draft";

export interface Draft {
    id:string;
    date:string;
    severite:number|null;
    activite:string|null;
  
    renforcementPositif:number;
    renforcementNegatif:number;
    commentaire:string;
    audio?: Blob;
}

export function ouvrirDB():Promise<IDBDatabase> {
    return new Promise ((resolve,reject) => {
        const request = indexedDB.open(DB_NAME,DB_VERSION);

        request.onerror = () => {
            reject(request.error);
        };

        request.onsuccess = () => {
            resolve(request.result);
            const db = request.result;
            resolve(db);
        };

        request.onupgradeneeded = () => {
            const db = request.result;

            if(!db.objectStoreNames.contains(STORE_NAME)) {
                const store = db.createObjectStore(STORE_NAME, {keyPath: "id"});

                store.createIndex("date","date",{unique:false})
            }
        }
    })
};

export async function saveDraft(draft:Draft):Promise<number> {
    const db = await ouvrirDB();
    return new Promise((resolve,reject) => {
        const transaction = db.transaction(STORE_NAME,"readwrite");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.put(draft);
        request.onsuccess = () => {
            resolve(request.result as number);
        request.onerror = () => {
            reject(request.error) ;
            
        }
        }
    })
    
}

export async function getDraft() {
    const db = await ouvrirDB();
    
        const transaction = db.transaction(STORE_NAME,"readonly");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get("current");

        return new Promise((resolve,reject) => {

        request.onsuccess = () => {
            const draft = resolve(request.result);
            console.log(draft);
        request.onerror = () => {
            reject(request.error) ;
        }}})
        
            
        }
    
    
