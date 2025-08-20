import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, X } from "lucide-react";
import type { Task } from "@shared/schema";

export default function TodoWidget() {
  const [newTask, setNewTask] = useState("");

  const { data: tasks = [], isLoading } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  const createTaskMutation = useMutation({
    mutationFn: (data: { text: string; order: number }) => 
      apiRequest("POST", "/api/tasks", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      setNewTask("");
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Task> }) => 
      apiRequest("PATCH", `/api/tasks/${id}`, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: (id: string) => 
      apiRequest("DELETE", `/api/tasks/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
    },
  });

  const handleAddTask = () => {
    if (newTask.trim()) {
      createTaskMutation.mutate({
        text: newTask.trim(),
        order: tasks.length,
      });
    }
  };

  const handleTaskKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddTask();
    }
  };

  const toggleTask = (task: Task) => {
    updateTaskMutation.mutate({
      id: task.id,
      updates: { completed: !task.completed },
    });
  };

  const deleteTask = (id: string) => {
    deleteTaskMutation.mutate(id);
  };

  const completedCount = tasks.filter(task => task.completed).length;

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
        <h3 className="text-white font-medium text-lg">Today's Tasks</h3>
        <span className="text-white opacity-60 text-sm">
          {completedCount}/{tasks.length}
        </span>
      </div>
      
      <div className="space-y-3 mb-4">
        {tasks.map((task) => (
          <div key={task.id} className="flex items-center space-x-3 group">
            <Checkbox
              checked={task.completed}
              onCheckedChange={() => toggleTask(task)}
              className="w-4 h-4 border-white border-opacity-50 data-[state=checked]:bg-zen-sage data-[state=checked]:border-zen-sage"
            />
            <span className={`flex-1 text-sm ${
              task.completed 
                ? "text-white opacity-60 line-through" 
                : "text-white opacity-90"
            }`}>
              {task.text}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="opacity-0 group-hover:opacity-100 text-white hover:text-red-400 transition-all duration-300 p-1 h-auto"
              onClick={() => deleteTask(task.id)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
      
      <div className="flex items-center space-x-2">
        <Input 
          type="text" 
          placeholder="Add new task..." 
          className="flex-1 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg px-3 py-2 text-sm text-white placeholder-white placeholder-opacity-50 focus:outline-none focus:ring-1 focus:ring-zen-sage transition-all duration-300"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyPress={handleTaskKeyPress}
        />
        <Button 
          variant="ghost"
          size="sm"
          className="text-white hover:text-zen-sage transition-colors duration-300 p-2 h-auto"
          onClick={handleAddTask}
          disabled={createTaskMutation.isPending}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
