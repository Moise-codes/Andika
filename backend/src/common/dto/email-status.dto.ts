import { IsEmail } from 'class-validator';

export class EmailStatusDto {
  @IsEmail({}, { message: 'A valid email address is required.' })
  email: string;
}
