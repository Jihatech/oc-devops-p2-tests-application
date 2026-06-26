package com.openclassrooms.etudiant.service;

import com.openclassrooms.etudiant.entities.Etudiant;
import com.openclassrooms.etudiant.repository.EtudiantRepository;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(SpringExtension.class)
public class EtudiantServiceTest {

    @Mock
    private EtudiantRepository etudiantRepository;
    @InjectMocks
    private EtudiantService etudiantService;

    private Etudiant sample() {
        return Etudiant.builder().id(1L).firstName("Ada").lastName("Lovelace")
                .email("ada@ex.com").classe("L3").build();
    }

    @Test
    public void findAll_returns_list() {
        when(etudiantRepository.findAll()).thenReturn(List.of(sample()));
        assertThat(etudiantService.findAll()).hasSize(1);
    }

    @Test
    public void findById_found() {
        when(etudiantRepository.findById(1L)).thenReturn(Optional.of(sample()));
        assertThat(etudiantService.findById(1L).getEmail()).isEqualTo("ada@ex.com");
    }

    @Test
    public void findById_notFound_throws() {
        when(etudiantRepository.findById(99L)).thenReturn(Optional.empty());
        Assertions.assertThrows(EntityNotFoundException.class, () -> etudiantService.findById(99L));
    }

    @Test
    public void create_ok() {
        Etudiant e = sample();
        when(etudiantRepository.existsByEmail(e.getEmail())).thenReturn(false);
        when(etudiantRepository.save(any())).thenReturn(e);
        assertThat(etudiantService.create(e)).isEqualTo(e);
        verify(etudiantRepository).save(e);
    }

    @Test
    public void create_duplicate_throws() {
        Etudiant e = sample();
        when(etudiantRepository.existsByEmail(e.getEmail())).thenReturn(true);
        Assertions.assertThrows(IllegalArgumentException.class, () -> etudiantService.create(e));
        verify(etudiantRepository, never()).save(any());
    }

    @Test
    public void update_ok() {
        Etudiant existing = sample();
        when(etudiantRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(etudiantRepository.save(any())).thenAnswer(i -> i.getArgument(0));
        Etudiant data = Etudiant.builder().firstName("Alan").lastName("Turing")
                .email("alan@ex.com").classe("M1").build();
        Etudiant updated = etudiantService.update(1L, data);
        assertThat(updated.getFirstName()).isEqualTo("Alan");
        assertThat(updated.getEmail()).isEqualTo("alan@ex.com");
    }

    @Test
    public void delete_ok() {
        Etudiant e = sample();
        when(etudiantRepository.findById(1L)).thenReturn(Optional.of(e));
        etudiantService.delete(1L);
        verify(etudiantRepository).delete(e);
    }
}
