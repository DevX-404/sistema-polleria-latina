package com.polleria.api.auth.service;

import com.polleria.api.auth.dto.LoginRequest;
import com.polleria.api.auth.dto.LoginResponse;
import com.polleria.api.auth.jwt.JwtProvider;
import com.polleria.api.user.domain.User;
import com.polleria.api.user.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
public class AuthService {

    private static final int MAX_FAILED_ATTEMPTS = 3;
    private static final int LOCK_DURATION_MINUTES = 15;

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtProvider jwtProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtProvider = jwtProvider;
    }

    @Transactional(noRollbackFor = ResponseStatusException.class)
    public LoginResponse login(LoginRequest request) {
        User user = findUser(request);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario o PIN incorrecto");
        }

        if (!user.isEnabled()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Usuario deshabilitado en el sistema");
        }

        Instant now = Instant.now();

        // 1. Verificar si la cuenta está bloqueada
        if (user.getLockedUntil() != null) {
            if (user.getLockedUntil().isAfter(now)) {
                long minutesLeft = Duration.between(now, user.getLockedUntil()).toMinutes() + 1;
                throw new ResponseStatusException(
                        HttpStatus.LOCKED,
                        "Cuenta bloqueada por múltiples intentos fallidos. Intenta de nuevo en " + minutesLeft + " minuto(s)."
                );
            } else {
                // El tiempo de bloqueo ya expiró, reiniciamos el bloqueo
                user.setLockedUntil(null);
                user.setFailedAttempts(0);
            }
        }

        // 2. Validar el PIN con BCrypt
        if (!passwordEncoder.matches(request.getPin(), user.getPassword())) {
            int attempts = user.getFailedAttempts() + 1;
            user.setFailedAttempts(attempts);

            if (attempts >= MAX_FAILED_ATTEMPTS) {
                user.setLockedUntil(now.plus(LOCK_DURATION_MINUTES, ChronoUnit.MINUTES));
                userRepository.save(user);
                throw new ResponseStatusException(
                        HttpStatus.LOCKED,
                        "Has alcanzado " + attempts + " intentos fallidos. Tu cuenta ha sido bloqueada por "
                                + LOCK_DURATION_MINUTES + " minutos."
                );
            }

            userRepository.save(user);
            int remaining = MAX_FAILED_ATTEMPTS - attempts;
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "PIN incorrecto. Intentos restantes antes del bloqueo: " + remaining
            );
        }

        // 3. Autenticación exitosa: reiniciar intentos y generar token
        user.setFailedAttempts(0);
        user.setLockedUntil(null);
        userRepository.save(user);

        String token = jwtProvider.generateToken(user.getUsername(), user.getRole().name());

        return new LoginResponse(token, user.getUsername(), user.getRole().name());
    }

    private User findUser(LoginRequest request) {
        if (request.getUserId() != null) {
            return userRepository.findById(request.getUserId()).orElse(null);
        }
        if (request.getUsername() != null && !request.getUsername().isBlank()) {
            // Permitir buscar por username, o si es numérico buscar también por id
            try {
                long parsedId = Long.parseLong(request.getUsername());
                User userById = userRepository.findById(parsedId).orElse(null);
                if (userById != null) {
                    return userById;
                }
            } catch (NumberFormatException ignored) {
            }
            return userRepository.findByUsername(request.getUsername()).orElse(null);
        }
        return null;
    }
}
