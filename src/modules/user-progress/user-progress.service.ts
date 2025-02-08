import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserProgressDto } from './dto/create-user-progress.dto';
import { UpdateUserProgressDto } from './dto/update-user-progress.dto';
import { UserProgress } from './schemas/user-progress.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UserProgressService {
  constructor(
    @InjectModel(UserProgress.name) private userProgressModel: Model<UserProgress>,
  ) { }

  create(userId: string,createUserProgressDto: CreateUserProgressDto) {
    const userProgress = new this.userProgressModel({...createUserProgressDto, userId});
    return userProgress.save();
  }

  findAll() {
    return `This action returns all userProgress`;
  }

  async findOne(userId: string) {
    const userProgress = await this.userProgressModel.findOne({ userId });
    if(!userProgress){
      throw new BadRequestException("User progress not found!");
    }else{
      return userProgress
    }
  }

  async update(userId: string,updateUserProgressDto: CreateUserProgressDto) {
    return await this.userProgressModel.updateOne(
      { userId: userId }, { ...updateUserProgressDto });
  }

  remove(id: number) {
    return `This action removes a #${id} userProgress`;
  }
}
