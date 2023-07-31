import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CfaclaimotpComponent } from './cfaclaimotp.component';

describe('CfaclaimotpComponent', () => {
  let component: CfaclaimotpComponent;
  let fixture: ComponentFixture<CfaclaimotpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CfaclaimotpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CfaclaimotpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
