package com.example.event.Exception;

public class EntityAlreadyExistException extends  RuntimeException {
    private static final long serialVersionUID = -4880601882811434234L;

	public EntityAlreadyExistException() {
    }

    public EntityAlreadyExistException(String message) {
        super(message);
    }
}
