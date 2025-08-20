import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SettingsPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBackgroundChange: (background: string) => void;
  currentBackground: string;
}

const BACKGROUND_OPTIONS = [
  {
    name: "Mountain Lake",
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
  },
  {
    name: "Forest Path",
    url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
  },
  {
    name: "Ocean Waves",
    url: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
  },
  {
    name: "Desert Sunset",
    url: "https://images.unsplash.com/photo-1516947786822-67505e0d4b3d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
  },
  {
    name: "Lavender Field",
    url: "https://images.unsplash.com/photo-1498307833015-e7b400441eb8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
  },
  {
    name: "Northern Lights",
    url: "https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
  }
];

export default function SettingsPanel({ 
  open, 
  onOpenChange, 
  onBackgroundChange, 
  currentBackground 
}: SettingsPanelProps) {
  const [userName, setUserName] = useState("");
  const [customBackground, setCustomBackground] = useState("");

  const { data: settings } = useQuery({
    queryKey: ["/api/settings"],
  });

  const updateSettingsMutation = useMutation({
    mutationFn: (data: { userName?: string; backgroundImage?: string }) => 
      apiRequest("PATCH", "/api/settings", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
    },
  });

  const handleUserNameChange = () => {
    if (userName.trim()) {
      updateSettingsMutation.mutate({ userName: userName.trim() });
    }
  };

  const handleCustomBackground = () => {
    if (customBackground.trim()) {
      onBackgroundChange(customBackground.trim());
      updateSettingsMutation.mutate({ backgroundImage: customBackground.trim() });
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-96 bg-white/95 backdrop-blur-sm">
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
          <SheetDescription>
            Customize your mindful new tab experience
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6 space-y-6">
          {/* User Name */}
          <div className="space-y-2">
            <Label htmlFor="username">Display Name</Label>
            <div className="flex space-x-2">
              <Input
                id="username"
                placeholder={(settings as any)?.userName || "Enter your name"}
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleUserNameChange()}
              />
              <Button onClick={handleUserNameChange} disabled={!userName.trim()}>
                Save
              </Button>
            </div>
          </div>

          {/* Background Images */}
          <div className="space-y-3">
            <Label>Background Images</Label>
            <div className="grid grid-cols-2 gap-3">
              {BACKGROUND_OPTIONS.map((bg) => (
                <button
                  key={bg.name}
                  className={`relative w-full h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                    currentBackground === bg.url 
                      ? "border-zen-sage shadow-lg scale-105" 
                      : "border-gray-200 hover:border-zen-sage"
                  }`}
                  onClick={() => onBackgroundChange(bg.url)}
                >
                  <img 
                    src={bg.url} 
                    alt={bg.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 flex items-end">
                    <span className="text-white text-xs p-2 font-medium">
                      {bg.name}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Background URL */}
          <div className="space-y-2">
            <Label htmlFor="custom-bg">Custom Background URL</Label>
            <div className="flex space-x-2">
              <Input
                id="custom-bg"
                placeholder="Enter image URL..."
                value={customBackground}
                onChange={(e) => setCustomBackground(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleCustomBackground()}
              />
              <Button onClick={handleCustomBackground} disabled={!customBackground.trim()}>
                Apply
              </Button>
            </div>
          </div>

          {/* Reset Options */}
          <div className="space-y-2 pt-4 border-t">
            <Label>Reset Options</Label>
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  updateSettingsMutation.mutate({ quickNotes: "" } as any);
                }}
              >
                Clear All Notes
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
                  // Clear completed tasks
                }}
              >
                Clear Completed Tasks
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
