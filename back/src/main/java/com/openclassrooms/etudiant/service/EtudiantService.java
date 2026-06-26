package com.openclassrooms.etudiant.service;

import com.openclassrooms.etudiant.entities.Etudiant;
import com.openclassrooms.etudiant.repository.EtudiantRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import java.util.List;

/**
 * Logique métier du CRUD des étudiants.
 */
@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class EtudiantService {

    private final EtudiantRepository etudiantRepository;

    public List<Etudiant> findAll() {
        return etudiantRepository.findAll();
    }

    public Etudiant findById(Long id) {
        Assert.notNull(id, "Id must not be null");
        return etudiantRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Etudiant not found with id " + id));
    }

    public Etudiant create(Etudiant etudiant) {
        Assert.notNull(etudiant, "Etudiant must not be null");
        if (etudiantRepository.existsByEmail(etudiant.getEmail())) {
            throw new IllegalArgumentException("Etudiant with email " + etudiant.getEmail() + " already exists");
        }
        log.info("Creating etudiant {}", etudiant.getEmail());
        return etudiantRepository.save(etudiant);
    }

    public Etudiant update(Long id, Etudiant data) {
        Etudiant existing = findById(id);
        existing.setFirstName(data.getFirstName());
        existing.setLastName(data.getLastName());
        existing.setEmail(data.getEmail());
        existing.setClasse(data.getClasse());
        log.info("Updating etudiant {}", id);
        return etudiantRepository.save(existing);
    }

    public void delete(Long id) {
        Etudiant existing = findById(id);
        etudiantRepository.delete(existing);
        log.info("Deleted etudiant {}", id);
    }
}
