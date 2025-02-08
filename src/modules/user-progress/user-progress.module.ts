import { Module } from '@nestjs/common';
import { UserProgressService } from './user-progress.service';
import { UserProgressController } from './user-progress.controller';
import { UserProgress, UserProgressSchema } from './schemas/user-progress.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{ name: UserProgress.name, schema: UserProgressSchema }])],
  controllers: [UserProgressController],
  providers: [UserProgressService],
})
export class UserProgressModule {}
