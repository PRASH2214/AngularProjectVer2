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
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})



export class DashboardComponent implements OnInit {

  @ViewChild("chartSpecialityWiseUser", { static: false }) chartSpecialityWiseUser: DxChartComponent;
  @ViewChild("chartSpecialityWisePOB", { static: false }) chartSpecialityWisePOB: DxChartComponent;
  //@ViewChild("chartSpecialityWiseCoveredVsMised", { static: false }) chartSpecialityWiseCoveredVsMised: DxChartComponent;

  @ViewChild("chartPatchwiseUserTop10", { static: false }) chartPatchwiseUserTop10: DxChartComponent;
  @ViewChild("chartPatchwiseUserBottom10", { static: false }) chartPatchwiseUserBottom10: DxChartComponent;
  @ViewChild("chartPatchwisePOBTop10", { static: false }) chartPatchwisePOBTop10: DxChartComponent;
  @ViewChild("chartPatchwisePOBBottom10", { static: false }) chartPatchwisePOBBottom10: DxChartComponent;

  @ViewChild("chartProductPlannedVsActualUser", { static: false }) chartProductPlannedVsActualUser: DxChartComponent;
  @ViewChild("chartProductPlannedVsActualUsage", { static: false }) chartProductPlannedVsActualUsage: DxChartComponent;

  @ViewChild("chartUserTrend", { static: false }) chartUserTrend: DxChartComponent;
  @ViewChild("chartPOBTrend", { static: false }) chartPOBTrend: DxChartComponent;
  //@ViewChild("chartCoverageTrend", { static: false }) chartCoverageTrend: DxChartComponent;
  @ViewChild("ChartPlannedVsActualUser", { static: false }) ChartPlannedVsActualUser: DxChartComponent;
  @ViewChild("ChartPlannedVsActualPOB", { static: false }) ChartPlannedVsActualPOB: DxChartComponent;

  @ViewChild(DxChartComponent, { static: false }) chart: DxChartComponent;

  private _unsubscribeAll: Subject<any>;

  patchdataSourceTop10: Data[];
  patchdataSourceBottom10: Data[];

  specialtyDataSource: Data[];
  productDataSource: Data[];
  monthWiseDataSource: Data[];
  PlannedVsActual: Data[];

  lblDoctorCoverageVal: any;
  lblDoctorCoveragePer: any;
  lblPlannedUsersVal: any;
  lblPlannedUsersValPer: any;
  lblActualUsersVal: any;
  lblActualUsersPer: any;
  lblPlannedPOBVal: any;
  lblPlannedPOBPer: any;
  lblActualPOBVal: any;
  lblActualPOBPer: any;
  lblPlannedtoA_Val: any;
  lblPlannedtoA_Per: any;
  lblSelectedPatch: any = "All";
  lblSelectedSpecialty: any = "All";
  fk_PatchGlCode: any = 0;
  fk_SpecialtyGlCode: any = 0;
  varClientName: any;
  dtMonth: any;
  fk_EmpGlCode_Login: any;
  fk_DivisionGlCode: any;
  fk_DesiGlCode: any;
  fk_EmpGlCode: any;
  varProductGlCode: any;
  chrType: any;
  Speciality_Title: any;
  SpecialtyWiseUsers: any;
  SpecialtyWisePOB: any;
  SpecialtyWiseCoveredVsMissed: any;
  dtSelectedMonth: any;
  test: any;
  iSShowTop10: boolean = true;
  iSShowBottom10: boolean = false;
  dtFromMonth: any;
  dtToMonth: any;
  varDesignationName: any;

  isShowBack: boolean = false;
  chrDesiLevel: any = "L";
  varDesiorder: any;
  chrBack: any;
  chrDrillDown: any;
  fk_EmpGlCodeSelect: any;
  fk_EmpGlCode_Sr: any;


