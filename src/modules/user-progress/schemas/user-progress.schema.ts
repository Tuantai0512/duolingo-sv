import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserProgressDocument = HydratedDocument<UserProgress>;

@Schema()
export class UserProgress {
  @Prop()
  userId: string;

  @Prop()
  activeCourseId: string;

  @Prop({default:5})
  hearts: number;

  @Prop({default:0})
  points: number;
}

export const UserProgressSchema = SchemaFactory.createForClass(UserProgress);
