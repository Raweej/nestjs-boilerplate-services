import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumberString, IsOptional } from 'class-validator';

export class QueryRoleListDTO {
  @ApiPropertyOptional()
  @IsOptional()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  alias: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  page: string;

  @ApiPropertyOptional()
  @IsOptional()
  sort: string;

  @ApiPropertyOptional()
  @IsOptional()
  sort_field: string;

  @ApiPropertyOptional()
  @IsOptional()
  limit: string;
}
