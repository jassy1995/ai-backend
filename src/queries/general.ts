import User from '../models/user';
import Chat from '../models/chat';

const GeneralQueries = {
    async createUser(data:any) {
        const newRecord = await User.create(data);
        return { data: newRecord, message: 'created', status: true, code: 201 };

    },
    async getUser(args:any) {
        const user = await User.findOne({where:{...args}});
        return { data: user, message: 'retrieved', status: true, code: 200 };
    },
};

export default GeneralQueries;
