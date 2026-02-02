// Faker.js script to generate 40 realistic candidates
// Run with: npx ts-node src/data/generateCandidates.ts

import { faker } from '@faker-js/faker';
import type { Candidate, Evaluation, Ranking, CandidateWithEvaluation } from '../types';

// Skill categories relevant to recycling production management
const SKILL_CATEGORIES = {
  technical: [
    'Lean Manufacturing',
    'Six Sigma',
    'ISO 14001',
    'ISO 9001',
    'Process Optimization',
    'Equipment Maintenance',
    'PLC Programming',
    'SCADA Systems',
    'Quality Control',
    'Waste Stream Analysis',
    'Material Recovery',
    'Sorting Technology',
    'Baling Operations',
    'Shredder Management',
  ],
  sustainability: [
    'Sustainability Reporting',
    'Carbon Footprint Analysis',
    'Circular Economy',
    'Environmental Compliance',
    'Green Manufacturing',
    'Zero Waste Initiatives',
    'Life Cycle Assessment',
    'EPA Regulations',
    'Hazardous Waste Management',
  ],
  leadership: [
    'Team Leadership',
    'Performance Management',
    'Conflict Resolution',
    'Staff Training',
    'Union Relations',
    'Cross-functional Teams',
    'Mentoring',
    'Change Management',
  ],
  operations: [
    'Production Planning',
    'Inventory Management',
    'Supply Chain',
    'Logistics Coordination',
    'Budget Management',
    'KPI Development',
    'Safety Management',
    'OSHA Compliance',
    'Crisis Management',
    'Problem Solving',
  ],
};

const BACKGROUND_TEMPLATES = [
  'Started career in waste management at {company}, progressing from line supervisor to operations manager. Led a team of {teamSize} workers across {shifts} shifts.',
  'Former {industry} professional who transitioned to recycling sector. Implemented process improvements that increased material recovery by {percent}%.',
  'Engineering background with specialization in industrial automation. Designed and deployed sorting systems for {company} resulting in {percent}% efficiency gains.',
  'Environmental science graduate with {years}+ years in sustainable manufacturing. Certified in ISO 14001 and passionate about circular economy principles.',
  'Operations veteran from {industry} with proven track record in scaling production facilities. Managed annual budgets exceeding ${budget}M.',
  'Safety-first leader with OSHA certification. Achieved {days} consecutive days without lost-time incidents at previous facility.',
  'Lean manufacturing expert trained at {company}. Successfully led kaizen events resulting in {percent}% waste reduction.',
  'Union-experienced manager who built strong labor relations at {company}. Known for transparent communication and fair conflict resolution.',
];

const COMPANIES = [
  'Waste Management Inc.',
  'Republic Services',
  'Veolia',
  'Suez',
  'Clean Harbors',
  'Stericycle',
  'GFL Environmental',
  'Casella Waste',
  'Covanta',
  'Tesla Gigafactory',
  'Toyota Manufacturing',
  'General Electric',
  'Caterpillar',
  'John Deere',
];

const INDUSTRIES = [
  'automotive manufacturing',
  'food processing',
  'pharmaceutical',
  'chemical processing',
  'paper and pulp',
  'plastics manufacturing',
  'metal fabrication',
  'electronics assembly',
];

function getRandomSkills(): string[] {
  const numSkills = faker.number.int({ min: 4, max: 8 });
  const allSkills = Object.values(SKILL_CATEGORIES).flat();
  const shuffled = faker.helpers.shuffle(allSkills);
  return shuffled.slice(0, numSkills);
}

function generateBackground(yearsExp: number): string {
  const template = faker.helpers.arrayElement(BACKGROUND_TEMPLATES);
  return template
    .replace('{company}', faker.helpers.arrayElement(COMPANIES))
    .replace('{industry}', faker.helpers.arrayElement(INDUSTRIES))
    .replace('{teamSize}', faker.number.int({ min: 15, max: 80 }).toString())
    .replace('{shifts}', faker.helpers.arrayElement(['2', '3']))
    .replace('{percent}', faker.number.int({ min: 15, max: 45 }).toString())
    .replace('{years}', Math.max(3, yearsExp - 2).toString())
    .replace('{budget}', faker.number.int({ min: 2, max: 15 }).toString())
    .replace('{days}', faker.number.int({ min: 180, max: 1000 }).toString());
}

