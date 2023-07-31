import { Component, OnInit, enableProdMode, ViewChild } from '@angular/core';
import { Data } from '@angular/router';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { DxChartComponent } from 'devextreme-angular';
import { HttpEventType, HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import { AuthenticationService } from '../_services';


if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'app-emp-sales-dashboard',
  templateUrl: './emp-sales-dashboard.component.html',
  styleUrls: ['./emp-sales-dashboard.component.css']
})
export class EmpSalesDashboardComponent implements OnInit {

  @ViewChild("chartTarget_Prim_Sec_Sales", { static: false }) chartTarget_Prim_Sec_Sales: DxChartComponent;
  @ViewChild("chartStokistWiseSalesTop5", { static: false }) chartStokistWiseSalesTop5: DxChartComponent;
  @ViewChild("chartStokistWiseSalesBottom5", { static: false }) chartStokistWiseSalesBottom5: DxChartComponent;
  @ViewChild("chartProductSales", { static: false }) chartProductSales: DxChartComponent;

  @ViewChild(DxChartComponent, { static: false }) chart: DxChartComponent;


  private _unsubscribeAll: Subject<any>;
  empsalesdashboard: any;

  Target_Prim_Sec_Sales: Data[];
  Stokist_WiseSalesDataSourceTop5: Data[];
  Stokist_WiseSalesDataSourceBottom5: Data[];
  Product_WiseSalesDataSource: Data[];


  lblTargetVal: any;
  lblPrimarySalesVal: any;
  lblSecondarySalesVal: any;
  lblPrimAchievementval: any;
  lblYPM: any;
  varClientName: any;
  fk_EmpGlCode_Login: any;
  fk_DivisionGlCode: any;
  fk_DesiGlCode: any;
  fk_EmpGlCode: any;
  varProductGlCode: any;
  dtSelectedMonth: any;
  test: any;
  iSShowTop5: boolean = true;
  iSShowBottom5: boolean = false;
  dtFromMonth: any;
  dtToMonth: any;
  varDesignationName: any;
  fk_EmpGlCodeSelect: any;
  isShowBack: boolean = false;
  chrDesiLevel: any = "L";
  varDesiorder: any;
  chrBack: any;
  fk_EmpGlCode_Sr: any;
  chrDrillDown: any;
  fk_ChannelGlCode: any = 0;
  APIURL: any;
  constructor(private service: AuthenticationService, config: NgbCarouselConfig, private route: ActivatedRoute, private router: Router, private http: HttpClient) {
    config.interval = 1500;
    config.wrap = false;
    config.keyboard = false;
    config.pauseOnHover = false;
    config.wrap = true;
    this._unsubscribeAll = new Subject();
    this.iSShowTop5 = true;
    this.iSShowBottom5 = false;


    this.route.params
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(params => {
        this.varClientName = params["varClientName"];

        this.dtFromMonth = params["dtFromMonth"];
        this.dtToMonth = params["dtToMonth"];
        this.fk_EmpGlCode_Login = params["fk_EmpGlCode_Login"];
        this.fk_DivisionGlCode = params["fk_DivisionGlCode"];
        this.fk_DesiGlCode = params["fk_DesiGlCode"];
        this.fk_EmpGlCode = params["fk_EmpGlCode"];
        this.varProductGlCode = params["varProductGlCode"];
        this.fk_EmpGlCodeSelect = params["fk_EmpGlCodeSelect"];
        this.varDesiorder = params["varDesiorder"];

      });
    this.EmpSalesDashboard_GetBlockSummary(this.varClientName, this.dtFromMonth, this.dtToMonth, this.fk_EmpGlCode_Login, this.fk_DivisionGlCode, this.fk_DesiGlCode, this.fk_EmpGlCode, this.varProductGlCode);
  }
  ngOnInit() {

  }

