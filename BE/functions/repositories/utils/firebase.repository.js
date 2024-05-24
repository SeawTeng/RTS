import admin from 'firebase-admin';
import p from '../../permission.json' assert { type: "json" };
import jwt from "jsonwebtoken";

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

    async checkAuthenticate(req, res) {
        if (req.headers && req.headers["cookie"]) {
            const token = req.headers["cookie"].split('=')[1];

            const decode = jwt.verify(token, process.env.JWT_SECRET);
    
            const user = await await this.db
                .doc(`${this.collection}/${decode.id}`)
                .get();

            if (!user) {
                res.clearCookie("jwt");
                return {
                    success: false,
                    message: 'unauthorized access!'
                };
            }

            return {
                success: true,
                message: 'authorized access!'
            };
        } else {
            return {success: false, message: 'unauthorized access!'};
        }
    }

    async login(req, res) {
        const response = await this.firebaseCollection
            .where('email', '==', req.body.email)
            .where('password', '==', req.body.password)
            .get();

        if (response.empty) {
            return "not found!";
        }

        const id = response.docs[0].ref.id;
        const data = this.processFirebaseResponse(response)[0];
        data.id = id
        
        const token = jwt.sign(data, process.env.JWT_SECRET);
        data.token = token;
        res.cookie("jwt", token, { httpOnly: true, secure: true, maxAge: 3600000 })

        return data;
    }

    async logout(req, res) {
        res.clearCookie("jwt");

        return "user logout successfully";
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