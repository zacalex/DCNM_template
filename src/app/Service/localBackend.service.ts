import { Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class localBackendService {
   list: any;
   urlServer = 'http://localhost:3001/';
   rpmStatus = [];
   TabLogs = [];
   TabRpmReports = [];
   status = 'waiting';
   cliStatus = []

   constructor(private http: HttpClient) {
     setInterval(() => {
         this.http.post(this.urlServer + 'report', { 'hello': 'hello' })
             .subscribe(res => {
                 this.processReport(res);
             });
     }, 3000);
   }
   processReport(report) {
       // console.log(report)
       // console.log(report['report'].nxapi)
       // console.log(report['report'].rpms)
       if (report['report'].rpms.length > 0) {
          console.log(report['report'].rpms);
           this.TabLogs.unshift(report['report'].rpms);
           console.log(this.TabLogs);
           for (let i in report['report'].rpms) {
               let currIp = report['report'].rpms[i].switchIp;
               console.log(report['report'].rpms[i].rpmname);
               let paths = report['report'].rpms[i].rpmname.split('/');
               let currentRpm = paths[paths.length - 1].split('.rpm')[0];
               console.log(currentRpm);
               for (let ind in this.rpmStatus) {
                   let st = this.rpmStatus[ind];
                   if (st.ip == currIp && st.rpm == currentRpm
                   && this.rpmStatus[ind].status == 'copying') {
                       console.log('found copy');
                       this.rpmStatus[ind].status = 'installing';
                   }
               }
           }
       }
       if (report['report'].nxapi.length > 0) {
         console.log(report);
           this.TabLogs.unshift(report['report'].nxapi);
           console.log(this.TabLogs);
           let str = '';
           for (let i in report['report'].nxapi) {
               str += report['report'].nxapi[i]['result'];
               if (!this.isJson(str)) {
                   continue;
               }
               console.log(str);
               console.log(report['report'].nxapi);
               let rpmName = report['report'].nxapi[i]['rpmName'];
               let ip = report['report'].nxapi[i]['ip'];
               let nxapiObj = JSON.parse(str.replace(/[\n\r]/g, ' '));
               str = '';
               console.log(nxapiObj);
               this.TabLogs.unshift(nxapiObj);
               var res = {msg:"",clierror:""}
               if(Array.isArray(nxapiObj.ins_api.outputs.output)){
                   const len = nxapiObj.ins_api.outputs.output.length;
                   console.log(nxapiObj.ins_api.outputs.output);
                   res = nxapiObj.ins_api.outputs.output[len - 1];
               } else {
                   res = nxapiObj.ins_api.outputs.output;
               }

               if (res.msg == 'Success')
               {
                   this.status = 'get somethgin back, please click the tab to load.';
                   console.log('installed');
                   console.log(ip);
                   console.log(rpmName);
                   for (let ind in this.rpmStatus) {
                       let st = this.rpmStatus[ind];
                       console.log(st.ip)
                       console.log(st.rpm)
                       if (st.ip == ip && st.rpm == rpmName) {
                           console.log('found');
                           this.rpmStatus[ind].status += ' Success';
                       }
                   }
               } else {
                   this.status = 'get somethgin back, please click the tab to load.';
                   console.log('failed');
                   console.log(ip);
                   console.log(rpmName);
                   for (let ind in this.rpmStatus) {
                       let st = this.rpmStatus[ind];
                       if (st.ip == ip && st.rpm == rpmName) {
                           console.log('found');
                           this.rpmStatus[ind].status = 'failed';
                       }
                   }
               }

           }
       }

   }
   isJson(str) {
       try {
           JSON.parse(str);
       } catch (e) {
           return false;
       }
       return true;
   }
   pushTabrpmStatus(data) {
     this.rpmStatus.unshift(data);
   }
//
}