function evaluateCandidate(candidate: Candidate): Omit<Evaluation, 'id' | 'evaluated_at'> {
  // Deterministic mock AI evaluation based on skills and experience
  const expFactor = Math.min(candidate.years_experience / 15, 1);
  const skillsLower = candidate.skills.map(s => s.toLowerCase());
  
  // Crisis management scoring
  const crisisKeywords = ['crisis', 'problem solving', 'safety', 'osha', 'emergency'];
  const crisisBonus = crisisKeywords.filter(k => 
    skillsLower.some(s => s.includes(k))
  ).length;
  
  // Sustainability scoring
  const sustainKeywords = ['sustainability', 'environmental', 'iso 14001', 'green', 'circular', 'carbon'];
  const sustainBonus = sustainKeywords.filter(k => 
    skillsLower.some(s => s.includes(k))
  ).length;
  
  // Team motivation scoring
  const teamKeywords = ['leadership', 'team', 'management', 'mentoring', 'training', 'conflict'];
  const teamBonus = teamKeywords.filter(k => 
    skillsLower.some(s => s.includes(k))
  ).length;
  
  // Add some randomness for realism
  const randomFactor = () => faker.number.float({ min: -0.5, max: 0.5 });
  
  return {
    candidate_id: candidate.id,
    crisis_management: Math.min(10, Math.max(1, Math.round(4 + expFactor * 3 + crisisBonus + randomFactor()))),
    sustainability: Math.min(10, Math.max(1, Math.round(4 + expFactor * 3 + sustainBonus + randomFactor()))),
    team_motivation: Math.min(10, Math.max(1, Math.round(4 + expFactor * 3 + teamBonus + randomFactor()))),
    evaluator_notes: `Auto-evaluated based on ${candidate.years_experience} years experience and ${candidate.skills.length} listed skills.`,
  };
}

export function generateCandidates(count: number = 40): CandidateWithEvaluation[] {
  // Set seed for reproducible data
  faker.seed(42);
  
  const candidates: CandidateWithEvaluation[] = [];
  
  for (let i = 1; i <= count; i++) {
    const yearsExp = faker.number.int({ min: 2, max: 15 });
    const skills = getRandomSkills();
    
    const candidate: Candidate = {
      id: i,
      name: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      phone: faker.phone.number(),
      years_experience: yearsExp,
      skills,
      background: generateBackground(yearsExp),
      created_at: faker.date.past({ years: 1 }).toISOString(),
    };
    
    const evalData = evaluateCandidate(candidate);
    const totalScore = evalData.crisis_management + evalData.sustainability + evalData.team_motivation;
    
    const evaluation: Evaluation = {
      id: i,
      ...evalData,
      evaluated_at: faker.date.recent({ days: 30 }).toISOString(),
    };
    
    const ranking: Ranking = {
      id: i,
      candidate_id: i,
      total_score: totalScore,
      rank: 0, // Will be calculated after all candidates are generated
      updated_at: new Date().toISOString(),
    };
    
    candidates.push({
      ...candidate,
      evaluation,
      ranking,
    });
  }
  
  // Calculate ranks based on total score DESC, then ID ASC for tie-breaker
  candidates.sort((a, b) => {
    const scoreDiff = b.ranking.total_score - a.ranking.total_score;
    if (scoreDiff !== 0) return scoreDiff;
    // Tie-breaker: candidate ID ascending
    return a.id - b.id;
  });
  candidates.forEach((c, index) => {
    c.ranking.rank = index + 1;
  });
  
  return candidates;
}

// Export pre-generated data
export const mockCandidates = generateCandidates(40);
