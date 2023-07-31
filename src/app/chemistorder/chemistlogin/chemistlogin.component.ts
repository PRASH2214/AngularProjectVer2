import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { ConnectionService } from 'ng-connection-service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Router, ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/_services';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
@Component({
  selector: 'app-chemistlogin',
  templateUrl: './chemistlogin.component.html',
  styleUrls: ['./chemistlogin.component.css']
})
export class ChemistloginComponent implements OnInit {
  ChemistloginForm: FormGroup;
  loading = false;
  submitted = false;
  isConnected = true;
  varClientName: any;
  private _unsubscribeAll: Subject<any>;

  constructor(private service: AuthenticationService, private connectionService: ConnectionService, private router: Router,
    private _formBuilder: FormBuilder, private route: ActivatedRoute, private spinnerService: Ng4LoadingSpinnerService) {
    this.connectionService.monitor().subscribe(isConnected => {
      this.isConnected = isConnected;
    })
    this._unsubscribeAll = new Subject();
    this.route.params
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(params => {
        localStorage.setItem("authenticate", "false");
      });
  }

  ngOnInit() {
    this.ChemistloginForm = this._formBuilder.group({
      ChemistMobileno: ['', [Validators.required]]
    });
  }

  ngAfterViewInit() {
    window.scroll(0, 0);
  }


  //only number will be add
  keyPress(event: any) {
    if (event.keyCode === 48 || event.keyCode === 49 || event.keyCode === 50 || event.keyCode === 51 || event.keyCode === 52 || event.keyCode === 53 || event.keyCode === 54 || event.keyCode === 55 || event.keyCode === 56 || event.keyCode === 57) {
      event.returnValue = true;
    }
    else {
      event.returnValue = false;
    }
  }
  get f() { return this.ChemistloginForm.controls; }
  ngOnDestroy(): void {

  }
  GET_OTP(): void {
    if (this.isConnected) {
      this.submitted = true;
      // stop here if form is invalid
      if (this.ChemistloginForm.invalid) {
        return;
      }
      //this.loading = true;
      this.spinnerService.show();
      this.service.Chemistlogin(this.f.ChemistMobileno.value, this.varClientName)
        .then(res => {
          if (res.Status[0].isValid) {
            //this.loading = false;
            this.spinnerService.hide();
            if (res.objChemistLogin.varMessage === null || res.objChemistLogin.varMessage === '') {
              localStorage.setItem("fk_ChemistGlCode", res.objChemistLogin.fk_ChemistGlCode);
              localStorage.setItem("varMobileNo", res.objChemistLogin.varMobileNo);
              this.router.navigateByUrl('/otp');
            }
            else {
             // this.loading = false;
              this.spinnerService.hide();
              Swal.fire('', res.objChemistLogin.varMessage, 'error');
            }
          }
          else {
           // this.loading = false;
            this.spinnerService.hide();
            Swal.fire('', res.Status[0].Message, 'error');
          }
        });
    }
    else {
     // this.loading = false;
      this.spinnerService.hide();
      Swal.fire('OFFLINE', 'Please check your internet connectivity and try again.', 'info');
    }
  }

}
