import GeneralQueries from '../queries/general';

const UserService = {
  async createUser(data: any) {
    return GeneralQueries.createUser(data);
  },
  async getUser(args:any){
    return GeneralQueries.getUser(args);
  }
};

export default UserService;