  customizeTooltip = (arg) => {
    return {
      //html: '<div class="prashant"> Series: '+ arg.seriesName+'<br> <p style="word-wrap: break-word;"> Point: ' + arg.argument +' </p> <br> Value: ' + arg.valueText +' </div>'
      html: '<div class="prashant"><table style="width:180px"><tr><td> ' + arg.seriesName + ' : ' + arg.valueText + ' </td></tr></table> </div>'
    };
  }
  // customizeTooltip(arg: any) {
  //   return {
  //     //text: arg.argumentText + "<br/>" + arg.valueText
  //     text: '<div class="prashant"> Series: '+ arg.seriesName+'<br> Point: ' + arg.argument +'<br> Value: ' + arg.valueText + '</div>'
  //   };
  // }


  chart_onLegendClick = (arg) => {
    var series = arg.target;
    if (series.isVisible()) {
      series.hide();
    } else {
      series.show();
    }
  }

  customizeHint = (arg1) => {
    return arg1.valueText;
  }

  customizeText = (arg) => {
    if (arg.valueText.length > 6) {
      return arg.valueText.toString().substring(0, 6) + '..';
    }
    else {
      return arg.valueText;
    }
  }

  customizeText_Stockist = (arg) => {
    if (arg.valueText.length > 20) {
      return arg.valueText.toString().substring(0, 20) + '..';
    }
    else {
      return arg.valueText;
    }
  }

  onItemChanged(item) {
    if (item.value == "0") {
      this.iSShowTop5 = true;
      this.iSShowBottom5 = false;
    }
    else {
      this.iSShowTop5 = false;
      this.iSShowBottom5 = true;
    }
    this.fk_ChannelGlCode = 0;

    this.chartProductSales.instance.showLoadingIndicator();
    this.EmpSalesDashboard_StockistWise(this.varClientName, this.dtFromMonth, this.dtToMonth, this.fk_EmpGlCode_Login, this.fk_DivisionGlCode, this.fk_DesiGlCode, this.fk_EmpGlCode, this.varProductGlCode, this.chrDesiLevel, this.fk_EmpGlCodeSelect, this.varDesiorder);
  }

  onPatchPointClick_Target_Prim_Sec_Sales(arg) {
    let point = arg.target;
    this.fk_EmpGlCodeSelect = point.data.fk_EmpGlcode;
    this.fk_ChannelGlCode = 0;
    if (this.chrDrillDown == "Y") {

      this.chrDesiLevel = "L";

      this.chartTarget_Prim_Sec_Sales.instance.showLoadingIndicator();
      if (this.iSShowTop5 == true) {
        this.chartStokistWiseSalesTop5.instance.showLoadingIndicator();
      }
      else {
        this.chartStokistWiseSalesBottom5.instance.showLoadingIndicator();
      }
      this.chartProductSales.instance.showLoadingIndicator();

      this.EmpSalesDashboard_Target_Prim_Sec_Sales(this.varClientName, this.dtFromMonth, this.dtToMonth, this.fk_EmpGlCode_Login, this.fk_DivisionGlCode, this.fk_DesiGlCode, this.fk_EmpGlCode, this.varProductGlCode, this.chrDesiLevel, this.fk_EmpGlCodeSelect, this.varDesiorder);
    }
    else {
      if (this.iSShowTop5 == true) {
        this.chartStokistWiseSalesTop5.instance.showLoadingIndicator();
      }
      else {
        this.chartStokistWiseSalesBottom5.instance.showLoadingIndicator();
      }
      this.chartProductSales.instance.showLoadingIndicator();

      this.EmpSalesDashboard_StockistWise(this.varClientName, this.dtFromMonth, this.dtToMonth, this.fk_EmpGlCode_Login, this.fk_DivisionGlCode, this.fk_DesiGlCode, this.fk_EmpGlCode, this.varProductGlCode, this.chrDesiLevel, this.fk_EmpGlCodeSelect, this.varDesiorder);
    }
  }

