import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { 
  User,
  Settings,
  Target,
  Clock,
  TrendingUp,
  X,
  Save
} from 'lucide-react';
import { UserPreferences } from '../services/PersonalizedMissionService';

interface UserPreferencesEditorProps {
  onSave?: (preferences: UserPreferences) => void;
  initialPreferences?: UserPreferences;
}

export const UserPreferencesEditor: React.FC<UserPreferencesEditorProps> = ({ onSave, initialPreferences }) => {
  const [preferences, setPreferences] = useState<UserPreferences>(
    initialPreferences || {
      interests: [],
      skillLevel: 'intermediate',
      availableTime: 60,
      goals: [],
      avoidTopics: [],
    }
  );

  // Update when initialPreferences changes
  useEffect(() => {
    if (initialPreferences) {
      setPreferences(initialPreferences);
    }
  }, [initialPreferences]);
  
  // Temporary inputs
  const [interestInput, setInterestInput] = useState('');
  const [goalInput, setGoalInput] = useState('');
  const [avoidInput, setAvoidInput] = useState('');
  const [saved, setSaved] = useState(false);

  // Predefined interest options
  const predefinedInterests = [
    'Coding', 'Fitness', 'Reading', 'Music', 'Gaming',
    'Art', 'Travel', 'Photography', 'Cooking', 'Writing',
    'Sports', 'Learning Languages', 'Meditation', 'Business', 'Science'
  ];

  // NOTE: Không load từ localStorage - data sẽ reset khi reload

  const handleAddInterest = () => {
    if (interestInput.trim() && !preferences.interests.includes(interestInput.trim())) {
      setPreferences({
        ...preferences,
        interests: [...preferences.interests, interestInput.trim()],
      });
      setInterestInput('');
      setSaved(false);
    }
  };

  const handleAddGoal = () => {
    if (goalInput.trim() && !preferences.goals.includes(goalInput.trim())) {
      setPreferences({
        ...preferences,
        goals: [...preferences.goals, goalInput.trim()],
      });
      setGoalInput('');
      setSaved(false);
    }
  };

  const handleAddAvoid = () => {
    if (avoidInput.trim() && !preferences.avoidTopics?.includes(avoidInput.trim())) {
      setPreferences({
        ...preferences,
        avoidTopics: [...(preferences.avoidTopics || []), avoidInput.trim()],
      });
      setAvoidInput('');
      setSaved(false);
    }
  };

  const handleRemove = (field: keyof UserPreferences, value: string) => {
    const fieldValue = preferences[field];
    if (Array.isArray(fieldValue)) {
      setPreferences({
        ...preferences,
        [field]: fieldValue.filter((item) => item !== value),
      });
      setSaved(false);
    }
  };

  const handleTogglePredefinedInterest = (interest: string) => {
    if (preferences.interests.includes(interest)) {
      setPreferences({
        ...preferences,
        interests: preferences.interests.filter((i) => i !== interest),
      });
    } else {
      setPreferences({
        ...preferences,
        interests: [...preferences.interests, interest],
      });
    }
    setSaved(false);
  };

  const handleSave = () => {
    // NOTE: Không lưu vào localStorage - chỉ update state trong memory
    setSaved(true);
    if (onSave) {
      onSave(preferences);
    }
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-6 h-6 text-blue-500" />
            Personal Preferences
          </CardTitle>
          <CardDescription>
            Set your preferences to get personalized AI mission recommendations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Interests */}
          <div className="space-y-3">
            <Label className="text-base font-semibold flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Your Interests
            </Label>
            <p className="text-sm text-muted-foreground">
              Select from popular interests or add your own custom interests
            </p>
            
            {/* Predefined Interest Buttons */}
            <div className="p-4 bg-gray-50 rounded-lg border">
              <p className="text-sm font-medium mb-3">Popular Interests:</p>
              <div className="flex flex-wrap gap-2">
                {predefinedInterests.map((interest) => (
                  <Button
                    key={interest}
                    variant={preferences.interests.includes(interest) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleTogglePredefinedInterest(interest)}
                    className="text-sm"
                  >
                    {preferences.interests.includes(interest) && <span className="mr-1">✓</span>}
                    {interest}
                  </Button>
                ))}
              </div>
            </div>

            {/* Custom Interest Input */}
            <div>
              <Label className="text-sm mb-2 block">Add Custom Interest:</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter a custom interest..."
                  value={interestInput}
                  onChange={(e) => setInterestInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddInterest()}
                />
                <Button onClick={handleAddInterest}>Add</Button>
              </div>
            </div>

            {/* Selected Interests Display */}
            <div>
              <Label className="text-sm mb-2 block">
                Selected Interests ({preferences.interests.length}):
              </Label>
              <div className="flex flex-wrap gap-2 min-h-[40px] p-3 bg-white border rounded-lg">
                {preferences.interests.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">No interests selected yet</p>
                ) : (
                  preferences.interests.map((interest) => (
                    <Badge key={interest} variant="secondary" className="flex items-center gap-1 text-sm py-1">
                      {interest}
                      <X
                        className="w-3 h-3 cursor-pointer hover:text-destructive"
                        onClick={() => handleRemove('interests', interest)}
                      />
                    </Badge>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Skill Level */}
          <div className="space-y-3">
            <Label className="text-base font-semibold flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Skill Level
            </Label>
            <p className="text-sm text-muted-foreground">
              How would you rate your overall skill level?
            </p>
            <div className="flex gap-2">
              {(['beginner', 'intermediate', 'advanced'] as const).map((level) => (
                <Button
                  key={level}
                  variant={preferences.skillLevel === level ? 'default' : 'outline'}
                  onClick={() => {
                    setPreferences({ ...preferences, skillLevel: level });
                    setSaved(false);
                  }}
                  className="flex-1"
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {/* Available Time */}
          <div className="space-y-3">
            <Label className="text-base font-semibold flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Available Time: {preferences.availableTime} minutes/day
            </Label>
            <p className="text-sm text-muted-foreground">
              How much time can you dedicate to tasks each day?
            </p>
            <Input
              type="range"
              min="15"
              max="240"
              step="15"
              value={preferences.availableTime}
              onChange={(e) => {
                setPreferences({ ...preferences, availableTime: parseInt(e.target.value) });
                setSaved(false);
              }}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>15 min</span>
              <span>4 hours</span>
            </div>
          </div>

          {/* Goals */}
          <div className="space-y-3">
            <Label className="text-base font-semibold flex items-center gap-2">
              <Target className="w-4 h-4" />
              Your Goals
            </Label>
            <p className="text-sm text-muted-foreground">
              What do you want to achieve? (e.g., learn AI, improve health)
            </p>
            <div className="flex gap-2">
              <Input
                placeholder="Add a goal..."
                value={goalInput}
                onChange={(e) => setGoalInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddGoal()}
              />
              <Button onClick={handleAddGoal}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {preferences.goals.map((goal) => (
                <Badge key={goal} variant="secondary" className="flex items-center gap-1 text-sm py-1">
                  {goal}
                  <X
                    className="w-3 h-3 cursor-pointer hover:text-destructive"
                    onClick={() => handleRemove('goals', goal)}
                  />
                </Badge>
              ))}
              {preferences.goals.length === 0 && (
                <p className="text-sm text-muted-foreground italic">No goals added yet</p>
              )}
            </div>
          </div>

          {/* Topics to Avoid */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Topics to Avoid (Optional)</Label>
            <p className="text-sm text-muted-foreground">
              Are there any topics you prefer not to work on?
            </p>
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
            <div className="flex flex-wrap gap-2">
              {preferences.avoidTopics?.map((topic) => (
                <Badge key={topic} variant="destructive" className="flex items-center gap-1 text-sm py-1">
                  {topic}
                  <X
                    className="w-3 h-3 cursor-pointer hover:text-white"
                    onClick={() => handleRemove('avoidTopics', topic)}
                  />
                </Badge>
              ))}
              {(!preferences.avoidTopics || preferences.avoidTopics.length === 0) && (
                <p className="text-sm text-muted-foreground italic">No topics to avoid</p>
              )}
            </div>
          </div>

          <Button
            onClick={handleSave}
            className="w-full"
            variant={saved ? "outline" : "default"}
          >
            <Save className="w-4 h-4 mr-2" />
            {saved ? "Preferences Saved ✓" : "Save Preferences"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
