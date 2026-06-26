import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { EtudiantsComponent } from './etudiants.component';

describe('EtudiantsComponent', () => {
  let component: EtudiantsComponent;
  let fixture: ComponentFixture<EtudiantsComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EtudiantsComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    }).compileComponents();
    fixture = TestBed.createComponent(EtudiantsComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges(); // déclenche ngOnInit -> load()
    httpMock.expectOne('/api/etudiants').flush([]);
  });

  afterEach(() => httpMock.verify());

  it('should create and load etudiants', () => {
    expect(component).toBeTruthy();
    expect(component.etudiants).toEqual([]);
  });

  it('should not submit an invalid form', () => {
    component.submit();
    httpMock.expectNone('/api/etudiants');
  });
});
