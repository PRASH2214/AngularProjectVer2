import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
//const httpOptions = {
//    headers: new HttpHeaders({
//        'Content-Type': 'application/x-www-form-urlencoded'
//    })
//};
export class Product {
  ID: string;
  name: string;
  expanded?: boolean;
  categoryId?: string;
  icon?: string;
  price?: number;
}
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'})
};
const httpOptions1 = {
  headers: new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded'
  })
};
@Injectable()
export class AuthenticationService {
  constructor(private http: HttpClient) { }

  GetDownloadLink(DownloadURL: any, varClientLink: any): Promise<any> {

    var test1 = "URL=" + DownloadURL + "";
    //var test1 = { URL: DownloadURL };
    return new Promise((resolve, reject) => {
      this.http.post(varClientLink + "Apps/WebService/frmDownloadData.asmx/GetDownloadLink", test1, httpOptions1)
        .subscribe((response: any) => {
          resolve(response);
        }, (error: any) => {
          reject(error);
        });
    });
  }
  GetMenuList(fk_PersonGlCode: any, varClientName: any): Promise<any> {
    var test = { fk_PersonGlCode: fk_PersonGlCode, varClientName: varClientName };
    //var test = "fk_PersonGlCode=" + fk_PersonGlCode + "&varClientName=" + varClientName + "";
    return new Promise((resolve, reject) => {
      this.http.post("api/ECPDashboard/DMS_Get_Menu_List", test, httpOptions)
        .subscribe((response: any) => {
          resolve(response);
        }, (error: any) => {
          reject(error);
        });
    });
  }
  //Added new
  Chemistlogin(varChemistMobileno, varClientName): Promise<any> {
    var data = {
      varChemistMobileno: varChemistMobileno, varClientName: varClientName
    };
    return new Promise((resolve, reject) => {
      this.http.post("api/ChemistOrder/ChemistOrder_ChemistLogin", data, httpOptions)
        .subscribe((response: any) => {
          resolve(response);
        }, (error: any) => {
          reject(error);
        });
    });
  }

  ValidateOTPChemist(OTP: string, fk_ChemistGlCode: string, varClientName: string): Promise<any> {
    var data = { OTP: OTP, fk_ChemistGlCode: fk_ChemistGlCode, varClientName: varClientName };
    return new Promise((resolve, reject) => {
      this.http.post('api/ChemistOrder/ChemistOrder_ValidateOTP', data, httpOptions)
        .subscribe((response: any) => {
          resolve(response);
        }, (error: any) => {
          reject(error);
        });
    });
  }

  ReSendOTPChemist(varMobileNo: string, varClientName: string): Promise<any> {
    var data = { varMobileNo: varMobileNo, varClientName: varClientName };
    return new Promise((resolve, reject) => {
      this.http.post('api/ChemistOrder/ChemistOrder_ChemistLogin', data, httpOptions)
        .subscribe((response: any) => {
          resolve(response);
        }, (error: any) => {
          reject(error);
        });
    });
  }


  CheckOrder(Fk_ChemistGlCode, varClientName): Promise<any> {
    var data = {
      fk_ChemistGlCode: Fk_ChemistGlCode, varClientName: varClientName
    };
    return new Promise((resolve, reject) => {
      this.http.post("api/ChemistOrder/ChemistOrder_GetPendingOrderDetails", data, httpOptions)
        .subscribe((response: any) => {
          resolve(response);
        }, (error: any) => {
          reject(error);
        });
    });
  }
  SaveOrder(Fk_ChemistGlCode, fk_PrefStockist, OrderList): Promise<any> {
    var data = {
      fk_ChemistGlCode: Fk_ChemistGlCode, fk_PrefStockist: fk_PrefStockist, OrderList: OrderList
    };
    return new Promise((resolve, reject) => {
      this.http.post("api/ChemistOrder/ChemistOrder_SaveOrder", data, httpOptions)
        .subscribe((response: any) => {
          resolve(response);
        }, (error: any) => {
          reject(error);
        });
    });
  }

