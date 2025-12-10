import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Banknote } from "lucide-react";
import { getPageContent } from "@/lib/settings/convenience";
import { CopyButton } from "./CopyButton";

export async function BankAccountsSection() {
  const content = await getPageContent("donation");
  
  // Get content from settings (empty array fallback - no constants fallback)
  const introduction = content.introduction || "";
  const bankAccounts = content.bankAccounts || [];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Introduction */}
          {introduction && (
            <div className="text-center mb-12">
              <p className="text-lg text-gray-600 leading-relaxed">
                {introduction}
              </p>
            </div>
          )}

          {/* Bank Accounts */}
          <div className="space-y-8">
            {bankAccounts.map((account: any, index: number) => (
              <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                  <CardTitle className="text-2xl font-bold text-gray-800 flex items-center">
                    <Banknote className="w-8 h-8 mr-3 text-blue-600" />
                    {account.currency} HESABI
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col h-full">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          BANKA
                        </label>
                        <div className="p-4 bg-gray-50 rounded-lg border flex-1 flex items-center">
                          <p className="text-lg font-medium text-gray-900">{account.bank}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col h-full">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          HESAP ADI
                        </label>
                        <div className="p-4 bg-gray-50 rounded-lg border flex-1 flex items-center">
                          <p className="text-lg font-medium text-gray-900">{account.accountName}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        IBAN
                      </label>
                      <div className="flex items-center space-x-3">
                        <div className="flex-1 p-4 bg-gray-50 rounded-lg border">
                          <p className="text-lg font-mono text-gray-900">{account.iban}</p>
                        </div>
                        <CopyButton text={account.iban} fieldId={`iban-${index}`} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
