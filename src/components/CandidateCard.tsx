import { Card, Text, Badge, Group, Stack, Avatar, Divider, Progress, Grid, ThemeIcon, Button } from '@mantine/core';
import { IconBriefcase, IconMail, IconPhone, IconStar, IconFlame, IconLeaf, IconUsers, IconShare } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import type { CandidateWithEvaluation } from '../types';

interface CandidateCardProps {
  candidate: CandidateWithEvaluation;
  onClick?: () => void;
  compact?: boolean;
}

// Share candidate function
function shareCandidate(candidate: CandidateWithEvaluation, e: React.MouseEvent) {
  e.stopPropagation();
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

// Get initials from name
function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// Avatar color based on name hash
function getAvatarColor(name: string): string {
  const colors = ['red', 'pink', 'grape', 'violet', 'indigo', 'blue', 'cyan', 'teal', 'green', 'lime', 'yellow', 'orange'];
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
}

// Score bar with icon
function ScoreBar({ 
  label, 
  score, 
  icon: Icon,
  color 
}: { 
  label: string; 
  score: number; 
  icon: React.ElementType;
  color: string;
}) {
  return (
    <Stack gap={4}>
      <Group justify="space-between">
        <Group gap={6}>
          <ThemeIcon size="sm" variant="light" color={color}>
            <Icon size={12} />
          </ThemeIcon>
          <Text size="xs" c="dimmed">{label}</Text>
        </Group>
        <Text size="sm" fw={600}>{score}/10</Text>
      </Group>
      <Progress value={score * 10} color={getScoreColor(score)} size="sm" radius="xl" />
    </Stack>
  );
}

export function CandidateCard({ candidate, onClick, compact = false }: CandidateCardProps) {
  const { evaluation, ranking } = candidate;
  
  if (compact) {
    return (
      <Card 
        shadow="sm" 
        padding="md" 
        radius="md" 
        withBorder 
        style={{ cursor: onClick ? 'pointer' : 'default' }}
        onClick={onClick}
      >
        <Group wrap="nowrap">
          <Avatar color={getAvatarColor(candidate.name)} radius="xl">
            {getInitials(candidate.name)}
          </Avatar>
          <div style={{ flex: 1 }}>
            <Text fw={500}>{candidate.name}</Text>
            <Text size="xs" c="dimmed">{candidate.years_experience} years exp.</Text>
          </div>
          <Badge color="violet" variant="filled">
            #{ranking.rank}
          </Badge>
        </Group>
      </Card>
    );
  }
  
  return (
    <Card 
      shadow="sm" 
      padding="lg" 
      radius="md" 
      withBorder
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      onClick={onClick}
    >
      {/* Header */}
      <Group justify="space-between" mb="md">
        <Group>
          <Avatar size="lg" color={getAvatarColor(candidate.name)} radius="xl">
            {getInitials(candidate.name)}
          </Avatar>
          <div>
            <Text fw={600} size="lg">{candidate.name}</Text>
            <Group gap="xs">
              <IconBriefcase size={14} style={{ opacity: 0.7 }} />
              <Text size="sm" c="dimmed">{candidate.years_experience} years experience</Text>
            </Group>
          </div>
        </Group>
        <Stack align="center" gap={0}>
          <Badge size="xl" color="violet" variant="filled">
            Rank #{ranking.rank}
          </Badge>
          <Text size="xs" c="dimmed" mt={4}>Score: {ranking.total_score}/30</Text>
        </Stack>
      </Group>
      
      {/* Contact Info */}
      <Group gap="lg" mb="md">
        <Group gap={4}>
          <IconMail size={14} style={{ opacity: 0.7 }} />
          <Text size="xs" c="dimmed">{candidate.email}</Text>
        </Group>
        <Group gap={4}>
          <IconPhone size={14} style={{ opacity: 0.7 }} />
          <Text size="xs" c="dimmed">{candidate.phone}</Text>
        </Group>
      </Group>
      
      <Divider my="sm" />
      
      {/* Skills */}
      <Text size="sm" fw={500} mb="xs">Skills</Text>
      <Group gap="xs" mb="md">
        {candidate.skills.slice(0, 5).map((skill, index) => (
          <Badge key={index} variant="light" color="gray" size="sm">
            {skill}
          </Badge>
        ))}
        {candidate.skills.length > 5 && (
          <Badge variant="outline" color="gray" size="sm">
            +{candidate.skills.length - 5} more
          </Badge>
        )}
      </Group>
      
      {/* Background */}
      <Text size="sm" fw={500} mb="xs">Background</Text>
      <Text size="sm" c="dimmed" mb="md" lineClamp={3}>
        {candidate.background}
      </Text>
      
      <Divider my="sm" />
      
      {/* Evaluation Scores */}
      <Text size="sm" fw={500} mb="md">
        <Group gap={4}>
          <IconStar size={14} />
          Evaluation Scores
        </Group>
      </Text>
      
      <Stack gap="md">
        <ScoreBar 
          label="Crisis Management" 
          score={evaluation.crisis_management} 
          icon={IconFlame}
          color="red"
        />
        <ScoreBar 
          label="Sustainability" 
          score={evaluation.sustainability} 
          icon={IconLeaf}
          color="green"
        />
        <ScoreBar 
          label="Team Motivation" 
          score={evaluation.team_motivation} 
          icon={IconUsers}
          color="blue"
        />
      </Stack>
      
      <Divider my="md" />
      
      {/* Share Button */}
      <Button 
        fullWidth 
        variant="light" 
        color="teal"
        leftSection={<IconShare size={16} />}
        onClick={(e) => shareCandidate(candidate, e)}
      >
        Share with HR Team
      </Button>
    </Card>
  );
}

// Grid of candidate cards
export function CandidateGrid({ 
  candidates, 
  onSelect 
}: { 
  candidates: CandidateWithEvaluation[]; 
  onSelect?: (candidate: CandidateWithEvaluation) => void;
}) {
  return (
    <Grid>
      {candidates.map(candidate => (
        <Grid.Col key={candidate.id} span={{ base: 12, sm: 6, lg: 4 }}>
          <CandidateCard 
            candidate={candidate} 
            onClick={onSelect ? () => onSelect(candidate) : undefined}
          />
        </Grid.Col>
      ))}
    </Grid>
  );
}