  constructor(private service: AuthenticationService, config: NgbCarouselConfig, private route: ActivatedRoute, private router: Router, private http: HttpClient) {
    config.interval = 1500;
    config.wrap = false;
    config.keyboard = false;
    config.pauseOnHover = false;
    config.wrap = true;
    this._unsubscribeAll = new Subject();
    this.iSShowTop10 = true;
    this.iSShowBottom10 = false;

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
        this.chrType = params["chrType"];
        this.Speciality_Title = params["Speciality_Title"];
        this.SpecialtyWiseUsers = params["Speciality_Title"] + ' Wise Users';
        this.SpecialtyWisePOB = params["Speciality_Title"] + ' Wise POB';
        this.SpecialtyWiseCoveredVsMissed = params["Speciality_Title"] + ' Wise Covered Vs Missed';
        this.fk_EmpGlCodeSelect = params["fk_EmpGlCodeSelect"];
        this.varDesiorder = params["varDesiorder"];
        //this.varDesignationName = 'SM';

      });

    this.DRPOBDashboard_GetBlockSummary(this.varClientName, this.dtFromMonth, this.dtToMonth, this.fk_EmpGlCode_Login, this.fk_DivisionGlCode, this.fk_DesiGlCode, this.fk_EmpGlCode, this.varProductGlCode, this.chrType);

  }

  customizeLabelPlanUser(arg) {
    if (arg.valueText != 0) {
      return arg.valueText;
    }
  }
  customizeLabelActualUser(arg) {
    if (arg.valueText != 0) {
      return arg.valueText;
    }
  }
  customizeLabelPlanPOB(arg) {
    if (arg.valueText != 0) {
      return arg.valueText;
    }
  }
  customizeLabelActualPOB(arg) {
    if (arg.valueText != 0) {
      return arg.valueText;
    }
  }
  customizeLabelMissedOpp(arg) {
    if (arg.valueText != 0) {
      return arg.valueText;
    }
  }

  tabChanged(event) {
    this.refresh();
  }
  refresh() {
    this.chartSpecialityWiseUser.instance.refresh();
    this.chartSpecialityWisePOB.instance.refresh();
    // this.chartSpecialityWiseCoveredVsMised.instance.refresh();
  }
  customizeTooltip = (arg) => {
    if (arg.seriesName == "Sum of Actual Users" || arg.seriesName == "Sum of Actual POB") {
      return {
        html: ' <div class="prashant1"> <table style="width:150px"><tr><td>' + arg.seriesName + ' : ' + arg.valueText + '</td></tr><tr><td> Contr: ' + arg.point.data.intContribution + '</td></tr></table> </div> '
      };
    }
    else {
      return {
        //html: ' <div class="prashant"> Series "' + arg.seriesName + '" Point "' + arg.argumentText + '"  Value :' + arg.valueText + ' </div> '
        html: ' <div class="prashant">' + arg.seriesName + ' : ' + arg.valueText + '</div> '
      };
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

  onSpecialtyPointClick(arg) {
    let point = arg.target;
    if (point.isSelected()) {
      point.clearSelection();
      this.lblSelectedSpecialty = "All";
      this.fk_SpecialtyGlCode = 0;
    } else {
      point.select();
      this.fk_SpecialtyGlCode = point.data.fk_SpecialtyGlCode;
      this.lblSelectedSpecialty = point.data.varSpecialtyName;
    }

    this.chartProductPlannedVsActualUsage.instance.showLoadingIndicator();
    this.chartProductPlannedVsActualUser.instance.showLoadingIndicator();

    this.chartUserTrend.instance.showLoadingIndicator();
    this.chartPOBTrend.instance.showLoadingIndicator();
    //this.chartCoverageTrend.instance.showLoadingIndicator();

    this.DRPOBDashboard_ProductAnalysis(this.varClientName, this.dtFromMonth, this.dtToMonth, this.fk_EmpGlCode_Login, this.fk_DivisionGlCode, this.fk_DesiGlCode, this.fk_EmpGlCode, this.varProductGlCode, this.chrType, this.fk_PatchGlCode, this.fk_SpecialtyGlCode);
  }

  onPatchPointClick(arg) {
    let point = arg.target;

    if (point.isSelected()) {
      point.clearSelection();
      this.lblSelectedPatch = "All";
      this.fk_PatchGlCode = 0;
    } else {
      point.select();
      this.fk_PatchGlCode = point.data.Fk_PatchGlCode;
      this.lblSelectedPatch = point.data.varPatchName;
    }
    this.chartSpecialityWiseUser.instance.showLoadingIndicator();
    this.chartSpecialityWisePOB.instance.showLoadingIndicator();
    // this.chartSpecialityWiseCoveredVsMised.instance.showLoadingIndicator();

    this.chartProductPlannedVsActualUsage.instance.showLoadingIndicator();
    this.chartProductPlannedVsActualUser.instance.showLoadingIndicator();

    this.chartUserTrend.instance.showLoadingIndicator();
    this.chartPOBTrend.instance.showLoadingIndicator();
    //this.chartCoverageTrend.instance.showLoadingIndicator();

    this.DRPOBDashboard_SpecialtyAnalysis(this.varClientName, this.dtFromMonth, this.dtToMonth, this.fk_EmpGlCode_Login, this.fk_DivisionGlCode, this.fk_DesiGlCode, this.fk_EmpGlCodeSelect, this.varProductGlCode, this.chrType, this.fk_PatchGlCode);


  }

  onPatchPointClick_PlannedVsActualUser(arg) {
    let point = arg.target;

    //this.isShowBack = true;

    this.lblSelectedSpecialty = "All";
    this.lblSelectedPatch = "All";
    this.fk_PatchGlCode = 0;

    this.fk_EmpGlCodeSelect = point.data.fk_EmpGlcode;


    if (this.chrDrillDown == "Y") {

      this.chrDesiLevel = "L";

      this.chartSpecialityWiseUser.instance.showLoadingIndicator();
      this.chartSpecialityWisePOB.instance.showLoadingIndicator();
      // this.chartSpecialityWiseCoveredVsMised.instance.showLoadingIndicator();

      this.chartProductPlannedVsActualUsage.instance.showLoadingIndicator();
      this.chartProductPlannedVsActualUser.instance.showLoadingIndicator();

      this.chartUserTrend.instance.showLoadingIndicator();
      this.chartPOBTrend.instance.showLoadingIndicator();
      //this.chartCoverageTrend.instance.showLoadingIndicator();


      //this.ChartPlannedVsActualPOB.instance.showLoadingIndicator();


      this.DRPOBDashboard_PlannedVsActualPOB(this.varClientName, this.dtFromMonth, this.dtToMonth, this.fk_EmpGlCode_Login, this.fk_DivisionGlCode, this.fk_DesiGlCode, this.fk_EmpGlCode, this.varProductGlCode, this.chrType, this.chrDesiLevel, this.fk_EmpGlCodeSelect, this.varDesiorder);
    }
    else {
      this.DRPOBDashboard_PatchAnalysis(this.varClientName, this.dtFromMonth, this.dtToMonth, this.fk_EmpGlCode_Login, this.fk_DivisionGlCode, this.fk_DesiGlCode, this.fk_EmpGlCodeSelect, this.varProductGlCode, this.chrType);
    }
  }

  chart_onLegendClick = (arg) => {
    var series = arg.target;
    if (series.isVisible()) {
      series.hide();
    } else {
      series.show();
    }
  }

  ngAfterViewInit() {
  }
  ngOnInit() {
  }

  DRPOBDashboard_GetBlockSummary(varClientName, dtFromMonth, dtToMonth, fk_EmpGlCode_Login, fk_DivisionGlCode, fk_DesiGlCode, fk_EmpGlCode, varProductGlCode, chrType) {
    this.service.DRPOBDashboard_GetBlockSummary(varClientName, dtFromMonth, dtToMonth, fk_EmpGlCode_Login, fk_DivisionGlCode, fk_DesiGlCode, fk_EmpGlCode, varProductGlCode, chrType)
      .then(res => {
        if (res.Status[0].isValid) {
          //this.lblDoctorCoverageVal = res.lstClsBlockSummary[0].varResult1;
          //this.lblDoctorCoveragePer = res.lstClsBlockSummary[0].varResult2;
          this.lblPlannedUsersVal = res.lstClsBlockSummary[0].varResult1;
          //this.lblPlannedUsersValPer = res.lstClsBlockSummary[1].varResult2;
          this.lblActualUsersVal = res.lstClsBlockSummary[1].varResult1;
          //this.lblActualUsersPer = res.lstClsBlockSummary[2].varResult2;
          this.lblPlannedPOBVal = res.lstClsBlockSummary[2].varResult1;
          //this.lblPlannedPOBPer = res.lstClsBlockSummary[3].varResult2;
          this.lblActualPOBVal = res.lstClsBlockSummary[3].varResult1;
          //this.lblActualPOBPer = res.lstClsBlockSummary[4].varResult2;
          this.lblPlannedtoA_Val = res.lstClsBlockSummary[4].varResult1;
          //this.lblPlannedtoA_Per = res.lstClsBlockSummary[5].varResult2;
        }
        else {
          this.lblDoctorCoverageVal = 0;
          //this.lblDoctorCoveragePer = 0;
          this.lblPlannedUsersVal = 0;
          //this.lblPlannedUsersValPer = 0;
          this.lblActualUsersVal = 0;
          //this.lblActualUsersPer = 0;
          this.lblPlannedPOBVal = 0;
          //this.lblPlannedPOBPer = 0;
          this.lblActualPOBVal = 0;
          //this.lblActualPOBPer = 0;
          this.lblPlannedtoA_Val = 0;
          //this.lblPlannedtoA_Per = 0;
        }
        this.DRPOBDashboard_PlannedVsActualPOB(this.varClientName, this.dtFromMonth, this.dtToMonth, this.fk_EmpGlCode_Login, this.fk_DivisionGlCode, this.fk_DesiGlCode, this.fk_EmpGlCode, this.varProductGlCode, this.chrType, this.chrDesiLevel, this.fk_EmpGlCodeSelect, this.varDesiorder);

      });
  }
  onItemChange(item) {

    if (item.value == "0") {
      this.iSShowTop10 = true;
      this.iSShowBottom10 = false;
    }
    else {
      this.iSShowTop10 = false;
      this.iSShowBottom10 = true;
    }
    this.DRPOBDashboard_PatchAnalysis(this.varClientName, this.dtFromMonth, this.dtToMonth, this.fk_EmpGlCode_Login, this.fk_DivisionGlCode, this.fk_DesiGlCode, this.fk_EmpGlCode, this.varProductGlCode, this.chrType);
  }
  DRPOBDashboard_PatchAnalysis(varClientName, dtFromMonth, dtToMonth, fk_EmpGlCode_Login, fk_DivisionGlCode, fk_DesiGlCode, fk_EmpGlCode, varProductGlCode, chrType) {
    this.service.DRPOBDashboard_PatchAnalysis(varClientName, dtFromMonth, dtToMonth, fk_EmpGlCode_Login, fk_DivisionGlCode, fk_DesiGlCode, fk_EmpGlCode, varProductGlCode, chrType)
      .then(res => {
        if (res.Status[0].isValid) {
          this.patchdataSourceTop10 = res.lstClsPatchAnalysisTop10;
          this.patchdataSourceBottom10 = res.lstClsPatchAnalysisBottom10;

        }
        this.DRPOBDashboard_SpecialtyAnalysis(this.varClientName, this.dtFromMonth, dtToMonth, this.fk_EmpGlCode_Login, this.fk_DivisionGlCode, this.fk_DesiGlCode, this.fk_EmpGlCodeSelect, this.varProductGlCode, this.chrType, this.fk_PatchGlCode);
      });
  }
  DRPOBDashboard_SpecialtyAnalysis(varClientName, dtFromMonth, dtToMonth, fk_EmpGlCode_Login, fk_DivisionGlCode, fk_DesiGlCode, fk_EmpGlCode, varProductGlCode, chrType, fk_PatchGlCode) {
    this.service.DRPOBDashboard_SpecialtyAnalysis(varClientName, dtFromMonth, dtToMonth, fk_EmpGlCode_Login, fk_DivisionGlCode, fk_DesiGlCode, fk_EmpGlCode, varProductGlCode, chrType, fk_PatchGlCode)
      .then(res => {
        if (res.Status[0].isValid) {
          this.specialtyDataSource = res.lstClSpecialtyWiseAnalysis;

          this.chartSpecialityWiseUser.instance.hideLoadingIndicator();
          this.chartSpecialityWisePOB.instance.hideLoadingIndicator();
          //this.chartSpecialityWiseCoveredVsMised.instance.hideLoadingIndicator();

        }
        this.DRPOBDashboard_ProductAnalysis(this.varClientName, this.dtFromMonth, dtToMonth, this.fk_EmpGlCode_Login, this.fk_DivisionGlCode, this.fk_DesiGlCode, this.fk_EmpGlCodeSelect, this.varProductGlCode, this.chrType, this.fk_PatchGlCode, this.fk_SpecialtyGlCode);
      });
  }
  DRPOBDashboard_ProductAnalysis(varClientName, dtFromMonth, dtToMonth, fk_EmpGlCode_Login, fk_DivisionGlCode, fk_DesiGlCode, fk_EmpGlCode, varProductGlCode, chrType, fk_PatchGlCode, fk_SpecialtyGlCode) {
    this.service.DRPOBDashboard_ProductAnalysis(varClientName, dtFromMonth, dtToMonth, fk_EmpGlCode_Login, fk_DivisionGlCode, fk_DesiGlCode, fk_EmpGlCode, varProductGlCode, chrType, fk_PatchGlCode, fk_SpecialtyGlCode)
      .then(res => {
        if (res.Status[0].isValid) {
          this.productDataSource = res.lstClSProductWiseAnalysis;

          this.chartProductPlannedVsActualUsage.instance.hideLoadingIndicator();
          this.chartProductPlannedVsActualUser.instance.hideLoadingIndicator();
        }
        this.DRPOBDashboard_6MTrend(this.varClientName, this.dtFromMonth, dtToMonth, this.fk_EmpGlCode_Login, this.fk_DivisionGlCode, this.fk_DesiGlCode, this.fk_EmpGlCodeSelect, this.varProductGlCode, this.chrType, this.fk_PatchGlCode, this.fk_SpecialtyGlCode);
      });
  }
  DRPOBDashboard_6MTrend(varClientName, dtFromMonth, dtToMonth, fk_EmpGlCode_Login, fk_DivisionGlCode, fk_DesiGlCode, fk_EmpGlCode, varProductGlCode, chrType, fk_PatchGlCode, fk_SpecialtyGlCode) {
    this.service.DRPOBDashboard_6MTrend(varClientName, dtFromMonth, dtToMonth, fk_EmpGlCode_Login, fk_DivisionGlCode, fk_DesiGlCode, fk_EmpGlCode, varProductGlCode, chrType, fk_PatchGlCode, fk_SpecialtyGlCode)
      .then(res => {
        if (res.Status[0].isValid) {
          this.monthWiseDataSource = res.lstClSMonthWiseAnalysis;

          this.chartUserTrend.instance.hideLoadingIndicator();
          this.chartPOBTrend.instance.hideLoadingIndicator();
          //this.chartCoverageTrend.instance.hideLoadingIndicator();

        }
      });
  }
  DRPOBDashboard_PlannedVsActualPOB(varClientName, dtFromMonth, dtToMonth, fk_EmpGlCode_Login, fk_DivisionGlCode, fk_DesiGlCode, fk_EmpGlCode, varProductGlCode, chrType, chrDesiLevel, fk_EmpGlCodeSelect, varDesiorder) {
    this.service.DRPOBDashboard_PlannedVsActualPOB(varClientName, dtFromMonth, dtToMonth, fk_EmpGlCode_Login, fk_DivisionGlCode, fk_DesiGlCode, fk_EmpGlCode, varProductGlCode, chrType, chrDesiLevel, fk_EmpGlCodeSelect, varDesiorder)
      .then(res => {
        if (res.Status[0].isValid) {
          this.PlannedVsActual = res.lstClSPlannedVsActualPOB;
          if (res.lstClSPlannedVsActualPOB.length != 0) {
            this.varDesignationName = res.lstClSPlannedVsActualPOB[0].varDesiName;
            this.chrBack = res.lstClSPlannedVsActualPOB[0].chrBack;
            this.fk_EmpGlCode_Sr = res.lstClSPlannedVsActualPOB[0].fk_EmpGlCode_Sr;
            this.varDesiorder = res.lstClSPlannedVsActualPOB[0].intDesiorder;
            if (res.lstClSPlannedVsActualPOB[0].chrBack == "Y") {
              this.isShowBack = true;
            }
            else {
              this.isShowBack = false;
            }
            this.chrDrillDown = res.lstClSPlannedVsActualPOB[0].chrDrillDown;
          }
          //this.ChartPlannedVsActualUser.instance.hideLoadingIndicator();
          //this.ChartPlannedVsActualUser.instance.hideLoadingIndicator();
          //this.ChartPlannedVsActualPOB.instance.hideLoadingIndicator();
        }
        this.DRPOBDashboard_PatchAnalysis(this.varClientName, this.dtFromMonth, this.dtToMonth, this.fk_EmpGlCode_Login, this.fk_DivisionGlCode, this.fk_DesiGlCode, this.fk_EmpGlCodeSelect, this.varProductGlCode, this.chrType);
      });
  }

  BackPOB() {
    this.lblSelectedSpecialty = "All";
    this.lblSelectedPatch = "All";
    this.fk_PatchGlCode = 0;

    this.chrDesiLevel = "U";
    this.fk_EmpGlCodeSelect = this.fk_EmpGlCode_Sr;
    //this.ChartPlannedVsActualUser.instance.showLoadingIndicator();
    this.DRPOBDashboard_PlannedVsActualPOB(this.varClientName, this.dtFromMonth, this.dtToMonth, this.fk_EmpGlCode_Login, this.fk_DivisionGlCode, this.fk_DesiGlCode, this.fk_EmpGlCode, this.varProductGlCode, this.chrType, this.chrDesiLevel, this.fk_EmpGlCodeSelect, this.varDesiorder);
  }

}
