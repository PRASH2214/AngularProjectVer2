import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CfaclaimviewComponent } from './cfaclaimview.component';

describe('CfaclaimviewComponent', () => {
  let component: CfaclaimviewComponent;
  let fixture: ComponentFixture<CfaclaimviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CfaclaimviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CfaclaimviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
