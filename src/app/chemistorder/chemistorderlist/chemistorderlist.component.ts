
import { Component, OnInit, ViewChild, NgModule, OnDestroy, Pipe, PipeTransform, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject, Subscription, timer } from 'rxjs';
import { ConnectionService } from 'ng-connection-service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Router, ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/_services';
import { encode } from 'punycode';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-chemistorderlist',
  templateUrl: './chemistorderlist.component.html',
  styleUrls: ['./chemistorderlist.component.css']
})
export class ChemistorderlistComponent implements OnInit {
  showMainContent: Boolean = true;
  showOrder: Boolean = false;
  showOrderWithDocStatus: boolean = false;
  OrderNo: any;
  OrderDate: any;
  OrderStatus: any;
  MarkAsReceive: any;
  ChemistOrderList: FormGroup
  fileToUpload: File = null;
  loading = false;
  FileName: any;
  varClientName: any;
  fk_ChemistGlCode: any;
  chrMarkAsReceive: any;
  fk_COGlCode: any = 0;
  base64textString: any;
  imageBy64: any;
  selectedFileName: any;
  varClientLink: any;
  varDocMarkAsReceive: any;
  varDocStatus: any;
  disableGenerateOrder = false;
  isConnected = true;
  chrCancelOrder = "N";
  disableCancleOrder = false;
  AllAproveRequestwithPendingDocApp: [];
  subscription: Subscription;
  interval: any = 30000;
  userActivity: any;
  varAuthenticate: any;
  private _unsubscribeAll: Subject<any>;
  private ngUnSubscribe: Subject<void> = new Subject<void>();
  constructor(private service: AuthenticationService, private connectionService: ConnectionService, private route: ActivatedRoute, private router: Router, private _formBuilder: FormBuilder, private spinnerService: Ng4LoadingSpinnerService) {
    this.connectionService.monitor().subscribe(isConnected => {
      this.isConnected = isConnected;
    })
    this._unsubscribeAll = new Subject();
    this.route.params
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(params => {
        //this.varClientName = "IQAA";
        //localStorage.setItem("varClientName", this.varClientName);
      });

    this.varAuthenticate = localStorage.getItem("authenticate");
    this.fk_ChemistGlCode = localStorage.getItem("fk_ChemistGlCode");

    if (this.varAuthenticate === "false") {
      this.router.navigateByUrl('/login');
    }
  }

  ngOnInit() {
    this.ChemistOrderList = this._formBuilder.group({
      chrMarkAsReceive: ['']
    });
    this.varAuthenticate = localStorage.getItem("authenticate");
    this.fk_ChemistGlCode = localStorage.getItem("fk_ChemistGlCode");

    if (this.varAuthenticate === "false") {
      this.router.navigateByUrl('/login');
    }

    this.CheckOrder();
    this.startInterval();
    //this.userActivity = setInterval(() => {
    //  this.setTimeout();
    //}, this.interval);

  }


  startInterval() {
    this.interval = setInterval(() => {
      this.setTimeout();
    }, 30000);
  }

  resetInterval() {
    this.ngUnSubscribe.next();
    this.startInterval()
    this.interval = 30000;// start the interval again

  }

  ngOnDestroy() {
    this.ngUnSubscribe.next();
    this.ngUnSubscribe.complete();
    if (this.interval) {
      clearInterval(this.interval);
      // this.resetInterval();
    }
  }

  setTimeout() {
    this.userActivity = setTimeout(() => {
      this.CheckOrder();
    })
  }

  @HostListener('body:mousemove') refreshUserState() {
    clearTimeout(this.interval);
    this.startInterval();
  }

  ngAfterViewInit() {
    window.scroll(0, 0);
  }

  GenerateNewOrder(): void {
    this.router.navigateByUrl('/productlist');
  }

  readThis(inputValue: any): void {
    var file: File = inputValue.files[0];
    var myReader: FileReader = new FileReader();

    myReader.onloadend = (e) => {
      this.imageBy64 = myReader.result;
      this.selectedFileName = file.name;
      //this.loading = false;
      this.spinnerService.hide();
    }
    myReader.readAsDataURL(file);
  }

