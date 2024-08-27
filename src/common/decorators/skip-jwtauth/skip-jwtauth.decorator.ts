import { SetMetadata } from '@nestjs/common';

export const SKIP_JWT_AUTH = 'SKIP_JWT_AUTH';
export const SkipJwtauth = () => SetMetadata(SKIP_JWT_AUTH, true);
