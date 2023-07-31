import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './_guards';
import { ChemistloginComponent } from './chemistorder/chemistlogin/chemistlogin.component';
import { ChemistotpComponent } from './chemistorder/chemistotp/chemistotp.component';
import { ChemistorderlistComponent } from './chemistorder/chemistorderlist/chemistorderlist.component';
import { ChemistproductlistComponent } from './chemistorder/chemistproductlist/chemistproductlist.component';
import { ChemistprevieworderComponent } from './chemistorder/chemistprevieworder/chemistprevieworder.component';
import { DocumentmanageComponent } from './documentmanage/documentmanage.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EmpSalesDashboardComponent } from './emp-sales-dashboard/emp-sales-dashboard.component';
import { CfaclaimloginComponent } from './cfaclaim/cfaclaimlogin/cfaclaimlogin.component';
import { CfaclaimotpComponent } from './cfaclaim/cfaclaimotp/cfaclaimotp.component';
import { CfaclaimviewComponent } from './cfaclaim/cfaclaimview/cfaclaimview.component';
import { CfaclaimviewdetailsComponent } from './cfaclaim/cfaclaimviewdetails/cfaclaimviewdetails.component';
import { NotificationComponent } from './notification/notification.component';
const appRoutes: Routes = [
  //{
  //  path: 'dms',
  //  component: DocumentmanageComponent
  //},
  {
    path: 'dms/:varClientName/:fk_PersonGlCode',
    component: DocumentmanageComponent
  },
  {
    path: '',
    component: CfaclaimloginComponent
  },
  {
    path: 'login',
    component: CfaclaimloginComponent
  },
  {
    path: 'otp',
    component: CfaclaimotpComponent
  },
  {
    path: 'cfaclaimview',
    component: CfaclaimviewComponent
  },
  {
    path: 'cfaclaimviewdetails',
    component: CfaclaimviewdetailsComponent
  },{
    path: 'notification',
    component: NotificationComponent
  },
  //{
  //  path: 'login',
  //  component: ChemistloginComponent
  //},
  //{
  //  path: 'otp',
  //  component: ChemistotpComponent
  //},
  //{
  //  path: 'orderlist',
  //  component: ChemistorderlistComponent,
  //  canActivate: [AuthGuard]
  //},
  //{
  //  path: 'productlist',
  //  component: ChemistproductlistComponent,
  //  canActivate: [AuthGuard]
  //},
  //{
  //  path: 'previeworder',
  //  component: ChemistprevieworderComponent,
  //  canActivate: [AuthGuard]
  //},
  //, {
  //  path: 'dashboard',
  //  component: DashboardComponent
  //},
  //{
  //  path: 'dashboard/:varClientName/:dtFromMonth/:dtToMonth/:fk_EmpGlCode_Login/:fk_DivisionGlCode/:fk_DesiGlCode/:fk_EmpGlCode/:varProductGlCode/:chrType/:Speciality_Title/:fk_EmpGlCodeSelect/:varDesiorder',
  //  component: DashboardComponent
  //},
  //{
  //  path: 'emp-sales-dashboard',
  //  component: EmpSalesDashboardComponent
  //},
  {
    path: 'emp-sales-dashboard/:varClientName/:dtFromMonth/:dtToMonth/:fk_EmpGlCode_Login/:fk_DivisionGlCode/:fk_DesiGlCode/:fk_EmpGlCode/:varProductGlCode/:fk_EmpGlCodeSelect/:varDesiorder',
    component: EmpSalesDashboardComponent
  },

  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];
export const routing = RouterModule.forRoot(appRoutes);
