import {Injectable} from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {Client} from 'elasticsearch-browser';

@Injectable()
export class ElasticsearchService {

    private isDcnmVersion = true;

    private client: Client;
    private baseUrl = 'https://sjc-vinci-ucs14.cisco.com/afw/integrated/http_';
    private searchUrl = 'https://sjc-vinci-ucs14.cisco.com/afw/integrated/http_33500/dcnm-elasticsearch-api/Data%20Center';
    private url = 'localhost:9200';
    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    constructor(private http: HttpClient) {

        if (this.isDcnmVersion) {
            this.AfwDiscoverService('dcnm-elasticsearch-api', '');
        } else {
            if (!this.client) {
                this.connectLocal();
            }
        }


    }

    private connect(port) {

        this.client = new Client({
            // host: 'http://172.27.252.26:9200',
            host: this.searchUrl,
            log: 'trace'
        });
    }
    private connectLocal() {
        console.log('nomal connect ');
        this.client = new Client({
            // host: 'http://172.27.252.26:9200',
            host: 'localhost:9200'
        });
    }


    search(data) {
        // // const parameter = JSON.stringify(data);
        // // this.http.get()
        // return this.http.get(this.url, data).toP;
        if (!this.client) {
            this.connect('33500');
        }
        return this.client.search(data);
    }


    AfwDiscoverService(svc, fabric) {


        const x = {ServiceName: svc, PublishedPort: 0, PublicIP: '', error: 1, success: -1};
        const urlConstant = '/cors-proxy/cn1-cors-proxy?_target=http://localhost:35000/afw/service/';
        console.log('svc', svc, 'fabric', fabric);

        let fullUrl = urlConstant;
        if (fabric == '') {
            fullUrl = urlConstant + svc;
        } else {
            fullUrl = urlConstant + svc + '/' + fabric;
        }
        this.http.get(fullUrl).subscribe( res => {
            console.log('service discrover', res);
            if (!this.client) {
                this.connect(res['PublishedPort'].toString());
            }
        });

    }




}
