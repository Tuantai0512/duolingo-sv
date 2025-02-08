import { IsNotEmpty } from "class-validator";

export class CreateCourseDto {
    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    imageSrc: string;
}