package com.openclassrooms.etudiant.handler;

import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.context.request.ServletWebRequest;
import org.springframework.web.context.request.WebRequest;

import java.nio.file.AccessDeniedException;

import static org.assertj.core.api.Assertions.assertThat;

class RestExceptionHandlerTest {

    private final RestExceptionHandler handler = new RestExceptionHandler();
    private final WebRequest request = new ServletWebRequest(new MockHttpServletRequest());

    @Test
    void handleConflict_returnsBadRequest() {
        ResponseEntity<Object> response =
                handler.handleConflict(new IllegalArgumentException("argument invalide"), request);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    void handleBadCredentials_returnsUnauthorized() {
        ResponseEntity<Object> response =
                handler.handleBadCredentialsException(new BadCredentialsException("identifiants invalides"), request);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }

    @Test
    void handleForbidden_returnsForbidden() {
        ResponseEntity<Object> response =
                handler.handleForbiddenException(new AccessDeniedException("acces refuse"), request);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
    }

    @Test
    void handleException_returnsInternalServerError() {
        ResponseEntity<Object> response =
                handler.handleException(new RuntimeException("erreur interne"), request);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Test
    void handleNotFound_returnsNotFound() {
        ResponseEntity<Object> response =
                handler.handleNotFound(new EntityNotFoundException("introuvable"), request);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }
}
