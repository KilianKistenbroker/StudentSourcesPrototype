package com.example.springbackendv2.service;

import com.example.springbackendv2.exception.UserNotFoundException;
import com.example.springbackendv2.model.Tokens;
import com.example.springbackendv2.repository.TokensRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Service
public class TokensService {

    private final Random random = new SecureRandom();
    private final String CHARACTERS =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    @Autowired
    private TokensRepository tokensRepository;



    //    Put token in database. to be called internally by login function.
    public String saveToken(Long userId){
        String token = generateToken(20);
        Tokens tokens = new Tokens();
        tokens.setToken(token);
        tokens.setFk_user_id(userId);
        tokensRepository.save(tokens);

        System.out.println("Token generated: " + token + " for User Id: " + userId);

//        return token to user.
        return token;
    }

    //    check and update token last used date, given token string.
//    to be called internally by any request
    public boolean checkAndUpdateToken(String tokenValue, Long userId) {
        Tokens token = tokensRepository.findByTokenAndUserId(tokenValue, userId);

        if (token == null) {
            System.out.println("token not found");
            return false; // Token not found
        }

        LocalDateTime now = LocalDateTime.now();

        // Check if the token is expired
        if (token.getExpirationDate().isBefore(now)) {
            deleteToken(token.getId());
            System.out.println("token has expired");
            return false; // Token is expired
        }

        // Update lastUsedDate and save
        token.setLastUsedDate(now);
        tokensRepository.save(token);
        return true; // Token is valid and updated
    }

    void deleteToken(Long id){
        if(!tokensRepository.existsById(id)){
            throw new UserNotFoundException(id);
        }
        tokensRepository.deleteById(id);
        System.out.println("Deleted token with id: " + id);
    }

    List<Tokens> getAllTokens(){
        return tokensRepository.findAll();
    }
    Tokens getTokenById(Long id){
        return  tokensRepository.findById(id)
                .orElseThrow(()-> new UserNotFoundException(id));
    }

    public void deleteByTokenAndUserId(String token, Long userId) {
        tokensRepository.deleteByTokenAndUserId(token, userId);
    }

    public void deleteAllByUserId(Long userId) {
        tokensRepository.deleteAllByUserId(userId);
    }



    private String generateToken(int length) {
        if (length <= 0) {
            throw new IllegalArgumentException("Length must be a positive number.");
        }

        StringBuilder token;
        token = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            token.append(CHARACTERS.charAt(random.nextInt(CHARACTERS.length())));
        }

        return token.toString();
    }
}
