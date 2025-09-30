"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Plane, 
  User, 
  Wind, 
  Heart, 
  Settings, 
  Home,
  ChevronLeft,
  ChevronRight,
  MessageCircle
} from "lucide-react";
import { cn } from "@/utils/cn";

interface ChatSidebarProps {
  onQuickAction: (action: string) => void;
  className?: string;
}

export function ChatSidebar({ onQuickAction, className }: ChatSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const router = useRouter();

  const quickActions = [
    {
      id: "turbulence",
      label: "Check Turbulence",
      icon: Wind,
      description: "Get turbulence forecast",
      action: () => {
        onQuickAction("Can you check the turbulence forecast for my flight?");
      }
    },
    {
      id: "plane-info",
      label: "Tell me about my plane",
      icon: Plane,
      description: "Learn about aircraft type",
      action: () => {
        onQuickAction("Can you tell me about my plane? What type of aircraft am I flying on?");
      }
    },
    {
      id: "breathing",
      label: "Breathing Exercise",
      icon: Heart,
      description: "Guided relaxation",
      action: () => {
        onQuickAction("Can you guide me through a breathing exercise to help with my flight anxiety?");
      }
    },
    {
      id: "profile",
      label: "My Profile",
      icon: User,
      description: "View profile settings",
      action: () => {
        router.push("/profile");
      }
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      description: "App preferences",
      action: () => {
        router.push("/settings");
      }
    }
  ];

  const navigationItems = [
    {
      id: "home",
      label: "Home",
      icon: Home,
      action: () => {
        router.push("/");
      }
    },
    {
      id: "turbulence-page",
      label: "Turbulence Forecast",
      icon: Wind,
      action: () => {
        router.push("/turbulence");
      }
    },
    {
      id: "forecast-page",
      label: "Weather Forecast",
      icon: MessageCircle,
      action: () => {
        router.push("/forecast");
      }
    }
  ];

  return (
    <div className={cn(
      "flex flex-col h-full bg-white border-r border-gray-200 transition-all duration-300",
      isCollapsed ? "w-16" : "w-80 lg:w-80 md:w-64 sm:w-56",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!isCollapsed && (
          <h2 className="text-lg font-semibold text-gray-900 hidden sm:block">Quick Actions</h2>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-4">
        {!isCollapsed && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700 mb-3 hidden sm:block">Chat with Larry</h3>
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Card key={action.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-2 sm:p-3" onClick={action.action}>
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className="flex-shrink-0">
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">{action.label}</p>
                        <p className="text-xs text-gray-500 hidden sm:block">{action.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {isCollapsed && (
          <div className="space-y-2">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.id}
                  variant="ghost"
                  size="sm"
                  onClick={action.action}
                  className="w-full justify-center p-3"
                  title={action.label}
                >
                  <Icon className="w-5 h-5 text-blue-600" />
                </Button>
              );
            })}
          </div>
        )}

        {/* Navigation */}
        <div className="pt-4 border-t border-gray-200">
          {!isCollapsed && (
            <h3 className="text-sm font-medium text-gray-700 mb-3 hidden sm:block">Navigate</h3>
          )}
          <div className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  size="sm"
                  onClick={item.action}
                  className={cn(
                    "w-full justify-start",
                    isCollapsed ? "justify-center p-2 sm:p-3" : "p-2 sm:p-3"
                  )}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                  {!isCollapsed && <span className="ml-2 sm:ml-3 text-xs sm:text-sm truncate">{item.label}</span>}
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
