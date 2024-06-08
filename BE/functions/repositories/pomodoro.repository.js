import FirebaseRepository from "./utils/firebase.repository.js";
import jwt from "jsonwebtoken";
class PomodoroRepository extends FirebaseRepository {
    constructor() {
        super("pomodoroTimer");
    }

    async getAllByUser(req) {
        const token = req.headers["authorization"];
        const userId = jwt.decode(token, process.env.JWT_SECRET).id;
    
        const userDocRef = await this.db
            .doc(`users/${userId}`);
    
        let response = null;
    
        if (!req.body.showCompleted) {
          response = await this.firebaseCollection
              .where("userId", "==", userDocRef)
              .get();
        } else {
          response = await this.firebaseCollection
              .where("userId", "==", userDocRef)
              .get();
        }
    
        return this.processFirebaseResponse(response, true);
      }
    


}

export default new PomodoroRepository();