import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class BaseQueryDto {
  @IsOptional()
  @Transform((page) => Number(page.value))
  @IsNumber()
  @Min(1)
  @ApiPropertyOptional()
  readonly page: number = 1;

  @IsOptional()
  @Transform((limit) => Number(limit.value))
  @IsNumber()
  @Min(1)
  @ApiPropertyOptional()
  readonly limit: number = 10;

  @IsOptional()
  @Transform((search) => String(search.value))
  @IsString()
  @ApiPropertyOptional()
  search: string;
}
