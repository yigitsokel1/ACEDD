import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { DASHBOARD_STATS } from "../constants";

export function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {DASHBOARD_STATS.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <p className={`text-xs ${
              stat.changeType === "positive" ? "text-green-600" : "text-red-600"
            }`}>
              {stat.change} geçen aydan
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
