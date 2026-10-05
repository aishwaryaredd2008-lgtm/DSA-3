package com.aqb;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class AutomatedQuestionBankApplication {
    public static void main(String[] args) {
        SpringApplication.run(AutomatedQuestionBankApplication.class, args);
        System.out.println("==========================================================");
        System.out.println("  AUTOMATED QUESTION BANK GENERATING SYSTEM STARTED (8080)");
        System.out.println("  DSA Engine: Hash Table O(1), B-Tree Index, KMP, 0/1 DP  ");
        System.out.println("==========================================================");
    }
}
