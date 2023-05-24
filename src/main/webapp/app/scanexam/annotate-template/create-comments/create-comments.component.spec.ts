import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateCommentsComponent } from './create-comments.component';

describe('CreateCommentsComponent', () => {
  let component: CreateCommentsComponent;
  let fixture: ComponentFixture<CreateCommentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateCommentsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
