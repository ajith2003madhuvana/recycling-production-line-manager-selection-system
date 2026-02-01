import { useState, useMemo } from 'react';
import { 
  MantineProvider, 
  AppShell, 
  Title, 
  Text, 
  Group, 
  Tabs, 
  Container,
  Stack,
  Badge,
  Modal,
  SimpleGrid,
  Paper,
  ThemeIcon,
} from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { useDisclosure } from '@mantine/hooks';
import { IconTrophy, IconUsers, IconChartBar, IconRecycle } from '@tabler/icons-react';
import { Leaderboard } from './components/Leaderboard';
import { CandidateCard, CandidateGrid } from './components/CandidateCard';
import { SkillHeatmap, ScoreDistribution } from './components/SkillHeatmap';
import { mockCandidates } from './data/generateCandidates';
import type { CandidateWithEvaluation, SortField, SortDirection } from './types';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

function Dashboard() {
  const [sortField, setSortField] = useState<SortField>('rank');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateWithEvaluation | null>(null);
  const [opened, { open, close }] = useDisclosure(false);
  
  // Sort candidates
  const sortedCandidates = useMemo(() => {
    const sorted = [...mockCandidates].sort((a, b) => {
      let aVal: number | string;
      let bVal: number | string;
      
      switch (sortField) {
        case 'rank':
          aVal = a.ranking.rank;
          bVal = b.ranking.rank;
          break;
        case 'name':
          aVal = a.name;
          bVal = b.name;
          break;
        case 'total_score':
          aVal = a.ranking.total_score;
          bVal = b.ranking.total_score;
          break;
        case 'crisis_management':
          aVal = a.evaluation.crisis_management;
          bVal = b.evaluation.crisis_management;
          break;
        case 'sustainability':
          aVal = a.evaluation.sustainability;
          bVal = b.evaluation.sustainability;
          break;
        case 'team_motivation':
          aVal = a.evaluation.team_motivation;
          bVal = b.evaluation.team_motivation;
          break;
        case 'years_experience':
          aVal = a.years_experience;
          bVal = b.years_experience;
          break;
        default:
          aVal = a.ranking.rank;
          bVal = b.ranking.rank;
      }
      
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc' 
          ? aVal.localeCompare(bVal) 
          : bVal.localeCompare(aVal);
      }
      
      return sortDirection === 'asc' 
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number);
    });
    
    return sorted;
  }, [sortField, sortDirection]);
  
  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection(field === 'name' ? 'asc' : 'desc');
    }
  };
  
  const handleViewCandidate = (candidate: CandidateWithEvaluation) => {
    setSelectedCandidate(candidate);
    open();
  };
  
  return (
    <AppShell
      header={{ height: 70 }}
      padding="md"
    >
      <AppShell.Header p="md" style={{ backgroundColor: '#228be6' }}>
        <Group justify="space-between" h="100%">
          <Group>
            <ThemeIcon size="lg" variant="white" color="blue">
              <IconRecycle size={24} />
            </ThemeIcon>
            <div>
              <Title order={3} c="white">Recycling Production Line Manager</Title>
              <Text size="xs" c="white" opacity={0.8}>Selection System</Text>
            </div>
          </Group>
          <Badge size="lg" variant="white" color="blue">
            {mockCandidates.length} Candidates
          </Badge>
        </Group>
      </AppShell.Header>

      <AppShell.Main style={{ backgroundColor: '#f8f9fa' }}>
        <Container size="xl" py="lg">
          <Tabs defaultValue="leaderboard">
            <Tabs.List mb="lg">
              <Tabs.Tab value="leaderboard" leftSection={<IconTrophy size={16} />}>
                Leaderboard
              </Tabs.Tab>
              <Tabs.Tab value="candidates" leftSection={<IconUsers size={16} />}>
                All Candidates
              </Tabs.Tab>
              <Tabs.Tab value="heatmap" leftSection={<IconChartBar size={16} />}>
                Skill Heatmap
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="leaderboard">
              <Stack gap="lg">
                <Leaderboard
                  candidates={sortedCandidates}
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                  onViewCandidate={handleViewCandidate}
                  limit={10}
                />
                <SimpleGrid cols={{ base: 1, md: 2 }}>
                  <ScoreDistribution candidates={mockCandidates} />
                  <Paper shadow="sm" p="lg" radius="md" withBorder>
                    <Title order={3} mb="md">🎯 Quick Stats</Title>
                    <Stack gap="sm">
                      <Group justify="space-between">
                        <Text size="sm">Total Candidates</Text>
                        <Badge color="blue">{mockCandidates.length}</Badge>
                      </Group>
                      <Group justify="space-between">
                        <Text size="sm">Avg Experience</Text>
                        <Badge color="grape">
                          {(mockCandidates.reduce((sum, c) => sum + c.years_experience, 0) / mockCandidates.length).toFixed(1)} years
                        </Badge>
                      </Group>
                      <Group justify="space-between">
                        <Text size="sm">Top Score</Text>
                        <Badge color="green">{mockCandidates[0].ranking.total_score}/30</Badge>
                      </Group>
                      <Group justify="space-between">
                        <Text size="sm">Avg Score</Text>
                        <Badge color="violet">
                          {(mockCandidates.reduce((sum, c) => sum + c.ranking.total_score, 0) / mockCandidates.length).toFixed(1)}/30
                        </Badge>
                      </Group>
                    </Stack>
                  </Paper>
                </SimpleGrid>
              </Stack>
            </Tabs.Panel>

            <Tabs.Panel value="candidates">
              <CandidateGrid 
                candidates={sortedCandidates} 
                onSelect={handleViewCandidate}
              />
            </Tabs.Panel>

            <Tabs.Panel value="heatmap">
              <SkillHeatmap candidates={sortedCandidates} maxCandidates={40} />
            </Tabs.Panel>
          </Tabs>
        </Container>
      </AppShell.Main>
      
      {/* Candidate Detail Modal */}
      <Modal 
        opened={opened} 
        onClose={close} 
        size="lg"
        title={<Text fw={600}>Candidate Profile</Text>}
      >
        {selectedCandidate && (
          <CandidateCard candidate={selectedCandidate} />
        )}
      </Modal>
    </AppShell>
  );
}

function App() {
  return (
    <MantineProvider>
      <Notifications position="top-right" />
      <Dashboard />
    </MantineProvider>
  );
}

export default App;
