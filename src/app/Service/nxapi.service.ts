import { Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable()
export class nxapiService {

  httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  urlServer = 'http://localhost:3001/';
  constructor(private http: HttpClient) {

  }

  preRunCli(cli,switches,appName) {

      console.log("run cli")

      var version = "1.0";
      var type = "cli_conf";
//
      this.runCli(cli, version, type, switches,appName)
  }


  runCli(cli, version, type, switches, appName) {
      console.log(cli)
      console.log(version)
      console.log(type)
      // console.log(rpm)

      var payload = {
          "ins_api": {

          }
      }
      // this.targetSwitch = this.switchDic
      payload["ins_api"]["version"] = version;
      payload["ins_api"]["type"] = type;
      payload["ins_api"]["chunk"] = "0";
      payload["ins_api"]["sid"] = "1";
      payload["ins_api"]["input"] = cli;
      payload["ins_api"]["output_format"] = "json"


      var info = {};
      info["switches"] = switches
      info["payload"] = payload
      info["rpmName"] = appName


      this.postJsonToLocalBackend(info, this.urlServer)
          .subscribe(
              data => {
                  console.log(data);
              }
          )
  }

  postJsonToLocalBackend(obj, url) {
      console.log("here to do the post");
      const parameter = JSON.stringify(obj);
      console.log(parameter);
      // console.log(url)
      return this.http.post(url, parameter, this.httpOptions);

  }

}
