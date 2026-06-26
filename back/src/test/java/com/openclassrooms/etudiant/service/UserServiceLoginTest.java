package com.openclassrooms.etudiant.service;

import com.openclassrooms.etudiant.entities.User;
import com.openclassrooms.etudiant.repository.UserRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(SpringExtension.class)
public class UserServiceLoginTest {

    @Mock private UserRepository userRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JwtService jwtService;
    @InjectMocks private UserService userService;

    @Test
    public void login_success_returns_token() {
        User user = new User();
        user.setLogin("john");
        user.setPassword("hash");
        when(userRepository.findByLogin("john")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("pwd", "hash")).thenReturn(true);
        when(jwtService.generateToken(user)).thenReturn("jwt-token");

        assertThat(userService.login("john", "pwd")).isEqualTo("jwt-token");
    }

    @Test
    public void login_invalid_password_throws() {
        User user = new User();
        user.setLogin("john");
        user.setPassword("hash");
        when(userRepository.findByLogin("john")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("bad", "hash")).thenReturn(false);

        Assertions.assertThrows(IllegalArgumentException.class,
                () -> userService.login("john", "bad"));
    }

    @Test
    public void login_unknown_user_throws() {
        when(userRepository.findByLogin("ghost")).thenReturn(Optional.empty());
        Assertions.assertThrows(IllegalArgumentException.class,
                () -> userService.login("ghost", "pwd"));
    }
}
