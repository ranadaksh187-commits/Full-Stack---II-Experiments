package com.example.backend.service;

import com.example.backend.entity.ScheduledPost;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@ConditionalOnProperty(name = "app.kafka.enabled", havingValue = "true")
public class KafkaProducerService {

    @Autowired
    private KafkaTemplate<String, ScheduledPost> kafkaTemplate;

    public void publishPostEvent(ScheduledPost post) {
        // Send event to Kafka topic
        kafkaTemplate.send("post-topic", String.valueOf(post.getId()), post);
        System.out.println("Published event for post ID: " + post.getId());
    }
}
