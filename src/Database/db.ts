const DB_NAME = "LindcombDB";
const DB_VERSION = 1;
const STORE_NAME_DRAFT = "Draft";
const STORE_NAME_SESSIONS = "Sessions";

//DB Draft

export type Draft = {
  id: string;
  date: string;
  severite: number | null;
  activite: string | null;
  renforcementPositif: number;
  renforcementNegatif: number;
  commentaire: string;
  audio?: Blob | null;
};

export function ouvrirDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

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

      if (!db.objectStoreNames.contains(STORE_NAME_DRAFT)) {
        const store = db.createObjectStore(STORE_NAME_DRAFT, { keyPath: "id" });

        store.createIndex("date", "date", { unique: true });
      }
      if (!db.objectStoreNames.contains(STORE_NAME_SESSIONS)) {
        const storeSessions = db.createObjectStore(STORE_NAME_SESSIONS, {
          keyPath: "id",
          autoIncrement: true,
        });
        storeSessions.createIndex("date", "date", { unique: true });
      }
    };
  });
}

export async function saveDraft(draft: Draft): Promise<number> {
  const db = await ouvrirDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME_DRAFT, "readwrite");
    const store = transaction.objectStore(STORE_NAME_DRAFT);
    const request = store.put(draft);
    request.onsuccess = () => {
      resolve(request.result as number);
      console.log("Draft saved successfully:", draft);
      request.onerror = () => {
        reject(request.error);
      };
    };
  });
}

export async function getDraft(): Promise<Draft | undefined> {
  const db = await ouvrirDB();
  try {
    const transaction = db.transaction(STORE_NAME_DRAFT, "readonly");
    const store = transaction.objectStore(STORE_NAME_DRAFT);
    const request = store.get("current");

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        const draft = resolve(request.result as Draft | undefined);
        console.log(draft);
        request.onerror = () => {
          reject(request.error);
        };
      };
    });
  } finally {
    db.close();
  }
}

export async function clearDraft(): Promise<Draft | undefined> {
  const db = await ouvrirDB();
  try {
    const transaction = db.transaction(STORE_NAME_DRAFT, "readwrite");
    const store = transaction.objectStore(STORE_NAME_DRAFT);
    const request = store.delete("current");

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        const draft = resolve(request.result as Draft | undefined);
        console.log(draft);
        request.onerror = () => {
          reject(request.error);
        };
      };
    });
  } finally {
    db.close();
  }
}

//DB Sessions

export type Session = {
  id?: number;
  date: string;
  severite: number | null;
  activite: string | null;
  renforcementPositif: number;
  renforcementNegatif: number;
  commentaire: string;
  audio?: Blob | null;
};

export async function saveSession(session: Session): Promise<number> {
  const db = await ouvrirDB();

  try {
    // 1. Vérifier si une séance existe déjà à cette date
    const exist = await getSessionByDate(session.date);

    console.log("Session existante :", exist);

    // 2. Ouvrir la transaction après la vérification
    return await new Promise<number>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME_SESSIONS, "readwrite");

      const store = transaction.objectStore(STORE_NAME_SESSIONS);

      // 3. Mettre à jour ou ajouter la séance
      const request = exist
        ? store.put({ ...session, id: exist.id })
        : store.add(session);

      request.onsuccess = () => {
        console.log(
          exist ? "Session mise à jour :" : "Session enregistrée :",
          session,
        );
        resolve(request.result as number);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  } finally {
    db.close();
  }
}

export async function getSession(): Promise<Session[] | undefined> {
  const db = await ouvrirDB();
  try {
    const transaction = db.transaction(STORE_NAME_SESSIONS, "readonly");
    const store = transaction.objectStore(STORE_NAME_SESSIONS);
    const request = store.getAll();

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        const sessions = request.result as Session[] | undefined;
        resolve(sessions);
        console.log(sessions);
        request.onerror = () => {
          reject(request.error);
        };
      };
    });
  } finally {
    db.close();
  }
}

export async function getSessionByDate(
  date: string,
): Promise<Session | undefined> {
  const db = await ouvrirDB();

  try {
    const transaction = db.transaction(STORE_NAME_SESSIONS, "readonly");

    const store = transaction.objectStore(STORE_NAME_SESSIONS);
    const request = store.index("date").get(date);

    return await new Promise((resolve, reject) => {
      request.onsuccess = () => {
        resolve(request.result as Session | undefined);
      };

      request.onerror = () => reject(request.error);
    });
  } finally {
    db.close();
  }
}
