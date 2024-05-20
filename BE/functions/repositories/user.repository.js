import FirebaseRepository from './utils/firebase.repository.js';

class UserRepository extends FirebaseRepository {

    constructor() {
        super('users');
    }

    async getAll() {
        const response = await this.firebaseCollection.get();
        return this.processFirebaseResponse(response);
    }

}

export default new UserRepository();