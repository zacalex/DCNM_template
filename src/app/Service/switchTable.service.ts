import { Injectable} from '@angular/core';

@Injectable()
export class switchTableService {
   list:any;
   getSwitchData(){
      return this.list;
   }
   setSwitch(data:any[]){
       this.list = data;
   }
}
