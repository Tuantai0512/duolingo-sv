import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { UserProgressService } from './user-progress.service';
import { CreateUserProgressDto } from './dto/create-user-progress.dto';
import { UpdateUserProgressDto } from './dto/update-user-progress.dto';

@Controller('user-progress')
export class UserProgressController {
  constructor(private readonly userProgressService: UserProgressService) { }

  @Post()
  create(@Req() req, @Body() createUserProgressDto: CreateUserProgressDto) {
    return this.userProgressService.create(req.user.userId,createUserProgressDto);
  }

  // @Get()
  // findAll() {
  //   return this.userProgressService.findAll();
  // }

  @Get()
  findOne(@Req() req) {
    return this.userProgressService.findOne(req.user.userId);
  }

  @Patch()
  update(@Req() req, @Body() updateUserProgressDto: CreateUserProgressDto) {
    return this.userProgressService.update(req.user.userId,updateUserProgressDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userProgressService.remove(+id);
  }
}
