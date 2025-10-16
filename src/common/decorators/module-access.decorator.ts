// src/common/decorators/module-access.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const ModuleAccess = (moduleName: string) => SetMetadata('module', moduleName);
