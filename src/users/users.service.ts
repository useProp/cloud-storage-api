import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
  ) {}

  async findByEmail(email: string) {
    return this.userRepo.findOneBy({ email });
  }

  async findById(id: number) {
    console.log(id);
    return this.userRepo.findOneBy({ id });
  }

  async create(dto: CreateUserDto) {
    return this.userRepo.save(dto);
  }
}
