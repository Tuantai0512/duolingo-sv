import { IsEmail, IsNotEmpty, IsOptional } from "class-validator";

export class CreateAuthDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsOptional()
    name: string;

    @IsNotEmpty()
    password: string;
}

export class VerifyAuthDto {
    @IsNotEmpty()
    _id: string;

    @IsNotEmpty()
    code: string;
}

export class changePasswordAuthDto {
    @IsNotEmpty()
    code: string;

    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    confirmPassword: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;
}

