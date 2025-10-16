import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { Product } from './products/entities/product.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    ScheduleModule.forRoot(),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        ssl: process.env.DATABASE_URL?.includes('neon.tech')
          ? { rejectUnauthorized: false }
          : false,
        entities: [Product],
        synchronize: configService.get<boolean>('TYPEORM_SYNCHRONIZE', true),
      }),
    }),

    HttpModule,
    ProductsModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
