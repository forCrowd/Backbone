import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForcrowdBackboneComponent } from './forcrowd-backbone.component';

describe('ForcrowdBackboneComponent', () => {
  let component: ForcrowdBackboneComponent;
  let fixture: ComponentFixture<ForcrowdBackboneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForcrowdBackboneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForcrowdBackboneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
