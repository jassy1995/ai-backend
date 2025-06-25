import User from '../models/user';
import { isValidObjectId } from 'mongoose';


const UserDao = {
    async createUser(data:any) {
        return User.create(data);
    },
    async getUser(args:any) {
        if (args._id && !isValidObjectId(args._id)) return null;
        return User.findOne(args);
    },
};

export default UserDao;
