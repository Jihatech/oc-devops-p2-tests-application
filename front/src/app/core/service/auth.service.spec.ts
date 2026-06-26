import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login and store the token', () => {
    service.login({ login: 'john', password: 'pwd' }).subscribe(token => {
      expect(token).toBe('jwt-token');
    });
    const req = httpMock.expectOne('/api/login');
    expect(req.request.method).toBe('POST');
    req.flush('jwt-token');
    expect(service.getToken()).toBe('jwt-token');
    expect(service.isAuthenticated()).toBe(true);
  });

  it('should clear the token on logout', () => {
    service.setToken('abc');
    service.logout();
    expect(service.getToken()).toBeNull();
    expect(service.isAuthenticated()).toBe(false);
  });
});
