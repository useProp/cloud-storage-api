import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    default: 'test@mail.com',
  })
  email: string;

  @ApiProperty({
    default: 'Danny D',
  })
  fullName: string;

  @ApiProperty({
    default: '12345',
  })
  password: string;
}
