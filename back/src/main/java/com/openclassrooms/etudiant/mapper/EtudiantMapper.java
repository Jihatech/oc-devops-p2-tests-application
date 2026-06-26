package com.openclassrooms.etudiant.mapper;

import com.openclassrooms.etudiant.dto.EtudiantDTO;
import com.openclassrooms.etudiant.entities.Etudiant;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface EtudiantMapper {

    EtudiantDTO toDto(Etudiant etudiant);

    List<EtudiantDTO> toDtoList(List<Etudiant> etudiants);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Etudiant toEntity(EtudiantDTO dto);
}
