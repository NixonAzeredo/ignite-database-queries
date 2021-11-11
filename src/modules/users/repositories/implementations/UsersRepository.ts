import { getRepository, Repository } from 'typeorm';
import { IFindUserByFullNameDTO, IFindUserWithGamesDTO } from '../../dtos';
import { User } from '../../entities/User';
import { IUsersRepository } from '../IUsersRepository';


export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User> {
    const user = await this.repository.createQueryBuilder("user")
      .leftJoinAndSelect("user.games", "game")
      .where("user.id = :id", { id: user_id })
      .getOne() as User;

    return user;
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    return this.repository.query('SELECT * FROM users ORDER BY first_name');
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[]> {
    return await this.repository.query("select first_name, last_name, email from users where first_name=initcap(lower($1)) and last_name=initcap(lower($2))", [first_name, last_name]);
  }
}
