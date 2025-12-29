import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewBrandCategoryComponent } from './new-brand-category.component';

describe('NewBrandCategoryComponent', () => {
  let component: NewBrandCategoryComponent;
  let fixture: ComponentFixture<NewBrandCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewBrandCategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewBrandCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
