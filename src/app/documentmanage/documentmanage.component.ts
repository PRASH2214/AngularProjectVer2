import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, Injectable } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { BehaviorSubject, Subject } from 'rxjs';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DxTreeViewModule, DxTreeListModule } from 'devextreme-angular';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil, filter } from 'rxjs/operators';
import { ConnectionService } from 'ng-connection-service';
import { MatDatepicker, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatDatepickerInputEvent } from '@angular/material';
import { FormControl } from '@angular/forms';
import { EventEmitter } from 'events';
import { NgModule, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import {
  DxSelectBoxModule,
  DxCheckBoxModule,
  DxDateBoxModule,
  DxCalendarModule,
  DxTemplateModule
} from 'devextreme-angular';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { AuthenticationService } from 'src/app/_services';
export class Product {
  ID: string;
  name: string;
  expanded?: boolean;
  categoryId?: string;
  icon?: string;
  chrElement_Type: string;
}
@Component({
  selector: 'app-documentmanage',
  templateUrl: './documentmanage.component.html',
  styleUrls: ['./documentmanage.component.css']
})
export class DocumentmanageComponent implements OnInit {
  AlertMessage: any;
  isPopupAlertVisible: any;
  result: any;
  products: Product[];
  blob: any;
  file: any;
  DownloadURL: any;
  fk_PersonGlCode: any;
  varClientName: any;
  varClientLink: any;
  status = 'ONLINE';
  isConnected = true;
  private _unsubscribeAll: Subject<any>;
  constructor(private connectionService: ConnectionService, private TdcService: AuthenticationService, private http: HttpClient, private route: ActivatedRoute, private router: Router,
    private spinnerService: Ng4LoadingSpinnerService) {
    this.connectionService.monitor().subscribe(isConnected => {
      this.isConnected = isConnected;
    })
    this._unsubscribeAll = new Subject();
    this.route.params
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(params => {
        this.varClientName = params["varClientName"];
        this.fk_PersonGlCode = params["fk_PersonGlCode"];
      });
    this.BindMenu();

  }
  btnOK(): void {
    this.isPopupAlertVisible = false;
  }
  show() {
    this.spinnerService.show();
    setTimeout(() => this.spinnerService.hide(), 1000)
  }
  selectItem(e) {
    if (this.isConnected) {
      this.status = "ONLINE";
      if (e.itemData.chrElement_Type == 'l') {
        var varExtension = e.itemData.url.substr(e.itemData.url.lastIndexOf('.') + 1);
        if (!(varExtension == "apk" || varExtension == "zip")) {
          this.TdcService.GetDownloadLink(e.itemData.url, e.itemData.varClientLink)
            .then(res => {

              if (res == 'N') {
                this.AlertMessage = "File not exist";
                this.isPopupAlertVisible = true;
              }
              else {
                this.show();
                var link = document.createElement('a');
                link.href = e.itemData.varClientLink + "frmDownloadFile.aspx?ID=" + e.itemData.url + "";
                // link.target = "_blank";
                link.click();
                link.remove();
              }
            });
        }
      }
    }
    else {
      this.status = "OFFLINE";
      this.AlertMessage = "Please check your internet connectivity and try again.";
      this.isPopupAlertVisible = true;
    }
  }
  BindMenu(): void {
    this.TdcService.GetMenuList(this.fk_PersonGlCode, this.varClientName)
      .then(res => {
        this.products = res.FileNode;
      });
  }
  ngOnInit() {
  }

}
