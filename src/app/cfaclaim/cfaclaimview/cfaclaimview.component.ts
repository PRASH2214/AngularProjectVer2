import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { takeUntil, retry } from 'rxjs/operators';
import { Subject, from } from 'rxjs';
import { CFAClaimService, ExcelService } from 'src/app/_services';
import { ConnectionService } from 'ng-connection-service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Router, ActivatedRoute } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { HostListener } from '@angular/core'
import { PlatformLocation } from '@angular/common'

@Component({
  selector: 'app-cfaclaimview',
  templateUrl: './cfaclaimview.component.html',
  styleUrls: ['./cfaclaimview.component.css']
})
export class CfaclaimviewComponent implements OnInit {
  isConnected = true;
  varClientName: any;
  FromDate: any = null;
  FromDateVal: any;
  ToDate: any = null;
  ToDateVal: any;
  Status: any;
  fk_ChannelGlCode: any;
  lstClaimViewBindGrid: any[];
  lstClaimViewDownloadData: any;
  serchCFACode: any = "";
  serchCFAName: any = "";
  serchReferenceID: any = "";
  serchStockistCode: any = "";
  serchStockistName: any = "";
  serchClaimDocNo: any = "";
  varAuthenticate_CFA: any;
  varStockistNameDyn: any;
  varCFANameDyn: any;
  isBack_Click: any = "False";

  @HostListener('window: popstate', ['$event'])
  onPopState(event) {
    localStorage.setItem("authenticate_CFA", "false");
    this.router.navigateByUrl('/login');
  }

  @ViewChild('Cfaclaimviewform', { static: false }) Cfaclaimviewform: NgForm;

  private _unsubscribeAll: Subject<any>;
  constructor(private service: CFAClaimService, private excelService: ExcelService, private connectionService: ConnectionService, private router: Router, private _formBuilder: FormBuilder, private route: ActivatedRoute, private spinnerService: Ng4LoadingSpinnerService) {
    this.connectionService.monitor().subscribe(isConnected => {
      this.isConnected = isConnected;
    })
    this._unsubscribeAll = new Subject();
    this.route.params
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(params => {
      });

    this.varAuthenticate_CFA = localStorage.getItem("authenticate_CFA");
    this.fk_ChannelGlCode = localStorage.getItem("fk_ChannelGlCode");

    if (this.varAuthenticate_CFA === "false" || this.varAuthenticate_CFA === null) {
      this.router.navigateByUrl('/login');
    }
  }


  ngOnInit() {
    this.fk_ChannelGlCode = localStorage.getItem("fk_ChannelGlCode");
    this.isBack_Click = localStorage.getItem("isBack_Click");
    this.varStockistNameDyn = "Stockist";
    this.varCFANameDyn = "CFA";
    this.Status = "";
    if (this.isBack_Click === "True") {
      this.isBack_Click = "False";
      localStorage.setItem("isBack_Click", "False");
      this.FromDate = new Date(localStorage.getItem("FromDate"));
      this.ToDate = new Date(localStorage.getItem("ToDate"));
      this.BindGrid();
    }
    else {
      var date = new Date();
      this.FromDate = new Date(date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + date.getDate());
      this.ToDate = new Date(date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + date.getDate());
    }
  }

  BindGrid(): void {
    if (this.isConnected) {
      this.spinnerService.show();
      this.lstClaimViewBindGrid = [];
      this.FromDateVal = this.RetuenDateintoDDMMYYFormat(this.FromDate);
      this.ToDateVal = this.RetuenDateintoDDMMYYFormat(this.ToDate);

      if (this.FromDate === null) {
        Swal.fire('', 'Please select from date', 'info');
        this.spinnerService.hide();
        return;
      }
      if (this.ToDate === null) {
        Swal.fire('', 'Please select to date', 'info');
        this.spinnerService.hide();
        return;
      }
      if (this.Status === null || this.Status === undefined) {
        this.spinnerService.hide();
        Swal.fire('', 'Please select to status', 'info');
        return;
      }
      if (new Date(this.FromDateVal) > new Date(this.ToDateVal)) {
        Swal.fire('', 'From date can not greater than To date', 'info');
        this.spinnerService.hide();
        return;
      }

      var TotalDays = this.calculateDiff(this.FromDateVal, this.ToDateVal);
      if (TotalDays > 30) {
        Swal.fire('', 'You can select maximum 31 days', 'info');
        this.spinnerService.hide();
        return;
      }

      this.service.CFAClaimViewBindGrid(this.FromDateVal, this.ToDateVal, this.Status, this.fk_ChannelGlCode, this.varClientName)
        .then(res => {
          if (res.Status[0].isValid) {
            this.spinnerService.hide();
            if (res.Status[0].isValid === true || (res.lstCFAClaimView !== '' && res.lstCFAClaimView.length > 0)) {
              this.lstClaimViewBindGrid = res.lstCFAClaimView;
            }
            else {
              this.spinnerService.hide();
              Swal.fire('', res.objChemistLogin.varMessage, 'error');
            }
          }
          else {
            this.spinnerService.hide();
            Swal.fire('', res.Status[0].Message, 'error');
          }
        });
    }
    else {
      this.spinnerService.hide();
      Swal.fire('OFFLINE', 'Please check your internet connectivity and try again.', 'info');
    }
  }



