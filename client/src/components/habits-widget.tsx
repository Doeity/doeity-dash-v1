import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X, Target, Flame } from "lucide-react";
import type { Habit } from "@shared/schema";

export default function HabitsWidget() {
  const [newHabit, setNewHabit] = useState({ name: "", icon: "📝" });

  const { data: habits = [], isLoading } = useQuery<Habit[]>({
    queryKey: ["/api/habits"],
  });

  const createHabitMutation = useMutation({
    mutationFn: (data: { name: string; icon: string }) => 
      apiRequest("POST", "/api/habits", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/habits"] });
      setNewHabit({ name: "", icon: "📝" });
    },
  });

  const updateHabitMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Habit> }) => 
      apiRequest("PATCH", `/api/habits/${id}`, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/habits"] });
    },
  });

  const deleteHabitMutation = useMutation({
    mutationFn: (id: string) => 
      apiRequest("DELETE", `/api/habits/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/habits"] });
    },
  });

  const handleAddHabit = () => {
    if (newHabit.name.trim()) {
      createHabitMutation.mutate({
        name: newHabit.name.trim(),
        icon: newHabit.icon,
      });
    }
  };

  const handleCompleteHabit = (habit: Habit) => {
    const today = new Date().toISOString().split('T')[0];
    const wasCompletedToday = habit.lastCompleted === today;
    
    if (wasCompletedToday) {
      // Uncomplete habit
      updateHabitMutation.mutate({
        id: habit.id,
        updates: { 
          lastCompleted: "",
          streak: Math.max(0, habit.streak - 1)
        },
      });
    } else {
      // Complete habit
      const newStreak = habit.lastCompleted === getPreviousDay(today) 
        ? habit.streak + 1 
        : 1;
      
      updateHabitMutation.mutate({
        id: habit.id,
        updates: { 
          lastCompleted: today,
          streak: newStreak
        },
      });
    }
  };

  const getPreviousDay = (dateString: string) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() - 1);
    return date.toISOString().split('T')[0];
  };

  const isCompletedToday = (habit: Habit) => {
    const today = new Date().toISOString().split('T')[0];
    return habit.lastCompleted === today;
  };

  const deleteHabit = (id: string) => {
    deleteHabitMutation.mutate(id);
  };

  const completedToday = habits.filter(isCompletedToday).length;

  if (isLoading) {
    return (
      <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white border-opacity-20">
        <div className="animate-pulse">
          <div className="h-6 bg-white bg-opacity-20 rounded mb-4"></div>
          <div className="space-y-3">
            {[1, 2].map(i => (
              <div key={i} className="h-4 bg-white bg-opacity-20 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white border-opacity-20 hover:translate-y-[-2px] transition-transform duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Target className="h-5 w-5 text-white opacity-80" />
          <h3 className="text-white font-medium text-lg">Habits</h3>
        </div>
        <span className="text-white opacity-60 text-sm">
          {completedToday}/{habits.length}
        </span>
      </div>
      
      <div className="space-y-3 mb-4">
        {habits.map((habit) => {
          const completed = isCompletedToday(habit);
          return (
            <div key={habit.id} className="flex items-center space-x-3 group">
              <Button
                variant="ghost"
                size="sm"
                className={`w-8 h-8 p-0 rounded-full border ${
                  completed 
                    ? "bg-zen-sage border-zen-sage text-white" 
                    : "border-white border-opacity-50 text-white hover:border-zen-sage"
                } transition-all duration-300`}
                onClick={() => handleCompleteHabit(habit)}
              >
                <span className="text-sm">{habit.icon}</span>
              </Button>
              
              <div className="flex-1">
                <div className={`text-sm ${
                  completed 
                    ? "text-white opacity-90" 
                    : "text-white opacity-70"
                }`}>
                  {habit.name}
                </div>
                {habit.streak > 0 && (
                  <div className="flex items-center space-x-1 text-xs text-white opacity-60">
                    <Flame className="h-3 w-3" />
                    <span>{habit.streak} day{habit.streak > 1 ? 's' : ''}</span>
                  </div>
                )}
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100 text-white hover:text-red-400 transition-all duration-300 p-1 h-auto"
                onClick={() => deleteHabit(habit.id)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          );
        })}
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Input 
            type="text" 
            placeholder="New habit..." 
            className="flex-1 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg px-3 py-2 text-sm text-white placeholder-white placeholder-opacity-50 focus:outline-none focus:ring-1 focus:ring-zen-sage transition-all duration-300"
            value={newHabit.name}
            onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
            onKeyPress={(e) => e.key === "Enter" && handleAddHabit()}
          />
          <Input 
            type="text" 
            placeholder="📝" 
            className="w-16 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg px-3 py-2 text-sm text-white text-center focus:outline-none focus:ring-1 focus:ring-zen-sage transition-all duration-300"
            value={newHabit.icon}
            onChange={(e) => setNewHabit({ ...newHabit, icon: e.target.value })}
          />
          <Button 
            variant="ghost"
            size="sm"
            className="text-white hover:text-zen-sage transition-colors duration-300 p-2 h-auto"
            onClick={handleAddHabit}
            disabled={createHabitMutation.isPending}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}