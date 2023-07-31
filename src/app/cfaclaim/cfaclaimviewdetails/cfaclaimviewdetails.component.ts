import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { takeUntil, retry } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { CFAClaimService, ExcelService } from 'src/app/_services';
import { ConnectionService } from 'ng-connection-service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Router, ActivatedRoute } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { HostListener } from '@angular/core'

@Component({
  selector: 'app-cfaclaimviewdetails',
  templateUrl: './cfaclaimviewdetails.component.html',
  styleUrls: ['./cfaclaimviewdetails.component.css']
})

export class CfaclaimviewdetailsComponent implements OnInit {
  isConnected = true;
  varClientName: any;
  fk_ChannelGlCode: any;
  varAuthenticate_CFA: any;
  lstCFAClaimViewUpdateData: any;
  varRefId: any;
  varStockistName: any;
  varPreClaimNo: any;
  varPreClaimDate: any;
  varStockistRefno: any;
  varStockistRefDate: any;
  varClaimDocNo: any;
  varReason: any;
  varClaimDate: any;
  varReturnType: any;
  varDocumentAmount: any;
  varFinalAmount: any;
  varFileName: any;
  varFileDownloadPath: any;
  varClaimRegisterName: any;
  selectedFileName: any;
  imageBy64: any;
  varClientLink: any;
  varStockistNameDyn: any;
  varCFANameDyn: any;
  ClaimStatus: any;
  varRemarks: any;
  @ViewChild('myInput', { static: false })
  myInputVariable: ElementRef;

  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    localStorage.setItem("authenticate_CFA", "false");
    this.router.navigateByUrl('/login');
  }

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
    this.varRefId = localStorage.getItem("varRefId");
    this.varStockistNameDyn = "Stockist";
    this.varCFANameDyn = "CFA";
    this.GetClaimData(this.varRefId);
  }

  handleFileInput($event) {
    this.spinnerService.show();
    var varFile = $event.target.files[0].name.split('.');
    if (varFile != null && varFile != "") {
      varFile = varFile[varFile.length - 1];
    }
    if (varFile.toLowerCase() !== "jpg" && varFile.toLowerCase() !== "jpeg" && varFile.toLowerCase() !== "png" && varFile.toLowerCase() !== "pdf") {
      this.selectedFileName = "";
      this.myInputVariable.nativeElement.value = "";
      this.spinnerService.hide();
      Swal.fire('', 'Invalid file format', 'error');
      return;
    }
    if ($event.target.files[0].size > 10485760) {
      this.selectedFileName = "";
      this.myInputVariable.nativeElement.value = "";
      this.spinnerService.hide();
      Swal.fire('', 'Maximum size allowed is 10 MB', 'error');
      return;
    }
    this.readThis($event.target);
  }

  readThis(inputValue: any): void {
    var file: File = inputValue.files[0];
    var myReader: FileReader = new FileReader();

    myReader.onloadend = (e) => {
      this.imageBy64 = myReader.result;
      this.selectedFileName = file.name;
      this.spinnerService.hide();
      if (this.imageBy64 != null && this.imageBy64 != "" && this.imageBy64 != undefined) {
        this.OnSaveCFADetails();
      }
    }
    myReader.readAsDataURL(file);
  }

  GetClaimData(varReferenceId): void {
    if (this.isConnected) {
      this.spinnerService.show();

      this.service.CFAClaimViewGetDataByRefID(varReferenceId, this.varClientName)
        .then(res => {
          if (res.Status[0].isValid) {
            this.spinnerService.hide();
            if (res.Status[0].isValid === true || (res.lstCFAClaimViewUpdateData !== '' && res.lstCFAClaimViewUpdateData.length > 0)) {
              this.lstCFAClaimViewUpdateData = res.lstCFAClaimViewUpdateData;
              this.varStockistName = res.lstCFAClaimViewUpdateData[0].varStockistName;
             //this.varPreClaimNo = res.lstCFAClaimViewUpdateData[0].varPreClaimNo;
             //this.varPreClaimDate = res.lstCFAClaimViewUpdateData[0].varPreClaimDate;
              this.varStockistRefno = res.lstCFAClaimViewUpdateData[0].varStockistRefno;
              this.varStockistRefDate = res.lstCFAClaimViewUpdateData[0].varStockistRefDate;
              this.varClaimDocNo = res.lstCFAClaimViewUpdateData[0].varClaimDocNo;
              this.varClaimRegisterName = res.lstCFAClaimViewUpdateData[0].varClaimRegisterName;
              this.varReason = res.lstCFAClaimViewUpdateData[0].varReason;
              this.varClaimDate = res.lstCFAClaimViewUpdateData[0].varClaimDate;
              this.varReturnType = res.lstCFAClaimViewUpdateData[0].varReturnType;
              this.varDocumentAmount = res.lstCFAClaimViewUpdateData[0].varDocumentAmount;
              this.varFinalAmount = res.lstCFAClaimViewUpdateData[0].varFinalAmount;
              this.varFileName = res.lstCFAClaimViewUpdateData[0].varFileName;
              this.varFileDownloadPath = res.lstCFAClaimViewUpdateData[0].varFileDownloadPath;
              this.varClientLink = res.lstCFAClaimViewUpdateData[0].varClientLink;
              this.varRemarks = res.lstCFAClaimViewUpdateData[0].varRemarks;
              
              if (res.lstCFAClaimViewUpdateData[0].chrStatus.toLocaleLowerCase() === "u") {
                this.ClaimStatus = true;
              }
              else {
                this.ClaimStatus = false;
              }
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

  OnSaveCFADetails(): void {
    if (this.isConnected) {
      this.spinnerService.show();
      if (this.selectedFileName === "" || this.selectedFileName === undefined || this.selectedFileName === null) {
        this.spinnerService.hide();
        Swal.fire('', 'Please selecte file', 'info');
        return;
      }

      if (this.selectedFileName !== "" && this.selectedFileName !== null && this.selectedFileName !== undefined && this.imageBy64 !== undefined) {
        var varRefId = this.varRefId;
        var selectedFileName = this.selectedFileName;
        var varrandomnumber = this.service.getRandomNumberBetween(1000, 1000000);
        var FileName = varRefId + "_" + varrandomnumber + "." + selectedFileName.split(".")[selectedFileName.split(".").length - 1];

        this.service.SaveCFAFile(this.imageBy64, this.varClientLink, FileName).then(data => {
          this.spinnerService.hide();
          if (data.Status[0].isValid === true) {
            this.SaveFile(FileName, varRefId)
          }
          else {
            this.spinnerService.hide();
            console.log(data.Status[0].Message);
            Swal.fire('', data.Status[0].Message, 'error');
          }
        }, error => {
          if (!this.isConnected) {
            this.spinnerService.hide();
            Swal.fire('OFFLINE', 'Please check your internet connectivity and try again.', 'info');
          }
          this.spinnerService.hide();
          console.log(error);
        });
      }

    }
    else {
      this.spinnerService.hide();
      Swal.fire('OFFLINE', 'Please check your internet connectivity and try again.', 'info');
    }
  }

  SaveFile(FileName, RefId): void {
    this.spinnerService.show();
    this.service.CFAClaimViewSaveFile(RefId, FileName, this.varClientName)
      .then(res => {
        if (res.Status[0].isValid) {
          this.spinnerService.hide();
          if (res.Status[0].Message === '') {
            Swal.fire({
              position: 'top-center', icon: 'success', title: 'Your record has been saved', showConfirmButton: false, timer: 1500
            })
            this.myInputVariable.nativeElement.value = "";
            this.GetClaimData(RefId);
          }
          else {
            Swal.fire('', res.Status[0].Message, 'error');
          }
        }
        else {
          this.spinnerService.hide();
          Swal.fire('', res.Status[0].Message, 'error');
        }
      });
  }

  Back(): void {
    localStorage.setItem("isBack_Click", "True");
    this.router.navigateByUrl('/cfaclaimview');
  }
}
