import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from 'uaguape-db';
import { AnswerModule } from './answer/answer.module';
import { TokenGuard } from './global/guards/token.guard';
import { UserExistsGuard } from './global/guards/user-exists.guard';
import { PairModule } from './pair/pair.module';
import { QuestionModule } from './question/question.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import config from './configuration/configuration';

@Module({
  imports: [
    PairModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ load: [config], isGlobal: true }),
    UserModule,
    QuestionModule,
    AnswerModule,
    PairModule,
    JwtModule,
    PrismaModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: TokenGuard },
    { provide: APP_GUARD, useClass: UserExistsGuard },
  ],
})
export class AppModule {}
