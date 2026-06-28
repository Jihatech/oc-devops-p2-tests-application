import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { RegisterComponent } from './register.component';
import { UserService } from '../../core/service/user.service';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  const userMock = { register: jest.fn().mockReturnValue(of({})) };
  const validValue = { firstName: 'Ada', lastName: 'Lovelace', login: 'ada', password: 'pwd' };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [{ provide: UserService, useValue: userMock }],
    }).compileComponents();
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    jest.clearAllMocks();
    jest.spyOn(window, 'alert').mockImplementation(() => undefined);
  });

  it('should create', () => expect(component).toBeTruthy());

  it('should expose form controls via the getter', () => {
    expect(component.form['login']).toBeTruthy();
  });

  it('should not register when the form is invalid', () => {
    component.onSubmit();
    expect(userMock.register).not.toHaveBeenCalled();
  });

  it('should register and alert on a valid form', () => {
    component.registerForm.setValue(validValue);
    component.onSubmit();
    expect(userMock.register).toHaveBeenCalledWith(validValue);
    expect(window.alert).toHaveBeenCalled();
  });

  it('should reset the form', () => {
    component.registerForm.setValue(validValue);
    component.onReset();
    expect(component.submitted).toBe(false);
    expect(component.registerForm.get('firstName')?.value).toBeNull();
  });
});
