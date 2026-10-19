package com.polleria.api.auth;

import com.polleria.api.auth.jwt.JwtProvider;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;

class AuthUnitTest {

    @Test
    void testBcryptHashForPin1234() {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String hashInMigration = "$2a$10$77K7Ly4G52.3nVKC1bd6leWwA4EdL9xnhH0gTc8AAoW7n8Q5Mso4C";

        boolean matches = encoder.matches("1234", hashInMigration);
        if (!matches) {
            String newHash = encoder.encode("1234");
            System.out.println("GENERATED_HASH_FOR_1234=" + newHash);
        }
        assertTrue(matches, "Hash in migration must match PIN 1234");
    }

    @Test
    void testJwtProviderTokenGenerationAndValidation() {
        JwtProvider jwtProvider = new JwtProvider("404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970", 28800000L);
        String token = jwtProvider.generateToken("admin", "ADMIN");

        assertNotNull(token);
        assertTrue(jwtProvider.validateToken(token));
        assertEquals("admin", jwtProvider.extractUsername(token));
        assertEquals("ADMIN", jwtProvider.extractRole(token));
    }
}
