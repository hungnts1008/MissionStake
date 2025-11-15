import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { 
  Sparkles, 
  RefreshCw, 
  Save, 
  Clock, 
  Target,
  TrendingUp,
  X 
} from 'lucide-react';
import { 
  UserPreferences, 
  MissionSuggestion, 
  personalizedMissionService 
} from '../services/PersonalizedMissionService';

export const PersonalizedMissionGenerator: React.FC = () => {
  const [step, setStep] = useState<'preferences' | 'missions'>('preferences');
  const [preferences, setPreferences] = useState<UserPreferences>({
    interests: [],
    skillLevel: 'intermediate',
    availableTime: 60,
    goals: [],
    avoidTopics: [],
  });
  const [missions, setMissions] = useState<MissionSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [rerollsRemaining, setRerollsRemaining] = useState(3);
  
  // Temporary inputs
  const [interestInput, setInterestInput] = useState('');
  const [goalInput, setGoalInput] = useState('');
  const [avoidInput, setAvoidInput] = useState('');

  useEffect(() => {
    // Check reroll availability
    const { remaining } = personalizedMissionService.canReroll('user_default');
    setRerollsRemaining(remaining);
  }, []);

  const handleAddInterest = () => {
    if (interestInput.trim() && !preferences.interests.includes(interestInput.trim())) {
      setPreferences({
        ...preferences,
        interests: [...preferences.interests, interestInput.trim()],
      });
      setInterestInput('');
    }
  };

  const handleAddGoal = () => {
    if (goalInput.trim() && !preferences.goals.includes(goalInput.trim())) {
      setPreferences({
        ...preferences,
        goals: [...preferences.goals, goalInput.trim()],
      });
      setGoalInput('');
    }
  };

  const handleAddAvoid = () => {
    if (avoidInput.trim() && !preferences.avoidTopics?.includes(avoidInput.trim())) {
      setPreferences({
        ...preferences,
        avoidTopics: [...(preferences.avoidTopics || []), avoidInput.trim()],
      });
      setAvoidInput('');
    }
  };

  const handleRemoveInterest = (interest: string) => {
    setPreferences({
      ...preferences,
      interests: preferences.interests.filter((i) => i !== interest),
    });
  };

  const handleGenerateMissions = async () => {
    if (preferences.interests.length === 0 || preferences.goals.length === 0) {
      alert('Please add at least one interest and one goal');
      return;
    }

    setLoading(true);
    try {
      const generated = await personalizedMissionService.generatePersonalizedMissions(
        preferences,
        3
      );
      setMissions(generated);
      setStep('missions');
    } catch (error) {
      console.error('Error generating missions:', error);
      alert('Failed to generate missions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRerollMission = async (missionIndex: number) => {
    const canReroll = personalizedMissionService.canReroll('user_default');
    if (!canReroll.allowed) {
      alert('No rerolls remaining today. Limit: 3 per day.');
      return;
    }

    setLoading(true);
    try {
      const newMission = await personalizedMissionService.rerollMission(
        missions[missionIndex],
        preferences
      );
      
      const updatedMissions = [...missions];
      updatedMissions[missionIndex] = newMission;
      setMissions(updatedMissions);
      
      personalizedMissionService.trackReroll('user_default');
      setRerollsRemaining(canReroll.remaining - 1);
    } catch (error) {
      console.error('Error rerolling mission:', error);
      alert('Failed to reroll mission. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (step === 'preferences') {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-500" />
            Personalized Mission Setup
          </CardTitle>
          <CardDescription>
            Tell us about yourself to get AI-powered mission recommendations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Interests */}
          <div className="space-y-2">
            <Label>Your Interests</Label>
            <div className="flex gap-2">
              <Input
                placeholder="e.g., coding, fitness, reading"
                value={interestInput}
                onChange={(e) => setInterestInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddInterest()}
              />
              <Button onClick={handleAddInterest}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {preferences.interests.map((interest) => (
                <Badge key={interest} variant="secondary" className="flex items-center gap-1">
                  {interest}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => handleRemoveInterest(interest)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          {/* Skill Level */}
          <div className="space-y-2">
            <Label>Skill Level</Label>
            <div className="flex gap-2">
              {(['beginner', 'intermediate', 'advanced'] as const).map((level) => (
                <Button
                  key={level}
                  variant={preferences.skillLevel === level ? 'default' : 'outline'}
                  onClick={() => setPreferences({ ...preferences, skillLevel: level })}
                  className="flex-1"
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {/* Available Time */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Available Time (minutes/day): {preferences.availableTime}
            </Label>
            <Input
              type="range"
              min="15"
              max="240"
              step="15"
              value={preferences.availableTime}
              onChange={(e) =>
                setPreferences({ ...preferences, availableTime: parseInt(e.target.value) })
              }
            />
          </div>

          {/* Goals */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Your Goals
            </Label>
            <div className="flex gap-2">
              <Input
                placeholder="e.g., learn AI, improve health"
                value={goalInput}
                onChange={(e) => setGoalInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddGoal()}
              />
              <Button onClick={handleAddGoal}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {preferences.goals.map((goal) => (
                <Badge key={goal} variant="secondary" className="flex items-center gap-1">
                  {goal}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() =>
                      setPreferences({
                        ...preferences,
                        goals: preferences.goals.filter((g) => g !== goal),
                      })
                    }
                  />
                </Badge>
              ))}
            </div>
          </div>

          {/* Topics to Avoid */}
          <div className="space-y-2">
            <Label>Topics to Avoid (Optional)</Label>
            <div className="flex gap-2">
              <Input
                placeholder="e.g., public speaking, physical exercise"
                value={avoidInput}
                onChange={(e) => setAvoidInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddAvoid()}
              />
              <Button onClick={handleAddAvoid} variant="outline">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {preferences.avoidTopics?.map((topic) => (
                <Badge key={topic} variant="destructive" className="flex items-center gap-1">
                  {topic}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() =>
                      setPreferences({
                        ...preferences,
                        avoidTopics: preferences.avoidTopics?.filter((t) => t !== topic),
                      })
                    }
                  />
                </Badge>
              ))}
            </div>
          </div>

          <Button
            onClick={handleGenerateMissions}
            disabled={loading || preferences.interests.length === 0 || preferences.goals.length === 0}
            className="w-full"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Generating Missions...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Personalized Missions
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-purple-500" />
              Your Personalized Missions
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {rerollsRemaining} Rerolls Left
              </Badge>
              <Button variant="outline" onClick={() => setStep('preferences')}>
                Edit Preferences
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {missions.map((mission, index) => (
        <Card key={mission.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <CardTitle className="text-xl">{mission.title}</CardTitle>
                <CardDescription className="mt-2">{mission.description}</CardDescription>
              </div>
              <Badge className={getDifficultyColor(mission.difficulty)}>
                {mission.difficulty}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{mission.category}</Badge>
              <Badge variant="outline">
                <Clock className="w-3 h-3 mr-1" />
                {mission.estimatedTime} min
              </Badge>
              {mission.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-1">
                <span className="font-semibold">XP:</span>
                <span className="text-purple-600">+{mission.rewards.xp}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-semibold">Coins:</span>
                <span className="text-yellow-600">+{mission.rewards.coins}</span>
              </div>
            </div>

            <div className="bg-muted p-3 rounded-md">
              <p className="text-sm text-muted-foreground">
                <strong>Why this mission?</strong> {mission.reasoning}
              </p>
            </div>

            <div className="flex gap-2">
              <Button className="flex-1">
                <Save className="w-4 h-4 mr-2" />
                Accept Mission
              </Button>
              <Button
                variant="outline"
                onClick={() => handleRerollMission(index)}
                disabled={loading || rerollsRemaining === 0}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Reroll
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      <Button
        variant="outline"
        className="w-full"
        onClick={handleGenerateMissions}
        disabled={loading}
      >
        <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
        Generate New Set
      </Button>
    </div>
  );
};