  handleFileInput($event) {
    //this.fileToUpload = files.item(0);
    var varFile = $event.target.files[0].name.split('.');
    if (varFile != null && varFile != "") {
      varFile = varFile[varFile.length - 1];
    }
    if (varFile.toLowerCase() !== "jpg" && varFile.toLowerCase() !== "jpeg" && varFile.toLowerCase() !== "png" && varFile.toLowerCase() !== "pdf") {
      this.selectedFileName = "";
      Swal.fire('', 'Invalid file format', 'error');
      return;
    }
    if ($event.target.files[0].size > 5242880) {
      this.selectedFileName = "";
      Swal.fire('', 'Maximum size allowed is 5 MB', 'error');
      return;
    }
    //this.loading = true;
    this.spinnerService.show();
    this.readThis($event.target);
  }

  get f() { return this.ChemistOrderList.controls; }

  CheckOrder(): void {
    if (this.isConnected) {
      //this.loading = true;
      this.spinnerService.show();
      this.service.CheckOrder(this.fk_ChemistGlCode, this.varClientName)
        .then(res => {
          if (res.Status[0].isValid) {
            //this.loading = false;
            this.spinnerService.hide();
            if (res.lstclsChemistOrderDetails !== null && res.lstclsChemistOrderDetails !== '' && res.lstclsChemistOrderDetails.length > 0) {
              this.fk_COGlCode = res.lstclsChemistOrderDetails[0].fk_COGlCode;
              this.OrderNo = res.lstclsChemistOrderDetails[0].varOrderNo;
              this.OrderDate = res.lstclsChemistOrderDetails[0].varOrderDate;
              this.OrderStatus = res.lstclsChemistOrderDetails[0].varOrderStatus;
              this.MarkAsReceive = res.lstclsChemistOrderDetails[0].varMarkAsReceive;
              this.varClientLink = res.lstclsChemistOrderDetails[0].varClientLink;
              if (this.MarkAsReceive !== "N") {
                this.ChemistOrderList.controls['chrMarkAsReceive'].setValue(true);
                this.ChemistOrderList.controls['chrMarkAsReceive'].disable();
              }
              else {
                this.ChemistOrderList.controls['chrMarkAsReceive'].setValue(false);
                this.ChemistOrderList.controls['chrMarkAsReceive'].enable();
              }
              if (this.OrderStatus === "Pending") {
                this.disableCancleOrder = false;
              }
              else {
                this.disableCancleOrder = true;
              }
              this.disableGenerateOrder = true;
              this.showOrder = true;
              this.showMainContent = false;
            }
            else {
              this.showOrder = false;
              this.showMainContent = true;
              this.disableGenerateOrder = false;
            }
            if (res.lstclsChemistOrderDetails_WithDocStatus !== null && res.lstclsChemistOrderDetails_WithDocStatus !== '' && res.lstclsChemistOrderDetails_WithDocStatus.length > 0) {
              this.AllAproveRequestwithPendingDocApp = res.lstclsChemistOrderDetails_WithDocStatus;
              this.showOrderWithDocStatus = true;
            }
            else {
              this.showOrderWithDocStatus = false;
            }
          }
          else {
            //this.loading = false;
            this.spinnerService.hide();
            Swal.fire('', res.status[0].message, 'error');
          }
        });
    }
    else {
      //this.loading = false;
      this.spinnerService.hide();
      Swal.fire('OFFLINE', 'Please check your internet connectivity and try again.', 'info');
    }
  }

