import { Injectable } from "@nestjs/common";
import { Repository, SelectQueryBuilder } from "typeorm";
import { Like } from "./entities/like.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../users/entities/user.entity";


@Injectable()
export class LikeRepository extends Repository<Like>{
  constructor(
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super(likeRepository.target, likeRepository.manager, likeRepository.queryRunner);
  }

  async findLikesWithUsers(): Promise<Like[]> {
    return await this.likeRepository.createQueryBuilder('like')
      .innerJoinAndSelect('like.user', 'user')
      .select(['like.*'])
      .getMany();
  }
}
