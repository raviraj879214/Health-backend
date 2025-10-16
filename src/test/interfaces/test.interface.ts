


export interface ITestService {
 
  runTask(data: any): Promise<any>;


  getStatus(type: string): Promise<any>;


  getInfo(type: string): Promise<any>;


  testAll(): Promise<any>;

  
}
