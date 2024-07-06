import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualiserComponent } from './visualiser.component';

describe('VisualiserComponent', () => {
  let component: VisualiserComponent;
  let fixture: ComponentFixture<VisualiserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VisualiserComponent]
    });
    fixture = TestBed.createComponent(VisualiserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
