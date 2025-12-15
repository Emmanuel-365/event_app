package com.example.event.Exception.handler;

import com.example.event.Exception.*;
import com.example.event.dto.ErrorMessage;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Date;

@RestControllerAdvice
public class AppExceptionHandler {

    @ExceptionHandler(value = {EntityNotFoundException.class})
    public ResponseEntity<Object> entityNotFoundException(EntityNotFoundException e){
            ErrorMessage errorMessage = ErrorMessage.builder()
                    .message(e.getMessage())
                    .timestamp(new Date())
                    .code(404)
                    .build();
            return  new ResponseEntity<>(errorMessage, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(value = {EntityAlreadyExistException.class})
    public ResponseEntity<Object> entityAlreadyException(EntityAlreadyExistException e){
        ErrorMessage errorMessage = ErrorMessage.builder()
                .message(e.getMessage())
                .timestamp(new Date())
                .code(409)
                .build();
        return  new ResponseEntity<>(errorMessage, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(value = {MethodNotAllowedException.class})
    public ResponseEntity<Object> MethodNotAllowedException(MethodNotAllowedException e){
        ErrorMessage errorMessage = ErrorMessage.builder()
                .message(e.getMessage())
                .timestamp(new Date())
                .code(405)
                .build();
        return  new ResponseEntity<>(errorMessage, HttpStatus.METHOD_NOT_ALLOWED);
    }
    @ExceptionHandler(value = {BadRequestException.class})
    public ResponseEntity<Object> BadRequestException(BadRequestException e){
        ErrorMessage errorMessage = ErrorMessage.builder()
                .message(e.getMessage())
                .timestamp(new Date())
                .code(400)
                .build();
        return  new ResponseEntity<>(errorMessage, HttpStatus.BAD_REQUEST);
    }
    @ExceptionHandler(value = {InternalServorError.class})
    public ResponseEntity<Object> InternalErrorServorException (InternalServorError e){
        //Instanciantion de l'objet sans builder
        ErrorMessage errorMessage = new ErrorMessage(e.getMessage(),new Date(),500);

        return  new ResponseEntity<>(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    @ExceptionHandler(value = {ForbiddenException.class})
    public ResponseEntity<Object> InternalErrorServorException (ForbiddenException e){
        //Instanciantion de l'objet sans builder
        ErrorMessage errorMessage = new ErrorMessage(e.getMessage(),new Date(),403);

        return  new ResponseEntity<>(errorMessage, HttpStatus.FORBIDDEN);
    }
}
