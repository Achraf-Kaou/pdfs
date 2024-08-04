import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MypdfsListComponent } from './mypdfs-list.component';

describe('MypdfsListComponent', () => {
  let component: MypdfsListComponent;
  let fixture: ComponentFixture<MypdfsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MypdfsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MypdfsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
