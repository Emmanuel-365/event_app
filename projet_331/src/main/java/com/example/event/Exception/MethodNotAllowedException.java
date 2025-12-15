package com.example.event.Exception;

public class MethodNotAllowedException extends  RuntimeException{
    private static final long serialVersionUID = 3397345710670748976L;

	public MethodNotAllowedException() {
    }

    public MethodNotAllowedException(String message) {
        super(message);
    }
}
