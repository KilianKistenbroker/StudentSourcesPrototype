package com.example.springbackendv2.controller;

import com.example.springbackendv2.dto.UserJsonDto;
import com.example.springbackendv2.service.StorageService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
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



// THIS IS A WORKAROUND FOR AN ISSUE I AM HAVING WITH COPYING A CHILD NODE
    JsonNode GLOBALJSON;




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

        UserJsonDto userJsonDto = traverse(jsonNode);

        String userJsonString = mapper.writeValueAsString(userJsonDto);

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

    @GetMapping(value = "/downloadChildJson/{key}/{targetId}")
    public ResponseEntity<ByteArrayResource> downloadChildJson(@PathVariable("key") String key,
                                                               @PathVariable("targetId") Long targetId) throws JsonProcessingException {

        byte[] data = service.downloadJson(key);

        // Convert the byte array to a string
        String jsonString = new String(data, StandardCharsets.UTF_8);

        // Create an ObjectMapper
        ObjectMapper mapper = new ObjectMapper();

        // Parse the JSON
        JsonNode jsonNode = mapper.readTree(jsonString);

        JsonNode userJsonDto = copyChildNode(jsonNode, targetId);
        UserJsonDto filterChild = traverse(GLOBALJSON);

        String userJsonString = mapper.writeValueAsString(filterChild);

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


    private JsonNode copyChildNode(JsonNode node, Long targetId) {

        if (node.isObject()) {
            ObjectNode objectNode = (ObjectNode) node;
            Iterator<Map.Entry<String, JsonNode>> iter = objectNode.fields();

            while (iter.hasNext()) {
                Map.Entry<String, JsonNode> entry = iter.next();
                String fieldName = entry.getKey();
                JsonNode fieldValue = entry.getValue();

                if ("id".equals(fieldName) && fieldValue.asLong() == targetId) {
                    // Return a copy of the entire object if the id matches the targetId
                    return traverseTree(node.deepCopy());
                } else if ("items".equals(fieldName) && fieldValue.isArray()) {
                    ArrayNode copiedItems = objectNode.putArray("items");
                    ArrayNode arrayNode = (ArrayNode) fieldValue;

                    for (JsonNode arrayElement : arrayNode) {
                        if (arrayElement != null) { // Added null check
                            JsonNode copiedItem = copyChildNode(arrayElement, targetId);
                            if (copiedItem != null && copiedItem.get("visibility") != null) {
                                copiedItems.add(copiedItem);
                            }
                        }
                    }
                }
            }
        }

        return null;
    }

    private JsonNode traverseTree(JsonNode node) {
        ObjectNode copiedNode = JsonNodeFactory.instance.objectNode();

        if (node != null && node.isObject()) {
            ObjectNode objectNode = (ObjectNode) node;
            Iterator<Map.Entry<String, JsonNode>> iter = objectNode.fields();

            while (iter.hasNext()) {
                Map.Entry<String, JsonNode> entry = iter.next();
                String fieldName = entry.getKey();
                JsonNode fieldValue = entry.getValue();

                copiedNode.set(fieldName, fieldValue.deepCopy());
            }
        }

//        WORKAROUND IMPLEMENTATION
        GLOBALJSON = copiedNode;
        return copiedNode;
    }

    private UserJsonDto traverse(JsonNode node) {
        UserJsonDto userJsonDto = new UserJsonDto();

        if (node.isObject()) {
            ObjectNode objectNode = (ObjectNode) node;
            Iterator<Map.Entry<String, JsonNode>> iter = objectNode.fields();

            while (iter.hasNext()) {
                Map.Entry<String, JsonNode> entry = iter.next();
                String fieldName = entry.getKey();
                JsonNode fieldValue = entry.getValue();

                if ("id".equals(fieldName)) {
                    userJsonDto.setId(fieldValue.asLong());
                } else if ("name".equals(fieldName)) {
                    userJsonDto.setName(fieldValue.asText());
                } else if ("pathname".equals(fieldName)) {
                    userJsonDto.setPathname(fieldValue.asText());
                } else if ("type".equals(fieldName)) {
                    userJsonDto.setType(fieldValue.asText());
                } else if ("visibility".equals(fieldName)) {
                    String visibility = fieldValue.asText();
                    if ("Public".equals(visibility)) {
                        userJsonDto.setVisibility(visibility);
                    }
                } else if ("permissions".equals(fieldName)) {
                    userJsonDto.setPermissions(fieldValue.asText());
                } else if ("dataUrl".equals(fieldName)) {
                    userJsonDto.setDataUrl(fieldValue.asText());
                } else if ("items".equals(fieldName)) {
                    if (fieldValue.isArray()) {
                        ArrayList<UserJsonDto> items = new ArrayList<>();
                        ArrayNode arrayNode = (ArrayNode) fieldValue;

                        for (JsonNode arrayElement : arrayNode) {
                            UserJsonDto item = traverse(arrayElement);
                            if (item.getVisibility() != null) {
                                items.add(item);
                            }
                        }
                        userJsonDto.setItems(items);
                    }
                }
            }
        }

        return userJsonDto;
    }
}
