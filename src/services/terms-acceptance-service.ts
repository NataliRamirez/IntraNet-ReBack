import {BadRequestException, Injectable,} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TermsAcceptance } from '../entities/terms-acceptance-entity';
import { CreateTermsAcceptanceDto } from '../DTOs/create-terms-acceptance-dto';

@Injectable()
export class TermsAcceptanceService {
  private readonly CURRENT_TERMS_VERSION = '2026-10-21';

  constructor(
    @InjectRepository(TermsAcceptance)
    private readonly termsRepository: Repository<TermsAcceptance>,
  ) {}

  async registerAcceptance(
    dto: CreateTermsAcceptanceDto,
    ipAddress: string | null,
    userAgent: string | null,
  ) {
    if (dto.accepted !== true) {
      throw new BadRequestException('Solo se pueden registrar aceptaciones verdaderas.',);
    }

    if (dto.termsVersion !== this.CURRENT_TERMS_VERSION) {
      throw new BadRequestException('La versión de los términos no es válida.',);
    }

    const acceptance = this.termsRepository.create({
      termsVersion: dto.termsVersion,
      accepted: true,
      ipAddress,
      userAgent,
    });

    const savedAcceptance = await this.termsRepository.save(acceptance);

    return {
      message: 'Aceptación registrada correctamente.',
      id: savedAcceptance.id,
      termsVersion: savedAcceptance.termsVersion,
      accepted: savedAcceptance.accepted,
      acceptedAt: savedAcceptance.acceptedAt,
    };
  }
}