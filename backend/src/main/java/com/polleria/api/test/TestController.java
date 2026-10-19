package com.polleria.api.test;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/test")
@Tag(name = "Test", description = "Endpoints de prueba de autorización por rol")
@SecurityRequirement(name = "bearerAuth")
public class TestController {

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Endpoint solo para Administradores")
    public ResponseEntity<Map<String, String>> adminEndpoint() {
        return ResponseEntity.ok(Map.of(
                "message", "Acceso concedido a zona ADMIN",
                "role", "ADMIN"
        ));
    }

    @GetMapping("/mesero")
    @PreAuthorize("hasRole('MESERO')")
    @Operation(summary = "Endpoint solo para Meseros")
    public ResponseEntity<Map<String, String>> meseroEndpoint() {
        return ResponseEntity.ok(Map.of(
                "message", "Acceso concedido a zona MESERO",
                "role", "MESERO"
        ));
    }

    @GetMapping("/cocina")
    @PreAuthorize("hasRole('COCINA')")
    @Operation(summary = "Endpoint solo para Cocina")
    public ResponseEntity<Map<String, String>> cocinaEndpoint() {
        return ResponseEntity.ok(Map.of(
                "message", "Acceso concedido a zona COCINA",
                "role", "COCINA"
        ));
    }
}
