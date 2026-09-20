package com.tcs.inventory.dto.response;

import java.util.List;

public class JwtResponse {

    private String token;
    private String tokenType;
    private Long userId;
    private String username;
    private String email;
    private List<String> roles;

    public JwtResponse() {}

    public JwtResponse(String token, String tokenType, Long userId, String username, String email, List<String> roles) {
        this.token = token;
        this.tokenType = tokenType;
        this.userId = userId;
        this.username = username;
        this.email = email;
        this.roles = roles;
    }

    public String getToken() { return token; }
    public String getTokenType() { return tokenType; }
    public Long getUserId() { return userId; }
    public String getUsername() { return username; }
    public String getEmail() { return email; }
    public List<String> getRoles() { return roles; }

    public void setToken(String token) { this.token = token; }
    public void setTokenType(String tokenType) { this.tokenType = tokenType; }
    public void setUserId(Long userId) { this.userId = userId; }
    public void setUsername(String username) { this.username = username; }
    public void setEmail(String email) { this.email = email; }
    public void setRoles(List<String> roles) { this.roles = roles; }
}
