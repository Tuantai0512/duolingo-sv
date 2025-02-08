import { Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './schemas/course.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class CoursesService {
  constructor(
    @InjectModel(Course.name) private courseModel: Model<Course>,
  ) { }

  create(createCourseDto: CreateCourseDto) {
    const course = new this.courseModel(createCourseDto);
    return course.save();
  }

  findAll() {
    return this.courseModel.find().exec();;
  }

  findOne(id: string) {
    return this.courseModel.findOne({ _id: id });
  }

  update(id: number, updateCourseDto: UpdateCourseDto) {
    return `This action updates a #${id} course`;
  }

  remove(id: number) {
    return `This action removes a #${id} course`;
  }
}
