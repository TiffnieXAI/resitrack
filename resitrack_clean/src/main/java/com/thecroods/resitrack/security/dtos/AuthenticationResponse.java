package com.thecroods.resitrack.security.DTOS;

public class AuthenticationResponse {

    private String response;

    public AuthenticationResponse() {}

    public AuthenticationResponse(String response) {
        this.response = response;
    }

    public String getResponse() {
        return response;
    }
}