  RefereshData(): void {
    this.BindGrid();
  }

  SignOut(): void {
    localStorage.setItem("fk_ChannelGlCode", "");
    localStorage.setItem("authenticate_CFA", "false");
    this.router.navigateByUrl('/login');
  }

  DownLoadData(): void {
    if (this.isConnected) {
      this.spinnerService.show();
      if (this.FromDate === null) {
        Swal.fire('', 'Please select from date', 'info');
        return;
      }
      if (this.ToDate === null) {
        Swal.fire('', 'Please select to date', 'info');
        return;
      }
      if (this.Status === null || this.Status === undefined) {
        Swal.fire('', 'Please select to date', 'info');
        return;
      }
      this.FromDateVal = this.RetuenDateintoDDMMYYFormat(this.FromDate);
      this.ToDate = this.RetuenDateintoDDMMYYFormat(this.ToDate);
      var Heading = [
        [this.varCFANameDyn + " Code", this.varCFANameDyn + " Name", this.varCFANameDyn + " Place", "Reference ID", this.varStockistNameDyn + " Code",
        this.varStockistNameDyn + " Name", this.varStockistNameDyn + " City", 
         this.varStockistNameDyn + " Ref.No.", this.varStockistNameDyn + " Ref. Date", "Claim Register Name",
          "Claim Doc No.", "Claim Date", "Reason", "Return Type", "Document Amount",
          "File Upload Status", "Claim Status","Latest Updated By HO" , "Latest Updated On"],
      ];
      this.service.CFAClaimViewDownloadData(this.FromDateVal, this.ToDate, this.Status, this.fk_ChannelGlCode, this.varClientName)
        .then(res => {
          if (res.Status[0].isValid) {
            this.spinnerService.hide();
            if (res.Status[0].isValid === true || (res.lstCFAClaimViewDownloadData !== '' && res.lstCFAClaimViewDownloadData.length > 0)) {
              this.lstClaimViewDownloadData = res.lstCFAClaimViewDownloadData;
              this.excelService.exportAsExcelFile(this.lstClaimViewDownloadData, this.varCFANameDyn + '_Claim_Details_Report', Heading);
            }
            else {
              this.spinnerService.hide();
              Swal.fire('', res.objChemistLogin.varMessage, 'error');
            }
          }
          else {
            this.spinnerService.hide();
            Swal.fire('', res.Status[0].Message, 'error');
          }
        });
    }
    else {
      this.spinnerService.hide();
      Swal.fire('OFFLINE', 'Please check your internet connectivity and try again.', 'info');
    }

  }

  UpdateData(varRefId): void {
    if (this.isConnected) {
      this.spinnerService.show();

      if (varRefId != null && varRefId != "" && varRefId != undefined) {
        this.spinnerService.hide();
        localStorage.setItem("varRefId", varRefId);
        localStorage.setItem("isBack_Click", "False");
        localStorage.setItem("FromDate", this.FromDateVal);
        localStorage.setItem("ToDate", this.ToDateVal);
        this.router.navigateByUrl('/cfaclaimviewdetails');
      }
    }
    else {
      this.spinnerService.hide();
      Swal.fire('OFFLINE', 'Please check your internet connectivity and try again.', 'info');
    }
  }

  RetuenDateintoDDMMYYFormat(val: any) {
    var date = new Date(Date.parse(val));
    if (date !== undefined) {
      return date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + date.getDate();
    }
    else {
      return val;
    }
  }

  calculateDiff(Fromdate, Todate) {
    Fromdate = new Date(Fromdate);
    Todate = new Date(Todate);

    return Math.floor(
      (Date.UTC(Todate.getFullYear(), Todate.getMonth(), Todate.getDate()) -
        Date.UTC(Fromdate.getFullYear(), Fromdate.getMonth(), Fromdate.getDate())
      ) / (1000 * 60 * 60 * 24));
  }

}
