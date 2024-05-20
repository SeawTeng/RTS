import Entity from '../entity.js';

class Users extends Entity {
    /**
     * @param {string} username
     * @param {string} firstName
     * @param {string} lastName
     * @param {string} password
     * @param {string} id
     */
    constructor(username, firstName, lastName, password, id) {
        super(id);

        if (!username) throw new TypeError('Username requires');
        if (!firstName) throw new TypeError('First Name required');
        if (!lastName) throw new TypeError('Last Name required');
        if (!password) throw new TypeError('Password required');

        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.password = password;
    }
}

export default Users;