import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Eraser } from "lucide-react";

export default function NotesWidget() {
  const [localNotes, setLocalNotes] = useState("");

  const { data: settings } = useQuery({
    queryKey: ["/api/settings"],
  });

  const updateSettingsMutation = useMutation({
    mutationFn: (data: { quickNotes: string }) => 
      apiRequest("PATCH", "/api/settings", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
    },
  });

  useEffect(() => {
    if ((settings as any)?.quickNotes !== undefined) {
      setLocalNotes((settings as any).quickNotes);
    }
  }, [(settings as any)?.quickNotes]);

  const handleNotesChange = (value: string) => {
    setLocalNotes(value);
    // Debounce the API call
    const timer = setTimeout(() => {
      updateSettingsMutation.mutate({ quickNotes: value });
    }, 1000);

    return () => clearTimeout(timer);
  };

  const handleClearNotes = () => {
    setLocalNotes("");
    updateSettingsMutation.mutate({ quickNotes: "" });
  };

  return (
    <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white border-opacity-20 hover:translate-y-[-2px] transition-transform duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-medium text-lg">Quick Notes</h3>
        <Button
          variant="ghost"
          size="sm"
          className="text-white opacity-60 hover:opacity-100 transition-opacity duration-300 p-1 h-auto"
          onClick={handleClearNotes}
        >
          <Eraser className="h-4 w-4" />
        </Button>
      </div>
      <Textarea 
        placeholder="Jot down your thoughts..."
        className="w-full h-32 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg px-3 py-2 text-sm text-white placeholder-white placeholder-opacity-50 focus:outline-none focus:ring-1 focus:ring-zen-sage transition-all duration-300 resize-none"
        value={localNotes}
        onChange={(e) => handleNotesChange(e.target.value)}
      />
      <div className="mt-2 text-xs text-white opacity-50">
        Auto-saved locally
      </div>
    </div>
  );
}
