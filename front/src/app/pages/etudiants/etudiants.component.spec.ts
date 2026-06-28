import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { EtudiantsComponent } from './etudiants.component';
import { EtudiantService } from '../../core/service/etudiant.service';
import { Etudiant } from '../../core/models/Etudiant';

describe('EtudiantsComponent', () => {
  let component: EtudiantsComponent;
  let fixture: ComponentFixture<EtudiantsComponent>;

  const sample: Etudiant = { id: 1, firstName: 'Ada', lastName: 'Lovelace', email: 'ada@ex.com', classe: 'L3' };
  const etuMock = {
    getAll: jest.fn().mockReturnValue(of([sample])),
    create: jest.fn().mockReturnValue(of(sample)),
    update: jest.fn().mockReturnValue(of(sample)),
    delete: jest.fn().mockReturnValue(of(void 0)),
  };

  const validValue = { firstName: 'Alan', lastName: 'Turing', email: 'alan@ex.com', classe: 'M1' };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EtudiantsComponent],
      providers: [{ provide: EtudiantService, useValue: etuMock }],
    }).compileComponents();
    fixture = TestBed.createComponent(EtudiantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // ngOnInit -> load()
    jest.clearAllMocks();
  });

  it('should create and load the list', () => {
    expect(component).toBeTruthy();
    expect(component.etudiants).toEqual([sample]);
  });

  it('should not submit an invalid form', () => {
    component.submit();
    expect(etuMock.create).not.toHaveBeenCalled();
  });

  it('should create a new etudiant then reload', () => {
    component.form.setValue(validValue);
    component.submit();
    expect(etuMock.create).toHaveBeenCalledWith(validValue);
    expect(etuMock.getAll).toHaveBeenCalled();
    expect(component.editingId).toBeNull();
  });

  it('should switch to edit mode and patch the form', () => {
    component.edit(sample);
    expect(component.editingId).toBe(1);
    expect(component.form.get('email')?.value).toBe('ada@ex.com');
  });

  it('should update an existing etudiant', () => {
    component.edit(sample);
    component.form.setValue(validValue);
    component.submit();
    expect(etuMock.update).toHaveBeenCalledWith(1, validValue);
  });

  it('should delete an etudiant by id', () => {
    component.remove(1);
    expect(etuMock.delete).toHaveBeenCalledWith(1);
  });

  it('should ignore delete when id is undefined', () => {
    component.remove(undefined);
    expect(etuMock.delete).not.toHaveBeenCalled();
  });

  it('should reset the form', () => {
    component.edit(sample);
    component.resetForm();
    expect(component.editingId).toBeNull();
  });
});
