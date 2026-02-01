package com.medical.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Arrays;
import java.util.List;

/**
 * CORS Configuration for Spring Boot Backend
 * Allows React frontend to communicate with the API
 */
@Configuration
public class CorsConfig {

    @Value("${app.cors.allowed-origins:http://localhost:5173,http://localhost:3000}")
    private String[] allowedOrigins;

    @Value("${app.cors.allowed-methods:GET,POST,PUT,DELETE,PATCH,OPTIONS}")
    private String[] allowedMethods;

    @Value("${app.cors.allowed-headers:*}")
    private String[] allowedHeaders;

    @Value("${app.cors.allow-credentials:true}")
    private boolean allowCredentials;

    @Value("${app.cors.max-age:3600}")
    private long maxAge;

    /**
     * Configure CORS using WebMvcConfigurer
     * This is the recommended approach for Spring Boot 3.x
     */
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins(allowedOrigins)
                        .allowedMethods(allowedMethods)
                        .allowedHeaders(allowedHeaders)
                        .allowCredentials(allowCredentials)
                        .maxAge(maxAge);
            }
        };
    }

    /**
     * Alternative CORS configuration using CorsConfigurationSource
     * Used by Spring Security if present
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Allowed origins (React frontend URLs)
        configuration.setAllowedOrigins(Arrays.asList(allowedOrigins));
        
        // Allowed HTTP methods
        configuration.setAllowedMethods(Arrays.asList(allowedMethods));
        
        // Allowed headers
        if (allowedHeaders.length == 1 && allowedHeaders[0].equals("*")) {
            configuration.addAllowedHeader("*");
        } else {
            configuration.setAllowedHeaders(Arrays.asList(allowedHeaders));
        }
        
        // Expose headers (for pagination, etc.)
        configuration.setExposedHeaders(Arrays.asList(
                "Authorization",
                "Content-Type",
                "Content-Disposition",
                "X-Total-Count",
                "X-Total-Pages"
        ));
        
        // Allow credentials (cookies, authorization headers)
        configuration.setAllowCredentials(allowCredentials);
        
        // Cache preflight response for 1 hour
        configuration.setMaxAge(maxAge);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", configuration);
        
        return source;
    }
}
