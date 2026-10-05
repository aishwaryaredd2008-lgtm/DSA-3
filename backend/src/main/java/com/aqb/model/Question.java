package com.aqb.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "questions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Question {

    @Id
    private String id;

    @Column(name = "question_text", nullable = false, columnDefinition = "TEXT")
    private String questionText;

    @Column(name = "subject_id", nullable = false)
    private String subjectId;

    @Column(name = "topic_id", nullable = false)
    private String topicId;

    @Column(nullable = false)
    private Integer unit;

    @Column(nullable = false)
    private String difficulty; // Easy, Medium, Hard

    @Column(nullable = false)
    private Integer marks; // 2, 5, 10, 15, 20

    @Column(name = "question_type", nullable = false)
    private String questionType; // MCQ, Short Answer, Descriptive

    @Column(columnDefinition = "TEXT")
    private String answer;

    @Column(name = "bloom_level")
    private String bloomLevel;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }
}
