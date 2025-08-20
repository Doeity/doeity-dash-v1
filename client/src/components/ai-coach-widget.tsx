import { useQuery } from "@tanstack/react-query";
import { Brain, AlertTriangle, Info, CheckCircle } from "lucide-react";
import type { AIInsight } from "@shared/schema";

export default function AICoachWidget() {
  const today = new Date().toISOString().split('T')[0];

  const { data: insights = [], isLoading } = useQuery<AIInsight[]>({
    queryKey: [`/api/ai-insights?date=${today}`],
  });

  if (isLoading) {
    return (
      <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white border-opacity-20">
        <div className="animate-pulse">
          <div className="h-6 bg-white bg-opacity-20 rounded mb-4"></div>
          <div className="space-y-3">
            {[1, 2].map(i => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-white bg-opacity-20 rounded"></div>
                <div className="h-3 bg-white bg-opacity-20 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-400" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      case 'info': return <Info className="h-4 w-4 text-blue-400" />;
      default: return <CheckCircle className="h-4 w-4 text-green-400" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-red-400 bg-red-400 bg-opacity-10';
      case 'warning': return 'border-yellow-400 bg-yellow-400 bg-opacity-10';
      case 'info': return 'border-blue-400 bg-blue-400 bg-opacity-10';
      default: return 'border-green-400 bg-green-400 bg-opacity-10';
    }
  };

  const getCategoryEmoji = (category: string) => {
    switch (category) {
      case 'productivity': return '📈';
      case 'focus': return '🎯';
      case 'habits': return '🔄';
      case 'time_management': return '⏰';
      default: return '💡';
    }
  };

  return (
    <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white border-opacity-20 hover:translate-y-[-2px] transition-transform duration-300">
      <div className="flex items-center space-x-2 mb-4">
        <Brain className="h-5 w-5 text-white opacity-80" />
        <h3 className="text-white font-medium text-lg">AI Coach</h3>
      </div>

      {insights.length === 0 ? (
        <div className="text-center py-4">
          <div className="text-4xl mb-2">🤖</div>
          <p className="text-white opacity-60 text-sm">
            Continue using the dashboard to get personalized insights!
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-48 overflow-y-auto">
          {insights.map((insight) => (
            <div 
              key={insight.id} 
              className={`p-3 rounded-lg border ${getSeverityColor(insight.severity)} backdrop-blur-sm`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <span className="text-sm">{getCategoryEmoji(insight.category)}</span>
                  {getSeverityIcon(insight.severity)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm leading-relaxed">
                    {insight.insight}
                  </p>
                  {insight.actionable && (
                    <div className="mt-2">
                      <span className="inline-flex items-center px-2 py-1 text-xs bg-white bg-opacity-20 text-white rounded-full">
                        Actionable
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 pt-3 border-t border-white border-opacity-20">
        <p className="text-white opacity-50 text-xs text-center">
          Insights update based on your daily activity patterns
        </p>
      </div>
    </div>
  );
}