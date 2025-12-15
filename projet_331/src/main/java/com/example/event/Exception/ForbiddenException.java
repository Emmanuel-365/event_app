package com.example.event.Exception;



public class ForbiddenException extends RuntimeException {
    private static final long serialVersionUID = -6329170328605336062L;

	public ForbiddenException() {
    }

    public ForbiddenException(String message) {
        super(message);
    }
}
