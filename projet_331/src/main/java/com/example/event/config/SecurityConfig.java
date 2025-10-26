package com.example.event.config;

import com.example.event.DetailService.OrganizerDetailService;
import com.example.event.DetailService.VisitorDetailService;
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

    private final OrganizerDetailService organizerDetailService;
    private final VisitorDetailService visitorDetailService;
    private final PasswordEncoder passwordEncoder;

    // Organizer Auth Provider
    @SuppressWarnings("deprecation")
	@Bean
    DaoAuthenticationProvider organizerAuthProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(organizerDetailService);
        provider.setPasswordEncoder(passwordEncoder);
        return provider;
    }

    // Visitor Auth Provider
    @SuppressWarnings("deprecation")
	@Bean
    DaoAuthenticationProvider visitorAuthProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(visitorDetailService);
        provider.setPasswordEncoder(passwordEncoder);
        return provider;
    }

    // AuthenticationManager avec les deux providers
    @Bean
    AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
        AuthenticationManagerBuilder auth = http.getSharedObject(AuthenticationManagerBuilder.class);
        auth.authenticationProvider(organizerAuthProvider());
        auth.authenticationProvider(visitorAuthProvider());
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
                        .requestMatchers("/organizer/register").permitAll()
                        .requestMatchers("/visitor/register").permitAll()
                        .requestMatchers(HttpMethod.GET, "/event", "/event/**").authenticated()
                        .requestMatchers(HttpMethod.POST, "/event").hasRole("ORGANIZER")
                        .requestMatchers(HttpMethod.PUT, "/event/**").hasRole("ORGANIZER")
                        .requestMatchers(HttpMethod.DELETE, "/event/**").hasRole("ORGANIZER")
                        .requestMatchers("/organizer/**").hasRole("ORGANIZER")
                        .requestMatchers("/member/**").hasRole("ORGANIZER")
                        .requestMatchers("/ticket/**").hasRole("ORGANIZER")
                        .requestMatchers("/image/**").hasRole("ORGANIZER")
                        .requestMatchers("/subscription/**").hasRole("VISITOR")
                        .requestMatchers("/visitor/**").hasRole("VISITOR")
                        .anyRequest().authenticated()
                )
                .formLogin(form -> form
                        .loginProcessingUrl("/login")
                        .successHandler((request, response, authentication) -> {
                            // Redirection selon le rôle
                            String role = authentication.getAuthorities().iterator().next().getAuthority();
                            if(role.equals("ROLE_ORGANIZER")) {
                                response.sendRedirect("/organizer/home");
                            } else if(role.equals("ROLE_VISITOR")) {
                                response.sendRedirect("/visitor/home");
                            } else {
                                response.sendRedirect("/"); // fallback
                            }
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
