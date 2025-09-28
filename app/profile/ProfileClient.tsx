"use client";

import { useState } from "react";
import { User } from "@/types/user";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  User as UserIcon,
  Mail,
  Calendar,
  MapPin,
  Plane,
  MessageCircle,
  Settings,
  Edit3,
  Award,
  TrendingUp,
  Clock,
} from "lucide-react";
import Link from "next/link";

interface ProfileClientProps {
  user: User;
}

export default function ProfileClient({ user }: ProfileClientProps) {

  const displayName = user.full_name || user.email.split("@")[0];
  const initials = displayName
    .split(" ")
    .map((name: string) => name[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const getSubscriptionBadgeVariant = (plan: string) => {
    switch (plan) {
      case "premium":
        return "default";
      case "enterprise":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getSubscriptionColor = (plan: string) => {
    switch (plan) {
      case "premium":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "enterprise":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getRemainingMessages = () => {
    if (
      (user.subscription_plan === "premium" ||
        user.subscription_plan === "enterprise") &&
      user.subscription_status === "active"
    ) {
      return "Unlimited";
    }
    return Math.max(0, user.messages_limit - user.messages_used);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
            <Link href="/settings">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Edit3 className="w-4 h-4" />
                Edit Profile
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                      <Plane className="w-10 h-10 text-white transform rotate-12" />
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                  </div>

                  {/* Name and Email */}
                  <div className="space-y-1">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {displayName}
                    </h2>
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {user.email}
                    </p>
                  </div>

                  {/* Subscription Badge */}
                  <Badge
                    className={`px-3 py-1 text-sm font-medium ${getSubscriptionColor(
                      user.subscription_plan
                    )}`}
                    variant={getSubscriptionBadgeVariant(user.subscription_plan)}
                  >
                    <Award className="w-4 h-4 mr-1" />
                    {user.subscription_plan.charAt(0).toUpperCase() +
                      user.subscription_plan.slice(1)}{" "}
                      Plan
                  </Badge>

                  {/* Member Since */}
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500 bg-gray-50 rounded-full px-3 py-1.5">
                    <Calendar className="w-4 h-4" />
                    <span>Member since {new Date(user.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm mt-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/chat">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3 h-11"
                  >
                    <MessageCircle className="w-4 h-4" />
                    My Chats
                  </Button>
                </Link>
                <Link href="/forecast">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3 h-11"
                  >
                    <Plane className="w-4 h-4" />
                    Turbulence Forecast
                  </Button>
                </Link>
                <Link href="/settings">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3 h-11"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Account Overview */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <UserIcon className="w-5 h-5" />
                  Account Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">
                      Full Name
                    </label>
                    <p className="text-gray-900 font-medium">
                      {user.full_name || "Not provided"}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">
                      Hometown
                    </label>
                    <p className="text-gray-900 font-medium flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {user.hometown || "Not provided"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Usage Statistics */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Usage Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                      <MessageCircle className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        {getRemainingMessages()}
                      </p>
                      <p className="text-sm text-gray-600">Messages from Larry</p>
                    </div>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                      <Clock className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        {user.messages_used}
                      </p>
                      <p className="text-sm text-gray-600">Sent Messages</p>
                    </div>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                      <Plane className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">0</p>
                      <p className="text-sm text-gray-600">Flights Tracked</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity Placeholder */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Plane className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">No recent activity yet</p>
                  <p className="text-sm text-gray-500">
                    Your flight tracking and turbulence forecasts will appear here
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
