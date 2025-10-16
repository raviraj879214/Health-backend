import { Controller, Get, Param, Query, Inject, Version } from '@nestjs/common';
import type  { ITestService } from './interfaces/test.interface';



@Controller('test')
export class TestController {


  constructor(


      @Inject('ITestService') private readonly testService: ITestService) {}


      @Get('run/:type')
      @Version('1')
      run(@Param('type') type: string)
      {

        return this.testService.runTask({ type });
      }

      @Get('status/:type')
      @Version('1')
      status(@Param('type') type: string) {
        return this.testService.getStatus(type);
      }

      @Get('info')
      @Version('1')
      info(@Query('type') type: string) {
        return this.testService.getInfo(type);
      }

      @Get('all')
      @Version('1')
      testAll() {
        return this.testService.testAll();
      }

      
}
