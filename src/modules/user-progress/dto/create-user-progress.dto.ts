import { IsNotEmpty } from "class-validator";

export class CreateUserProgressDto {
    @IsNotEmpty()
    activeCourseId: string;

    hearts: number;

    points: number;
}