  CancleOrder(fk_COGlCode, chrCancelOrder, varClientName): Promise<any> {
    var data = {
      fk_COGlCode: fk_COGlCode, chrCancelOrder: chrCancelOrder, varClientName: varClientName
    };
    return new Promise((resolve, reject) => {
      this.http.post("api/ChemistOrder/ChemistOrder_CancleOrder", data, httpOptions)
        .subscribe((response: any) => {
          resolve(response);
        }, (error: any) => {
          reject(error);
        });
    });
  }

  BindPrefereStockist(fk_ChemistGlCode): Promise<any> {
    var data = {
      fk_ChemistGlCode: fk_ChemistGlCode
    };
    return new Promise((resolve, reject) => {
      this.http.post("api/ChemistOrder/BindPrefereStockist", data, httpOptions)
        .subscribe((response: any) => {
          resolve(response);
        }, (error: any) => {
          reject(error);
        });
    });
  }

  BindDivisionWiseProductList(fk_ChemistGlCode): Promise<any> {
    var data = {
      varClientName: 'NA', fk_ChemistGlCode: fk_ChemistGlCode
    };
    return new Promise((resolve, reject) => {
      this.http.post("api/ChemistOrder/ChemistOrder_BindDivisionWiseProductList", data, httpOptions)
        .subscribe((response: any) => {
          resolve(response);
        }, (error: any) => {
          reject(error);
        });
    });
  }

  ChemistSaveClick(varClientName, fk_COGlCode, chrMarkAsReceive, chrCancelOrder, FileName): Promise<any> {
    var data = {
      varClientName: varClientName, fk_COGlCode: fk_COGlCode, chrMarkAsRec: chrMarkAsReceive, chrCancelOrder: chrCancelOrder, varFileName: FileName
    };
    return new Promise((resolve, reject) => {
      this.http.post("api/ChemistOrder/ChemistOrderList_SaveOrder", data, httpOptions)
        .subscribe((response: any) => {
          resolve(response);
        }, (error: any) => {
          reject(error);
        });
    });
  }

