package com.example.event.Exception;

public class InternalServorError extends RuntimeException {
    private static final long serialVersionUID = -449934134715309038L;

	public InternalServorError() {
    }

    public InternalServorError(String message) {
        super(message);
    }
}
