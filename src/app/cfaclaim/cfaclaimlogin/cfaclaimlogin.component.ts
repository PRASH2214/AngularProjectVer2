import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { ConnectionService } from 'ng-connection-service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Router, ActivatedRoute } from '@angular/router';
import { takeUntil, retry } from 'rxjs/operators';
import { CFAClaimService } from 'src/app/_services';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-cfaclaimlogin',
  templateUrl: './cfaclaimlogin.component.html',
  styleUrls: ['./cfaclaimlogin.component.css']
})
export class CfaclaimloginComponent implements OnInit {
  CFAClaimloginForm: FormGroup;
  loading = false;
  submitted = false;
  isConnected = true;
  varClientName: any;
  varCFANameDyn: any;
  varStockistNameDyn: any;
  private _unsubscribeAll: Subject<any>;
  constructor(private service: CFAClaimService, private connectionService: ConnectionService, private router: Router,
    private _formBuilder: FormBuilder, private route: ActivatedRoute, private spinnerService: Ng4LoadingSpinnerService) {
    this.connectionService.monitor().subscribe(isConnected => {
      this.isConnected = isConnected;
    })
    this._unsubscribeAll = new Subject();
    this.route.params
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(params => {
        //localStorage.setItem("authenticate", "false");
      });
  }

  ngOnInit() {
    this.CFAClaimloginForm = this._formBuilder.group({
      CFAmobileEmailID: ['', [Validators.required]]
    });

  }

  get f() { return this.CFAClaimloginForm.controls; }
  ngOnDestroy(): void {

  }
  GET_OTP(): void {
    if (this.isConnected) {
      this.submitted = true;
      if (this.f.CFAmobileEmailID.value == null || this.f.CFAmobileEmailID.value == "" || this.f.CFAmobileEmailID.value == undefined) {
        Swal.fire('', "Please enter mobile no or email id", 'info');
        return;
      }
      // stop here if form is invalid
      if (this.CFAClaimloginForm.invalid) {
        return;
      }
      this.spinnerService.show();
      this.service.CFAClaimlogin(this.f.CFAmobileEmailID.value)
        .then(res => {
          if (res.Status[0].isValid) {
            this.spinnerService.hide();
            if (res.objClsCFAClaimLogin.varMessage === null || res.objClsCFAClaimLogin.varMessage === '') {
              localStorage.setItem("fk_ChannelGlCode", res.objClsCFAClaimLogin.fk_ChannelGlCode);
              localStorage.setItem("varMobileEmailID", res.objClsCFAClaimLogin.varMobileEmailID);
              this.router.navigateByUrl('/otp');
            }
            else {
              this.spinnerService.hide();
              Swal.fire('', res.objChemistLogin.varMessage, 'error');
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
}
