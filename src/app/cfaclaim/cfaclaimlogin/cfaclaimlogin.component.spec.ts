import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CfaclaimloginComponent } from './cfaclaimlogin.component';

describe('CfaclaimloginComponent', () => {
  let component: CfaclaimloginComponent;
  let fixture: ComponentFixture<CfaclaimloginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CfaclaimloginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CfaclaimloginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
