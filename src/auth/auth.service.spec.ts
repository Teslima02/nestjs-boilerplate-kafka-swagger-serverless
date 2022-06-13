import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';

describe('Auth Service', () => {
  let authService: AuthService;

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });
});
