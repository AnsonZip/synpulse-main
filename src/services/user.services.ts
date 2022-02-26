


export default class UserService {


  constructor(collectionName: string) {
  }

  public async create(user: any): Promise<any> {
    try {
      console.log('create', user)
      

      return null;
    } catch (err) {
      console.log('service', err);
      throw err;
    }
  }
}