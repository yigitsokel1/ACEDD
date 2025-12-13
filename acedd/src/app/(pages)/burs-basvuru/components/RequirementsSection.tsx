import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { getPageContent } from "@/lib/settings/convenience";

// Color mapping for application steps
const STEP_COLORS: Record<string, string> = {
  blue: "text-blue-600 bg-blue-50",
  green: "text-green-600 bg-green-50",
  purple: "text-purple-600 bg-purple-50",
  emerald: "text-emerald-600 bg-emerald-50",
  indigo: "text-indigo-600 bg-indigo-50",
};

export async function RequirementsSection() {
  const content = await getPageContent("scholarship");
  
  // Get requirements and steps from settings
  // Normalize requirements: ensure it's a string array
  let requirements: string[] = [];
  if (content.requirements && Array.isArray(content.requirements)) {
    // Filter to ensure all items are non-empty strings
    requirements = content.requirements.filter((req: any) => typeof req === 'string' && req.trim().length > 0);
  }
  
  // Get application steps from settings (empty array fallback)
  const applicationSteps = content.applicationSteps || [];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Requirements */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Başvuru Şartları</CardTitle>
              <CardDescription>
                Burs başvurusu yapabilmek için aşağıdaki şartları sağlamanız gerekmektedir.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {requirements.map((requirement: string, index: number) => (
                  <li key={index} className="flex items-start space-x-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4L12 14.01l-3-3"
                      />
                    </svg>
                    <span className="text-gray-700">{requirement}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Application Steps */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Başvuru Süreci</CardTitle>
              <CardDescription>
                Başvuru sürecinin nasıl işlediğini öğrenin.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {applicationSteps.map((step: any) => {
                  const stepColor = STEP_COLORS[step.color] || STEP_COLORS.blue;
                  
                  return (
                    <div key={step.id || step.step} className="flex items-start space-x-4">
                      <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${stepColor}`}>
                        {step.icon ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d={step.icon}
                            />
                          </svg>
                        ) : (
                          <span className="text-sm font-bold">{step.step}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{step.title}</h3>
                        <p className="text-gray-600 text-sm">{step.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
