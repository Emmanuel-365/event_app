package com.example.event.Exception;

public class BadRequestException extends RuntimeException{
    private static final long serialVersionUID = 909976556377666109L;

	public BadRequestException() {
    }

    public BadRequestException(String message) {
        super(message);
    }
}
