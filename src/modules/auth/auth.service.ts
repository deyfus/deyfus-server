// src/modules/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from '../../core/types';
import { PrismaModelMap, userFields } from '../../core/types/models';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly repo: Repository,
    private readonly jwt: JwtService,
  ) {}

  async login(email: string, password: string) {
    const normalizedEmail = email.trim().toLowerCase();
    const model = PrismaModelMap.user;

    const select = {
      [userFields.id]: true,
      [userFields.email]: true,
      [userFields.password_hash]: true,
      [userFields.role]: true, 
    } as const;

    const user = await this.repo.findUnique(model, {
      where: { [userFields.email]: normalizedEmail },
      select,
    });

    if (!user) throw new UnauthorizedException('Credenciales inválidas');

    const isValid = await bcrypt.compare(
      password,
      user[userFields.password_hash],
    );
    if (!isValid) throw new UnauthorizedException('Credenciales inválidas');

    const payload = {
      sub: user[userFields.id],
      email: user[userFields.email],
      role: user[userFields.role],
    };

    const access_token = await this.jwt.signAsync(payload);

    return { access_token };
  }
}
