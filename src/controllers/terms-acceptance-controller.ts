import { Body, Controller, Post, Req,} from '@nestjs/common';
import type { Request } from 'express';
import { TermsAcceptanceService } from '../services/terms-acceptance-service';
import { CreateTermsAcceptanceDto } from '../DTOs/create-terms-acceptance-dto';

@Controller('terms-acceptance')
export class TermsAcceptanceController {
  constructor(
    private readonly termsAcceptanceService: TermsAcceptanceService,
  ) {}

  @Post()
  async registerAcceptance(
    @Body() dto: CreateTermsAcceptanceDto,
    @Req() req: Request,
  ) {
    const ipAddress = req.ip || null;
    const userAgent = req.headers['user-agent'] || null;

    return this.termsAcceptanceService.registerAcceptance(dto,ipAddress,userAgent,);
  }
}
