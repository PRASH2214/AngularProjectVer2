import { Component, OnInit, ViewChild, NgModule, OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { Validators, FormGroup, FormBuilder, NgForm, FormControl } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject, Observable, interval, Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/_services';
import { ConnectionService } from 'ng-connection-service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Router, ActivatedRoute } from '@angular/router';
import { parse } from 'querystring';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-chemistproductlist',
  templateUrl: './chemistproductlist.component.html',
  styleUrls: ['./chemistproductlist.component.css']
})
export class ChemistproductlistComponent implements OnInit {
  ChemistProductlist: FormGroup;
  fk_ChemistGlCode: any;
  loading = false;
  isConnected = true;
  private _unsubscribeAll: Subject<any>;
  public isCollapsed: boolean[] = [];

  DivisionList: any;
  ProductList: any;
  products: any;
  ProductListQty = [];
  ProductListwithQty = [];
  varAuthenticate: any;

  private updateSubscription: Subscription;

  @ViewChild('ProductListform', { static: false }) ProductListform: NgForm;
  constructor(private connectionService: ConnectionService, private route: ActivatedRoute, private _formBuilder: FormBuilder, private router: Router, private service: AuthenticationService, private spinnerService: Ng4LoadingSpinnerService) {
    this.connectionService.monitor().subscribe(isConnected => {
      this.isConnected = isConnected;
    })
    this._unsubscribeAll = new Subject();
    this.route.params
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(params => {
        // this.varClientName = "IQAA";
        //localStorage.setItem("varClientName", this.varClientName);
      });
    this.varAuthenticate = localStorage.getItem("authenticate");
    this.fk_ChemistGlCode = localStorage.getItem("fk_ChemistGlCode");
    if (this.varAuthenticate === "false") {
      this.router.navigateByUrl('/login');
    }
  }

  ngOnInit() {
    //this.ChemistProductlist = this._formBuilder.group({
    //  price: ['', Validators.required]
    //});
    this.varAuthenticate = localStorage.getItem("authenticate");
    this.fk_ChemistGlCode = localStorage.getItem("fk_ChemistGlCode");

    if (this.varAuthenticate === "false") {
      this.router.navigateByUrl('/login');
    }

    if (localStorage.getItem("oldroute") == "ChemistPreviewOrder") {
      localStorage.setItem("oldroute", "");
      this.BindProductList();
    }
    else {
      this.GetData();
    }
  }
  ngAfterViewInit() {
    window.scroll(0, 0);
  }
  ValidateText(i,prd) {
    if (i.value.length > 0) {
      i.value = i.value.replace(/[^\d]+/g, '');
      prd.Qty = prd.Qty.replace(/[^\d]+/g, '');
     
    }
   
  }
  CalculateFreeQty(i,prod) {
    if (i.value.length > 0 && prod.intDiscount>0) {
      var discount = prod.intDiscount;
      prod.intFreeQty = Math.floor((prod.Qty * discount) / 100).toString();
    }
    else {
      prod.intFreeQty = '';
    }
}
  keyPress(event: any) {
    if ((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105)) {
      event.returnValue = true;
    }
    else {
      event.returnValue = false;
    }
  }

  GetData() {
    if (this.isConnected) {
      this.spinnerService.show();
      this.service.BindDivisionWiseProductList(this.fk_ChemistGlCode)
        .then(res => {if (res.Status[0].isValid) {
            this.spinnerService.hide();
            this.ProductListQty = [];
            this.DivisionList = res.lstClsDivisionList;
            this.ProductList = res.lstClsProductList;
          }
          else {
            //this.loading = false;
            this.spinnerService.hide();
            Swal.fire('', res.Status[0].Message, 'error');
          }
        });
    }
    else {
      //this.loading = false;
      this.spinnerService.hide();
      Swal.fire('OFFLINE', 'Please check your internet connectivity and try again.', 'info');
    }
  }

  BindProductList(): void {
    if (this.isConnected) {
      //this.loading = true;
      this.spinnerService.show();
      this.service.BindDivisionWiseProductList(this.fk_ChemistGlCode)
        .then(res => {
          if (res.Status[0].isValid) {
            //this.loading = false;
            this.spinnerService.hide();
            this.ProductListQty = [];
            this.DivisionList = res.lstClsDivisionList;
            //this.ProductList = JSON.parse(localStorage.getItem("ProductListwithQty"));
            this.ProductList = JSON.parse(localStorage.getItem("ChemistPreviewBackArray"));
          }
          else {
            // this.loading = false;
            this.spinnerService.hide();
            Swal.fire('', res.Status[0].Message, 'error');
          }
        });
    }
    else {
      //this.loading = false;
      this.spinnerService.hide();
      Swal.fire('OFFLINE', 'Please check your internet connectivity and try again.', 'info');
    }

  }
  isPositiveInteger(n) {
    return n >>> 0 === parseFloat(n);
  }
  ClickNext(): void {
    if (this.isConnected) {
      var blFlag = true;
      this.spinnerService.show();
      var length = 0;
      var TotalQtyLength = 0;
      this.products = this.ProductList.map(v => {
        if (v.fk_ProductGlCode) {
          length = length + 1;//Check Total Length
        }
        if (v.Qty === null || v.Qty === "" || v.Qty === undefined || parseInt(v.Qty) <= 0) {
          TotalQtyLength = TotalQtyLength + 1;//Check blank and enter zero value
        }
        else {
          if (this.isPositiveInteger(v.Qty) === false) {
            blFlag = false;
          }
        }
      })
      if (blFlag = false) {
        Swal.fire('', 'Allow only numeric value.', 'info');
        return;
      }
      if (TotalQtyLength === length) {
        //this.loading = false;
        this.spinnerService.hide();
        Swal.fire('', 'Please enter Qty greater than 0 for atleast 1 Product.', 'info');
        return;
      }

      this.products = this.ProductList.map(v => {
        if (v.fk_ProductGlCode) {
          // if (v.Qty != null && v.Qty != "" && v.Qty != undefined && v.Qty != 0) {
          this.ProductListQty.push(v);
          //}
        }
      })

      this.spinnerService.hide();
      this.ProductListwithQty = JSON.parse(JSON.stringify(this.ProductListQty));//Copy Array into New array
      localStorage.setItem("ProductListwithQty", JSON.stringify(this.ProductListwithQty));
      localStorage.setItem("oldroute", "");
      this.router.navigateByUrl('/previeworder');
    }
    else {
      //this.loading = false;
      this.spinnerService.hide();
      Swal.fire('OFFLINE', 'Please check your internet connectivity and try again.', 'info');
    }
  }

  BackClick(): void {
    localStorage.setItem("oldroute", "");
    this.router.navigateByUrl('/orderlist');
  }
}
