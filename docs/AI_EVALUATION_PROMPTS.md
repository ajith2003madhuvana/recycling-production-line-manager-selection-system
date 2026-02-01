# AI Evaluation Prompts for Recycling Production Line Manager Selection

This document contains the three AI evaluation prompts used to assess candidates for the Recycling Production Line Manager position. Each prompt includes a clear scoring rubric and expects structured output.

---

## 1. Crisis Management Evaluation

### Prompt

```
You are an expert HR evaluator assessing a candidate for the position of Recycling Production Line Manager. Evaluate their crisis management capabilities based on their profile.

CANDIDATE PROFILE:
- Name: {{candidate.name}}
- Years of Experience: {{candidate.years_experience}}
- Skills: {{candidate.skills}}
- Background: {{candidate.background}}

EVALUATION CRITERIA:
Assess the candidate's ability to handle unexpected production crises, equipment failures, supply chain disruptions, and safety incidents in a recycling facility environment.

SCORING RUBRIC (1-10):

10 - Exceptional: Proven track record of managing multiple high-stakes crises. Demonstrates proactive risk mitigation, rapid decision-making, and post-crisis improvement implementation.

8-9 - Strong: Significant experience handling production emergencies. Shows clear methodology for crisis response and team coordination during high-pressure situations.

6-7 - Competent: Adequate crisis management experience. Can handle routine emergencies but may lack experience with complex, multi-factor crises.

4-5 - Developing: Limited direct crisis management experience. Shows potential but needs mentorship and structured protocols.

2-3 - Minimal: Little to no relevant crisis management experience. May struggle under pressure.

1 - Insufficient: No evidence of crisis management capability. Significant concerns about ability to handle production emergencies.

REQUIRED OUTPUT FORMAT:
{
  "score": <number 1-10>,
  "justification": "<2-3 sentences explaining the score>",
  "key_strengths": ["<strength 1>", "<strength 2>"],
  "areas_for_development": ["<area 1>", "<area 2>"]
}
```

---

## 2. Sustainability Knowledge Evaluation

### Prompt

```
You are an expert HR evaluator assessing a candidate for the position of Recycling Production Line Manager. Evaluate their sustainability knowledge and environmental consciousness.

CANDIDATE PROFILE:
- Name: {{candidate.name}}
- Years of Experience: {{candidate.years_experience}}
- Skills: {{candidate.skills}}
- Background: {{candidate.background}}

EVALUATION CRITERIA:
Assess the candidate's understanding of sustainable recycling practices, circular economy principles, environmental regulations, waste reduction strategies, and green manufacturing processes.

SCORING RUBRIC (1-10):

10 - Exceptional: Deep expertise in sustainability frameworks (ISO 14001, GRI). Proven implementation of zero-waste initiatives. Published research or recognized certifications in environmental management.

8-9 - Strong: Comprehensive knowledge of recycling best practices and environmental regulations. Track record of implementing measurable sustainability improvements.

6-7 - Competent: Solid understanding of basic sustainability principles. Familiar with common environmental regulations and standard recycling processes.

4-5 - Developing: Basic awareness of sustainability concepts. Limited practical experience implementing green initiatives.

2-3 - Minimal: Superficial understanding of sustainability. May view environmental concerns as secondary to production targets.

1 - Insufficient: No demonstrated interest or knowledge in sustainability. Potential liability for environmental compliance.

REQUIRED OUTPUT FORMAT:
{
  "score": <number 1-10>,
  "justification": "<2-3 sentences explaining the score>",
  "sustainability_expertise": ["<area 1>", "<area 2>"],
  "knowledge_gaps": ["<gap 1>", "<gap 2>"]
}
```

---

## 3. Team Motivation Evaluation

### Prompt

```
You are an expert HR evaluator assessing a candidate for the position of Recycling Production Line Manager. Evaluate their team motivation and leadership capabilities.

CANDIDATE PROFILE:
- Name: {{candidate.name}}
- Years of Experience: {{candidate.years_experience}}
- Skills: {{candidate.skills}}
- Background: {{candidate.background}}

EVALUATION CRITERIA:
Assess the candidate's ability to inspire, motivate, and lead production teams. Consider their experience with team building, performance management, conflict resolution, and creating a positive workplace culture in industrial settings.

SCORING RUBRIC (1-10):

10 - Exceptional: Transformational leader with documented history of dramatically improving team morale and productivity. Skilled in diverse motivation techniques, mentorship programs, and retention strategies.

8-9 - Strong: Proven leadership experience managing production teams of 20+ people. Demonstrates empathy, clear communication, and ability to align team goals with organizational objectives.

6-7 - Competent: Solid team management experience. Capable of day-to-day leadership but may lack experience with challenging team dynamics or large-scale motivation initiatives.

4-5 - Developing: Some supervisory experience but limited scope. Shows leadership potential but needs development in motivational strategies.

2-3 - Minimal: Little to no direct team leadership experience. May struggle with interpersonal aspects of management.

1 - Insufficient: No evidence of leadership capability. Concerning gaps in people management skills.

REQUIRED OUTPUT FORMAT:
{
  "score": <number 1-10>,
  "justification": "<2-3 sentences explaining the score>",
  "leadership_strengths": ["<strength 1>", "<strength 2>"],
  "development_needs": ["<need 1>", "<need 2>"]
}
```

---

## Implementation Notes

### Mock AI Evaluation Logic

Since we're not using paid AI APIs, the mock evaluation follows this deterministic logic:

```typescript
function mockEvaluate(candidate: Candidate): Evaluation {
  // Base scores derived from experience
  const expFactor = Math.min(candidate.years_experience / 15, 1);
  
  // Skill-based modifiers
  const crisisSkills = ['crisis management', 'problem solving', 'safety'];
  const sustainSkills = ['sustainability', 'environmental', 'iso 14001', 'green'];
  const teamSkills = ['leadership', 'team', 'management', 'mentoring'];
  
  const skillsLower = candidate.skills.map(s => s.toLowerCase());
  
  const crisisBonus = crisisSkills.filter(s => 
    skillsLower.some(sk => sk.includes(s))
  ).length;
  
  const sustainBonus = sustainSkills.filter(s => 
    skillsLower.some(sk => sk.includes(s))
  ).length;
  
  const teamBonus = teamSkills.filter(s => 
    skillsLower.some(sk => sk.includes(s))
  ).length;
  
  return {
    crisis_management: Math.min(10, Math.round(4 + expFactor * 3 + crisisBonus)),
    sustainability: Math.min(10, Math.round(4 + expFactor * 3 + sustainBonus)),
    team_motivation: Math.min(10, Math.round(4 + expFactor * 3 + teamBonus))
  };
}
```

### Score Aggregation

Total score is calculated as:
```
total_score = crisis_management + sustainability + team_motivation
```

Maximum possible score: 30 (10 + 10 + 10)

### Ranking Algorithm

Candidates are ranked by:
1. Total score (descending)
2. Candidate ID (ascending, for tie-breaking)

Rank 1 = highest total score.
