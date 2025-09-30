"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Plane, 
  User, 
  Wind, 
  Heart, 
  Settings, 
  Home,
  MessageCircle,
  Menu
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/utils/cn";

interface MobileSidebarToggleProps {
  onQuickAction: (action: string) => void;
}

export function MobileSidebarToggle({ onQuickAction }: MobileSidebarToggleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const quickActions = [
    {
      id: "turbulence",
      label: "Check Turbulence",
      icon: Wind,
      description: "Get turbulence forecast",
      action: () => {
        onQuickAction("Can you check the turbulence forecast for my flight?");
        setIsOpen(false);
      }
    },
    {
      id: "plane-info",
      label: "Tell me about my plane",
      icon: Plane,
      description: "Learn about aircraft type",
      action: () => {
        onQuickAction("Can you tell me about my plane? What type of aircraft am I flying on?");
        setIsOpen(false);
      }
    },
    {
      id: "breathing",
      label: "Breathing Exercise",
      icon: Heart,
      description: "Guided relaxation",
      action: () => {
        onQuickAction("Can you guide me through a breathing exercise to help with my flight anxiety?");
        setIsOpen(false);
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
        setIsOpen(false);
      }
    },
    {
      id: "turbulence-page",
      label: "Turbulence Forecast",
      icon: Wind,
      action: () => {
        router.push("/turbulence");
        setIsOpen(false);
      }
    },
    {
      id: "forecast-page",
      label: "Weather Forecast",
      icon: MessageCircle,
      action: () => {
        router.push("/forecast");
        setIsOpen(false);
      }
    },
    {
      id: "profile",
      label: "My Profile",
      icon: User,
      action: () => {
        router.push("/profile");
        setIsOpen(false);
      }
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      action: () => {
        router.push("/settings");
        setIsOpen(false);
      }
    }
  ];

  return (
    <>
      {/* Floating Action Button - only visible on mobile */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-4 sm:hidden z-20 rounded-full w-12 h-12 p-0 shadow-lg bg-blue-600 hover:bg-blue-700"
        size="sm"
      >
        <Menu className="w-5 h-5" />
      </Button>

      {/* Mobile Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Quick Actions</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Quick Actions */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Chat with Larry</h3>
              <div className="space-y-2">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <Button
                      key={action.id}
                      variant="outline"
                      className="w-full justify-start p-3 h-auto"
                      onClick={action.action}
                    >
                      <Icon className="w-5 h-5 text-blue-600 mr-3" />
                      <div className="text-left">
                        <div className="font-medium">{action.label}</div>
                        <div className="text-sm text-gray-500">{action.description}</div>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Navigation */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Navigate</h3>
              <div className="space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.id}
                      variant="ghost"
                      className="w-full justify-start p-3"
                      onClick={item.action}
                    >
                      <Icon className="w-5 h-5 text-gray-600 mr-3" />
                      <span>{item.label}</span>
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
