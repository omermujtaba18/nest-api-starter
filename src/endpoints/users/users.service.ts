import { Injectable } from '@nestjs/common';
import { User, UserDocument } from './schemas/users.schema';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { CreateUserGoogleDto, CreateUserLocalDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  async create(
    createAccountDto: CreateUserLocalDto | CreateUserGoogleDto,
  ): Promise<UserDocument> {
    const user = await this.userModel.create(createAccountDto);
    return user;
  }
  async findOneByFilter(
    filter: FilterQuery<User>,
  ): Promise<UserDocument | null> {
    return this.userModel.findOne(filter).exec();
  }
}
