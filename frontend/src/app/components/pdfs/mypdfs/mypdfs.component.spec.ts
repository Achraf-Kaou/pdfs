import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MypdfsComponent } from './mypdfs.component';

describe('MypdfsComponent', () => {
  let component: MypdfsComponent;
  let fixture: ComponentFixture<MypdfsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MypdfsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MypdfsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
