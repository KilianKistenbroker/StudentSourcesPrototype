package com.example.springbackendv2.config;

import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.multipart.MultipartResolver;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;

import java.nio.charset.StandardCharsets;

@Configuration
public class StorageConfig {

    @Value("${cloud.aws.credentials.access-key1}")
    private String accessKey1;
    @Value("${cloud.aws.credentials.secret-key1}")
    private String accessSecret1;
    @Value("${cloud.aws.credentials.access-key2}")
    private String accessKey2;
    @Value("${cloud.aws.credentials.secret-key2}")
    private String accessSecret2;
    @Value("${cloud.aws.region.static}")
    private String region;


    @Bean
    public MultipartResolver multipartResolver() {
        CommonsMultipartResolver resolver
                = new CommonsMultipartResolver();
        resolver.setDefaultEncoding(StandardCharsets.UTF_8.displayName());
        resolver.setMaxUploadSize(1073741824L); //50MB
        resolver.setMaxUploadSizePerFile(1073741824L); //50MB

        return resolver;
    }

    @Bean
    public AmazonS3 s3Client1() {
        AWSCredentials credentials = new BasicAWSCredentials(accessKey1, accessSecret1);
        return AmazonS3ClientBuilder.standard()
                .withCredentials(new AWSStaticCredentialsProvider(credentials))
                .withRegion(region).build();
    }

    @Bean
    public AmazonS3 s3Client2() {
        AWSCredentials credentials = new BasicAWSCredentials(accessKey2, accessSecret2);
        return AmazonS3ClientBuilder.standard()
                .withCredentials(new AWSStaticCredentialsProvider(credentials))
                .withRegion(region).build();
    }
}