  onPatchPointClick_Stockist_Sales(arg) {
    let point = arg.target;
    if (point.isSelected()) {
      point.clearSelection()
      this.fk_ChannelGlCode = 0;
    } else {
      point.select();
      this.fk_ChannelGlCode = point.data.fk_ChannelGlCode;
    }

    this.chartProductSales.instance.showLoadingIndicator();

    this.EmpSalesDashboard_ProducttWise(this.varClientName, this.dtFromMonth, this.dtToMonth, this.fk_EmpGlCode_Login, this.fk_DivisionGlCode, this.fk_DesiGlCode, this.fk_EmpGlCode, this.varProductGlCode, this.chrDesiLevel, this.fk_EmpGlCodeSelect, this.varDesiorder, this.fk_ChannelGlCode);
  }

  Chart_Click(e: any) {
    e.element.querySelectorAll(".dxc-series").forEach((el) => {
      el.style.cursor = "pointer";
    });
  }

  EmpSalesDashboard_GetBlockSummary(varClientName, dtFromMonth, dtToMonth, fk_EmpGlCode_Login, fk_DivisionGlCode, fk_DesiGlCode, fk_EmpGlCode, varProductGlCode) {
    this.service.EmpSalesDashboard_GetBlockSummary(varClientName, dtFromMonth, dtToMonth, fk_EmpGlCode_Login, fk_DivisionGlCode, fk_DesiGlCode, fk_EmpGlCode, varProductGlCode)
      .then(res => {
        if (res.Status[0].isValid) {
          this.lblTargetVal = res.lstClsEmpSalesBlockSummary[0].varResult1;
          this.lblPrimarySalesVal = res.lstClsEmpSalesBlockSummary[1].varResult1;
          this.lblSecondarySalesVal = res.lstClsEmpSalesBlockSummary[2].varResult1;
          this.lblPrimAchievementval = res.lstClsEmpSalesBlockSummary[3].varResult1;
          this.lblYPM = res.lstClsEmpSalesBlockSummary[4].varResult1;
        }
        else {
          this.lblTargetVal = 0;
          this.lblPrimarySalesVal = 0;
          this.lblSecondarySalesVal = 0;
          this.lblPrimAchievementval = 0;
          this.lblYPM = 0;
        }
        this.EmpSalesDashboard_Target_Prim_Sec_Sales(this.varClientName, this.dtFromMonth, this.dtToMonth, this.fk_EmpGlCode_Login, this.fk_DivisionGlCode, this.fk_DesiGlCode, this.fk_EmpGlCode, this.varProductGlCode, this.chrDesiLevel, this.fk_EmpGlCodeSelect, this.varDesiorder);

      });
  }

  EmpSalesDashboard_Target_Prim_Sec_Sales(varClientName, dtFromMonth, dtToMonth, fk_EmpGlCode_Login, fk_DivisionGlCode, fk_DesiGlCode, fk_EmpGlCode, varProductGlCode, chrDesiLevel, fk_EmpGlCodeSelect, varDesiorder) {
    this.service.EmpSalesDashboard_Target_Prim_Sec_Sales(varClientName, dtFromMonth, dtToMonth, fk_EmpGlCode_Login, fk_DivisionGlCode, fk_DesiGlCode, fk_EmpGlCode, varProductGlCode, chrDesiLevel, fk_EmpGlCodeSelect, varDesiorder)
      .then(res => {
        if (res.Status[0].isValid) {
          this.Target_Prim_Sec_Sales = res.lstClsTarget_Prim_Sec_Sales;
          if (res.lstClsTarget_Prim_Sec_Sales.length != 0) {
            this.varDesignationName = res.lstClsTarget_Prim_Sec_Sales[0].varDesiName;
            this.chrBack = res.lstClsTarget_Prim_Sec_Sales[0].chrback;
            this.fk_EmpGlCode_Sr = res.lstClsTarget_Prim_Sec_Sales[0].fk_EmpGlCode_Sr;
            this.varDesiorder = res.lstClsTarget_Prim_Sec_Sales[0].intDesiOrder;
            if (res.lstClsTarget_Prim_Sec_Sales[0].chrback == "Y") {
              this.isShowBack = true;
            }
            else {
              this.isShowBack = false;
            }
            this.chrDrillDown = res.lstClsTarget_Prim_Sec_Sales[0].charDrillDown;
          }
          this.chartTarget_Prim_Sec_Sales.instance.hideLoadingIndicator();
          this.EmpSalesDashboard_StockistWise(this.varClientName, this.dtFromMonth, this.dtToMonth, this.fk_EmpGlCode_Login, this.fk_DivisionGlCode, this.fk_DesiGlCode, this.fk_EmpGlCode, this.varProductGlCode, this.chrDesiLevel, this.fk_EmpGlCodeSelect, this.varDesiorder);
        }
      });
  }

