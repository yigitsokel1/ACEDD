"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui";
import { Copy, CheckCircle, Banknote } from "lucide-react";
import { BANK_ACCOUNTS, DONATION_CONTENT } from "../constants";

export function BankAccountsSection() {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Introduction */}
          <div className="text-center mb-12">
            <p className="text-lg text-gray-600 leading-relaxed">
              {DONATION_CONTENT.introduction}
            </p>
          </div>

          {/* Bank Accounts */}
          <div className="space-y-8">
            {BANK_ACCOUNTS.map((account, index) => (
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
                        <Button
                          onClick={() => copyToClipboard(account.iban, `iban-${index}`)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                        >
                          {copiedField === `iban-${index}` ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : (
                            <Copy className="w-5 h-5" />
                          )}
                        </Button>
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

