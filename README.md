# Recycling Production Line Manager Selection System

A technical hiring demo showcasing a production-quality candidate evaluation system built with modern web technologies.

## 🎯 Project Overview

This system manages the selection process for Recycling Production Line Manager positions. It features:

- **AI-powered candidate evaluation** (mocked for demo)
- **Real-time leaderboard** with sortable rankings
- **Visual skill heatmap** for score comparison
- **Detailed candidate profiles** with evaluation breakdowns

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + Vite |
| UI Framework | Mantine v7 |
| Icons | Tabler Icons |
| Data Generation | Faker.js |
| Database Schema | MySQL-compatible SQL |
| Language | TypeScript |

## 📁 Folder Structure

```
├── docs/
│   └── AI_EVALUATION_PROMPTS.md    # AI prompt templates with rubrics
├── sql/
│   ├── 001_schema.sql              # Database schema (tables, triggers, views)
│   └── 002_sample_queries.sql      # Example queries
├── src/
│   ├── components/
│   │   ├── Leaderboard.tsx         # Top 10 sortable table
│   │   ├── CandidateCard.tsx       # Profile cards with scores
│   │   └── SkillHeatmap.tsx        # Visual score comparison
│   ├── data/
│   │   └── generateCandidates.ts   # Faker.js data generator
│   ├── types/
│   │   └── index.ts                # TypeScript interfaces
│   └── App.tsx                     # Main dashboard
└── README.md
```

## 🚀 How to Run

### Prerequisites

- Node.js 18+ or Bun
- npm, yarn, or bun package manager

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The app will be available at `http://localhost:5173`

## 📊 Data Generation

### Candidate Generation (Faker.js)

The `generateCandidates.ts` script creates 40 realistic candidates with:

- **Names**: Generated using Faker.js person module
- **Experience**: 2-15 years (realistic distribution)
- **Skills**: 4-8 skills from curated categories:
  - Technical (Lean Manufacturing, Six Sigma, ISO certifications)
  - Sustainability (Carbon analysis, EPA regulations)
  - Leadership (Team management, Mentoring)
  - Operations (Production planning, Safety)
- **Background**: Template-based generation with realistic company names

### Mock AI Evaluation

Scores are deterministically generated based on:

1. **Experience factor** (0-1 scale based on years)
2. **Skill matching** (keywords boost relevant scores)
3. **Random variance** (±0.5 for realism)

```typescript
// Example scoring logic
crisis_management = 4 + (experience_factor * 3) + skill_matches + random
```

## 📈 Ranking System

### Score Calculation

```
total_score = crisis_management + sustainability + team_motivation
```

- Each category: 1-10 points
- Maximum total: 30 points

### Ranking Algorithm

1. Sort all candidates by `total_score` DESC
2. Tie-breaker: `candidate_id` ASC
3. Assign sequential ranks (1 = best)

### Database Triggers

The SQL schema includes triggers that automatically:

1. Create ranking entries when candidates are inserted
2. Recalculate all ranks when evaluations change

## 🗄 Database Schema

### Tables

| Table | Purpose |
|-------|---------|
| `candidates` | Basic profile information |
| `evaluations` | AI-generated scores (1-10 each) |
| `rankings` | Computed total scores and ranks |

### Key Features

- Foreign key constraints with CASCADE delete
- Check constraints for score validation (1-10)
- Indexes on frequently queried columns
- Stored procedure for rank recalculation
- View for combined leaderboard data

## 🤖 AI Evaluation Prompts

Three structured prompts evaluate candidates on:

1. **Crisis Management** - Emergency response, safety protocols
2. **Sustainability Knowledge** - Environmental practices, ISO 14001
3. **Team Motivation** - Leadership, mentoring, conflict resolution

Each prompt includes:
- Detailed scoring rubric (1-10)
- Candidate profile placeholder
- Structured JSON output format

See `docs/AI_EVALUATION_PROMPTS.md` for full prompt templates.

## 🎨 UI Components

### Leaderboard
- Sortable by any column
- Click headers to toggle sort direction
- Visual rank badges (🥇🥈🥉)
- Color-coded score badges

### Candidate Cards
- Avatar with initials
- Skills as badges
- Progress bars for each score
- Contact information

### Skill Heatmap
- Color gradient (red → yellow → green)
- Hover tooltips with details
- Score distribution stats

## 📝 License

MIT License - Built for demonstration purposes.
