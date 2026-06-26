import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MaterialModule } from '../../shared/material.module';
import { EtudiantService } from '../../core/service/etudiant.service';
import { Etudiant } from '../../core/models/Etudiant';

@Component({
  selector: 'app-etudiants',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './etudiants.component.html',
  styleUrl: './etudiants.component.css'
})
export class EtudiantsComponent implements OnInit {
  private etudiantService = inject(EtudiantService);
  private formBuilder = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);

  etudiants: Etudiant[] = [];
  form: FormGroup = new FormGroup({});
  editingId: number | null = null;

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      classe: ['', Validators.required]
    });
    this.load();
  }

  load(): void {
    this.etudiantService.getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(data => this.etudiants = data);
  }

  submit(): void {
    if (this.form.invalid) {
      return;
    }
    const etudiant: Etudiant = this.form.value;
    const request$ = this.editingId
      ? this.etudiantService.update(this.editingId, etudiant)
      : this.etudiantService.create(etudiant);

    request$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.resetForm();
      this.load();
    });
  }

  edit(etudiant: Etudiant): void {
    this.editingId = etudiant.id ?? null;
    this.form.patchValue(etudiant);
  }

  remove(id?: number): void {
    if (id == null) {
      return;
    }
    this.etudiantService.delete(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.load());
  }

  resetForm(): void {
    this.editingId = null;
    this.form.reset();
  }
}
