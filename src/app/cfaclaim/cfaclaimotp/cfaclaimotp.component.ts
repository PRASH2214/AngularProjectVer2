import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { takeUntil, retry } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { CFAClaimService } from 'src/app/_services';
import { ConnectionService } from 'ng-connection-service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Router, ActivatedRoute } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { timer } from 'rxjs';

@Component({
  selector: 'app-cfaclaimotp',
  templateUrl: './cfaclaimotp.component.html',
  styleUrls: ['./cfaclaimotp.component.css']
})
export class CfaclaimotpComponent implements OnInit {
  varProjectCode: any;
  fk_ChannelGlCode: any;
  varMobileEmailID: any;
  CFAClaimLoginOTP: FormGroup;
  loading = false;
  submitted = false;
  varClientName: any;
  isConnected = true;
  timeLeft: number = 60;
  interval;
  subscribeTimer: any;
  showTimer: any = true;
  showResend: any = false;
  varStockistNameDyn: any;
  varCFANameDyn: any;
  private _unsubscribeAll: Subject<any>;
  constructor(private service: CFAClaimService, private connectionService: ConnectionService, private router: Router, private _formBuilder: FormBuilder, private route: ActivatedRoute, private spinnerService: Ng4LoadingSpinnerService) {
    this.connectionService.monitor().subscribe(isConnected => {
      this.isConnected = isConnected;
    })
    this._unsubscribeAll = new Subject();
    this.route.params
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(params => {

      });
  }

  ngOnInit() {
    this.CFAClaimLoginOTP = this._formBuilder.group({
      CFAClaimOTP: ['', Validators.required]
    });

    this.fk_ChannelGlCode = localStorage.getItem("fk_ChannelGlCode");
    this.varMobileEmailID = localStorage.getItem("varMobileEmailID");       
    this.startTimer();
  }


  get f() { return this.CFAClaimLoginOTP.controls; }

  keyPress(event: any) {
    if (event.keyCode === 48 || event.keyCode === 49 || event.keyCode === 50 || event.keyCode === 51 || event.keyCode === 52 || event.keyCode === 53 || event.keyCode === 54 || event.keyCode === 55 || event.keyCode === 56 || event.keyCode === 57) {
      event.returnValue = true;
    }
    else {
      event.returnValue = false;
    }
  }

  ValidateOTP(): void {
    if (this.f.CFAClaimOTP.value == null || this.f.CFAClaimOTP.value == "" || this.f.CFAClaimOTP.value == undefined) {
      Swal.fire('', "Please enter otp", 'info');
      return;
    }

    localStorage.setItem("authenticate_CFA", "false");
    if (this.isConnected) {
      this.submitted = true;
      // stop here if form is invalid
      if (this.CFAClaimLoginOTP.invalid) {
        return;
      }
      this.spinnerService.show();
      this.service.ValidateOTP(this.f.CFAClaimOTP.value, this.fk_ChannelGlCode, this.varClientName)
        .then(res => {
          if (res.Status[0].isValid) {
            this.spinnerService.hide();
            if (res.Status[0].Message === '') {
              localStorage.setItem("authenticate_CFA", "true");
              localStorage.setItem('currentUser', JSON.stringify({ fk_ChannelGlCode: this.fk_ChannelGlCode, token: res.Status[0].varToken }));
              localStorage.setItem('varCheckToken_CFA', res.Status[0].varToken);
              localStorage.setItem("fk_ChannelGlCode", this.fk_ChannelGlCode);              
              this.router.navigateByUrl('/cfaclaimview');
            }
            else {
              this.spinnerService.hide();
              Swal.fire('', 'Invalid OTP', 'error');
              this.f.ChemistOtp.value('');
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

  ReSendOTP() {
    if (this.isConnected) {
      this.service.CFAClaimlogin(this.varMobileEmailID)
        .then(res => {
          if (res.Status[0].isValid) {
            this.spinnerService.hide();
            Swal.fire('', 'OTP Sent', 'info');
            this.showTimer = true;
            this.showResend = false;
            this.startTimer();
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

  backClick(): void {
    this.router.navigateByUrl('/login');
  }


  oberserableTimer() {
    const source = timer(1000, 2000);
    const abc = source.subscribe(val => {
      console.log(val, '-');
      this.subscribeTimer = this.timeLeft - val;
    });
  }

  startTimer() {
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.timeLeft = 60;
      }
      if (this.timeLeft === 0) {
        this.pauseTimer();
      }
    }, 1000)

  }

  pauseTimer() {
    clearInterval(this.interval);
    this.showTimer = false;
    this.showResend = true;
  }
}
