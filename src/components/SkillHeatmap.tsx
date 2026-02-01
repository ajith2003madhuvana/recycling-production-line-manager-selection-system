import { Paper, Title, Text, Group, Stack, Tooltip, Box } from '@mantine/core';
import type { CandidateWithEvaluation } from '../types';

interface SkillHeatmapProps {
  candidates: CandidateWithEvaluation[];
  maxCandidates?: number;
}

// Color scale for heatmap (1-10)
function getHeatColor(score: number): string {
  const colors = [
    '#f8d7da', // 1 - lightest red
    '#f5c6cb',
    '#f1b0b7',
    '#ffe69c', // 4 - yellow transition
    '#fff3cd',
    '#d1e7dd', // 6 - green transition
    '#badbcc',
    '#a3cfbb',
    '#8bc4aa',
    '#198754', // 10 - darkest green
  ];
  return colors[Math.min(Math.max(score - 1, 0), 9)];
}

// Text color for contrast
function getTextColor(score: number): string {
  return score >= 7 ? 'white' : 'black';
}

// Categories for the heatmap
const CATEGORIES = [
  { key: 'crisis_management', label: 'Crisis', shortLabel: 'CRI' },
  { key: 'sustainability', label: 'Sustainability', shortLabel: 'SUS' },
  { key: 'team_motivation', label: 'Team', shortLabel: 'TEA' },
] as const;

// Single heatmap cell
function HeatCell({ score, candidateName, category }: { 
  score: number; 
  candidateName: string; 
  category: string;
}) {
  return (
    <Tooltip label={`${candidateName}: ${category} = ${score}/10`}>
      <Box
        style={{
          width: 36,
          height: 36,
          backgroundColor: getHeatColor(score),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 4,
          cursor: 'default',
          transition: 'transform 0.1s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.zIndex = '10';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.zIndex = '1';
        }}
      >
        <Text size="xs" fw={600} c={getTextColor(score)}>
          {score}
        </Text>
      </Box>
    </Tooltip>
  );
}

// Legend component
function HeatmapLegend() {
  return (
    <Group gap="xs" mt="md">
      <Text size="xs" c="dimmed">Score:</Text>
      {[1, 3, 5, 7, 10].map(score => (
        <Group gap={4} key={score}>
          <Box
            style={{
              width: 16,
              height: 16,
              backgroundColor: getHeatColor(score),
              borderRadius: 2,
            }}
          />
          <Text size="xs" c="dimmed">{score}</Text>
        </Group>
      ))}
    </Group>
  );
}

export function SkillHeatmap({ candidates, maxCandidates = 20 }: SkillHeatmapProps) {
  const displayCandidates = candidates.slice(0, maxCandidates);
  
  return (
    <Paper shadow="sm" p="lg" radius="md" withBorder>
      <Title order={2} mb="xs">📊 Skill Heatmap</Title>
      <Text size="sm" c="dimmed" mb="lg">
        Visual comparison of evaluation scores across all candidates
      </Text>
      
      {/* Heatmap grid */}
      <Box style={{ overflowX: 'auto' }}>
        <table style={{ borderCollapse: 'separate', borderSpacing: 2 }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '8px 12px', minWidth: 150 }}>
                <Text size="sm" fw={600}>Candidate</Text>
              </th>
              {CATEGORIES.map(cat => (
                <th key={cat.key} style={{ padding: 4 }}>
                  <Tooltip label={cat.label}>
                    <Text size="xs" fw={600} ta="center" style={{ width: 36 }}>
                      {cat.shortLabel}
                    </Text>
                  </Tooltip>
                </th>
              ))}
              <th style={{ padding: '8px 12px' }}>
                <Text size="xs" fw={600}>Total</Text>
              </th>
            </tr>
          </thead>
          <tbody>
            {displayCandidates.map((candidate, index) => (
              <tr key={candidate.id}>
                <td style={{ padding: '4px 12px' }}>
                  <Group gap="xs" wrap="nowrap">
                    <Text size="xs" c="dimmed" style={{ width: 20 }}>
                      #{candidate.ranking.rank}
                    </Text>
                    <Text size="sm" fw={500} lineClamp={1} style={{ maxWidth: 120 }}>
                      {candidate.name.split(' ')[0]}
                    </Text>
                  </Group>
                </td>
                <td style={{ padding: 2 }}>
                  <HeatCell 
                    score={candidate.evaluation.crisis_management} 
                    candidateName={candidate.name}
                    category="Crisis Management"
                  />
                </td>
                <td style={{ padding: 2 }}>
                  <HeatCell 
                    score={candidate.evaluation.sustainability} 
                    candidateName={candidate.name}
                    category="Sustainability"
                  />
                </td>
                <td style={{ padding: 2 }}>
                  <HeatCell 
                    score={candidate.evaluation.team_motivation} 
                    candidateName={candidate.name}
                    category="Team Motivation"
                  />
                </td>
                <td style={{ padding: '4px 12px' }}>
                  <Text size="sm" fw={600} c="violet">
                    {candidate.ranking.total_score}
                  </Text>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
      
      <HeatmapLegend />
    </Paper>
  );
}

// Summary stats component
export function ScoreDistribution({ candidates }: { candidates: CandidateWithEvaluation[] }) {
  const stats = {
    crisis: {
      avg: candidates.reduce((sum, c) => sum + c.evaluation.crisis_management, 0) / candidates.length,
      max: Math.max(...candidates.map(c => c.evaluation.crisis_management)),
      min: Math.min(...candidates.map(c => c.evaluation.crisis_management)),
    },
    sustainability: {
      avg: candidates.reduce((sum, c) => sum + c.evaluation.sustainability, 0) / candidates.length,
      max: Math.max(...candidates.map(c => c.evaluation.sustainability)),
      min: Math.min(...candidates.map(c => c.evaluation.sustainability)),
    },
    team: {
      avg: candidates.reduce((sum, c) => sum + c.evaluation.team_motivation, 0) / candidates.length,
      max: Math.max(...candidates.map(c => c.evaluation.team_motivation)),
      min: Math.min(...candidates.map(c => c.evaluation.team_motivation)),
    },
  };
  
  return (
    <Paper shadow="sm" p="lg" radius="md" withBorder>
      <Title order={3} mb="md">📈 Score Distribution</Title>
      
      <Stack gap="md">
        {[
          { label: 'Crisis Management', data: stats.crisis, color: 'red' },
          { label: 'Sustainability', data: stats.sustainability, color: 'green' },
          { label: 'Team Motivation', data: stats.team, color: 'blue' },
        ].map(({ label, data, color }) => (
          <Group key={label} justify="space-between">
            <Text size="sm" fw={500}>{label}</Text>
            <Group gap="lg">
              <Text size="xs" c="dimmed">
                Avg: <Text span fw={600} c={color}>{data.avg.toFixed(1)}</Text>
              </Text>
              <Text size="xs" c="dimmed">
                Range: {data.min} - {data.max}
              </Text>
            </Group>
          </Group>
        ))}
      </Stack>
    </Paper>
  );
}
