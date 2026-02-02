import { Table, Badge, Group, Text, Paper, Title, ActionIcon, Tooltip } from '@mantine/core';
import { IconChevronUp, IconChevronDown, IconSelector, IconEye, IconShare } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import type { CandidateWithEvaluation, SortField, SortDirection } from '../types';

interface LeaderboardProps {
  candidates: CandidateWithEvaluation[];
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
  onViewCandidate: (candidate: CandidateWithEvaluation) => void;
  selectedCandidateId: number | null;
  limit?: number;
}

// Share candidate function
function shareCandidate(candidate: CandidateWithEvaluation) {
  notifications.show({
    title: '📤 Candidate Shared!',
    message: `${candidate.name}'s profile has been shared with the HR team. They will receive an email with the candidate's evaluation summary.`,
    color: 'teal',
    autoClose: 4000,
  });
}

// Score color based on value
function getScoreColor(score: number): string {
  if (score >= 8) return 'green';
  if (score >= 6) return 'blue';
  if (score >= 4) return 'yellow';
  return 'red';
}

// Rank badge color
function getRankBadge(rank: number) {
  if (rank === 1) return { color: 'yellow', label: '🥇 1st' };
  if (rank === 2) return { color: 'gray', label: '🥈 2nd' };
  if (rank === 3) return { color: 'orange', label: '🥉 3rd' };
  return { color: 'dark', label: `#${rank}` };
}

// Sort icon component
function SortIcon({ field, currentField, direction }: { 
  field: SortField; 
  currentField: SortField; 
  direction: SortDirection; 
}) {
  if (field !== currentField) {
    return <IconSelector size={14} style={{ opacity: 0.5 }} />;
  }
  return direction === 'asc' ? <IconChevronUp size={14} /> : <IconChevronDown size={14} />;
}

// Sortable header component
function SortableHeader({ 
  label, 
  field, 
  currentField, 
  direction, 
  onSort 
}: { 
  label: string; 
  field: SortField; 
  currentField: SortField; 
  direction: SortDirection; 
  onSort: (field: SortField) => void;
}) {
  return (
    <Table.Th 
      style={{ cursor: 'pointer', userSelect: 'none' }}
      onClick={() => onSort(field)}
    >
      <Group gap={4} wrap="nowrap">
        <Text size="sm" fw={600}>{label}</Text>
        <SortIcon field={field} currentField={currentField} direction={direction} />
      </Group>
    </Table.Th>
  );
}

export function Leaderboard({ 
  candidates, 
  sortField, 
  sortDirection, 
  onSort, 
  onViewCandidate,
  selectedCandidateId,
  limit = 10 
}: LeaderboardProps) {
  const displayCandidates = candidates.slice(0, limit);
  
  return (
    <Paper shadow="sm" p="lg" radius="md" withBorder>
      <Title order={2} mb="md">🏆 Top {limit} Candidates</Title>
      
      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <SortableHeader 
              label="Rank" 
              field="rank" 
              currentField={sortField} 
              direction={sortDirection} 
              onSort={onSort} 
            />
            <SortableHeader 
              label="Name" 
              field="name" 
              currentField={sortField} 
              direction={sortDirection} 
              onSort={onSort} 
            />
            <SortableHeader 
              label="Experience" 
              field="years_experience" 
              currentField={sortField} 
              direction={sortDirection} 
              onSort={onSort} 
            />
            <SortableHeader 
              label="Crisis" 
              field="crisis_management" 
              currentField={sortField} 
              direction={sortDirection} 
              onSort={onSort} 
            />
            <SortableHeader 
              label="Sustainability" 
              field="sustainability" 
              currentField={sortField} 
              direction={sortDirection} 
              onSort={onSort} 
            />
            <SortableHeader 
              label="Team" 
              field="team_motivation" 
              currentField={sortField} 
              direction={sortDirection} 
              onSort={onSort} 
            />
            <SortableHeader 
              label="Total" 
              field="total_score" 
              currentField={sortField} 
              direction={sortDirection} 
              onSort={onSort} 
            />
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {displayCandidates.map((candidate) => {
            const rankInfo = getRankBadge(candidate.ranking.rank);
            const isSelected = candidate.id === selectedCandidateId;
            return (
              <Table.Tr 
                key={candidate.id}
                onClick={() => onViewCandidate(candidate)}
                style={{ 
                  cursor: 'pointer',
                  backgroundColor: isSelected ? 'var(--mantine-color-blue-light)' : undefined,
                }}
              >
                <Table.Td>
                  <Badge color={rankInfo.color} variant="filled" size="lg">
                    {rankInfo.label}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Text fw={500}>{candidate.name}</Text>
                </Table.Td>
                <Table.Td>
                  <Text size="sm">{candidate.years_experience} years</Text>
                </Table.Td>
                <Table.Td>
                  <Badge color={getScoreColor(candidate.evaluation.crisis_management)} variant="light">
                    {candidate.evaluation.crisis_management}/10
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Badge color={getScoreColor(candidate.evaluation.sustainability)} variant="light">
                    {candidate.evaluation.sustainability}/10
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Badge color={getScoreColor(candidate.evaluation.team_motivation)} variant="light">
                    {candidate.evaluation.team_motivation}/10
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Badge color="violet" variant="filled" size="lg">
                    {candidate.ranking.total_score}/30
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    <Tooltip label="View Profile">
                      <ActionIcon 
                        variant="subtle" 
                        color="blue"
                        onClick={() => onViewCandidate(candidate)}
                      >
                        <IconEye size={18} />
                      </ActionIcon>
                    </Tooltip>
                    <Tooltip label="Share with HR">
                      <ActionIcon 
                        variant="subtle" 
                        color="teal"
                        onClick={(e) => {
                          e.stopPropagation();
                          shareCandidate(candidate);
                        }}
                      >
                        <IconShare size={18} />
                      </ActionIcon>
                    </Tooltip>
                  </Group>
                </Table.Td>
              </Table.Tr>
            );
          })}
        </Table.Tbody>
      </Table>
    </Paper>
  );
}
