package com.aqb.repository;

import com.aqb.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, String> {
    List<List<Question>> findBySubjectId(String subjectId);
    List<Question> findByTopicId(String topicId);
    List<Question> findByDifficulty(String difficulty);
    List<Question> findByMarks(Integer marks);
}
