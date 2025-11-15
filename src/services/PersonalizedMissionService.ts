import { GoogleGenerativeAI } from "@google/generative-ai";

// User preferences interface
export interface UserPreferences {
  interests: string[]; // e.g., ["coding", "fitness", "reading"]
  skillLevel: "beginner" | "intermediate" | "advanced";
  availableTime: number; // minutes per day
  goals: string[]; // e.g., ["learn AI", "improve health"]
  avoidTopics?: string[]; // topics user wants to avoid
}

// Mission suggestion interface
export interface MissionSuggestion {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  estimatedTime: number; // minutes
  rewards: {
    xp: number;
    coins: number;
  };
  tags: string[];
  reasoning: string; // Why AI suggested this
}

export class PersonalizedMissionService {
  private genAI: GoogleGenerativeAI;
  private model: any;
  private maxRerolls = 3; // Maximum rerolls per day

  constructor() {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      console.error("Gemini API key not found in environment variables");
      throw new Error("Gemini API key not configured");
    }
    
    this.genAI = new GoogleGenerativeAI(apiKey);
    // Use gemini-1.5-flash (latest, fastest, most stable)
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  /**
   * Generate personalized missions based on user preferences using Gemini AI
   */
  async generatePersonalizedMissions(
    preferences: UserPreferences,
    count: number = 3
  ): Promise<MissionSuggestion[]> {
    try {
      const prompt = `You are a mission generator for SpoonOS, a gamified productivity app. Generate ${count} personalized missions for this user:

**User Profile:**
- Interests: ${preferences.interests.join(", ")}
- Skill Level: ${preferences.skillLevel}
- Available Time: ${preferences.availableTime} minutes per day
- Goals: ${preferences.goals.join(", ")}
${preferences.avoidTopics ? `- Avoid Topics: ${preferences.avoidTopics.join(", ")}` : ""}

**Requirements:**
1. Each mission should be specific, actionable, and achievable
2. Match the user's interests and skill level
3. Fit within their available time
4. Support their stated goals
5. Vary in difficulty and type

**Output Format (JSON array only, no markdown):**
[
  {
    "title": "Clear, action-oriented title",
    "description": "Detailed 2-3 sentence description explaining what to do and why",
    "category": "learning|health|creative|social|work|other",
    "difficulty": "easy|medium|hard",
    "estimatedTime": <number in minutes>,
    "xpReward": <100 for easy, 250 for medium, 500 for hard>,
    "coinReward": <50 for easy, 100 for medium, 200 for hard>,
    "tags": ["tag1", "tag2", "tag3"],
    "reasoning": "Why this mission fits the user's profile"
  }
]

Generate exactly ${count} diverse missions that would genuinely help this user grow.`;

      console.log("🤖 Calling Gemini API for personalized missions...");
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      console.log("📥 Gemini API response received");

      // Extract JSON from response (handle markdown code blocks)
      let jsonText = text;
      const jsonMatch = text.match(/```(?:json)?\s*(\[[\s\S]*?\])\s*```/);
      if (jsonMatch) {
        jsonText = jsonMatch[1];
      } else {
        const directMatch = text.match(/\[[\s\S]*?\]/);
        if (directMatch) {
          jsonText = directMatch[0];
        }
      }

      const missions = JSON.parse(jsonText);

      // Transform to our format and add IDs
      const transformedMissions: MissionSuggestion[] = missions.map((mission: any, index: number) => ({
        id: `ai_mission_${Date.now()}_${index}`,
        title: mission.title,
        description: mission.description,
        category: mission.category,
        difficulty: mission.difficulty,
        estimatedTime: mission.estimatedTime,
        rewards: {
          xp: mission.xpReward,
          coins: mission.coinReward
        },
        tags: mission.tags || preferences.interests.slice(0, 3),
        reasoning: mission.reasoning || "AI-generated mission based on your profile"
      }));

      console.log(`✅ Generated ${transformedMissions.length} personalized missions`);
      return transformedMissions;

    } catch (error) {
      console.error("❌ Error generating missions with Gemini:", error);
      throw new Error(`Failed to generate missions: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  /**
   * Reroll a specific mission with user feedback
   */
  async rerollMission(
    currentMission: MissionSuggestion,
    preferences: UserPreferences,
    rejectionReason?: string
  ): Promise<MissionSuggestion> {
    try {
      const prompt = `You are rerolling a mission for a SpoonOS user who rejected this mission:

**Rejected Mission:**
- Title: ${currentMission.title}
- Description: ${currentMission.description}
- Category: ${currentMission.category}
- Difficulty: ${currentMission.difficulty}
${rejectionReason ? `\n**Why Rejected:** ${rejectionReason}` : ""}

**User Profile:**
- Interests: ${preferences.interests.join(", ")}
- Skill Level: ${preferences.skillLevel}
- Available Time: ${preferences.availableTime} minutes
- Goals: ${preferences.goals.join(", ")}

Generate ONE alternative mission that:
1. Is COMPLETELY DIFFERENT from the rejected mission
2. Better matches their preferences
3. Addresses the rejection reason (if provided)
4. Has similar difficulty and time commitment

**Output Format (JSON object only, no markdown):**
{
  "title": "string",
  "description": "string",
  "category": "learning|health|creative|social|work|other",
  "difficulty": "easy|medium|hard",
  "estimatedTime": <number>,
  "xpReward": <number>,
  "coinReward": <number>,
  "tags": ["tag1", "tag2"],
  "reasoning": "Why this is better than the rejected mission"
}`;

      console.log("🔄 Rerolling mission with Gemini...");
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Extract JSON
      let jsonText = text;
      const jsonMatch = text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
      if (jsonMatch) {
        jsonText = jsonMatch[1];
      } else {
        const directMatch = text.match(/\{[\s\S]*?\}/);
        if (directMatch) {
          jsonText = directMatch[0];
        }
      }

      const newMission = JSON.parse(jsonText);

      const transformedMission: MissionSuggestion = {
        id: `ai_mission_${Date.now()}_reroll`,
        title: newMission.title,
        description: newMission.description,
        category: newMission.category,
        difficulty: newMission.difficulty,
        estimatedTime: newMission.estimatedTime,
        rewards: {
          xp: newMission.xpReward,
          coins: newMission.coinReward
        },
        tags: newMission.tags || preferences.interests.slice(0, 3),
        reasoning: newMission.reasoning || "Rerolled based on your feedback"
      };

      console.log("✅ Successfully rerolled mission");
      return transformedMission;

    } catch (error) {
      console.error("❌ Error rerolling mission:", error);
      throw new Error(`Failed to reroll mission: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  /**
   * Get mission recommendations based on context
   */
  async getContextualRecommendations(
    preferences: UserPreferences,
    context: {
      timeOfDay: "morning" | "afternoon" | "evening";
      dayOfWeek: string;
      recentCompletions: string[];
    }
  ): Promise<MissionSuggestion[]> {
    try {
      const prompt = `Generate 3 contextual mission recommendations for SpoonOS:

**User Profile:**
- Interests: ${preferences.interests.join(", ")}
- Skill Level: ${preferences.skillLevel}
- Available Time: ${preferences.availableTime} minutes

**Current Context:**
- Time of Day: ${context.timeOfDay}
- Day: ${context.dayOfWeek}
- Recently Completed: ${context.recentCompletions.join(", ") || "None"}

**Context-Aware Suggestions:**
- Morning: High-energy, learning, creative tasks
- Afternoon: Productive work, skill-building
- Evening: Relaxing, social, reflection tasks
- Consider day of week (weekend vs weekday)
- Avoid similar missions to recently completed ones

Generate 3 missions perfectly suited to this moment. Return JSON array format (same as before).`;

      console.log("🎯 Getting contextual recommendations...");
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      let jsonText = text;
      const jsonMatch = text.match(/```(?:json)?\s*(\[[\s\S]*?\])\s*```/);
      if (jsonMatch) {
        jsonText = jsonMatch[1];
      } else {
        const directMatch = text.match(/\[[\s\S]*?\]/);
        if (directMatch) {
          jsonText = directMatch[0];
        }
      }

      const missions = JSON.parse(jsonText);

      const transformedMissions: MissionSuggestion[] = missions.map((mission: any, index: number) => ({
        id: `ai_mission_${Date.now()}_${index}`,
        title: mission.title,
        description: mission.description,
        category: mission.category,
        difficulty: mission.difficulty,
        estimatedTime: mission.estimatedTime,
        rewards: {
          xp: mission.xpReward,
          coins: mission.coinReward
        },
        tags: mission.tags || preferences.interests.slice(0, 3),
        reasoning: mission.reasoning || `Contextual mission for ${context.timeOfDay}`
      }));

      console.log("✅ Generated contextual recommendations");
      return transformedMissions;

    } catch (error) {
      console.error("❌ Error getting contextual recommendations:", error);
      // Fallback to regular generation
      return this.generatePersonalizedMissions(preferences, 3);
    }
  }

  /**
   * Check if user can reroll a mission (mock tracking)
   */
  canReroll(userId: string): { allowed: boolean; remaining: number } {
    // In production, this would check database/storage
    // For now, always allow with 3 rerolls
    return {
      allowed: true,
      remaining: this.maxRerolls,
    };
  }

  /**
   * Track that user used a reroll (mock)
   */
  trackReroll(userId: string): void {
    // In production, this would update database/storage
    console.log(`User ${userId} used a reroll`);
  }
}

// Export singleton instance
export const personalizedMissionService = new PersonalizedMissionService();
