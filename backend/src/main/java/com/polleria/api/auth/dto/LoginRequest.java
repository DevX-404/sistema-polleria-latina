package com.polleria.api.auth.dto;

import jakarta.validation.constraints.NotBlank;

public class LoginRequest {

    private String username;
    private Long userId;

    @NotBlank(message = "El PIN es obligatorio")
    private String pin;

    public LoginRequest() {
    }

    public LoginRequest(String username, String pin) {
        this.username = username;
        this.pin = pin;
    }

    public LoginRequest(Long userId, String pin) {
        this.userId = userId;
        this.pin = pin;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getPin() {
        return pin;
    }

    public void setPin(String pin) {
        this.pin = pin;
    }
}
