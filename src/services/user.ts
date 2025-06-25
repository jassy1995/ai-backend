import UserDao from '../dao/user';

const UserService = {
  async createUser(data: any) {
    return UserDao.createUser(data);
  },
  async getUser(args:any){
    return UserDao.getUser(args);
  }
};

export default UserService;
