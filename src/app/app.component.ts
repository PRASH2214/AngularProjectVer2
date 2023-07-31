import { Component } from '@angular/core';
import { BnNgIdleService } from 'bn-ng-idle'; // import it to your component
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Location } from "@angular/common";
@Component({
  selector: 'app',
  templateUrl: 'app.component.html'
})

export class AppComponent {

  varClientName: any;
  route: any;
  constructor(private bnIdle: BnNgIdleService, private router: Router, location: Location, ) {
    router.events.subscribe(val => {
      if (location.path() != "") {
        this.route = location.path();
      } else {
        this.route = "Home";
      }
    });
  }

  // initiate it in your component OnInit 60 1 mintes
  ngOnInit(): void {
    this.bnIdle.startWatching(600).subscribe((isTimedOut: boolean) => {
      if (isTimedOut) {
        if (this.route != null && this.route != undefined && this.route.includes("cfa")) {          
          Swal.fire('Session Time Out', 'Please do again login', 'info');
          localStorage.setItem("authenticate_CFA", "false");
          this.varClientName = localStorage.getItem("varClientName");
          this.router.navigateByUrl('/login');
        } else {          
          Swal.fire('Session Time Out', 'Please do again login', 'info');
          localStorage.setItem("authenticate_CFA", "false");
          this.varClientName = localStorage.getItem("varClientName");
          this.router.navigateByUrl('/login');
        }
      }
    });
  }

}
