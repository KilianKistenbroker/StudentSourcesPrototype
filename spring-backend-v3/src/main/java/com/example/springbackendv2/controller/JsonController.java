package com.example.springbackendv2.controller;

import com.example.springbackendv2.model.FileMetadata;
import com.example.springbackendv2.model.UserJson;
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
import java.util.ArrayList;
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

    @DeleteMapping("/deleteJson/{key}")
    public ResponseEntity<String> deleteJson(@PathVariable String key) {
        return new ResponseEntity<>(service.deleteJson(key), HttpStatus.OK);
    }

    @GetMapping(value = "/downloadJson/{key}")
    public ResponseEntity<ByteArrayResource> downloadJson(@PathVariable("key") String key) throws JsonProcessingException {
        byte[] data=  service.downloadJson(key);
        ByteArrayResource resource = new ByteArrayResource(data);

        return ResponseEntity
                .ok()
                .contentLength(data.length)
                .header("Content-type", "application/octet-stream")
                .header("Content-disposition, ", "attachment; filename=\"" + key + "\"")
                .body(resource);
    }

    @GetMapping(value = "/downloadOutsideJson/{key}")
    public ResponseEntity<ByteArrayResource> downloadOutsideJson(@PathVariable("key") String key) throws JsonProcessingException {

        byte[] data = service.downloadJson(key);

        // Convert the byte array to a string
        String jsonString = new String(data, StandardCharsets.UTF_8);

        // Create an ObjectMapper
        ObjectMapper mapper = new ObjectMapper();

        // Parse the JSON
        JsonNode jsonNode = mapper.readTree(jsonString);

        UserJson userJson = traverse(jsonNode);

        String userJsonString = mapper.writeValueAsString(userJson);

        // Convert the JSON string to a byte array
        byte[] userJsonData = userJsonString.getBytes(StandardCharsets.UTF_8);

        // Create a ByteArrayResource
        ByteArrayResource resource = new ByteArrayResource(userJsonData);

        return ResponseEntity
                .ok()
                .contentLength(userJsonData.length)
                .header("Content-type", "application/octet-stream")
                .header("Content-disposition", "attachment; filename=\"" + key + "\"")
                .body(resource);
    }


    private UserJson traverse(JsonNode node) {
        UserJson userJson = new UserJson();

        if (node.isObject()) {
            ObjectNode objectNode = (ObjectNode) node;
            Iterator<Map.Entry<String, JsonNode>> iter = objectNode.fields();

            while (iter.hasNext()) {
                Map.Entry<String, JsonNode> entry = iter.next();
                String fieldName = entry.getKey();
                JsonNode fieldValue = entry.getValue();

                if ("id".equals(fieldName)) {
                    userJson.setId(fieldValue.asLong());
                } else if ("name".equals(fieldName)) {
                    userJson.setName(fieldValue.asText());
                } else if ("pathname".equals(fieldName)) {
                    userJson.setPathname(fieldValue.asText());
                } else if ("type".equals(fieldName)) {
                    userJson.setType(fieldValue.asText());
                } else if ("visibility".equals(fieldName)) {
                    String visibility = fieldValue.asText();
                    if ("Public".equals(visibility)) {
                        userJson.setVisibility(visibility);
                    }
                } else if ("permissions".equals(fieldName)) {
                    userJson.setPermissions(fieldValue.asText());
                } else if ("dataUrl".equals(fieldName)) {
                    userJson.setDataUrl(fieldValue.asText());
                } else if ("items".equals(fieldName)) {
                    if (fieldValue.isArray()) {
                        ArrayList<UserJson> items = new ArrayList<>();
                        ArrayNode arrayNode = (ArrayNode) fieldValue;

                        for (JsonNode arrayElement : arrayNode) {
                            UserJson item = traverse(arrayElement);
                            if (item.getVisibility() != null) {
                                items.add(item);
                            }
                        }
                        userJson.setItems(items);
                    }
                }
            }
        }

        return userJson;
    }
}
