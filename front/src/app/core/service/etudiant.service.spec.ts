import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { EtudiantService } from './etudiant.service';
import { Etudiant } from '../models/Etudiant';

describe('EtudiantService', () => {
  let service: EtudiantService;
  let httpMock: HttpTestingController;
  const sample: Etudiant = { id: 1, firstName: 'Ada', lastName: 'Lovelace', email: 'ada@ex.com', classe: 'L3' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), EtudiantService]
    });
    service = TestBed.inject(EtudiantService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => expect(service).toBeTruthy());

  it('getAll should GET /api/etudiants', () => {
    service.getAll().subscribe(list => expect(list.length).toBe(1));
    const req = httpMock.expectOne('/api/etudiants');
    expect(req.request.method).toBe('GET');
    req.flush([sample]);
  });

  it('create should POST an etudiant', () => {
    service.create(sample).subscribe(e => expect(e.email).toBe('ada@ex.com'));
    const req = httpMock.expectOne('/api/etudiants');
    expect(req.request.method).toBe('POST');
    req.flush(sample);
  });

  it('update should PUT to /api/etudiants/:id', () => {
    service.update(1, sample).subscribe();
    const req = httpMock.expectOne('/api/etudiants/1');
    expect(req.request.method).toBe('PUT');
    req.flush(sample);
  });

  it('delete should DELETE /api/etudiants/:id', () => {
    service.delete(1).subscribe();
    const req = httpMock.expectOne('/api/etudiants/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