  OnCancleOrder(): void {
    if (this.isConnected) {
      Swal.fire({
        title: 'Are you sure?',
        text: "You want to cancel this order",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, order cancel!',
        width: 350
      }).then((result) => {
        if (result.value) {
          //this.loading = true;

          this.chrCancelOrder = "Y";
          if (this.fk_COGlCode !== null && this.fk_COGlCode !== "" && this.fk_COGlCode !== 0) {
            //this.loading = true;
            this.spinnerService.show();
            this.service.CancleOrder(this.fk_COGlCode, this.chrCancelOrder, this.varClientName)
              .then(res => {
                if (res.Status[0].isValid) {
                  Swal.fire({
                    position: 'top-center', icon: 'success', title: 'Your order has been Cancelled', showConfirmButton: false, timer: 1500, width: 350
                  })
                  this.spinnerService.hide();
                  this.showMainContent = true;
                  this.showOrder = false;
                  this.disableGenerateOrder = false;
                }
                else {
                  this.spinnerService.hide();
                  Swal.fire('', res.status[0].message, 'error');
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
      })
    }
    else {
      //this.loading = false;
      this.spinnerService.hide();
      Swal.fire('OFFLINE', 'Please check your internet connectivity and try again.', 'info');
    }
  }

  OnSaveOrder(): void {
    if (this.isConnected) {

      if (this.OrderStatus === "Pending") {
        Swal.fire('', 'Order is not approved', 'info');
        this.f.chrMarkAsReceive.setValue(false);
        this.selectedFileName = "";
        return;
      }

      if ((this.selectedFileName !== "" || this.selectedFileName !== undefined) && this.f.chrMarkAsReceive.value === false) {
        Swal.fire('', 'Please mark the order as Received', 'info');
        return;
      }

      if (this.MarkAsReceive === "Y" && (this.selectedFileName === "" || this.selectedFileName === undefined)) {
        Swal.fire('', 'Order have been already marked as received, kindly upload the document', 'info');
        return;
      }

      Swal.fire({
        title: 'Are you sure?',
        text: "You want to save this record",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, record save!',
        width: 350
      }).then((result) => {
        if (result.value) {
          this.spinnerService.show();
          if (this.f.chrMarkAsReceive.value === true || this.f.chrMarkAsReceive.value === "Y") {
            this.chrMarkAsReceive = "Y";
          }
          else {
            this.chrMarkAsReceive = "N";
          }
          if (this.selectedFileName !== "" && this.selectedFileName !== null && this.selectedFileName !== undefined) {
            //this.loading = true;
            var varOrderNo = this.OrderNo;
            var selectedFileName = this.selectedFileName;
            var varrandomnumber = this.service.getRandomNumberBetween(1000, 1000000);
            var FileName = varOrderNo + "_" + varrandomnumber + "." + selectedFileName.split(".")[selectedFileName.split(".").length - 1];

            this.service.PostFile(this.imageBy64, this.selectedFileName, this.varClientName, this.varClientLink, this.OrderNo, FileName).then(data => {
              //this.loading = false;
              this.spinnerService.hide();
              if (data.Status[0].isValid === true) {
                this.SaveMarkAsReceiveDocument(this.chrMarkAsReceive, FileName);
              }
              else {
                //this.loading = false;
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
          else {
            this.SaveMarkAsReceiveDocument(this.chrMarkAsReceive, "");
          }
        }
      })
    }
    else {
      //this.loading = false;
      this.spinnerService.hide();
      Swal.fire('OFFLINE', 'Please check your internet connectivity and try again.', 'info');
    }
  }

  SaveMarkAsReceiveDocument(MarkAsReceive, SaveFileNmae): void {
    this.chrCancelOrder = "N";
    this.spinnerService.show();
    this.service.ChemistSaveClick(this.varClientName, this.fk_COGlCode, MarkAsReceive, this.chrCancelOrder, SaveFileNmae)
      .then(res => {
        if (res.Status[0].isValid) {
          //this.loading = false;
          this.spinnerService.hide();
          if (res.Status[0].Message === '') {
            Swal.fire({
              position: 'top-center', icon: 'success', title: 'Your record has been saved', showConfirmButton: false, timer: 1500
            })
            this.CheckOrder();
          }
          else {
            Swal.fire('', res.Status[0].Message, 'error');
          }
        }
        else {
          //this.loading = false;
          this.spinnerService.hide();
          Swal.fire('', res.Status[0].Message, 'error');
        }
      });
  }

  backClick(): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You want to leave this screen ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      width: 350
      //confirmButtonText: 'Yes, record save!'
    }).then((result) => {
      if (result.value) {
        this.router.navigateByUrl('/login');
      }
    })
  }


}
