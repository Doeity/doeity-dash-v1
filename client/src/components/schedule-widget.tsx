import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, X, Calendar } from "lucide-react";
import type { ScheduleEvent } from "@shared/schema";

export default function ScheduleWidget() {
  const [newEvent, setNewEvent] = useState({ title: "", time: "" });
  const today = new Date().toISOString().split('T')[0];

  const { data: events = [], isLoading } = useQuery<ScheduleEvent[]>({
    queryKey: [`/api/schedule?date=${today}`],
  });

  const createEventMutation = useMutation({
    mutationFn: (data: { title: string; time: string; date: string }) => 
      apiRequest("POST", "/api/schedule", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/schedule?date=${today}`] });
      setNewEvent({ title: "", time: "" });
    },
  });

  const updateEventMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<ScheduleEvent> }) => 
      apiRequest("PATCH", `/api/schedule/${id}`, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/schedule?date=${today}`] });
    },
  });

  const deleteEventMutation = useMutation({
    mutationFn: (id: string) => 
      apiRequest("DELETE", `/api/schedule/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/schedule?date=${today}`] });
    },
  });

  const handleAddEvent = () => {
    if (newEvent.title.trim() && newEvent.time.trim()) {
      createEventMutation.mutate({
        title: newEvent.title.trim(),
        time: newEvent.time.trim(),
        date: today,
      });
    }
  };

  const toggleEventCompletion = (event: ScheduleEvent) => {
    updateEventMutation.mutate({
      id: event.id,
      updates: { completed: !event.completed },
    });
  };

  const deleteEvent = (id: string) => {
    deleteEventMutation.mutate(id);
  };

  const completedCount = events.filter(event => event.completed).length;

  if (isLoading) {
    return (
      <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white border-opacity-20">
        <div className="animate-pulse">
          <div className="h-6 bg-white bg-opacity-20 rounded mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
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
          <Calendar className="h-5 w-5 text-white opacity-80" />
          <h3 className="text-white font-medium text-lg">Today's Schedule</h3>
        </div>
        <span className="text-white opacity-60 text-sm">
          {completedCount}/{events.length}
        </span>
      </div>
      
      <div className="space-y-3 mb-4">
        {events.map((event) => (
          <div key={event.id} className="flex items-center space-x-3 group">
            <Checkbox
              checked={event.completed}
              onCheckedChange={() => toggleEventCompletion(event)}
              className="w-4 h-4 border-white border-opacity-50 data-[state=checked]:bg-zen-sage data-[state=checked]:border-zen-sage"
            />
            <div className="flex-1">
              <div className={`text-sm ${
                event.completed 
                  ? "text-white opacity-60 line-through" 
                  : "text-white opacity-90"
              }`}>
                {event.title}
              </div>
              <div className="text-xs text-white opacity-60">
                {event.time}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="opacity-0 group-hover:opacity-100 text-white hover:text-red-400 transition-all duration-300 p-1 h-auto"
              onClick={() => deleteEvent(event.id)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Input 
            type="text" 
            placeholder="Event title..." 
            className="flex-1 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg px-3 py-2 text-sm text-white placeholder-white placeholder-opacity-50 focus:outline-none focus:ring-1 focus:ring-zen-sage transition-all duration-300"
            value={newEvent.title}
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
          />
          <Input 
            type="time" 
            className="w-24 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-zen-sage transition-all duration-300"
            value={newEvent.time}
            onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
          />
          <Button 
            variant="ghost"
            size="sm"
            className="text-white hover:text-zen-sage transition-colors duration-300 p-2 h-auto"
            onClick={handleAddEvent}
            disabled={createEventMutation.isPending}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}