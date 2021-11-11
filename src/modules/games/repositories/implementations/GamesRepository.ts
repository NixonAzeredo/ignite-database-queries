import { getRepository, ILike, Repository } from 'typeorm';
import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';
import { IGamesRepository } from '../IGamesRepository';



export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    return await this.repository.find({
      title: ILike(`%${param}%`),
    })
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return await this.repository.query("SELECT COUNT(*) FROM games");
  }

  async findUsersByGameId(id: string): Promise<User[]> {

    const { users } = await this.repository.createQueryBuilder("game")
      .leftJoinAndSelect("game.users", "user")
      .where("game.id = :id", { id })
      .getOne() as Game;

    return users;
  }
}
