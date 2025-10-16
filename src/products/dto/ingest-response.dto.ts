import { ApiProperty } from '@nestjs/swagger';

export class IngestResponseDto {
  @ApiProperty({
    description: 'Success message',
    example: 'Products ingested successfully'
  })
  message: string;

  @ApiProperty({
    description: 'Number of new products imported',
    example: 150
  })
  imported: number;

  @ApiProperty({
    description: 'Number of existing products updated',
    example: 25
  })
  updated: number;

  @ApiProperty({
    description: 'Total number of products processed',
    example: 175
  })
  total: number;
}
