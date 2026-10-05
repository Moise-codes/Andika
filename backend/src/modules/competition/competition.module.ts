import { Module } from '@nestjs/common';
import { CompetitionGateway } from './competition.gateway';

@Module({
  providers: [CompetitionGateway],
  exports: [CompetitionGateway],
})
export class CompetitionModule {}
