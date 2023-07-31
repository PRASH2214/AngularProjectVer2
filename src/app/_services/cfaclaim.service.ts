import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};
const httpOptions1 = {
  headers: new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded'
  })
};
const httpOptions2 = {
  headers: new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PUT,GET,POST,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': '*'
  })
};

@Injectable({
  providedIn: 'root'
})
export class CFAClaimService {

  constructor(private http: HttpClient) { }

  GetDownloadLink(DownloadURL: any, varClientLink: any): Promise<any> {

    var test1 = "URL=" + DownloadURL + "";    
    return new Promise((resolve, reject) => {
      this.http.post(varClientLink + "Apps/WebService/frmDownloadData.asmx/GetDownloadLink", test1, httpOptions1)
        .subscribe((response: any) => {
          resolve(response);
        }, (error: any) => {
          reject(error);
        });
    });
  }

   
  CFAClaimlogin(varMobileEmailID): Promise<any> {
    var data = {
      varMobileEmailID: varMobileEmailID
    };
    return new Promise((resolve, reject) => {
      this.http.post("api/CFAClaim/CFAClaim_CFAClaiimLogin", data, httpOptions)
        .subscribe((response: any) => {
          resolve(response);
        }, (error: any) => {
          reject(error);
        });
    });
  }

  ValidateOTP(OTP: string, fk_ChannelGlCode: string, varClientName: string): Promise<any> {
    var data = { OTP: OTP, fk_ChannelGlCode: fk_ChannelGlCode, varClientName: varClientName };
    return new Promise((resolve, reject) => {
      this.http.post('api/CFAClaim/CFAClaim_ValidateOTP', data, httpOptions)
        .subscribe((response: any) => {
          resolve(response);
        }, (error: any) => {
          reject(error);
        });
    });
  }

  CFAClaimViewBindGrid(FromDate, ToDate, Status, fk_ChannelGlCode, varClientName): Promise<any> {
    var data = {
      FromDate: FromDate, ToDate: ToDate, Status: Status, fk_ChannelGlCode: fk_ChannelGlCode,varClientName: varClientName
    };
    return new Promise((resolve, reject) => {
      this.http.post("api/CFAClaim/CFAClaimViewBindGrid", data, httpOptions)
        .subscribe((response: any) => {
          resolve(response);
        }, (error: any) => {
          reject(error);
        });
    });
  }

  CFAClaimViewDownloadData(FromDate, ToDate, Status, fk_ChannelGlCode, varClientName): Promise<any> {
    var data = {
      FromDate: FromDate, ToDate: ToDate, Status: Status, fk_ChannelGlCode: fk_ChannelGlCode, varClientName: varClientName
    };
    return new Promise((resolve, reject) => {
      this.http.post("api/CFAClaim/CFAClaimViewDownloadData", data, httpOptions)
        .subscribe((response: any) => {
          resolve(response);
        }, (error: any) => {
          reject(error);
        });
    });
  }

  CFAClaimViewGetDataByRefID(varRefId, varClientName): Promise<any> {
    var data = {
      varRefId: varRefId, varClientName: varClientName
    };
    return new Promise((resolve, reject) => {
      this.http.post("api/CFAClaim/CFAClaimViewGetDataByRefID", data, httpOptions)
        .subscribe((response: any) => {
          resolve(response);
        }, (error: any) => {
          reject(error);
        });
    });
  }

  CFAClaimViewSaveFile(varRefId, varFileName, varClientName): Promise<any> {
    var data = {
      varRefId: varRefId, varFileName: varFileName,varClientName: varClientName
    };
    return new Promise((resolve, reject) => {
      this.http.post("api/CFAClaim/CFAClaimViewSaveFile", data, httpOptions)
        .subscribe((response: any) => {
          resolve(response);
        }, (error: any) => {
          reject(error);
        });
    });
  }
  SaveCFAFile(imageBy64, varClientLink, FileName): Promise<any> {
   
    var varimageBy64 = imageBy64.split(",")[1];
    var varFileName = FileName;
    var folderName = "CFAClaimDetails";
    var data = {
      file: varimageBy64, fileName: varFileName, folderName: folderName
    };
    return new Promise((resolve, reject) => {
      this.http.post("api/CFAClaim/CorpDrFileUpload", data, httpOptions)
        .subscribe((response: any) => {
          resolve(response);
        }, (error: any) => {
          reject(error);
        });
    });
  }
  SaveCFAFileOLD(imageBy64, varClientLink, FileName): Promise<any> {
         
    var varimageBy64 = imageBy64.split(",")[1];    
    var varFileName = FileName;    
    var folderName = "CFAClaimDetails";
    var test1 = "file=" + varimageBy64 + "&fileName=" + varFileName + "&folderName=" + folderName + "";;;
    return new Promise((resolve, reject) => {
      this.http.post("http://www.ecubixservices02.co.in/eris_cqa/Apps/WebService/PushFile.asmx/CorpDrFileUpload", test1, httpOptions2)
        .subscribe((response: any) => {
          resolve(response);
        }, (error: any) => {
          reject(error);
        });
    });
  }

  getRandomNumberBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}
