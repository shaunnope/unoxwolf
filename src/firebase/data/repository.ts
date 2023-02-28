import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, query, where } from 'firebase/firestore/lite';

import { log } from "../../utils/logger";
import { SavedText, User } from "../../app/types";

const firebaseConfig = JSON.parse(process.env.FB_CONFIG!);

class Database {
    private readonly app = initializeApp(firebaseConfig);
    // private readonly analytics = getAnalytics(this.app);
    private readonly db = getFirestore(this.app);

    public async getCollection(index: string) {
        const col = collection(this.db, index);
        const snapshot = await getDocs(col);
        const list = snapshot.docs.map(doc => doc.data());
        return list;
    }

    public async addUser(user: User) {
        try {
            const docRef = await addDoc(collection(this.db, "users"), user);
            log.info("Message saved with ID: ", docRef.id);
          } catch (e) {
            console.error("Error adding document: ", e);
          }
    }

    public async saveMessage(msg: SavedText) {
        try {
            const docRef = await addDoc(collection(this.db, "saved_messages"), msg);
            log.info("Message saved with ID: ", docRef.id);
          } catch (e) {
            log.error("Error adding document: ", e);
          }
    }

    public async loadMessages(uid: number) {
        try {
            const q = query(collection(this.db, "saved_messages"), where("uid", "==", uid))

            const querySnapshot = await getDocs(q);
            const saved: SavedText[] = [];
            querySnapshot.forEach( (doc) => {
                const data = doc.data();
                const msg = new SavedText(data.uid, data.from, data.text, data.date);
                saved.push(msg);
            })
            log.info("Loaded messages saved by ", uid);
            return saved;
          } catch (e) {
            log.error("Error retrieving messages: ", e);
          }
    }

}

export const db = new Database();
