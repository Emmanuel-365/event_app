package com.example.event.config;

import com.example.event.DetailService.UserDetailsServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final UserDetailsServiceImpl userDetailsService;
    private final PasswordEncoder passwordEncoder;

    @Bean
    AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
        AuthenticationManagerBuilder auth = http.getSharedObject(AuthenticationManagerBuilder.class);
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder);
        auth.authenticationProvider(provider);
        return auth.build();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173"));
        configuration.setAllowedMethods(Arrays.asList("GET","POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/register").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/auth/forgot-password").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/auth/reset-password").permitAll()
                        .requestMatchers(HttpMethod.GET, "/event", "/event/**").authenticated()
                        .requestMatchers(HttpMethod.POST, "/event").hasAuthority("ROLE_ORGANIZER")
                        .requestMatchers(HttpMethod.PUT, "/event/**").hasAuthority("ROLE_ORGANIZER")
                        .requestMatchers(HttpMethod.DELETE, "/event/**").hasAuthority("ROLE_ORGANIZER")
                        .requestMatchers("/member/**").hasAuthority("ROLE_ORGANIZER")
                        .requestMatchers("/ticket/**").hasAuthority("ROLE_ORGANIZER")
                        .requestMatchers("/image/**").hasAuthority("ROLE_ORGANIZER")
                        .requestMatchers(HttpMethod.POST, "/subscription").hasAuthority("ROLE_VISITOR")
                        .requestMatchers(HttpMethod.GET, "/subscription/visitor/me").hasAuthority("ROLE_VISITOR")
                        .requestMatchers(HttpMethod.GET, "/subscription/event/**").hasAuthority("ROLE_ORGANIZER")
                        .requestMatchers(HttpMethod.POST, "/subscription/validate/**").hasAuthority("ROLE_ORGANIZER")
                        .requestMatchers("/api/profile/me").authenticated()
                        .requestMatchers("/api/stats/recommendation").permitAll()
                        .requestMatchers("/api/admin/**").hasAuthority("ROLE_ADMIN") // New admin rule
                        .anyRequest().authenticated()
                )
                .formLogin(form -> form
                        .loginProcessingUrl("/login")
                        .successHandler((request, response, authentication) -> {
                            response.setStatus(200);
                        })
                        .failureHandler((request, response, exception) -> {
                            response.setStatus(401);
                        })
                        .permitAll()
                )
                .logout(logout -> logout
                        .logoutUrl("/logout")
                        .logoutSuccessUrl("/login")
                        .permitAll()
                );

        return http.build();
    }
}
