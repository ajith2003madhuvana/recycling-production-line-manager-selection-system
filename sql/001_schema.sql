-- ============================================
-- Recycling Production Line Manager Selection System
-- MySQL Database Schema
-- ============================================

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS rankings;
DROP TABLE IF EXISTS evaluations;
DROP TABLE IF EXISTS candidates;

-- ============================================
-- CANDIDATES TABLE
-- Stores basic candidate profile information
-- ============================================
CREATE TABLE candidates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20),
    years_experience INT NOT NULL CHECK (years_experience >= 0 AND years_experience <= 50),
    skills TEXT NOT NULL COMMENT 'Comma-separated list of skills',
    background TEXT NOT NULL COMMENT 'Professional background summary',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_candidates_experience (years_experience),
    INDEX idx_candidates_name (name),
    INDEX idx_candidates_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- EVALUATIONS TABLE
-- Stores AI-generated evaluation scores
-- ============================================
CREATE TABLE evaluations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    candidate_id INT NOT NULL,
    crisis_management TINYINT NOT NULL CHECK (crisis_management >= 1 AND crisis_management <= 10),
    sustainability TINYINT NOT NULL CHECK (sustainability >= 1 AND sustainability <= 10),
    team_motivation TINYINT NOT NULL CHECK (team_motivation >= 1 AND team_motivation <= 10),
    evaluator_notes TEXT,
    evaluated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE,
    UNIQUE KEY uk_evaluations_candidate (candidate_id),
    INDEX idx_evaluations_scores (crisis_management, sustainability, team_motivation)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- RANKINGS TABLE
-- Stores computed rankings based on evaluations
-- ============================================
CREATE TABLE rankings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    candidate_id INT NOT NULL,
    total_score INT NOT NULL DEFAULT 0 COMMENT 'Sum of all evaluation scores',
    rank INT NOT NULL DEFAULT 0 COMMENT 'Position in leaderboard (1 = best)',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE,
    UNIQUE KEY uk_rankings_candidate (candidate_id),
    INDEX idx_rankings_score (total_score DESC),
    INDEX idx_rankings_rank (rank)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TRIGGER: Auto-create ranking entry when candidate is created
-- ============================================
DELIMITER //
CREATE TRIGGER trg_candidate_after_insert
AFTER INSERT ON candidates
FOR EACH ROW
BEGIN
    INSERT INTO rankings (candidate_id, total_score, rank)
    VALUES (NEW.id, 0, 0);
END//
DELIMITER ;

-- ============================================
-- TRIGGER: Auto-update ranking when evaluation is inserted/updated
-- ============================================
DELIMITER //
CREATE TRIGGER trg_evaluation_after_insert
AFTER INSERT ON evaluations
FOR EACH ROW
BEGIN
    -- Update total score
    UPDATE rankings 
    SET total_score = NEW.crisis_management + NEW.sustainability + NEW.team_motivation
    WHERE candidate_id = NEW.candidate_id;
    
    -- Recalculate all ranks
    CALL sp_recalculate_ranks();
END//
DELIMITER ;

DELIMITER //
CREATE TRIGGER trg_evaluation_after_update
AFTER UPDATE ON evaluations
FOR EACH ROW
BEGIN
    -- Update total score
    UPDATE rankings 
    SET total_score = NEW.crisis_management + NEW.sustainability + NEW.team_motivation
    WHERE candidate_id = NEW.candidate_id;
    
    -- Recalculate all ranks
    CALL sp_recalculate_ranks();
END//
DELIMITER ;

-- ============================================
-- STORED PROCEDURE: Recalculate all ranks
-- ============================================
DELIMITER //
CREATE PROCEDURE sp_recalculate_ranks()
BEGIN
    SET @rank := 0;
    UPDATE rankings r
    INNER JOIN (
        SELECT 
            candidate_id,
            @rank := @rank + 1 AS new_rank
        FROM rankings
        ORDER BY total_score DESC, candidate_id ASC
    ) ranked ON r.candidate_id = ranked.candidate_id
    SET r.rank = ranked.new_rank;
END//
DELIMITER ;

-- ============================================
-- VIEW: Combined candidate data with evaluations and rankings
-- ============================================
CREATE OR REPLACE VIEW vw_candidate_leaderboard AS
SELECT 
    c.id,
    c.name,
    c.email,
    c.phone,
    c.years_experience,
    c.skills,
    c.background,
    c.created_at,
    COALESCE(e.crisis_management, 0) AS crisis_management,
    COALESCE(e.sustainability, 0) AS sustainability,
    COALESCE(e.team_motivation, 0) AS team_motivation,
    e.evaluator_notes,
    e.evaluated_at,
    r.total_score,
    r.rank,
    r.updated_at AS rank_updated_at
FROM candidates c
LEFT JOIN evaluations e ON c.id = e.candidate_id
LEFT JOIN rankings r ON c.id = r.candidate_id
ORDER BY r.rank ASC;
