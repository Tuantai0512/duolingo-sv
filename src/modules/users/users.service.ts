import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { hashPasswordHelper } from '@/utils/helper';
import aqp from 'api-query-params';
import { changePasswordAuthDto, CreateAuthDto, VerifyAuthDto } from '@/auth/dto/create-auth.dto';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly mailerService: MailerService
  ) { }

  isEmailExist = async (email: string) => {
    const user = await this.userModel.exists({ email });
    if (user) return true;
    return false
  }

  async create(createUserDto: CreateUserDto): Promise<any> {
    const { name, email, password } = createUserDto;
    //Check email
    const isEmail = await this.isEmailExist(email);
    if (isEmail) {
      throw new BadRequestException(`Email is exists: ${email}, please use other email!`)
    }
    //hash password
    const hashPassword = await hashPasswordHelper(password);
    const createdUser = await this.userModel.create({
      name, email, password: hashPassword
    });
    return createdUser.save();
  }

  async findAll(query: string, current: number, pageSize: number) {
    const { filter, sort } = aqp(query);
    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;
    if (!current) current = 1;
    if (!pageSize) pageSize = 10;

    const totalItems = (await (this.userModel.find(filter))).length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const skip = (current - 1) * (pageSize);

    const results = await this.userModel
      .find(filter)
      .limit(pageSize)
      .skip(skip)
      .select("-password")
      .sort(sort as any);

    return {
      meta:{
        current: current,
        pageSize: pageSize,
        pages: totalPages,
        total: totalItems
      }, 
      results 
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async findByEmail(email: string) {
    return await this.userModel.findOne({ email })
  }

  async update(updateUserDto: UpdateUserDto) {
    return await this.userModel.updateOne(
      { _id: updateUserDto._id }, { ...updateUserDto });
  }

  async remove(_id: string) {
    //check id
    if (mongoose.isValidObjectId(_id)) {
      return this.userModel.deleteOne({ _id })
    } else {
      throw new BadRequestException("Invalid id")
    }
  }

  async handleRegister(registerDto: CreateAuthDto) {
    const { name, email, password } = registerDto;
    //Check email
    const isEmail = await this.isEmailExist(email);
    if (isEmail) {
      throw new BadRequestException(`Email is exists: ${email}, please use other email!`)
    }

    //hash password
    const hashPassword = await hashPasswordHelper(password);
    const createdUser = await this.userModel.create({
      name, email, password: hashPassword,
      isActive: true,
      codeId: uuidv4(),
      codeExpired: dayjs().add(30, 'minute')
    });
    /* createdUser.save(); */

    //Send email
    // this.mailerService.sendMail({
    //   to: createdUser.email, // list of receivers
    //   subject: 'Active account at Duolingo', // Subject line
    //   template: 'register.hbs', // HTML body content
    //   context: {
    //     name: createdUser.name || createdUser.email,
    //     activationCode: createdUser.codeId
    //   }
    // })

    //Send response
    return {
      _id: createdUser._id
    }


  }

  async handleActive(data: VerifyAuthDto) {
    const user = await this.userModel.findOne({
      _id: data._id,
      codeId: data.code
    })
    if (!user) {
      throw new BadRequestException('Mã code không hợp lệ hoặc đã hết hạn!')
    }

    //check expire code
    const isBeforeCheck = dayjs().isBefore(user.codeExpired);
    if (isBeforeCheck) {
      //valid => update user
      await this.userModel.updateOne({ _id: data._id }, {
        isActive: true
      })
    } else {
      throw new BadRequestException('Mã code không hợp lệ hoặc đã hết hạn!')
    }
    return { isBeforeCheck };
  }

  async retryActive(email: string) {
    //check email

    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new BadRequestException('Tài khoản không tồn tại!');
    }
    if (user.isActive) {
      throw new BadRequestException('Tài khoản đã được kích hoạt!')
    }

    //update code id
    const codeId = uuidv4();

    await user.updateOne({
      codeId: codeId,
      codeExpired: dayjs().add(30, 'minute')
    })

    //Send email
    this.mailerService.sendMail({
      to: user.email, // list of receivers
      subject: 'Retry active account at Duolingo', // Subject line
      template: 'register.hbs', // HTML body content
      context: {
        name: user.name || user.email,
        activationCode: codeId
      }
    })

    return {
      _id: user._id
    }
  }

  async retryPassword(email: string) {
    //check email

    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new BadRequestException('Tài khoản không tồn tại!');
    }

    //update code id
    const codeId = uuidv4();

    await user.updateOne({
      codeId: codeId,
      codeExpired: dayjs().add(30, 'minute')
    })

    //Send email
    this.mailerService.sendMail({
      to: user.email, // list of receivers
      subject: 'Change password account at Duolingo', // Subject line
      template: 'register.hbs', // HTML body content
      context: {
        name: user.name || user.email,
        activationCode: codeId
      }
    })

    return {
      _id: user._id,
      email: user.email
    }
  }

  async changePassword(body: changePasswordAuthDto) {

    const { code, password, confirmPassword, email } = body;
    //check password
    if (password !== confirmPassword) {
      throw new BadRequestException('Xác thực mật khẩu không trùng khớp!')
    }

    //check email

    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new BadRequestException('Tài khoản không tồn tại!');
    }

    //check expire code
    const isBeforeCheck = dayjs().isBefore(user.codeExpired);
    if (isBeforeCheck && code == user.codeId) {
      //update password
      const newPassword = await hashPasswordHelper(password);
      await user.updateOne({ password: newPassword })
    } else {
      throw new BadRequestException('Mã code không hợp lệ hoặc đã hết hạn!')
    }
    return { isBeforeCheck };
  }
}
