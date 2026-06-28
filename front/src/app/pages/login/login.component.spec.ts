import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService } from '../../core/service/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  const authMock = { login: jest.fn() };
  const routerMock = { navigate: jest.fn() };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    jest.clearAllMocks();
  });

  it('should create', () => expect(component).toBeTruthy());

  it('should have an invalid form when empty', () => {
    expect(component.loginForm.valid).toBe(false);
  });

  it('should not call login when the form is invalid', () => {
    component.onSubmit();
    expect(authMock.login).not.toHaveBeenCalled();
  });

  it('should login and navigate to /etudiants on success', () => {
    authMock.login.mockReturnValue(of('jwt-token'));
    component.loginForm.setValue({ login: 'john', password: 'pwd' });
    component.onSubmit();
    expect(authMock.login).toHaveBeenCalledWith({ login: 'john', password: 'pwd' });
    expect(routerMock.navigate).toHaveBeenCalledWith(['/etudiants']);
    expect(component.errorMessage).toBe('');
  });

  it('should set an error message on failure', () => {
    authMock.login.mockReturnValue(throwError(() => new Error('bad')));
    component.loginForm.setValue({ login: 'john', password: 'bad' });
    component.onSubmit();
    expect(component.errorMessage).toBe('Identifiants invalides');
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });
});
