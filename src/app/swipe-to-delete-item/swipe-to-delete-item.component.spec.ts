import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwipeToDeleteItemComponent } from './swipe-to-delete-item.component';

describe('SwipeToDeleteItemComponent', () => {
  let component: SwipeToDeleteItemComponent;
  let fixture: ComponentFixture<SwipeToDeleteItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SwipeToDeleteItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwipeToDeleteItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
