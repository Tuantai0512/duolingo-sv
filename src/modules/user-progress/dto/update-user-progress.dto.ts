import { PartialType } from '@nestjs/mapped-types';
import { CreateUserProgressDto } from './create-user-progress.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateUserProgressDto extends PartialType(CreateUserProgressDto) {

}
