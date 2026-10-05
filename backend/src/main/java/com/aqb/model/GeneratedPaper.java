package com.aqb.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "generated_papers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GeneratedPaper {

    @Id
    private String id;

    @Column(name = "subject_id", nullable = false)
    private String subjectId;

    @Column(name = "course_code", nullable = false)
    private String courseCode;

    @Column(name = "exam_title", nullable = false)
    private String examTitle;

    @Column(name = "total_marks", nullable = false)
    private Integer totalMarks;

    @Column(name = "question_count", nullable = false)
    private Integer questionCount;

    @Column(name = "duration_hours")
    private String durationHours;

    @Column(name = "created_by", nullable = false)
    private String createdBy;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }
}
