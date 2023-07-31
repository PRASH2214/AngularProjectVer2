import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CfaclaimviewdetailsComponent } from './cfaclaimviewdetails.component';

describe('CfaclaimviewdetailsComponent', () => {
  let component: CfaclaimviewdetailsComponent;
  let fixture: ComponentFixture<CfaclaimviewdetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CfaclaimviewdetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CfaclaimviewdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
