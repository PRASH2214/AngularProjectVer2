import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AuthenticationService } from 'src/app/_services';
import { ConnectionService } from 'ng-connection-service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Router, ActivatedRoute } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-chemistprevieworder',
  templateUrl: './chemistprevieworder.component.html',
  styleUrls: ['./chemistprevieworder.component.css']
})
export class ChemistprevieworderComponent implements OnInit {
  Fk_ChemistGlCode: any;
  PreviewOrderForm: FormGroup;
  ProductPreviewList = [];
  ProductPreviewList_BackList = [];
  PrefereStockist: any;
  PrefereStockistName: any;
  loading = false;
  isConnected = true;
  varAuthenticate: any;
  private _unsubscribeAll: Subject<any>;
  constructor(private connectionService: ConnectionService, private route: ActivatedRoute, private router: Router, private service: AuthenticationService, private _formBuilder: FormBuilder, private spinnerService: Ng4LoadingSpinnerService) {
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
    this.Fk_ChemistGlCode = localStorage.getItem('fk_ChemistGlCode');
    
    if (this.varAuthenticate === "false") {
      
      this.router.navigateByUrl('/login');
    }
  }

  ngOnInit() {
    this.PreviewOrderForm = this._formBuilder.group({
      fk_PrefStockist: ['', Validators.required]
    });
    this.varAuthenticate = localStorage.getItem("authenticate");
    this.Fk_ChemistGlCode = localStorage.getItem('fk_ChemistGlCode');
    

    if (this.varAuthenticate === "false") {
     
      this.router.navigateByUrl('/login');
    }

    this.GetProductPriviewData();
    this.BindPrefereStockist();
  }

  get f() { return this.PreviewOrderForm.controls; }

  GetProductPriviewData(): void {
    //this.ProductPreviewList = JSON.parse(localStorage.getItem('ProductListwithQty'));
    this.ProductPreviewList_BackList = JSON.parse(localStorage.getItem('ProductListwithQty'));
    JSON.parse(localStorage.getItem('ProductListwithQty')).map(v => {
      if (v.fk_ProductGlCode) {
        if (v.Qty != null && v.Qty != "" && v.Qty != undefined && v.Qty != 0) {
          this.ProductPreviewList.push(v);
        }
      }
    })
  }


  BindPrefereStockist(): void {
    if (this.isConnected) {

      //this.loading = true;
      this.spinnerService.show();
      this.service.BindPrefereStockist(this.Fk_ChemistGlCode)
        .then(res => {
          if (res.Status[0].isValid) {
            //this.loading = false;
            this.spinnerService.hide();
            if (res.lstClsprefStockist != null) {
              this.PrefereStockist = res.lstClsprefStockist;
              this.PrefereStockistName = res.Status[0].varStockistname;
            }
            else {
              //this.loading = false;
              this.spinnerService.hide();
              Swal.fire('', res.lstClsChemistLogin[0].varMessage, 'error');
            }
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

  DeleteProduct(id): void {
    const DeleteArryID = this.ProductPreviewList.map(item => item.fk_ProductGlCode).indexOf(id);
    this.ProductPreviewList.splice(DeleteArryID, 1);
    const targetIdx = this.ProductPreviewList_BackList.map(item => item.fk_ProductGlCode).indexOf(id);
    this.ProductPreviewList_BackList[targetIdx].Qty = "";
    this.ProductPreviewList_BackList[targetIdx].intFreeQty = "";
  }

  SaveOrder(): void {
    if (this.isConnected) {
      if (this.f.fk_PrefStockist.value == "") {
        //this.loading = false;
        this.spinnerService.hide();
        Swal.fire('', 'Please select prefer ' + this.PrefereStockistName.toLowerCase(), 'info');
        return;
      }
      if (this.ProductPreviewList.length == 0) {
        //this.loading = false;
        this.spinnerService.hide();
        Swal.fire('', 'Please enter Qty greater than 0 for atleast 1 Product.', 'info');
        return;
      }

      Swal.fire({
        title: 'Are you sure?',
        text: "You want to save this order",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, order save!'
      }).then((result) => {
        if (result.value) {
          //this.loading = true;
          this.spinnerService.show();
          this.service.SaveOrder(this.Fk_ChemistGlCode, this.f.fk_PrefStockist.value, this.ProductPreviewList)
            .then(res => {
              if (res.Status[0].isValid) {
                //this.loading = false;
                this.spinnerService.hide();
                if (res.Status[0].Message == "") {
                  Swal.fire({
                    position: 'top-center', icon: 'success', title: 'Your order has been saved', showConfirmButton: false, timer: 1500
                  })
                  this.router.navigateByUrl('/orderlist');
                }
                else {
                  //this.loading = false;
                  this.spinnerService.hide();
                  Swal.fire('', res.Status[0].Message, 'error');
                }
              }
              else {
                //this.loading = false;
                this.spinnerService.hide();
                Swal.fire('', res.Status[0].Message, 'error');
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
      })
    }
    else {
      //this.loading = false;
      this.spinnerService.hide();
      Swal.fire('OFFLINE', 'Please check your internet connectivity and try again.', 'info');
    }
  }

  backClick(): void {
    //var ProductPriview = this.ProductPreviewList;
    //var t2 = JSON.parse(localStorage.getItem('ProductListwithQty'));

    //JSON.parse(localStorage.getItem('ProductListwithQty')).map(v => {
    //  //var VNewItem = JSON.parse(localStorage.getItem('ProductListwithQty')).map(item => ProductPriview.fk_ProductGlCode);
    //  ProductPriview.map(V1 => {         
    //    if (v.fk_ProductGlCode === V1.fk_ProductGlCode) {
    //      this.ProductPreviewList_BackList.push(V1);
    //      return;
    //    }
    //    else {
    //      v.Qty = "";
    //      this.ProductPreviewList_BackList.push(v);
    //      return;
    //    }        
    //  })
    //})

    localStorage.setItem("ChemistPreviewBackArray", JSON.stringify(this.ProductPreviewList_BackList));
    localStorage.setItem("oldroute", "ChemistPreviewOrder");
    this.router.navigateByUrl('/productlist');
  }

}
