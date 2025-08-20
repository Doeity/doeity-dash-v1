import { useState, useEffect } from "react";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import TimeDisplay from "@/components/time-display";
import PersonalGreeting from "@/components/personal-greeting";
import DailyQuote from "@/components/daily-quote";
import MainFocus from "@/components/main-focus";
import TodoWidget from "@/components/todo-widget";
import WeatherWidget from "@/components/weather-widget";
import NotesWidget from "@/components/notes-widget";
import ScheduleWidget from "@/components/schedule-widget";
import PomodoroWidget from "@/components/pomodoro-widget";
import HabitsWidget from "@/components/habits-widget";
import QuickAccessWidget from "@/components/quick-access-widget";
import TodaySummaryWidget from "@/components/today-summary-widget";
import DailyBookWidget from "@/components/daily-book-widget";
import WebsiteUsageWidget from "@/components/website-usage-widget";
import AICoachWidget from "@/components/ai-coach-widget";
import FocusMusicControl from "@/components/focus-music-control";
import ZenModeControl from "@/components/zen-mode-control";
import CalendarControl from "@/components/calendar-control";
import SettingsPanel from "@/components/settings-panel";

export default function Home() {
  const [showSettings, setShowSettings] = useState(false);
  const [isZenMode, setIsZenMode] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState(
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
  );

  useEffect(() => {
    // Load background from localStorage
    const savedBackground = localStorage.getItem("backgroundImage");
    if (savedBackground) {
      setBackgroundImage(savedBackground);
    }
  }, []);

  const handleBackgroundChange = (newBackground: string) => {
    setBackgroundImage(newBackground);
    localStorage.setItem("backgroundImage", newBackground);
  };

  return (
    <div className="font-inter min-h-screen overflow-hidden">
      {/* Background Container */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${backgroundImage}')` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6">
        
        {/* Upper Controls */}
        <div className="fixed top-6 right-6 flex items-center space-x-2">
          <FocusMusicControl />
          <ZenModeControl onZenModeToggle={setIsZenMode} />
          <CalendarControl />
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:text-zen-sage transition-colors duration-300 opacity-70 hover:opacity-100 hover:bg-white/10"
            onClick={() => setShowSettings(true)}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>

        {/* Time Display */}
        <div className={`transition-all duration-500 ${isZenMode ? 'scale-110' : 'scale-100'}`}>
          <TimeDisplay />
        </div>

        {/* Personal Greeting */}
        <div className={`transition-all duration-500 ${isZenMode ? 'opacity-80' : 'opacity-100'}`}>
          <PersonalGreeting />
        </div>

        {/* Daily Quote */}
        <div className={`transition-all duration-500 ${isZenMode ? 'opacity-60' : 'opacity-100'}`}>
          <DailyQuote />
        </div>

        {/* Main Focus Section */}
        <div className={`transition-all duration-500 ${isZenMode ? 'scale-105 opacity-90' : 'scale-100 opacity-100'}`}>
          <MainFocus />
        </div>

        {/* Productivity Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl mb-8 transition-all duration-500 ${
          isZenMode ? 'opacity-30 scale-95 blur-sm' : 'opacity-100 scale-100'
        }`}>
          {/* Row 1 - Core Productivity */}
          <TodoWidget />
          <ScheduleWidget />
          <TodaySummaryWidget />
          
          {/* Row 2 - Tools & Habits */}
          <PomodoroWidget />
          <HabitsWidget />
          <QuickAccessWidget />
          
          {/* Row 3 - Analytics & Insights */}
          <DailyBookWidget />
          <WebsiteUsageWidget />
          <AICoachWidget />
          
          {/* Row 4 - Supporting Tools */}
          <WeatherWidget />
          <NotesWidget />
        </div>

        {/* Bottom Actions */}
        <div className={`mt-8 flex items-center space-x-6 transition-all duration-500 ${
          isZenMode ? 'opacity-30' : 'opacity-100'
        }`}>
          <Button
            variant="ghost"
            className="text-white opacity-60 hover:opacity-100 hover:text-zen-sage transition-all duration-300 text-sm hover:bg-white/10"
            onClick={() => setShowSettings(true)}
          >
            <span className="mr-2">🖼️</span>
            Change Background
          </Button>
          <Button
            variant="ghost"
            className="text-white opacity-60 hover:opacity-100 hover:text-zen-blue transition-all duration-300 text-sm hover:bg-white/10"
          >
            <span className="mr-2">🌬️</span>
            Breathing Exercise
          </Button>
        </div>
      </div>

      {/* Settings Panel */}
      <SettingsPanel 
        open={showSettings} 
        onOpenChange={setShowSettings}
        onBackgroundChange={handleBackgroundChange}
        currentBackground={backgroundImage}
      />
    </div>
  );
}
