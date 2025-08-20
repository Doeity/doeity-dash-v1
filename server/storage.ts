import { 
  type User, type InsertUser, 
  type Task, type InsertTask, 
  type UserSettings, type InsertUserSettings,
  type ScheduleEvent, type InsertScheduleEvent,
  type Habit, type InsertHabit,
  type QuickLink, type InsertQuickLink,
  type DailySummary, type InsertDailySummary,
  type DailyBook, type InsertDailyBook,
  type WebsiteUsage, type InsertWebsiteUsage,
  type AIInsight, type InsertAIInsight
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Task methods
  getTasks(userId: string): Promise<Task[]>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: string, updates: Partial<Task>): Promise<Task | undefined>;
  deleteTask(id: string): Promise<boolean>;
  
  // Settings methods
  getUserSettings(userId: string): Promise<UserSettings | undefined>;
  createUserSettings(settings: InsertUserSettings): Promise<UserSettings>;
  updateUserSettings(userId: string, updates: Partial<UserSettings>): Promise<UserSettings | undefined>;
  
  // Schedule methods
  getScheduleEvents(userId: string, date: string): Promise<ScheduleEvent[]>;
  createScheduleEvent(event: InsertScheduleEvent): Promise<ScheduleEvent>;
  updateScheduleEvent(id: string, updates: Partial<ScheduleEvent>): Promise<ScheduleEvent | undefined>;
  deleteScheduleEvent(id: string): Promise<boolean>;
  
  // Habit methods
  getHabits(userId: string): Promise<Habit[]>;
  createHabit(habit: InsertHabit): Promise<Habit>;
  updateHabit(id: string, updates: Partial<Habit>): Promise<Habit | undefined>;
  deleteHabit(id: string): Promise<boolean>;
  
  // Quick Link methods
  getQuickLinks(userId: string): Promise<QuickLink[]>;
  createQuickLink(link: InsertQuickLink): Promise<QuickLink>;
  updateQuickLink(id: string, updates: Partial<QuickLink>): Promise<QuickLink | undefined>;
  deleteQuickLink(id: string): Promise<boolean>;
  
  // Daily Summary methods
  getDailySummary(userId: string, date: string): Promise<DailySummary | undefined>;
  createDailySummary(summary: InsertDailySummary): Promise<DailySummary>;
  updateDailySummary(userId: string, date: string, updates: Partial<DailySummary>): Promise<DailySummary | undefined>;
  
  // Daily Book methods
  getDailyBook(userId: string, date: string): Promise<DailyBook | undefined>;
  createDailyBook(book: InsertDailyBook): Promise<DailyBook>;
  
  // Website Usage methods
  getWebsiteUsage(userId: string, date: string): Promise<WebsiteUsage[]>;
  createWebsiteUsage(usage: InsertWebsiteUsage): Promise<WebsiteUsage>;
  updateWebsiteUsage(id: string, updates: Partial<WebsiteUsage>): Promise<WebsiteUsage | undefined>;
  
  // AI Insights methods
  getAIInsights(userId: string, date: string): Promise<AIInsight[]>;
  createAIInsight(insight: InsertAIInsight): Promise<AIInsight>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private tasks: Map<string, Task>;
  private userSettings: Map<string, UserSettings>;
  private scheduleEvents: Map<string, ScheduleEvent>;
  private habits: Map<string, Habit>;
  private quickLinks: Map<string, QuickLink>;
  private dailySummaries: Map<string, DailySummary>;
  private dailyBooks: Map<string, DailyBook>;
  private websiteUsage: Map<string, WebsiteUsage>;
  private aiInsights: Map<string, AIInsight>;

  constructor() {
    this.users = new Map();
    this.tasks = new Map();
    this.userSettings = new Map();
    this.scheduleEvents = new Map();
    this.habits = new Map();
    this.quickLinks = new Map();
    this.dailySummaries = new Map();
    this.dailyBooks = new Map();
    this.websiteUsage = new Map();
    this.aiInsights = new Map();
    
    // Create a default user for the demo
    const defaultUser: User = {
      id: "default-user",
      name: "Alex",
      email: "alex@example.com",
      createdAt: new Date(),
    };
    this.users.set("default-user", defaultUser);
    
    // Create default settings
    const defaultSettings: UserSettings = {
      id: "default-settings",
      userId: "default-user",
      userName: "Alex",
      dailyFocus: "",
      quickNotes: "",
      backgroundImage: "",
    };
    this.userSettings.set("default-user", defaultSettings);
    
    // Create sample data for new features
    const sampleSchedule: ScheduleEvent = {
      id: "sample-event-1",
      userId: "default-user",
      title: "Team meeting",
      time: "10:00",
      completed: false,
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date(),
    };
    this.scheduleEvents.set("sample-event-1", sampleSchedule);
    
    const sampleHabit: Habit = {
      id: "sample-habit-1",
      userId: "default-user",
      name: "Morning meditation",
      icon: "🧘",
      streak: 3,
      lastCompleted: "",
      createdAt: new Date(),
    };
    this.habits.set("sample-habit-1", sampleHabit);
    
    const sampleLink: QuickLink = {
      id: "sample-link-1",
      userId: "default-user",
      name: "Gmail",
      url: "https://gmail.com",
      icon: "📧",
      order: 0,
      createdAt: new Date(),
    };
    this.quickLinks.set("sample-link-1", sampleLink);
    
    // Create sample data for new features
    const today = new Date().toISOString().split('T')[0];
    
    const sampleSummary: DailySummary = {
      id: "sample-summary-1",
      userId: "default-user",
      date: today,
      tasksCompleted: 2,
      totalTasks: 5,
      focusTimeMinutes: 75,
      habitsCompleted: 3,
      totalHabits: 4,
      productivityScore: 78,
      createdAt: new Date(),
    };
    this.dailySummaries.set(`default-user-${today}`, sampleSummary);
    
    const sampleBook: DailyBook = {
      id: "sample-book-1",
      userId: "default-user",
      date: today,
      title: "Atomic Habits",
      author: "James Clear",
      summary: "A practical guide to building good habits and breaking bad ones through small, consistent changes.",
      keyTakeaway: "Focus on systems rather than goals. Small improvements compound over time.",
      genre: "Self-Help",
      coverUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&h=300&fit=crop",
      createdAt: new Date(),
    };
    this.dailyBooks.set(`default-user-${today}`, sampleBook);
    
    // Sample website usage
    const sampleUsage: WebsiteUsage[] = [
      {
        id: "usage-1",
        userId: "default-user",
        date: today,
        domain: "youtube.com",
        title: "YouTube",
        timeSpentMinutes: 45,
        visitCount: 8,
        category: "entertainment",
        createdAt: new Date(),
      },
      {
        id: "usage-2",
        userId: "default-user",
        date: today,
        domain: "github.com",
        title: "GitHub",
        timeSpentMinutes: 120,
        visitCount: 15,
        category: "work",
        createdAt: new Date(),
      },
      {
        id: "usage-3",
        userId: "default-user",
        date: today,
        domain: "twitter.com",
        title: "Twitter",
        timeSpentMinutes: 25,
        visitCount: 12,
        category: "social",
        createdAt: new Date(),
      },
    ];
    sampleUsage.forEach(usage => this.websiteUsage.set(usage.id, usage));
    
    // Sample AI insights
    const sampleInsights: AIInsight[] = [
      {
        id: "insight-1",
        userId: "default-user",
        date: today,
        insight: "You spent 45 minutes on YouTube today, which is 30% of your focus time. Consider using a website blocker during work hours.",
        category: "focus",
        severity: "warning",
        actionable: true,
        createdAt: new Date(),
      },
      {
        id: "insight-2",
        userId: "default-user",
        date: today,
        insight: "Great job maintaining a 3-day meditation streak! Consistency is key to building lasting habits.",
        category: "habits",
        severity: "info",
        actionable: false,
        createdAt: new Date(),
      },
      {
        id: "insight-3",
        userId: "default-user",
        date: today,
        insight: "Your productivity score is 78% today. You're on track to meet your weekly goals!",
        category: "productivity",
        severity: "info",
        actionable: false,
        createdAt: new Date(),
      },
    ];
    sampleInsights.forEach(insight => this.aiInsights.set(insight.id, insight));
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: new Date() 
    };
    this.users.set(id, user);
    return user;
  }

  async getTasks(userId: string): Promise<Task[]> {
    return Array.from(this.tasks.values())
      .filter(task => task.userId === userId)
      .sort((a, b) => a.order - b.order);
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const id = randomUUID();
    const task: Task = {
      ...insertTask,
      id,
      createdAt: new Date(),
      order: insertTask.order || 0,
      completed: insertTask.completed || false,
    };
    this.tasks.set(id, task);
    return task;
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Task | undefined> {
    const task = this.tasks.get(id);
    if (!task) return undefined;
    
    const updatedTask = { ...task, ...updates };
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  async deleteTask(id: string): Promise<boolean> {
    return this.tasks.delete(id);
  }

  async getUserSettings(userId: string): Promise<UserSettings | undefined> {
    return this.userSettings.get(userId);
  }

  async createUserSettings(insertSettings: InsertUserSettings): Promise<UserSettings> {
    const id = randomUUID();
    const settings: UserSettings = {
      ...insertSettings,
      id,
      userName: insertSettings.userName || "Friend",
      dailyFocus: insertSettings.dailyFocus || "",
      quickNotes: insertSettings.quickNotes || "",
      backgroundImage: insertSettings.backgroundImage || "",
    };
    this.userSettings.set(insertSettings.userId, settings);
    return settings;
  }

  async updateUserSettings(userId: string, updates: Partial<UserSettings>): Promise<UserSettings | undefined> {
    const settings = this.userSettings.get(userId);
    if (!settings) return undefined;
    
    const updatedSettings = { ...settings, ...updates };
    this.userSettings.set(userId, updatedSettings);
    return updatedSettings;
  }

  // Schedule Event methods
  async getScheduleEvents(userId: string, date: string): Promise<ScheduleEvent[]> {
    return Array.from(this.scheduleEvents.values())
      .filter(event => event.userId === userId && event.date === date)
      .sort((a, b) => a.time.localeCompare(b.time));
  }

  async createScheduleEvent(insertEvent: InsertScheduleEvent): Promise<ScheduleEvent> {
    const id = randomUUID();
    const event: ScheduleEvent = {
      ...insertEvent,
      id,
      createdAt: new Date(),
      completed: insertEvent.completed || false,
    };
    this.scheduleEvents.set(id, event);
    return event;
  }

  async updateScheduleEvent(id: string, updates: Partial<ScheduleEvent>): Promise<ScheduleEvent | undefined> {
    const event = this.scheduleEvents.get(id);
    if (!event) return undefined;
    
    const updatedEvent = { ...event, ...updates };
    this.scheduleEvents.set(id, updatedEvent);
    return updatedEvent;
  }

  async deleteScheduleEvent(id: string): Promise<boolean> {
    return this.scheduleEvents.delete(id);
  }

  // Habit methods
  async getHabits(userId: string): Promise<Habit[]> {
    return Array.from(this.habits.values())
      .filter(habit => habit.userId === userId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async createHabit(insertHabit: InsertHabit): Promise<Habit> {
    const id = randomUUID();
    const habit: Habit = {
      ...insertHabit,
      id,
      createdAt: new Date(),
      streak: insertHabit.streak || 0,
      lastCompleted: insertHabit.lastCompleted || "",
      icon: insertHabit.icon || "📝",
    };
    this.habits.set(id, habit);
    return habit;
  }

  async updateHabit(id: string, updates: Partial<Habit>): Promise<Habit | undefined> {
    const habit = this.habits.get(id);
    if (!habit) return undefined;
    
    const updatedHabit = { ...habit, ...updates };
    this.habits.set(id, updatedHabit);
    return updatedHabit;
  }

  async deleteHabit(id: string): Promise<boolean> {
    return this.habits.delete(id);
  }

  // Quick Link methods
  async getQuickLinks(userId: string): Promise<QuickLink[]> {
    return Array.from(this.quickLinks.values())
      .filter(link => link.userId === userId)
      .sort((a, b) => a.order - b.order);
  }

  async createQuickLink(insertLink: InsertQuickLink): Promise<QuickLink> {
    const id = randomUUID();
    const link: QuickLink = {
      ...insertLink,
      id,
      createdAt: new Date(),
      order: insertLink.order || 0,
      icon: insertLink.icon || "🔗",
    };
    this.quickLinks.set(id, link);
    return link;
  }

  async updateQuickLink(id: string, updates: Partial<QuickLink>): Promise<QuickLink | undefined> {
    const link = this.quickLinks.get(id);
    if (!link) return undefined;
    
    const updatedLink = { ...link, ...updates };
    this.quickLinks.set(id, updatedLink);
    return updatedLink;
  }

  async deleteQuickLink(id: string): Promise<boolean> {
    return this.quickLinks.delete(id);
  }

  // Daily Summary methods
  async getDailySummary(userId: string, date: string): Promise<DailySummary | undefined> {
    return this.dailySummaries.get(`${userId}-${date}`);
  }

  async createDailySummary(insertSummary: InsertDailySummary): Promise<DailySummary> {
    const id = randomUUID();
    const summary: DailySummary = {
      ...insertSummary,
      id,
      createdAt: new Date(),
      tasksCompleted: insertSummary.tasksCompleted || 0,
      totalTasks: insertSummary.totalTasks || 0,
      focusTimeMinutes: insertSummary.focusTimeMinutes || 0,
      habitsCompleted: insertSummary.habitsCompleted || 0,
      totalHabits: insertSummary.totalHabits || 0,
      productivityScore: insertSummary.productivityScore || 0,
    };
    this.dailySummaries.set(`${insertSummary.userId}-${insertSummary.date}`, summary);
    return summary;
  }

  async updateDailySummary(userId: string, date: string, updates: Partial<DailySummary>): Promise<DailySummary | undefined> {
    const summary = this.dailySummaries.get(`${userId}-${date}`);
    if (!summary) return undefined;
    
    const updatedSummary = { ...summary, ...updates };
    this.dailySummaries.set(`${userId}-${date}`, updatedSummary);
    return updatedSummary;
  }

  // Daily Book methods
  async getDailyBook(userId: string, date: string): Promise<DailyBook | undefined> {
    return this.dailyBooks.get(`${userId}-${date}`);
  }

  async createDailyBook(insertBook: InsertDailyBook): Promise<DailyBook> {
    const id = randomUUID();
    const book: DailyBook = {
      ...insertBook,
      id,
      createdAt: new Date(),
      coverUrl: insertBook.coverUrl || null,
    };
    this.dailyBooks.set(`${insertBook.userId}-${insertBook.date}`, book);
    return book;
  }

  // Website Usage methods
  async getWebsiteUsage(userId: string, date: string): Promise<WebsiteUsage[]> {
    return Array.from(this.websiteUsage.values())
      .filter(usage => usage.userId === userId && usage.date === date)
      .sort((a, b) => b.timeSpentMinutes - a.timeSpentMinutes);
  }

  async createWebsiteUsage(insertUsage: InsertWebsiteUsage): Promise<WebsiteUsage> {
    const id = randomUUID();
    const usage: WebsiteUsage = {
      ...insertUsage,
      id,
      createdAt: new Date(),
      timeSpentMinutes: insertUsage.timeSpentMinutes || 0,
      visitCount: insertUsage.visitCount || 1,
      category: insertUsage.category || "other",
    };
    this.websiteUsage.set(id, usage);
    return usage;
  }

  async updateWebsiteUsage(id: string, updates: Partial<WebsiteUsage>): Promise<WebsiteUsage | undefined> {
    const usage = this.websiteUsage.get(id);
    if (!usage) return undefined;
    
    const updatedUsage = { ...usage, ...updates };
    this.websiteUsage.set(id, updatedUsage);
    return updatedUsage;
  }

  // AI Insights methods
  async getAIInsights(userId: string, date: string): Promise<AIInsight[]> {
    return Array.from(this.aiInsights.values())
      .filter(insight => insight.userId === userId && insight.date === date)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createAIInsight(insertInsight: InsertAIInsight): Promise<AIInsight> {
    const id = randomUUID();
    const insight: AIInsight = {
      ...insertInsight,
      id,
      createdAt: new Date(),
      severity: insertInsight.severity || "info",
      actionable: insertInsight.actionable !== undefined ? insertInsight.actionable : true,
    };
    this.aiInsights.set(id, insight);
    return insight;
  }
}

export const storage = new MemStorage();
