package com.aqb.dto;

import com.aqb.model.Question;
import lombok.Builder;
import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
@Builder
public class PaperResponse {
    private String paperId;
    private String subject;
    private String courseCode;
    private String examTitle;
    private String institutionName;
    private String department;
    private String durationHours;
    private Integer totalMarks;
    private Integer questionCount;
    private String createdAt;
    private List<Question> questions;
    private Map<String, Object> paperSets;
    private String algorithmMethodUsed;
    private double totalExecutionTimeMs;
    private List<Map<String, Object>> pipelineLog;
}
