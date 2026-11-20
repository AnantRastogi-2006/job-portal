package com.jobhub;

import static org.junit.jupiter.api.Assertions.*;

import com.jobhub.util.PasswordHasher;
import org.junit.jupiter.api.Test;

class PasswordHasherTest {

    @Test
    void correctPasswordVerifies() {
        String hash = PasswordHasher.hash("secret123");
        assertTrue(PasswordHasher.verify("secret123", hash));
    }

    @Test
    void wrongPasswordFails() {
        assertFalse(PasswordHasher.verify("nope", PasswordHasher.hash("secret123")));
    }

    @Test
    void sameServerPasswordGivesDifferentHashes() {
        assertNotEquals(PasswordHasher.hash("abc123"), PasswordHasher.hash("abc123"));
    }

    @Test
    void garbageHashDoesNotCrash() {
        assertFalse(PasswordHasher.verify("x", "garbage"));
        assertFalse(PasswordHasher.verify("x", null));
    }
}
