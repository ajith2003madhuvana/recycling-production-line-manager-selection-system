-- ============================================
-- Sample SQL Queries for the Selection System
-- ============================================

-- Get top 10 candidates
SELECT 
    c.name,
    c.years_experience,
    e.crisis_management,
    e.sustainability,
    e.team_motivation,
    r.total_score,
    r.rank
FROM candidates c
JOIN evaluations e ON c.id = e.candidate_id
JOIN rankings r ON c.id = r.candidate_id
ORDER BY r.rank ASC
LIMIT 10;

-- Get candidates by skill (example: searching for "Lean Manufacturing")
SELECT 
    c.name,
    c.skills,
    r.total_score,
    r.rank
FROM candidates c
JOIN rankings r ON c.id = r.candidate_id
WHERE c.skills LIKE '%Lean Manufacturing%'
ORDER BY r.rank ASC;

-- Get average scores across all candidates
SELECT 
    AVG(crisis_management) AS avg_crisis,
    AVG(sustainability) AS avg_sustainability,
    AVG(team_motivation) AS avg_motivation,
    AVG(crisis_management + sustainability + team_motivation) AS avg_total
FROM evaluations;

-- Get score distribution
SELECT 
    CASE 
        WHEN total_score >= 25 THEN 'Excellent (25-30)'
        WHEN total_score >= 20 THEN 'Good (20-24)'
        WHEN total_score >= 15 THEN 'Average (15-19)'
        ELSE 'Below Average (<15)'
    END AS score_tier,
    COUNT(*) AS candidate_count
FROM rankings
GROUP BY score_tier
ORDER BY MIN(total_score) DESC;

-- Get candidates with experience correlation
SELECT 
    CASE 
        WHEN years_experience <= 5 THEN '0-5 years'
        WHEN years_experience <= 10 THEN '6-10 years'
        ELSE '11+ years'
    END AS experience_tier,
    AVG(r.total_score) AS avg_score,
    COUNT(*) AS count
FROM candidates c
JOIN rankings r ON c.id = r.candidate_id
GROUP BY experience_tier
ORDER BY avg_score DESC;

-- Find top performer in each evaluation category
(SELECT 'Crisis Management' AS category, c.name, e.crisis_management AS score
 FROM candidates c JOIN evaluations e ON c.id = e.candidate_id
 ORDER BY e.crisis_management DESC LIMIT 1)
UNION ALL
(SELECT 'Sustainability' AS category, c.name, e.sustainability AS score
 FROM candidates c JOIN evaluations e ON c.id = e.candidate_id
 ORDER BY e.sustainability DESC LIMIT 1)
UNION ALL
(SELECT 'Team Motivation' AS category, c.name, e.team_motivation AS score
 FROM candidates c JOIN evaluations e ON c.id = e.candidate_id
 ORDER BY e.team_motivation DESC LIMIT 1);
