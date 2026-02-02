import { useState, useMemo } from 'react';
import { Table, Badge, Group, Text, Paper, Title, TextInput, Stack } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import type { CandidateWithEvaluation } from '../types';

interface AllCandidatesTableProps {
  candidates: CandidateWithEvaluation[];
  onSelectCandidate: (candidate: CandidateWithEvaluation) => void;
  selectedCandidateId: number | null;
}

// Format candidate ID as CAN-XXX
function formatCandidateId(id: number): string {
  return `CAN-${String(id).padStart(3, '0')}`;
}

// Get status based on rank
function getStatus(rank: number): { label: string; color: string } {
  if (rank <= 10) {
    return { label: 'Priority', color: 'green' };
  }
  return { label: 'Qualified', color: 'blue' };
}

export function AllCandidatesTable({ 
  candidates, 
  onSelectCandidate,
  selectedCandidateId 
}: AllCandidatesTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter candidates by name or background (case-insensitive)
  const filteredCandidates = useMemo(() => {
    if (!searchQuery.trim()) {
      return candidates;
    }
    
    const query = searchQuery.toLowerCase();
    return candidates.filter(candidate => 
      candidate.name.toLowerCase().includes(query) ||
      candidate.background.toLowerCase().includes(query)
    );
  }, [candidates, searchQuery]);
  
  return (
    <Paper shadow="sm" p="lg" radius="md" withBorder>
      <Stack gap="md">
        <Group justify="space-between" align="flex-end">
          <Title order={2}>👥 All Candidates</Title>
          <Badge size="lg" variant="light" color="gray">
            {filteredCandidates.length} of {candidates.length} shown
          </Badge>
        </Group>
        
        {/* Search Input */}
        <TextInput
          placeholder="Search by name or industry background..."
          leftSection={<IconSearch size={16} />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.currentTarget.value)}
          size="md"
        />
        
        {/* Candidates Table */}
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>ID</Table.Th>
              <Table.Th>Full Name</Table.Th>
              <Table.Th>Experience</Table.Th>
              <Table.Th>Industry Background</Table.Th>
              <Table.Th>Total Score</Table.Th>
              <Table.Th>Status</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filteredCandidates.map((candidate) => {
              const status = getStatus(candidate.ranking.rank);
              const isSelected = candidate.id === selectedCandidateId;
              
              return (
                <Table.Tr 
                  key={candidate.id}
                  onClick={() => onSelectCandidate(candidate)}
                  style={{ 
                    cursor: 'pointer',
                    backgroundColor: isSelected ? 'var(--mantine-color-blue-light)' : undefined,
                  }}
                >
                  <Table.Td>
                    <Text size="sm" c="dimmed" ff="monospace">
                      {formatCandidateId(candidate.id)}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text fw={500}>{candidate.name}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{candidate.years_experience} years</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" lineClamp={1} style={{ maxWidth: 300 }}>
                      {candidate.background}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge color="violet" variant="filled">
                      {candidate.ranking.total_score}/30
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Badge color={status.color} variant="light">
                      {status.label}
                    </Badge>
                  </Table.Td>
                </Table.Tr>
              );
            })}
          </Table.Tbody>
        </Table>
        
        {filteredCandidates.length === 0 && (
          <Text c="dimmed" ta="center" py="xl">
            No candidates match your search criteria
          </Text>
        )}
      </Stack>
    </Paper>
  );
}
