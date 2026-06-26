package com.openclassrooms.etudiant.service;

import io.jsonwebtoken.ExpiredJwtException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.util.ReflectionTestUtils;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

public class JwtServiceTest {

    private JwtService jwtService;
    private final UserDetails user = User.builder().username("john").password("x").build();

    @BeforeEach
    void setUp() {
        jwtService = new JwtService();
        ReflectionTestUtils.setField(jwtService, "secret",
                "test-secret-key-test-secret-key-1234567890!!");
        ReflectionTestUtils.setField(jwtService, "expirationMs", 3600000L);
    }

    @Test
    public void generateToken_then_extractUsername() {
        String token = jwtService.generateToken(user);
        assertThat(token).isNotBlank();
        assertThat(jwtService.extractUsername(token)).isEqualTo("john");
    }

    @Test
    public void isTokenValid_true_for_matching_user() {
        String token = jwtService.generateToken(user);
        assertThat(jwtService.isTokenValid(token, user)).isTrue();
    }

    @Test
    public void isTokenValid_false_whenUsernameDoesNotMatch() {
        String token = jwtService.generateToken(user); // sujet = "john"
        UserDetails other = User.builder().username("alice").password("x").build();
        assertThat(jwtService.isTokenValid(token, other)).isFalse();
    }

    @Test
    public void extractUsername_throws_whenTokenExpired() {
        // Expiration negative => token deja expire des sa generation
        ReflectionTestUtils.setField(jwtService, "expirationMs", -1000L);
        String expired = jwtService.generateToken(user);
        assertThatThrownBy(() -> jwtService.extractUsername(expired))
                .isInstanceOf(ExpiredJwtException.class);
    }
}
