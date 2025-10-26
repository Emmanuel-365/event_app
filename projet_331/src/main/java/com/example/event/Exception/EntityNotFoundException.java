package com.example.event.Exception;

public class EntityNotFoundException extends RuntimeException{

    private static final long serialVersionUID = 5963106449170923826L;

	public EntityNotFoundException() {
    }

    public EntityNotFoundException(String message) {
        super(message);
    }


}
