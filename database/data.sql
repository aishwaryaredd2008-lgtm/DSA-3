-- ====================================================================
-- SEED DATA FOR AUTOMATED QUESTION BANK GENERATING SYSTEM
-- ====================================================================

USE aqb_system_db;

-- 1. Insert Users
INSERT INTO users (id, name, email, password, role, department) VALUES
('usr-admin-01', 'Dr. Sarah Jenkins', 'admin@univ.edu', '$2a$10$e88yE3/J1k4v71...admin', 'Admin', 'Department of Computer Science & Engineering'),
('usr-fac-02', 'Prof. Alan Turing', 'faculty@univ.edu', '$2a$10$x7819q/L9v...faculty', 'Faculty/Teacher', 'Department of Computer Science & Engineering');

-- 2. Insert Subject
INSERT INTO subjects (id, name, course_code, description) VALUES
('sub-dsa-01', 'Data Structures and Algorithms', 'CS301-DSA', 'Fundamental linear and non-linear data structures, sorting, searching, hashing, graph theory, and algorithmic complexity.');

-- 3. Insert Topics
INSERT INTO topics (id, subject_id, name, unit) VALUES
('top-arr', 'sub-dsa-01', 'Arrays', 1),
('top-ll', 'sub-dsa-01', 'Linked Lists', 1),
('top-stk', 'sub-dsa-01', 'Stacks', 2),
('top-que', 'sub-dsa-01', 'Queues', 2),
('top-tre', 'sub-dsa-01', 'Trees', 3),
('top-srch', 'sub-dsa-01', 'Searching', 4),
('top-sort', 'sub-dsa-01', 'Sorting', 4),
('top-grp', 'sub-dsa-01', 'Graphs', 4),
('top-hsh', 'sub-dsa-01', 'Hashing', 5),
('top-dp', 'sub-dsa-01', 'Dynamic Programming', 5);

-- 4. Insert Questions
INSERT INTO questions (id, question_text, subject_id, topic_id, unit, difficulty, marks, question_type, answer, bloom_level) VALUES
('Q-1001', 'What is the time complexity of accessing an element in an array using an index?', 'sub-dsa-01', 'top-arr', 1, 'Easy', 2, 'MCQ', 'O(1) because arrays provide direct indexed memory access in constant time.', 'Remember'),
('Q-1003', 'Explain the difference between singly linked list and doubly linked list with diagrams.', 'sub-dsa-01', 'top-ll', 1, 'Easy', 5, 'Short Answer', 'Singly linked list has a single next pointer; doubly linked list has both prev and next pointers allowing bi-directional traversal.', 'Understand'),
('Q-1004', 'Write an algorithm to reverse a singly linked list in O(n) time and O(1) space.', 'sub-dsa-01', 'top-ll', 1, 'Medium', 10, 'Descriptive', 'Maintain three pointers: prev = NULL, curr = head, next = NULL. Iterate through list reversing curr.next = prev.', 'Apply'),
('Q-1006', 'Which data structure follows the Last In First Out (LIFO) principle?', 'sub-dsa-01', 'top-stk', 2, 'Easy', 2, 'MCQ', 'Stack follows the LIFO principle.', 'Remember'),
('Q-1008', 'Describe the conversion of an Infix arithmetic expression to Postfix notation using a Stack.', 'sub-dsa-01', 'top-stk', 2, 'Medium', 10, 'Descriptive', 'Use an operator stack and follow precedence rules: operands to output, operators pushed or popped based on priority.', 'Apply'),
('Q-1009', 'Explain circular queue operations and illustrate condition for queue full and empty.', 'sub-dsa-01', 'top-que', 2, 'Medium', 5, 'Short Answer', 'Queue full: (rear + 1) % size == front; Queue empty: front == -1.', 'Understand'),
('Q-1011', 'What is the maximum number of nodes in a binary tree of height h?', 'sub-dsa-01', 'top-tre', 3, 'Easy', 2, 'MCQ', '2^(h+1) - 1 nodes.', 'Remember'),
('Q-1012', 'Explain AVL tree rotations (LL, RR, LR, RL) with clear diagrams and examples.', 'sub-dsa-01', 'top-tre', 3, 'Hard', 10, 'Descriptive', 'AVL tree enforces balance factor between -1 and +1. Single rotations (LL, RR) or double rotations (LR, RL) restore balance.', 'Apply'),
('Q-1016', 'Explain the working of Binary Search algorithm with example and deduce its time complexity.', 'sub-dsa-01', 'top-srch', 4, 'Easy', 5, 'Short Answer', 'Divide-and-conquer on sorted arrays: compare target with middle element and recurse on left or right half.', 'Understand'),
('Q-1017', 'Explain Merge Sort with an example and demonstrate its recursive recurrence relation.', 'sub-dsa-01', 'top-sort', 4, 'Medium', 10, 'Descriptive', 'Divide array into two halves, recursively sort both, and merge two sorted subarrays in O(n) time. T(n) = 2T(n/2) + O(n).', 'Apply'),
('Q-1019', 'Explain Breadth First Search (BFS) graph traversal with an example and queue implementation.', 'sub-dsa-01', 'top-grp', 4, 'Medium', 10, 'Descriptive', 'BFS explores vertices level by level using a Queue. Time complexity is O(V + E).', 'Apply'),
('Q-1021', 'Explain Dijkstra\'s Single Source Shortest Path algorithm using a Priority Queue / Min-Heap.', 'sub-dsa-01', 'top-grp', 4, 'Hard', 10, 'Descriptive', 'Greedy algorithm that relaxes edges with minimum tentative distance. O((V + E) log V) with min-heap.', 'Apply'),
('Q-1023', 'Explain collision resolution techniques in Hashing: Separate Chaining vs Open Addressing.', 'sub-dsa-01', 'top-hsh', 5, 'Medium', 5, 'Short Answer', 'Separate Chaining stores collisions in linked lists; Open Addressing probes other slots.', 'Understand'),
('Q-1025', 'Solve the 0/1 Knapsack Problem using Dynamic Programming. Write recurrence relation and construct DP table.', 'sub-dsa-01', 'top-dp', 5, 'Hard', 10, 'Descriptive', 'DP[i][w] = max(DP[i-1][w], DP[i-1][w - wt[i]] + val[i]). Time complexity is O(n * W).', 'Evaluate');