  PostFile(imageBy64, selectedFileName, varClientName, varClientLink, varOrerNo, FileName): Promise<any> {
    //var data = {
    //  imageBy64: imageBy64, selectedFileName: selectedFileName, varClientName: varClientName, varClientLink: varClientLink, varOrerNo: varOrerNo
    //};
    //return new Promise((resolve, reject) => {
    //  this.http.post("api/ChemistOrder/PostFile", data, httpOptions)
    //    .subscribe((response: any) => {
    //      resolve(response);
    //    }, (error: any) => {
    //      reject(error);
    //    });
    //});
    //varClientLink = "https://cqa.ecubix.com/";
    var varimageBy64 = imageBy64.split(",")[1];
   // var varrandomnumber = this.getRandomNumberBetween(1000, 1000000);
    var varFileName = FileName;// varOrerNo + "_" + varrandomnumber + "." + selectedFileName.split(".")[selectedFileName.split(".").length - 1];
    //var data = { file: varimageBy64, fileName: varFileName, folderName: "ChemistOrder" };
    var folderName = "ChemistOrder";
    var test1 = "file=" + varimageBy64 + "&fileName=" + varFileName + "&folderName=" + folderName + "";;;
    return new Promise((resolve, reject) => {
      this.http.post(varClientLink + "Apps/WebService/PushFile.asmx/CorpDrFileUpload", test1, httpOptions1)
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
  
  EmpSalesDashboard_GetBlockSummary(varClientName, dtFromMonth, dtToMonth, fk_EmpGlCode_Login, fk_DivisionGlCode, fk_DesiGlCode, fk_EmpGlCode, varProductGlCode): Promise<any> {
    var data = { varClientName: varClientName, dtFromMonth: dtFromMonth, dtToMonth: dtToMonth, fk_EmpGlCode_Login: fk_EmpGlCode_Login, fk_DivisionGlCode: fk_DivisionGlCode, fk_DesiGlCode: fk_DesiGlCode, fk_EmpGlCode: fk_EmpGlCode, varProductGlCode: varProductGlCode };
    //var data = "varClientName=" + varClientName + "&dtFromMonth=" + dtFromMonth + "&dtToMonth=" + dtToMonth + "&fk_EmpGlCode_Login=" + fk_EmpGlCode_Login + "&fk_DivisionGlCode=" + fk_DivisionGlCode + "&fk_DesiGlCode=" + fk_DesiGlCode + "&fk_EmpGlCode=" + fk_EmpGlCode + "&varProductGlCode=" + varProductGlCode;
    return new Promise((resolve, reject) => {
      this.http.post("api/EmpSalesDashboard/EmpSalesDashboard_GetBlockSummary", data, httpOptions)
        .subscribe((response: any) => {
          resolve(response);
        }, (error: any) => {
          reject(error);
        });
    });
  }

  EmpSalesDashboard_Target_Prim_Sec_Sales(varClientName, dtFromMonth, dtToMonth, fk_EmpGlCode_Login, fk_DivisionGlCode, fk_DesiGlCode, fk_EmpGlCode, varProductGlCode, chrDesiLevel, fk_EmpGlCodeSelect, varDesiorder): Promise<any> {
    var data = { varClientName: varClientName, dtFromMonth: dtFromMonth, dtToMonth: dtToMonth, fk_EmpGlCode_Login: fk_EmpGlCode_Login, fk_DivisionGlCode: fk_DivisionGlCode, fk_DesiGlCode: fk_DesiGlCode, fk_EmpGlCode: fk_EmpGlCode, varProductGlCode: varProductGlCode, chrDesiLevel: chrDesiLevel, fk_EmpGlCodeSelect: fk_EmpGlCodeSelect, varDesiorder: varDesiorder };
    //var data = "varClientName=" + varClientName + "&dtFromMonth=" + dtFromMonth + "&dtToMonth=" + dtToMonth + "&fk_EmpGlCode_Login=" + fk_EmpGlCode_Login + "&fk_DivisionGlCode=" + fk_DivisionGlCode + "&fk_DesiGlCode=" + fk_DesiGlCode + "&fk_EmpGlCode=" + fk_EmpGlCode + "&varProductGlCode=" + varProductGlCode + "&chrDesiLevel=" + chrDesiLevel + "&fk_EmpGlCodeSelect=" + fk_EmpGlCodeSelect + "&varDesiorder=" + varDesiorder;
    return new Promise((resolve, reject) => {
      this.http.post("api/EmpSalesDashboard/EmpSalesDashboard_Target_Prim_Sec", data, httpOptions)
        .subscribe((response: any) => {
          resolve(response);
        }, (error: any) => {
          reject(error);
        });
    });
  }

  EmpSalesDashboard_StockistWise(varClientName, dtFromMonth, dtToMonth, fk_EmpGlCode_Login, fk_DivisionGlCode, fk_DesiGlCode, fk_EmpGlCode, varProductGlCode, chrDesiLevel, fk_EmpGlCodeSelect, varDesiorder): Promise<any> {

    var data = { varClientName: varClientName, dtFromMonth: dtFromMonth, dtToMonth: dtToMonth, fk_EmpGlCode_Login: fk_EmpGlCode_Login, fk_DivisionGlCode: fk_DivisionGlCode, fk_DesiGlCode: fk_DesiGlCode, fk_EmpGlCode: fk_EmpGlCode, varProductGlCode: varProductGlCode, chrDesiLevel: chrDesiLevel, fk_EmpGlCodeSelect: fk_EmpGlCodeSelect, varDesiorder: varDesiorder };
    //var data = "varClientName=" + varClientName + "&dtFromMonth=" + dtFromMonth + "&dtToMonth=" + dtToMonth + "&fk_EmpGlCode_Login=" + fk_EmpGlCode_Login + "&fk_DivisionGlCode=" + fk_DivisionGlCode + "&fk_DesiGlCode=" + fk_DesiGlCode + "&fk_EmpGlCode=" + fk_EmpGlCode + "&varProductGlCode=" + varProductGlCode + "&chrDesiLevel=" + chrDesiLevel + "&fk_EmpGlCodeSelect=" + fk_EmpGlCodeSelect + "&varDesiorder=" + varDesiorder;
    return new Promise((resolve, reject) => {
      this.http.post("api/EmpSalesDashboard/EmpSalesDashboard_Stockist_Wise", data, httpOptions)
        .subscribe((response: any) => {
          resolve(response);
        }, (error: any) => {
          reject(error);
        });
    });
  }

  EmpSalesDashboard_ProducttWise(varClientName, dtFromMonth, dtToMonth, fk_EmpGlCode_Login, fk_DivisionGlCode, fk_DesiGlCode, fk_EmpGlCode, varProductGlCode, chrDesiLevel, fk_EmpGlCodeSelect, varDesiorder, fk_ChannelGlCode): Promise<any> {
    //var data = "varClientName=" + varClientName + "&dtFromMonth=" + dtFromMonth + "&dtToMonth=" + dtToMonth + "&fk_EmpGlCode_Login=" + fk_EmpGlCode_Login + "&fk_DivisionGlCode=" + fk_DivisionGlCode + "&fk_DesiGlCode=" + fk_DesiGlCode + "&fk_EmpGlCode=" + fk_EmpGlCode + "&varProductGlCode=" + varProductGlCode + "&chrDesiLevel=" + chrDesiLevel + "&fk_EmpGlCodeSelect=" + fk_EmpGlCodeSelect + "&varDesiorder=" + varDesiorder + "&fk_ChannelGlCode=" + fk_ChannelGlCode;
    var data = { varClientName: varClientName, dtFromMonth: dtFromMonth, dtToMonth: dtToMonth, fk_EmpGlCode_Login: fk_EmpGlCode_Login, fk_DivisionGlCode: fk_DivisionGlCode, fk_DesiGlCode: fk_DesiGlCode, fk_EmpGlCode: fk_EmpGlCode, varProductGlCode: varProductGlCode, chrDesiLevel: chrDesiLevel, fk_EmpGlCodeSelect: fk_EmpGlCodeSelect, varDesiorder: varDesiorder, fk_ChannelGlCode: fk_ChannelGlCode };
    return new Promise((resolve, reject) => {
      this.http.post("api/EmpSalesDashboard/EmpSalesDashboard_Product_Wise", data, httpOptions)
        .subscribe((response: any) => {
          resolve(response);
        }, (error: any) => {
          reject(error);
        });
    });
  }
  DRPOBDashboard_GetBlockSummary(varClientName, dtFromMonth, dtToMonth, fk_EmpGlCode_Login, fk_DivisionGlCode, fk_DesiGlCode, fk_EmpGlCode, varProductGlCode, chrType): Promise<any> {
    //var data = "varClientName=" + varClientName + "&dtMonth=" + dtMonth + "&fk_EmpGlCode_Login=" + fk_EmpGlCode_Login + "&fk_DivisionGlCode=" + fk_DivisionGlCode + "&fk_DesiGlCode=" + fk_DesiGlCode + "&fk_EmpGlCode=" + fk_EmpGlCode + "&varProductGlCode=" + varProductGlCode + "&chrType=" + chrType;
    var data = { varClientName: varClientName, dtFromMonth: dtFromMonth, dtToMonth: dtToMonth, fk_EmpGlCode_Login: fk_EmpGlCode_Login, fk_DivisionGlCode: fk_DivisionGlCode, fk_DesiGlCode: fk_DesiGlCode, fk_EmpGlCode: fk_EmpGlCode, varProductGlCode: varProductGlCode, chrType: chrType };
    //var data = "varClientName=" + varClientName + "&dtFromMonth=" + dtFromMonth + "&dtToMonth=" + dtToMonth + "&fk_EmpGlCode_Login=" + fk_EmpGlCode_Login + "&fk_DivisionGlCode=" + fk_DivisionGlCode + "&fk_DesiGlCode=" + fk_DesiGlCode + "&fk_EmpGlCode=" + fk_EmpGlCode + "&varProductGlCode=" + varProductGlCode + "&chrType=" + chrType;
    return new Promise((resolve, reject) => {
      this.http.post("api/DRPOBDashboard/DRPOBDashboard_GetBlockSummary", data, httpOptions)
        .subscribe((response: any) => {
          resolve(response);
        }, (error: any) => {
          reject(error);
        });
    });
  }
  DRPOBDashboard_PatchAnalysis(varClientName, dtFromMonth, dtToMonth, fk_EmpGlCode_Login, fk_DivisionGlCode, fk_DesiGlCode, fk_EmpGlCode, varProductGlCode, chrType): Promise<any> {
    //var data = "varClientName=" + varClientName + "&dtFromMonth=" + dtFromMonth + "&dtToMonth=" + dtToMonth + "&fk_EmpGlCode_Login=" + fk_EmpGlCode_Login + "&fk_DivisionGlCode=" + fk_DivisionGlCode + "&fk_DesiGlCode=" + fk_DesiGlCode + "&fk_EmpGlCode=" + fk_EmpGlCode + "&varProductGlCode=" + varProductGlCode + "&chrType=" + chrType;
    var data = { varClientName: varClientName, dtFromMonth: dtFromMonth, dtToMonth: dtToMonth, fk_EmpGlCode_Login: fk_EmpGlCode_Login, fk_DivisionGlCode: fk_DivisionGlCode, fk_DesiGlCode: fk_DesiGlCode, fk_EmpGlCode: fk_EmpGlCode, varProductGlCode: varProductGlCode, chrType: chrType };
    return new Promise((resolve, reject) => {
      this.http.post("api/DRPOBDashboard/DRPOBDashboard_PatchAnalysis", data, httpOptions)
        .subscribe((response: any) => {
          resolve(response);
        }, (error: any) => {
          reject(error);
        });
    });
  }
  DRPOBDashboard_SpecialtyAnalysis(varClientName, dtFromMonth, dtToMonth, fk_EmpGlCode_Login, fk_DivisionGlCode, fk_DesiGlCode, fk_EmpGlCode, varProductGlCode, chrType, fk_PatchGlCode): Promise<any> {
    //var data = "varClientName=" + varClientName + "&dtFromMonth=" + dtFromMonth + "&dtToMonth=" + dtToMonth + "&fk_EmpGlCode_Login=" + fk_EmpGlCode_Login + "&fk_DivisionGlCode=" + fk_DivisionGlCode + "&fk_DesiGlCode=" + fk_DesiGlCode + "&fk_EmpGlCode=" + fk_EmpGlCode + "&varProductGlCode=" + varProductGlCode + "&chrType=" + chrType + "&fk_PatchGlCode=" + fk_PatchGlCode;
    var data = { varClientName: varClientName, dtFromMonth: dtFromMonth, dtToMonth: dtToMonth, fk_EmpGlCode_Login: fk_EmpGlCode_Login, fk_DivisionGlCode: fk_DivisionGlCode, fk_DesiGlCode: fk_DesiGlCode, fk_EmpGlCode: fk_EmpGlCode, varProductGlCode: varProductGlCode, chrType: chrType, fk_PatchGlCode: fk_PatchGlCode };
    return new Promise((resolve, reject) => {
      this.http.post("api/DRPOBDashboard/DRPOBDashboard_SpecialtyAnalysis", data, httpOptions)
        .subscribe((response: any) => {
          resolve(response);
        }, (error: any) => {
          reject(error);
        });
    });
  }
  DRPOBDashboard_ProductAnalysis(varClientName, dtFromMonth, dtToMonth, fk_EmpGlCode_Login, fk_DivisionGlCode, fk_DesiGlCode, fk_EmpGlCode, varProductGlCode, chrType, fk_PatchGlCode, fk_SpecialtyGlCode): Promise<any> {
    //var data = "varClientName=" + varClientName + "&dtFromMonth=" + dtFromMonth + "&dtToMonth=" + dtToMonth + "&fk_EmpGlCode_Login=" + fk_EmpGlCode_Login + "&fk_DivisionGlCode=" + fk_DivisionGlCode + "&fk_DesiGlCode=" + fk_DesiGlCode + "&fk_EmpGlCode=" + fk_EmpGlCode + "&varProductGlCode=" + varProductGlCode + "&chrType=" + chrType + "&fk_PatchGlCode=" + fk_PatchGlCode + "&fk_SpecialtyGlCode=" + fk_SpecialtyGlCode;
    var data = { varClientName: varClientName, dtFromMonth: dtFromMonth, dtToMonth: dtToMonth, fk_EmpGlCode_Login: fk_EmpGlCode_Login, fk_DivisionGlCode: fk_DivisionGlCode, fk_DesiGlCode: fk_DesiGlCode, fk_EmpGlCode: fk_EmpGlCode, varProductGlCode: varProductGlCode, chrType: chrType, fk_PatchGlCode: fk_PatchGlCode, fk_SpecialtyGlCode: fk_SpecialtyGlCode };
    return new Promise((resolve, reject) => {
      this.http.post("api/DRPOBDashboard/DRPOBDashboard_ProductAnalysis", data, httpOptions)
        .subscribe((response: any) => {
          resolve(response);
        }, (error: any) => {
          reject(error);
        });
    });
  }
  DRPOBDashboard_6MTrend(varClientName, dtFromMonth, dtToMonth, fk_EmpGlCode_Login, fk_DivisionGlCode, fk_DesiGlCode, fk_EmpGlCode, varProductGlCode, chrType, fk_PatchGlCode, fk_SpecialtyGlCode): Promise<any> {
    //var data = "varClientName=" + varClientName + "&dtFromMonth=" + dtFromMonth + "&dtToMonth=" + dtToMonth + "&fk_EmpGlCode_Login=" + fk_EmpGlCode_Login + "&fk_DivisionGlCode=" + fk_DivisionGlCode + "&fk_DesiGlCode=" + fk_DesiGlCode + "&fk_EmpGlCode=" + fk_EmpGlCode + "&varProductGlCode=" + varProductGlCode + "&chrType=" + chrType + "&fk_PatchGlCode=" + fk_PatchGlCode + "&fk_SpecialtyGlCode=" + fk_SpecialtyGlCode;
    var data = { varClientName: varClientName, dtFromMonth: dtFromMonth, dtToMonth: dtToMonth, fk_EmpGlCode_Login: fk_EmpGlCode_Login, fk_DivisionGlCode: fk_DivisionGlCode, fk_DesiGlCode: fk_DesiGlCode, fk_EmpGlCode: fk_EmpGlCode, varProductGlCode: varProductGlCode, chrType: chrType, fk_PatchGlCode: fk_PatchGlCode, fk_SpecialtyGlCode: fk_SpecialtyGlCode };
    return new Promise((resolve, reject) => {
      this.http.post("api/DRPOBDashboard/DRPOBDashboard_6MTrend", data, httpOptions)
        .subscribe((response: any) => {
          resolve(response);
        }, (error: any) => {
          reject(error);
        });
    });
  }
  DRPOBDashboard_PlannedVsActualPOB(varClientName, dtFromMonth, dtToMonth, fk_EmpGlCode_Login, fk_DivisionGlCode, fk_DesiGlCode, fk_EmpGlCode, varProductGlCode, chrType, chrDesiLevel, fk_EmpGlCodeSelect, varDesiorder): Promise<any> {
    //var data = "varClientName=" + varClientName + "&dtFromMonth=" + dtFromMonth + "&dtToMonth=" + dtToMonth + "&fk_EmpGlCode_Login=" + fk_EmpGlCode_Login + "&fk_DivisionGlCode=" + fk_DivisionGlCode + "&fk_DesiGlCode=" + fk_DesiGlCode + "&fk_EmpGlCode=" + fk_EmpGlCode + "&varProductGlCode=" + varProductGlCode + "&chrType=" + chrType + "&chrDesiLevel=" + chrDesiLevel + "&fk_EmpGlCodeSelect=" + fk_EmpGlCodeSelect + "&varDesiorder=" + varDesiorder;
    var data = { varClientName: varClientName, dtFromMonth: dtFromMonth, dtToMonth: dtToMonth, fk_EmpGlCode_Login: fk_EmpGlCode_Login, fk_DivisionGlCode: fk_DivisionGlCode, fk_DesiGlCode: fk_DesiGlCode, fk_EmpGlCode: fk_EmpGlCode, varProductGlCode: varProductGlCode, chrType: chrType, chrDesiLevel: chrDesiLevel, fk_EmpGlCodeSelect: fk_EmpGlCodeSelect, varDesiorder: varDesiorder };
    return new Promise((resolve, reject) => {
      this.http.post("api/DRPOBDashboard/DRPOBDashboard_PlannedVsActualPOB", data, httpOptions)
        .subscribe((response: any) => {
          resolve(response);
        }, (error: any) => {
          reject(error);
        });
    });
  }
}
