import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatRadioModule, MatExpansionModule, MatTabsModule, MatCardModule, MatProgressSpinnerModule, MatDatepickerModule, MatSelectModule, MAT_DATE_LOCALE  } from '@angular/material'
import { fakeBackendProvider } from './_helpers';
import { AppComponent } from './app.component';
import { routing } from './app.routing';
import { AlertComponent } from './_directives';
import { AuthGuard } from './_guards';
import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import { AlertService, AuthenticationService, UserService } from './_services';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ChemistloginComponent } from './chemistorder/chemistlogin/chemistlogin.component';
import { ChemistotpComponent } from './chemistorder/chemistotp/chemistotp.component';
import { ChemistprevieworderComponent } from './chemistorder/chemistprevieworder/chemistprevieworder.component';
import { ChemistproductlistComponent } from './chemistorder/chemistproductlist/chemistproductlist.component';
import { ChemistorderlistComponent } from './chemistorder/chemistorderlist/chemistorderlist.component';
import { ArraySortPipe } from './Component/_OrderbyPipe';
import { DocumentmanageComponent } from './documentmanage/documentmanage.component';
import { DxLoadIndicatorModule, DxChartModule, DxCalendarModule, DxTreeListModule, DxDateBoxModule, DxTreeViewModule, DxPopupModule, DxTemplateModule, DxCheckBoxModule } from 'devextreme-angular';
import { DxButtonModule } from 'devextreme-angular';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { EmpSalesDashboardComponent } from './emp-sales-dashboard/emp-sales-dashboard.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TruncatePipe } from './Component/_LimitPipe';
import { FilterPipe } from './Component/_FilterPipe';
import { BnNgIdleService } from 'bn-ng-idle';
import { CfaclaimloginComponent } from './cfaclaim/cfaclaimlogin/cfaclaimlogin.component';
import { CfaclaimotpComponent } from './cfaclaim/cfaclaimotp/cfaclaimotp.component';
import { CfaclaimviewComponent } from './cfaclaim/cfaclaimview/cfaclaimview.component';
import { CfaclaimviewdetailsComponent } from './cfaclaim/cfaclaimviewdetails/cfaclaimviewdetails.component'; // import bn-ng-idle service
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { NotificationComponent } from './notification/notification.component';
import { SwipeToDeleteItemComponent } from './swipe-to-delete-item/swipe-to-delete-item.component';
 

@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    routing, MatRadioModule, BrowserAnimationsModule, MatExpansionModule, FormsModule,
    NgbModule, DxButtonModule, MatTabsModule, BrowserAnimationsModule, NoopAnimationsModule, HttpClientModule, MatRadioModule,
    DxCalendarModule,
    DxTreeListModule,
    DxDateBoxModule,
    DxTreeViewModule,
    DxPopupModule, DxButtonModule, DxTemplateModule, DxCheckBoxModule, DxChartModule, DxLoadIndicatorModule,
    Ng4LoadingSpinnerModule, MatCardModule, MatProgressSpinnerModule, MatDatepickerModule, MatFormFieldModule, MatInputModule, MatNativeDateModule, MatSelectModule
  ],
  declarations: [
    AppComponent,
    AlertComponent,
    ChemistloginComponent,
    ChemistotpComponent,
    ChemistprevieworderComponent,
    ChemistproductlistComponent,
    ChemistorderlistComponent, ArraySortPipe, DocumentmanageComponent, EmpSalesDashboardComponent, DashboardComponent, TruncatePipe, CfaclaimloginComponent, CfaclaimotpComponent, CfaclaimviewComponent, CfaclaimviewdetailsComponent, FilterPipe, NotificationComponent, SwipeToDeleteItemComponent
  ],
  providers: [
    AuthGuard,
    AlertService,
    AuthenticationService,
    UserService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    // provider used to create fake backend
    fakeBackendProvider, BnNgIdleService
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
