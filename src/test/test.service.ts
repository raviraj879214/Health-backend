import { Injectable } from '@nestjs/common';
import { ITestService } from '../../src/test/interfaces/test.interface';

@Injectable()
export class EmailTestService implements ITestService {

    
  async runTask(data: any): Promise<any> {

    
    return { status: 'email run', data };
  }

  async getStatus(type: string): Promise<any> {
    return { type, status: 'email service ready' };
  }

  async getInfo(type: string): Promise<any> {
    return { type, info: 'Email task info' };
  }

  async testAll(): Promise<any> {
    return [{ type: 'email', result: 'test ok' }];
  }


}
