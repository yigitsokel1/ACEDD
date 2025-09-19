import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui";
import { Eye, CheckCircle, XCircle, Clock } from "lucide-react";
import { RECENT_APPLICATIONS } from "../constants";

const getStatusIcon = (status: string) => {
  switch (status) {
    case "approved":
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case "rejected":
      return <XCircle className="h-4 w-4 text-red-600" />;
    case "under_review":
      return <Clock className="h-4 w-4 text-blue-600" />;
    default:
      return <Clock className="h-4 w-4 text-yellow-600" />;
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "approved":
      return "Onaylandı";
    case "rejected":
      return "Reddedildi";
    case "under_review":
      return "İnceleniyor";
    default:
      return "Beklemede";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "approved":
      return "bg-green-100 text-green-800";
    case "rejected":
      return "bg-red-100 text-red-800";
    case "under_review":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-yellow-100 text-yellow-800";
  }
};

export function RecentApplications() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Son Başvurular</CardTitle>
        <CardDescription>
          En son yapılan burs başvuruları
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {RECENT_APPLICATIONS.map((application) => (
            <div
              key={application.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  {getStatusIcon(application.status)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {application.name}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {application.school} - {application.grade}
                  </p>
                  <p className="text-xs text-gray-400">
                    Not Ortalaması: {application.gpa} | Başvuru: {application.appliedDate}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                    application.status
                  )}`}
                >
                  {getStatusText(application.status)}
                </span>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-1" />
                  Görüntüle
                </Button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <Button variant="outline" className="w-full">
            Tüm Başvuruları Görüntüle
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
