import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const tasks = pgTable("tasks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  text: text("text").notNull(),
  completed: boolean("completed").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  order: integer("order").default(0).notNull(),
});

export const userSettings = pgTable("user_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  userName: text("user_name").default("Friend").notNull(),
  dailyFocus: text("daily_focus").default("").notNull(),
  quickNotes: text("quick_notes").default("").notNull(),
  backgroundImage: text("background_image").default("").notNull(),
});

export const scheduleEvents = pgTable("schedule_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  time: text("time").notNull(),
  completed: boolean("completed").default(false).notNull(),
  date: text("date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const habits = pgTable("habits", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  icon: text("icon").default("📝").notNull(),
  streak: integer("streak").default(0).notNull(),
  lastCompleted: text("last_completed").default("").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const quickLinks = pgTable("quick_links", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  url: text("url").notNull(),
  icon: text("icon").default("🔗").notNull(),
  order: integer("order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
  createdAt: true,
});

export const insertUserSettingsSchema = createInsertSchema(userSettings).omit({
  id: true,
});

export const insertScheduleEventSchema = createInsertSchema(scheduleEvents).omit({
  id: true,
  createdAt: true,
});

export const insertHabitSchema = createInsertSchema(habits).omit({
  id: true,
  createdAt: true,
});

export const insertQuickLinkSchema = createInsertSchema(quickLinks).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Task = typeof tasks.$inferSelect;
export type InsertUserSettings = z.infer<typeof insertUserSettingsSchema>;
export type UserSettings = typeof userSettings.$inferSelect;
export type InsertScheduleEvent = z.infer<typeof insertScheduleEventSchema>;
export type ScheduleEvent = typeof scheduleEvents.$inferSelect;
export type InsertHabit = z.infer<typeof insertHabitSchema>;
export type Habit = typeof habits.$inferSelect;
export type InsertQuickLink = z.infer<typeof insertQuickLinkSchema>;
export type QuickLink = typeof quickLinks.$inferSelect;

// Daily Summary tracking
export const dailySummary = pgTable("daily_summary", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  date: text("date").notNull(), // YYYY-MM-DD format
  tasksCompleted: integer("tasks_completed").default(0).notNull(),
  totalTasks: integer("total_tasks").default(0).notNull(),
  focusTimeMinutes: integer("focus_time_minutes").default(0).notNull(),
  habitsCompleted: integer("habits_completed").default(0).notNull(),
  totalHabits: integer("total_habits").default(0).notNull(),
  productivityScore: integer("productivity_score").default(0).notNull(), // 0-100
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Book recommendations
export const dailyBook = pgTable("daily_book", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  date: text("date").notNull(), // YYYY-MM-DD format
  title: text("title").notNull(),
  author: text("author").notNull(),
  summary: text("summary").notNull(),
  keyTakeaway: text("key_takeaway").notNull(),
  genre: text("genre").notNull(),
  coverUrl: text("cover_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Website usage tracking (simulated Chrome history)
export const websiteUsage = pgTable("website_usage", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  date: text("date").notNull(),
  domain: text("domain").notNull(),
  title: text("title").notNull(),
  timeSpentMinutes: integer("time_spent_minutes").default(0).notNull(),
  visitCount: integer("visit_count").default(1).notNull(),
  category: text("category").default("other").notNull(), // work, social, entertainment, education, etc.
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// AI Coach insights
export const aiInsights = pgTable("ai_insights", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  date: text("date").notNull(),
  insight: text("insight").notNull(),
  category: text("category").notNull(), // productivity, focus, habits, time_management
  severity: text("severity").default("info").notNull(), // info, warning, critical
  actionable: boolean("actionable").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertDailySummarySchema = createInsertSchema(dailySummary).omit({
  id: true,
  createdAt: true,
});

export const insertDailyBookSchema = createInsertSchema(dailyBook).omit({
  id: true,
  createdAt: true,
});

export const insertWebsiteUsageSchema = createInsertSchema(websiteUsage).omit({
  id: true,
  createdAt: true,
});

export const insertAIInsightSchema = createInsertSchema(aiInsights).omit({
  id: true,
  createdAt: true,
});

export type InsertDailySummary = z.infer<typeof insertDailySummarySchema>;
export type DailySummary = typeof dailySummary.$inferSelect;
export type InsertDailyBook = z.infer<typeof insertDailyBookSchema>;
export type DailyBook = typeof dailyBook.$inferSelect;
export type InsertWebsiteUsage = z.infer<typeof insertWebsiteUsageSchema>;
export type WebsiteUsage = typeof websiteUsage.$inferSelect;
export type InsertAIInsight = z.infer<typeof insertAIInsightSchema>;
export type AIInsight = typeof aiInsights.$inferSelect;
