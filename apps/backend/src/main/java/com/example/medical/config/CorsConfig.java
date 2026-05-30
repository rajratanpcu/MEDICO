package com.example.medical.config;

import java.util.Arrays;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Value("${app.cors.allowed-origins:}")
    private String[] allowedOrigins;

    @Value("${app.cors.allowed-methods:GET,POST,PUT,DELETE,PATCH,OPTIONS}")
    private String[] allowedMethods;

    @Value("${app.cors.allowed-headers:*}")
    private String[] allowedHeaders;

    @Value("${app.cors.allow-credentials:false}")
    private boolean allowCredentials;

    @Value("${app.cors.max-age:3600}")
    private long maxAge;

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                    .allowedOriginPatterns(resolveAllowedOriginPatterns())
                    .allowedMethods(allowedMethods)
                    .allowedHeaders(resolveAllowedHeaders())
                    .allowCredentials(hasExplicitOrigins() && allowCredentials)
                    .maxAge(maxAge);
            }
        };
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        if (hasExplicitOrigins()) {
            configuration.setAllowedOrigins(resolveAllowedOrigins());
            configuration.setAllowCredentials(allowCredentials);
        } else {
            configuration.addAllowedOriginPattern("*");
            configuration.setAllowCredentials(false);
        }
        configuration.setAllowedMethods(Arrays.asList(allowedMethods));
        configuration.setAllowedHeaders(resolveAllowedHeaders());
        configuration.setExposedHeaders(List.of(
            "Authorization",
            "Content-Type",
            "Content-Disposition",
            "X-Total-Count",
            "X-Total-Pages"
        ));
        configuration.setMaxAge(maxAge);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    private boolean hasExplicitOrigins() {
        return allowedOrigins != null
            && Arrays.stream(allowedOrigins).anyMatch(origin -> origin != null && !origin.isBlank());
    }

    private List<String> resolveAllowedOrigins() {
        return Arrays.stream(allowedOrigins)
            .filter(origin -> origin != null && !origin.isBlank())
            .toList();
    }

    private String[] resolveAllowedOriginPatterns() {
        if (hasExplicitOrigins()) {
            return resolveAllowedOrigins().toArray(new String[0]);
        }
        return new String[] {"*"};
    }

    private List<String> resolveAllowedHeaders() {
        if (allowedHeaders.length == 1 && "*".equals(allowedHeaders[0])) {
            return List.of("*");
        }
        return Arrays.stream(allowedHeaders)
            .filter(header -> header != null && !header.isBlank())
            .toList();
    }
}