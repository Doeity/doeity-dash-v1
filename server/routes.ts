import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertTaskSchema, 
  insertUserSettingsSchema,
  insertScheduleEventSchema,
  insertHabitSchema,
  insertQuickLinkSchema,
  insertDailySummarySchema,
  insertDailyBookSchema,
  insertWebsiteUsageSchema,
  insertAIInsightSchema
} from "@shared/schema";
import { z } from "zod";

const updateTaskSchema = z.object({
  text: z.string().optional(),
  completed: z.boolean().optional(),
  order: z.number().optional(),
});

const updateSettingsSchema = insertUserSettingsSchema.partial().omit({ userId: true });
const updateScheduleEventSchema = z.object({
  title: z.string().optional(),
  time: z.string().optional(),
  completed: z.boolean().optional(),
  date: z.string().optional(),
});
const updateHabitSchema = z.object({
  name: z.string().optional(),
  icon: z.string().optional(),
  streak: z.number().optional(),
  lastCompleted: z.string().optional(),
});
const updateQuickLinkSchema = z.object({
  name: z.string().optional(),
  url: z.string().optional(),
  icon: z.string().optional(),
  order: z.number().optional(),
});

export async function registerRoutes(app: Express): Promise<Server> {
  const DEFAULT_USER_ID = "default-user";

  // Get daily quote from external API
  app.get("/api/quote", async (req, res) => {
    try {
      const response = await fetch("https://api.quotable.io/random?minLength=50&maxLength=150&tags=wisdom,motivational,inspirational");
      if (!response.ok) {
        throw new Error("Failed to fetch quote");
      }
      const data = await response.json();
      res.json({
        text: data.content,
        author: data.author,
      });
    } catch (error) {
      console.error("Quote API error:", error);
      res.json({
        text: "The present moment is the only time over which we have dominion.",
        author: "Thich Nhat Hanh",
      });
    }
  });

  // Get weather data
  app.get("/api/weather", async (req, res) => {
    try {
      const { lat, lon } = req.query;
      const apiKey = process.env.OPENWEATHER_API_KEY || process.env.WEATHER_API_KEY;
      
      if (!apiKey) {
        throw new Error("Weather API key not configured");
      }
      
      if (!lat || !lon) {
        throw new Error("Location coordinates required");
      }

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch weather data");
      }
      
      const data = await response.json();
      
      res.json({
        temperature: Math.round(data.main.temp),
        condition: data.weather[0].main,
        description: data.weather[0].description,
        location: data.name,
        high: Math.round(data.main.temp_max),
        low: Math.round(data.main.temp_min),
        icon: data.weather[0].icon,
      });
    } catch (error) {
      console.error("Weather API error:", error);
      res.status(500).json({ 
        error: "Weather data unavailable",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Get user tasks
  app.get("/api/tasks", async (req, res) => {
    try {
      const tasks = await storage.getTasks(DEFAULT_USER_ID);
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tasks" });
    }
  });

  // Create new task
  app.post("/api/tasks", async (req, res) => {
    try {
      const taskData = insertTaskSchema.parse({
        ...req.body,
        userId: DEFAULT_USER_ID,
      });
      
      const task = await storage.createTask(taskData);
      res.json(task);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid task data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create task" });
      }
    }
  });

  // Update task
  app.patch("/api/tasks/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = updateTaskSchema.parse(req.body);
      
      const task = await storage.updateTask(id, updates);
      if (!task) {
        res.status(404).json({ error: "Task not found" });
        return;
      }
      
      res.json(task);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid update data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to update task" });
      }
    }
  });

  // Delete task
  app.delete("/api/tasks/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteTask(id);
      
      if (!deleted) {
        res.status(404).json({ error: "Task not found" });
        return;
      }
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete task" });
    }
  });

  // Get user settings
  app.get("/api/settings", async (req, res) => {
    try {
      const settings = await storage.getUserSettings(DEFAULT_USER_ID);
      if (!settings) {
        res.status(404).json({ error: "Settings not found" });
        return;
      }
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  // Update user settings
  app.patch("/api/settings", async (req, res) => {
    try {
      const updates = updateSettingsSchema.parse(req.body);
      
      const settings = await storage.updateUserSettings(DEFAULT_USER_ID, updates);
      if (!settings) {
        res.status(404).json({ error: "Settings not found" });
        return;
      }
      
      res.json(settings);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid settings data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to update settings" });
      }
    }
  });

  // Schedule Events API
  app.get("/api/schedule", async (req, res) => {
    try {
      const { date } = req.query;
      const scheduleDate = date ? String(date) : new Date().toISOString().split('T')[0];
      const events = await storage.getScheduleEvents(DEFAULT_USER_ID, scheduleDate);
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch schedule events" });
    }
  });

  app.post("/api/schedule", async (req, res) => {
    try {
      const eventData = insertScheduleEventSchema.parse({
        ...req.body,
        userId: DEFAULT_USER_ID,
      });
      const event = await storage.createScheduleEvent(eventData);
      res.json(event);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid event data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create event" });
      }
    }
  });

  app.patch("/api/schedule/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = updateScheduleEventSchema.parse(req.body);
      const event = await storage.updateScheduleEvent(id, updates);
      if (!event) {
        res.status(404).json({ error: "Event not found" });
        return;
      }
      res.json(event);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid update data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to update event" });
      }
    }
  });

  app.delete("/api/schedule/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteScheduleEvent(id);
      if (!deleted) {
        res.status(404).json({ error: "Event not found" });
        return;
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete event" });
    }
  });

  // Habits API
  app.get("/api/habits", async (req, res) => {
    try {
      const habits = await storage.getHabits(DEFAULT_USER_ID);
      res.json(habits);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch habits" });
    }
  });

  app.post("/api/habits", async (req, res) => {
    try {
      const habitData = insertHabitSchema.parse({
        ...req.body,
        userId: DEFAULT_USER_ID,
      });
      const habit = await storage.createHabit(habitData);
      res.json(habit);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid habit data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create habit" });
      }
    }
  });

  app.patch("/api/habits/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = updateHabitSchema.parse(req.body);
      const habit = await storage.updateHabit(id, updates);
      if (!habit) {
        res.status(404).json({ error: "Habit not found" });
        return;
      }
      res.json(habit);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid update data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to update habit" });
      }
    }
  });

  app.delete("/api/habits/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteHabit(id);
      if (!deleted) {
        res.status(404).json({ error: "Habit not found" });
        return;
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete habit" });
    }
  });

  // Quick Links API
  app.get("/api/quick-links", async (req, res) => {
    try {
      const links = await storage.getQuickLinks(DEFAULT_USER_ID);
      res.json(links);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch quick links" });
    }
  });

  app.post("/api/quick-links", async (req, res) => {
    try {
      const linkData = insertQuickLinkSchema.parse({
        ...req.body,
        userId: DEFAULT_USER_ID,
      });
      const link = await storage.createQuickLink(linkData);
      res.json(link);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid link data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create link" });
      }
    }
  });

  app.patch("/api/quick-links/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = updateQuickLinkSchema.parse(req.body);
      const link = await storage.updateQuickLink(id, updates);
      if (!link) {
        res.status(404).json({ error: "Link not found" });
        return;
      }
      res.json(link);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid update data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to update link" });
      }
    }
  });

  app.delete("/api/quick-links/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteQuickLink(id);
      if (!deleted) {
        res.status(404).json({ error: "Link not found" });
        return;
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete link" });
    }
  });

  // Daily Summary API
  app.get("/api/daily-summary", async (req, res) => {
    try {
      const { date } = req.query;
      const summaryDate = date ? String(date) : new Date().toISOString().split('T')[0];
      const summary = await storage.getDailySummary(DEFAULT_USER_ID, summaryDate);
      res.json(summary);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch daily summary" });
    }
  });

  // Daily Book API
  app.get("/api/daily-book", async (req, res) => {
    try {
      const { date } = req.query;
      const bookDate = date ? String(date) : new Date().toISOString().split('T')[0];
      const book = await storage.getDailyBook(DEFAULT_USER_ID, bookDate);
      res.json(book);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch daily book" });
    }
  });

  // Website Usage API
  app.get("/api/website-usage", async (req, res) => {
    try {
      const { date } = req.query;
      const usageDate = date ? String(date) : new Date().toISOString().split('T')[0];
      const usage = await storage.getWebsiteUsage(DEFAULT_USER_ID, usageDate);
      res.json(usage);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch website usage" });
    }
  });

  // AI Insights API
  app.get("/api/ai-insights", async (req, res) => {
    try {
      const { date } = req.query;
      const insightDate = date ? String(date) : new Date().toISOString().split('T')[0];
      const insights = await storage.getAIInsights(DEFAULT_USER_ID, insightDate);
      res.json(insights);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch AI insights" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
