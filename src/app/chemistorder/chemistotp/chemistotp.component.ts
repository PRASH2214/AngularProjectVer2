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
  selector: 'app-chemistotp',
  templateUrl: './chemistotp.component.html',
  styleUrls: ['./chemistotp.component.css']
})
export class ChemistotpComponent implements OnInit {
  varProjectCode: any;
  fk_ChemistGlCode: any;
  varMobileNo: any;
  chemistLoginOTP: FormGroup;
  loading = false;
  submitted = false;
  varClientName: any;
  isConnected = true;
  private _unsubscribeAll: Subject<any>;
  constructor(private service: AuthenticationService, private connectionService: ConnectionService, private router: Router, private _formBuilder: FormBuilder, private route: ActivatedRoute, private spinnerService: Ng4LoadingSpinnerService) {
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
  }

  ngOnInit() {
    this.chemistLoginOTP = this._formBuilder.group({
      ChemistOtp: ['', Validators.required]
    });

    this.fk_ChemistGlCode = localStorage.getItem("fk_ChemistGlCode");
    this.varMobileNo = localStorage.getItem("varMobileNo");
    
  }

  ngAfterViewInit() {
    window.scroll(0, 0);
  }


  get f() { return this.chemistLoginOTP.controls; }

  keyPress(event: any) {
    if (event.keyCode === 48 || event.keyCode === 49 || event.keyCode === 50 || event.keyCode === 51 || event.keyCode === 52 || event.keyCode === 53 || event.keyCode === 54 || event.keyCode === 55 || event.keyCode === 56 || event.keyCode === 57) {
      event.returnValue = true;
    }
    else {
      event.returnValue = false;
    }
  }

  ValidateOTP(): void {
    localStorage.setItem("authenticate", "false");
    if (this.isConnected) {
      this.submitted = true;
      // stop here if form is invalid
      if (this.chemistLoginOTP.invalid) {
        return;
      }
      //this.loading = true;
      this.spinnerService.show();
      this.service.ValidateOTPChemist(this.f.ChemistOtp.value, this.fk_ChemistGlCode, this.varClientName)
        .then(res => {
          if (res.Status[0].isValid) {
            //this.loading = false;
            this.spinnerService.hide();
            if (res.Status[0].Message === '') {
              localStorage.setItem("authenticate", "true");
              localStorage.setItem('currentUser', JSON.stringify({ fk_ChemistGlCode: this.fk_ChemistGlCode, token: res.Status[0].varToken }));
              localStorage.setItem('varCheckToken', res.Status[0].varToken);
              //localStorage.setItem("currentUser", res.Status[0].varToken);
              this.router.navigateByUrl('/orderlist');
            }
            else {
              //this.loading = false;
              this.spinnerService.hide();
              Swal.fire('', 'Invalid OTP', 'error');
              this.f.ChemistOtp.value('');
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

  ReSendOTP() {
    if (this.isConnected) {
      this.service.Chemistlogin(this.varMobileNo, this.varClientName)
        .then(res => {
          if (res.Status[0].isValid) {
            //this.loading = false;
            this.spinnerService.hide();
            Swal.fire('', 'OTP Sent', 'info');
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

  backClick(): void {
    this.router.navigateByUrl('/login');
  }
}