  EmpSalesDashboard_StockistWise(varClientName, dtFromMonth, dtToMonth, fk_EmpGlCode_Login, fk_DivisionGlCode, fk_DesiGlCode, fk_EmpGlCode, varProductGlCode, chrDesiLevel, fk_EmpGlCodeSelect, varDesiorder) {
    this.service.EmpSalesDashboard_StockistWise(varClientName, dtFromMonth, dtToMonth, fk_EmpGlCode_Login, fk_DivisionGlCode, fk_DesiGlCode, fk_EmpGlCode, varProductGlCode, chrDesiLevel, fk_EmpGlCodeSelect, varDesiorder)
      .then(res => {
        if (res.Status[0].isValid) {
          this.Stokist_WiseSalesDataSourceTop5 = res.lstClsStockist_WiseTop5;
          this.Stokist_WiseSalesDataSourceBottom5 = res.lstClsStockist_WiseBottom5;

          if (this.iSShowTop5 == true) {
            this.chartStokistWiseSalesTop5.instance.hideLoadingIndicator();
          }
          else {
            this.chartStokistWiseSalesBottom5.instance.hideLoadingIndicator();
          }
          this.EmpSalesDashboard_ProducttWise(this.varClientName, this.dtFromMonth, this.dtToMonth, this.fk_EmpGlCode_Login, this.fk_DivisionGlCode, this.fk_DesiGlCode, this.fk_EmpGlCode, this.varProductGlCode, this.chrDesiLevel, this.fk_EmpGlCodeSelect, this.varDesiorder, this.fk_ChannelGlCode);
        }
      });
  }

  EmpSalesDashboard_ProducttWise(varClientName, dtFromMonth, dtToMonth, fk_EmpGlCode_Login, fk_DivisionGlCode, fk_DesiGlCode, fk_EmpGlCode, varProductGlCode, chrDesiLevel, fk_EmpGlCodeSelect, varDesiorder, fk_ChannelGlCode) {
    this.service.EmpSalesDashboard_ProducttWise(varClientName, dtFromMonth, dtToMonth, fk_EmpGlCode_Login, fk_DivisionGlCode, fk_DesiGlCode, fk_EmpGlCode, varProductGlCode, chrDesiLevel, fk_EmpGlCodeSelect, varDesiorder, fk_ChannelGlCode)
      .then(res => {
        if (res.Status[0].isValid) {
          this.Product_WiseSalesDataSource = res.lstClsProduct_Wise_Sales;
          this.chartProductSales.instance.hideLoadingIndicator();
        }
      });
  }

  BackSales() {
    this.fk_ChannelGlCode = 0;
    this.chrDesiLevel = "U";
    this.fk_EmpGlCodeSelect = this.fk_EmpGlCode_Sr;

    this.chartTarget_Prim_Sec_Sales.instance.showLoadingIndicator();
    if (this.iSShowTop5 == true) {
      this.chartStokistWiseSalesTop5.instance.showLoadingIndicator();
    }
    else {
      this.chartStokistWiseSalesBottom5.instance.showLoadingIndicator();
    }
    this.chartProductSales.instance.showLoadingIndicator();
    this.EmpSalesDashboard_Target_Prim_Sec_Sales(this.varClientName, this.dtFromMonth, this.dtToMonth, this.fk_EmpGlCode_Login, this.fk_DivisionGlCode, this.fk_DesiGlCode, this.fk_EmpGlCode, this.varProductGlCode, this.chrDesiLevel, this.fk_EmpGlCodeSelect, this.varDesiorder);
  }
}
