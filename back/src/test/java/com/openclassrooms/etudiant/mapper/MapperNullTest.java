package com.openclassrooms.etudiant.mapper;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Couvre les garde-fous "null" generes par MapStruct dans les mappers (branches if (source == null)).
 * Les implementations *Impl sont generees a la compilation et possedent un constructeur sans argument.
 */
class MapperNullTest {

    private final EtudiantMapper etudiantMapper = new EtudiantMapperImpl();
    private final UserDtoMapper userDtoMapper = new UserDtoMapperImpl();

    @Test
    void etudiantMapper_returnsNull_onNullInputs() {
        assertThat(etudiantMapper.toDto(null)).isNull();
        assertThat(etudiantMapper.toEntity(null)).isNull();
        assertThat(etudiantMapper.toDtoList(null)).isNull();
    }

    @Test
    void userDtoMapper_returnsNull_onNullInput() {
        assertThat(userDtoMapper.toEntity(null)).isNull();
    }
}
