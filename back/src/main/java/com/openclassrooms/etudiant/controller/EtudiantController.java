package com.openclassrooms.etudiant.controller;

import com.openclassrooms.etudiant.dto.EtudiantDTO;
import com.openclassrooms.etudiant.mapper.EtudiantMapper;
import com.openclassrooms.etudiant.service.EtudiantService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/etudiants")
@RequiredArgsConstructor
public class EtudiantController {

    private final EtudiantService etudiantService;
    private final EtudiantMapper etudiantMapper;

    @GetMapping
    public ResponseEntity<List<EtudiantDTO>> getAll() {
        return ResponseEntity.ok(etudiantMapper.toDtoList(etudiantService.findAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<EtudiantDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(etudiantMapper.toDto(etudiantService.findById(id)));
    }

    @PostMapping
    public ResponseEntity<EtudiantDTO> create(@Valid @RequestBody EtudiantDTO dto) {
        EtudiantDTO created = etudiantMapper.toDto(etudiantService.create(etudiantMapper.toEntity(dto)));
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EtudiantDTO> update(@PathVariable Long id, @Valid @RequestBody EtudiantDTO dto) {
        EtudiantDTO updated = etudiantMapper.toDto(etudiantService.update(id, etudiantMapper.toEntity(dto)));
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        etudiantService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
