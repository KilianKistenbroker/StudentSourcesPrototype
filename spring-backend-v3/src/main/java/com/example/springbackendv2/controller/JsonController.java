package com.example.springbackendv2.controller;

import com.example.springbackendv2.model.FileMetadata;
import com.example.springbackendv2.service.StorageService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.charset.StandardCharsets;
import java.util.Iterator;
import java.util.Map;

@RestController
public class JsonController {
    @Autowired
    private StorageService service;
    @PostMapping(value = "/uploadJson/{key}")
    public ResponseEntity<String> uploadJson(@RequestParam(value = "file") MultipartFile file,
                                             @PathVariable("key") String key) {

        return new ResponseEntity<>(service.uploadJson(file, key), HttpStatus.OK);
    }

    @GetMapping(value = "/downloadJson/{key}")
    public ResponseEntity<ByteArrayResource> downloadJson(@PathVariable("key") String key) throws JsonProcessingException {
        byte[] data=  service.downloadJson(key);
        ByteArrayResource resource = new ByteArrayResource(data);

        // Convert the byte array to a string
        String jsonString = new String(data, StandardCharsets.UTF_8);

        // Create an ObjectMapper
        ObjectMapper mapper = new ObjectMapper();

        // Parse the JSON
        JsonNode jsonNode = mapper.readTree(jsonString);

        traverse(jsonNode);

        // Convert the modified JSON back to a string
        String modifiedJsonString = mapper.writeValueAsString(jsonNode);

        // Print the modified JSON
//        System.out.println(modifiedJsonString);


        return ResponseEntity
                .ok()
                .contentLength(data.length)
                .header("Content-type", "application/octet-stream")
                .header("Content-disposition, ", "attachment; filename=\"" + key + "\"")
                .body(resource);
    }

    private void traverse(JsonNode node) {
        if (node.isObject()) {
            ObjectNode objectNode = (ObjectNode) node;
            Iterator<Map.Entry<String, JsonNode>> iter = objectNode.fields();

            while (((Iterator<?>) iter).hasNext()) {
                Map.Entry<String, JsonNode> entry = iter.next();
                traverse(entry.getValue());
            }
        } else if (node.isArray()) {
            ArrayNode arrayNode = (ArrayNode) node;
            for (JsonNode arrayElement : arrayNode) {
                traverse(arrayElement);
            }
        } else if (node.isValueNode()) {
            // Modify the value here
//            System.out.println(node.asText());
        }
    }
}
