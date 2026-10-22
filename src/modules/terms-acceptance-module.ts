import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TermsAcceptance } from '../entities/terms-acceptance-entity';
import { TermsAcceptanceController } from '../controllers/terms-acceptance-controller';
import { TermsAcceptanceService } from '../services/terms-acceptance-service';

@Module({
  imports: [TypeOrmModule.forFeature([TermsAcceptance]),],
  controllers: [TermsAcceptanceController, ],
  providers: [TermsAcceptanceService, ],
  exports: [TermsAcceptanceService, ],
})
export class TermsAcceptanceModule {}