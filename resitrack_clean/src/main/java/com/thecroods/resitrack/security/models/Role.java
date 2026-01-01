package com.thecroods.resitrack.security.models;

import lombok.Getter;

import java.util.Set;

@Getter
public enum Role {

    ROLE_ADMIN(Set.of(Permissions.RESI_WRITE, Permissions.RESI_READ, Permissions.RESI_DELETE, Permissions.RESI_UPDATE)),
    ROLE_USER(Set.of(Permissions.RESI_WRITE, Permissions.RESI_READ));

    private final Set<Permissions> permissions;

    Role(Set<Permissions> permissions) {
        this.permissions = permissions;
    }
}
