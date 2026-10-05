package com.aqb.dto;

import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
public class PaperGenerationRequest {
    private String subject;
    private String courseCode;
    private String examTitle;
    private String institutionName;
    private String department;
    private String durationHours;
    private Integer totalMarks;
    private Integer questionCount;
    private String questionType; // 'Mixed', 'MCQ', 'Short Answer', 'Descriptive'
    private List<String> selectedTopics;
    private String sortAlgorithm; // 'MergeSort' or 'QuickSort'
    private Map<String, Double> difficultyDistribution;
}
