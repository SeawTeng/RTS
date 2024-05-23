import admin from 'firebase-admin';
import p from '../../permission.json' assert { type: "json" };

class FirebaseRepository {

    constructor(collection) {
        let defaultApp;

        if (!admin.apps?.length) {
            defaultApp = admin.initializeApp({
                credential: admin.credential.cert(p)
            });
            
            defaultApp.firestore().settings({ timestampsInSnapshots: true });
        } else {
            defaultApp = admin.app();
        }

        this.db = defaultApp.firestore();
        this.collection = collection;
        this.firebaseCollection = this.db.collection(collection);
    }

    async login(item) {
        const response = await this.firebaseCollection
            .where('email', '==', item.email)
            .where('password', '==', item.password)
            .get();

        if (response.empty) {
            return "not found!";
        }

        const id = response.docs[0].ref.id;
        const data = this.processFirebaseResponse(response)[0];
        data.id = id

        return data;
    }

    async getById(id) {
        const response = await this.firebaseCollection
            .doc(id)
            .get();

        if (response.empty) {
            return `${this.collection} with id ${id} does not exist!`;
        }

        const data = this.processDBResponse(response);
        data.id = id;

        return data;
    }

    async add(item) {
        const response = await this.firebaseCollection
            .add(item);

        return response.id;
    }

    async set(item) {
        await this.db
            .doc(`${this.collection}/${item.id}`)
            .update(item);

        return `${this.collection} has successfully updated!`;
    }

    async delete(id) {
        const res = await this.db
            .doc(`${this.collection}/${id}`)
            .update({ "isDeleted": true })

        return res;
    }

    processFirebaseResponse(response) {
        return response.docs.map(itemRef => itemRef.data());
    }

    processDBResponse(response) {
        const data  = {}
        for (const i in response._fieldsProto) {
            data[i] = response._fieldsProto[i].stringValue
        }
        
        return data;
    }
}

export default FirebaseRepository;