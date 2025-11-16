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
  
  // Rate limiting: Track API calls
  private apiCallHistory: number[] = []; // timestamps of API calls
  private readonly MAX_CALLS_PER_MINUTE = 15; // Limit to 15 calls per minute
  private readonly MAX_CALLS_PER_HOUR = 60; // Limit to 60 calls per hour
  
  // Caching: Store recent responses
  private cache: Map<string, { data: MissionSuggestion[], timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  constructor() {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      console.error("Không tìm thấy Gemini API key trong biến môi trường");
      throw new Error("Gemini API key chưa được cấu hình");
    }
    
    this.genAI = new GoogleGenerativeAI(apiKey);
    // Use gemini-2.5-flash-lite (lightweight, fastest, most stable)
    this.model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
  }
  
  /**
   * Check if we're within rate limits
   */
  private checkRateLimit(): { allowed: boolean; reason?: string } {
    const now = Date.now();
    const oneMinuteAgo = now - 60 * 1000;
    const oneHourAgo = now - 60 * 60 * 1000;
    
    // Clean old entries
    this.apiCallHistory = this.apiCallHistory.filter(time => time > oneHourAgo);
    
    // Check minute limit
    const callsInLastMinute = this.apiCallHistory.filter(time => time > oneMinuteAgo).length;
    if (callsInLastMinute >= this.MAX_CALLS_PER_MINUTE) {
      return { 
        allowed: false, 
        reason: `⚠️ Đã đạt giới hạn ${this.MAX_CALLS_PER_MINUTE} lần gọi/phút. Vui lòng đợi.` 
      };
    }
    
    // Check hour limit
    const callsInLastHour = this.apiCallHistory.length;
    if (callsInLastHour >= this.MAX_CALLS_PER_HOUR) {
      return { 
        allowed: false, 
        reason: `⚠️ Đã đạt giới hạn ${this.MAX_CALLS_PER_HOUR} lần gọi/giờ. Vui lòng đợi.` 
      };
    }
    
    return { allowed: true };
  }
  
  /**
   * Track an API call
   */
  private trackApiCall() {
    this.apiCallHistory.push(Date.now());
    console.log(`📊 API Calls - Last minute: ${this.apiCallHistory.filter(t => t > Date.now() - 60000).length}/${this.MAX_CALLS_PER_MINUTE}, Last hour: ${this.apiCallHistory.length}/${this.MAX_CALLS_PER_HOUR}`);
  }
  
  /**
   * Get cache key for preferences
   */
  private getCacheKey(preferences: UserPreferences, count: number): string {
    return JSON.stringify({
      interests: preferences.interests.sort(),
      skillLevel: preferences.skillLevel,
      availableTime: preferences.availableTime,
      goals: preferences.goals.sort(),
      count
    });
  }
  
  /**
   * Check cache for existing response
   */
  private checkCache(key: string): MissionSuggestion[] | null {
    const cached = this.cache.get(key);
    if (cached) {
      const age = Date.now() - cached.timestamp;
      if (age < this.CACHE_DURATION) {
        console.log(`✅ Using cached missions (${Math.floor(age / 1000)}s old)`);
        return cached.data;
      } else {
        this.cache.delete(key);
      }
    }
    return null;
  }
  
  /**
   * Save to cache
   */
  private saveCache(key: string, data: MissionSuggestion[]) {
    this.cache.set(key, { data, timestamp: Date.now() });
    
    // Limit cache size to 10 entries
    if (this.cache.size > 10) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
  }

  /**
   * Generate personalized missions based on user preferences using Gemini AI
   */
  async generatePersonalizedMissions(
    preferences: UserPreferences,
    count: number = 3
  ): Promise<MissionSuggestion[]> {
    // Check cache first
    const cacheKey = this.getCacheKey(preferences, count);
    const cached = this.checkCache(cacheKey);
    if (cached) {
      return cached;
    }
    
    // Check rate limit
    const rateLimitCheck = this.checkRateLimit();
    if (!rateLimitCheck.allowed) {
      throw new Error(rateLimitCheck.reason);
    }
    
    try {
      // Track this API call
      this.trackApiCall();
      
      const prompt = `Tạo CHÍNH XÁC ${count} nhiệm vụ (${count} objects) bằng TIẾNG VIỆT:

Sở thích: ${preferences.interests.join(", ")}
Trình độ: ${preferences.skillLevel}
Thời gian: ${preferences.availableTime} phút/ngày
Mục tiêu: ${preferences.goals.join(", ")}

QUAN TRỌNG: Phải có ĐỦ ${count} nhiệm vụ trong array. Mỗi nhiệm vụ NGẮN GỌN (description max 50 từ).

Format (CHỈ trả về JSON array):
[{"title":"Tiêu đề","description":"Mô tả ngắn","category":"learning","difficulty":"easy","estimatedTime":30,"xpReward":100,"coinReward":50,"tags":["tag1","tag2"],"reasoning":"Lý do"}]

Tạo ${count} nhiệm vụ khác nhau, không trùng lặp.`;

      console.log("🤖 Đang gọi Gemini API để tạo nhiệm vụ cá nhân hóa...");
      const result = await this.model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 2048,
          topP: 0.95,
        }
      });
      const response = await result.response;
      const text = response.text();

      console.log("📥 Đã nhận phản hồi từ Gemini API");
      console.log("Phản hồi gốc:", text);

      // Extract JSON from response (handle markdown code blocks)
      let jsonText = text.trim();
      
      // Remove markdown code blocks if present
      const jsonMatch = text.match(/```(?:json)?\s*(\[[\s\S]*?\])\s*```/);
      if (jsonMatch) {
        jsonText = jsonMatch[1];
      } else {
        const directMatch = text.match(/\[[\s\S]*?\]/);
        if (directMatch) {
          jsonText = directMatch[0];
        }
      }

      // Clean up the JSON text more aggressively
      jsonText = jsonText
        .replace(/,(\s*[}\]])/g, '$1') // Remove trailing commas
        .replace(/\/\/[^\n]*/g, '') // Remove single-line comments
        .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
        .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove control characters
        .replace(/\r\n/g, '\n') // Normalize line endings
        .trim();

      console.log("JSON đã làm sạch:", jsonText);

      let missions;
      try {
        missions = JSON.parse(jsonText);
      } catch (parseError) {
        console.error("Lỗi phân tích JSON:", parseError);
        console.error("Văn bản JSON lỗi:", jsonText);
        
        // Try one more aggressive cleanup
        let veryCleanJson = jsonText
          .replace(/[\n\r\t]/g, ' ') // Remove all newlines and tabs
          .replace(/\s+/g, ' ') // Normalize spaces
          .replace(/,\s*([}\]])/g, '$1'); // Remove trailing commas again
        
        // Check if JSON is incomplete (missing closing brackets)
        const openBrackets = (veryCleanJson.match(/\[/g) || []).length;
        const closeBrackets = (veryCleanJson.match(/\]/g) || []).length;
        const openBraces = (veryCleanJson.match(/\{/g) || []).length;
        const closeBraces = (veryCleanJson.match(/\}/g) || []).length;
        
        // Try to fix incomplete JSON
        if (openBraces > closeBraces) {
          // Add missing properties and closing braces
          const missingBraces = openBraces - closeBraces;
          for (let i = 0; i < missingBraces; i++) {
            if (!veryCleanJson.includes('"reasoning"')) {
              veryCleanJson += ',"reasoning":"Phù hợp với mục tiêu"';
            }
            veryCleanJson += '}';
          }
        }
        if (openBrackets > closeBrackets) {
          veryCleanJson += ']';
        }
        
        console.log("Đang thử JSON đã làm sạch hoàn toàn:", veryCleanJson);
        missions = JSON.parse(veryCleanJson);
      }

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
        reasoning: mission.reasoning || "Nhiệm vụ được tạo bởi AI dựa trên hồ sơ của bạn"
      }));

      console.log(`✅ Đã tạo ${transformedMissions.length} nhiệm vụ cá nhân hóa`);
      
      // Save to cache
      this.saveCache(cacheKey, transformedMissions);
      
      return transformedMissions;

    } catch (error) {
      console.error("❌ Lỗi khi tạo nhiệm vụ với Gemini:", error);
      throw new Error(`Không thể tạo nhiệm vụ: ${error instanceof Error ? error.message : "Lỗi không xác định"}`);
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
    // Check rate limit
    const rateLimitCheck = this.checkRateLimit();
    if (!rateLimitCheck.allowed) {
      throw new Error(rateLimitCheck.reason);
    }
    
    try {
      // Track this API call
      this.trackApiCall();
      
      const prompt = `Bạn đang tạo lại nhiệm vụ cho người dùng SpoonOS đã từ chối nhiệm vụ này:

**Nhiệm Vụ Bị Từ Chối:**
- Tiêu đề: ${currentMission.title}
- Mô tả: ${currentMission.description}
- Danh mục: ${currentMission.category}
- Độ khó: ${currentMission.difficulty}
${rejectionReason ? `\n**Lý do từ chối:** ${rejectionReason}` : ""}

**Hồ Sơ Người Dùng:**
- Sở thích: ${preferences.interests.join(", ")}
- Trình độ: ${preferences.skillLevel}
- Thời gian rảnh: ${preferences.availableTime} phút
- Mục tiêu: ${preferences.goals.join(", ")}

Tạo MỘT nhiệm vụ thay thế:
1. HOÀN TOÀN KHÁC với nhiệm vụ bị từ chối
2. Phù hợp hơn với sở thích
3. Giải quyết lý do từ chối
4. Độ khó và thời gian tương tự

**CHỈ trả về JSON object ĐÚNG chuẩn, KHÔNG có markdown, KHÔNG có trailing comma:**
{
  "title": "Tiêu đề bằng tiếng Việt",
  "description": "Mô tả bằng tiếng Việt",
  "category": "learning",
  "difficulty": "easy",
  "estimatedTime": 30,
  "xpReward": 100,
  "coinReward": 50,
  "tags": ["tag1", "tag2"],
  "reasoning": "Lý do bằng tiếng Việt"
}`;

      console.log("🔄 Đang tạo lại nhiệm vụ với Gemini...");
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Extract JSON
      let jsonText = text.trim();
      const jsonMatch = text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
      if (jsonMatch) {
        jsonText = jsonMatch[1];
      } else {
        const directMatch = text.match(/\{[\s\S]*?\}/);
        if (directMatch) {
          jsonText = directMatch[0];
        }
      }

      // Clean up the JSON text
      jsonText = jsonText
        .replace(/,(\s*[}\]])/g, '$1') // Remove trailing commas
        .replace(/\/\/.*/g, '') // Remove single-line comments
        .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
        .trim();

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
        reasoning: newMission.reasoning || "Được tạo lại dựa trên phản hồi của bạn"
      };

      console.log("✅ Đã tạo lại nhiệm vụ thành công");
      return transformedMission;

    } catch (error) {
      console.error("❌ Lỗi khi tạo lại nhiệm vụ:", error);
      throw new Error(`Không thể tạo lại nhiệm vụ: ${error instanceof Error ? error.message : "Lỗi không xác định"}`);
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
      const prompt = `Tạo 3 gợi ý nhiệm vụ theo ngữ cảnh cho SpoonOS:

**Hồ Sơ:**
- Sở thích: ${preferences.interests.join(", ")}
- Trình độ: ${preferences.skillLevel}
- Thời gian rảnh: ${preferences.availableTime} phút

**Ngữ Cảnh Hiện Tại:**
- Thời điểm: ${context.timeOfDay}
- Ngày: ${context.dayOfWeek}
- Vừa hoàn thành: ${context.recentCompletions.join(", ") || "Không có"}

**Gợi Ý Theo Ngữ Cảnh:**
- Sáng: Năng lượng cao, học tập, sáng tạo
- Chiều: Làm việc hiệu quả, xây dựng kỹ năng
- Tối: Thư giãn, giao lưu, suy ngẫm
- Tránh nhiệm vụ giống vừa hoàn thành

Tạo 3 nhiệm vụ phù hợp bằng TIẾNG VIỆT. CHỈ trả về JSON array ĐÚNG chuẩn, KHÔNG có markdown.`;

      console.log("🎯 Đang lấy gợi ý theo ngữ cảnh...");
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      let jsonText = text.trim();
      const jsonMatch = text.match(/```(?:json)?\s*(\[[\s\S]*?\])\s*```/);
      if (jsonMatch) {
        jsonText = jsonMatch[1];
      } else {
        const directMatch = text.match(/\[[\s\S]*?\]/);
        if (directMatch) {
          jsonText = directMatch[0];
        }
      }

      // Clean up the JSON text
      jsonText = jsonText
        .replace(/,(\s*[}\]])/g, '$1') // Remove trailing commas
        .replace(/\/\/.*/g, '') // Remove single-line comments
        .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
        .trim();

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
        reasoning: mission.reasoning || `Nhiệm vụ phù hợp cho ${context.timeOfDay === 'morning' ? 'buổi sáng' : context.timeOfDay === 'afternoon' ? 'buổi chiều' : 'buổi tối'}`
      }));

      console.log("✅ Đã tạo gợi ý theo ngữ cảnh");
      return transformedMissions;

    } catch (error) {
      console.error("❌ Lỗi khi lấy gợi ý theo ngữ cảnh:", error);
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
    console.log(`Người dùng ${userId} đã sử dụng lượt tạo lại`);
  }
}

// Export singleton instance
export const personalizedMissionService = new PersonalizedMissionService();
