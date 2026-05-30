package com.example.medical.config;

import com.zaxxer.hikari.HikariDataSource;
import javax.sql.DataSource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

@Configuration
public class DataSourceConfig {

    @Bean
    @Primary
    public DataSource dataSource(
        @Value("${spring.datasource.url:${DATABASE_URL:jdbc:postgresql://localhost:5432/medical}}") String rawUrl,
        @Value("${spring.datasource.username:${DB_USERNAME:medical_user}}") String username,
        @Value("${spring.datasource.password:${DB_PASSWORD:change_me}}") String password
    ) {
        HikariDataSource dataSource = new HikariDataSource();
        dataSource.setDriverClassName("org.postgresql.Driver");
        dataSource.setJdbcUrl(normalizeJdbcUrl(rawUrl));
        dataSource.setUsername(username);
        dataSource.setPassword(password);
        dataSource.addDataSourceProperty("cachePrepStmts", "true");
        dataSource.addDataSourceProperty("prepStmtCacheSize", "250");
        dataSource.addDataSourceProperty("prepStmtCacheSqlLimit", "2048");
        return dataSource;
    }

    private String normalizeJdbcUrl(String value) {
        String jdbcUrl = value == null ? "" : value.trim();

        if (jdbcUrl.isEmpty()) {
            return "jdbc:postgresql://localhost:5432/medical";
        }

        if (jdbcUrl.startsWith("postgres://")) {
            jdbcUrl = "jdbc:postgresql://" + jdbcUrl.substring("postgres://".length());
        } else if (jdbcUrl.startsWith("postgresql://")) {
            jdbcUrl = "jdbc:postgresql://" + jdbcUrl.substring("postgresql://".length());
        } else if (jdbcUrl.startsWith("jdbc:postgres://")) {
            jdbcUrl = "jdbc:postgresql://" + jdbcUrl.substring("jdbc:postgres://".length());
        } else if (!jdbcUrl.startsWith("jdbc:")) {
            jdbcUrl = "jdbc:" + jdbcUrl;
        }

        if (!jdbcUrl.contains("sslmode=") && !jdbcUrl.contains("localhost") && !jdbcUrl.contains("127.0.0.1")) {
            jdbcUrl += jdbcUrl.contains("?") ? "&sslmode=require" : "?sslmode=require";
        }

        return jdbcUrl;
    }
}