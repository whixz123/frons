import { Coffee, Target, Zap } from "lucide-react";
import { Button } from "../ui/button";

export function FocusApp() {
  return (
    <div className="p-8 h-full flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50">
      <Coffee className="w-20 h-20 text-amber-600 mb-6" />
      
      <h2 className="text-3xl text-gray-800 mb-2">Focus Mode</h2>
      <p className="text-gray-600 mb-8 text-center max-w-md">
        Enter deep work mode. All notifications will be muted, and only essential apps will be available.
      </p>

      {/* Focus Options */}
      <div className="grid grid-cols-1 gap-4 w-full max-w-md mb-8">
        <div className="p-4 bg-white rounded-xl border border-amber-200 hover:border-amber-400 cursor-pointer transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="text-gray-800 mb-1">Quick Focus</div>
              <div className="text-sm text-gray-500">25 minutes</div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-amber-200 hover:border-amber-400 cursor-pointer transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="text-gray-800 mb-1">Deep Work</div>
              <div className="text-sm text-gray-500">90 minutes</div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-amber-200 hover:border-amber-400 cursor-pointer transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center">
              <Coffee className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="text-gray-800 mb-1">Custom Duration</div>
              <div className="text-sm text-gray-500">Set your own time</div>
            </div>
          </div>
        </div>
      </div>

      <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg px-8 py-6 text-lg">
        Start Focus Session
      </Button>

      <div className="mt-6 text-sm text-gray-500 text-center">
        Tip: Use focus mode to maximize productivity during important tasks
      </div>
    </div>
  );
}
