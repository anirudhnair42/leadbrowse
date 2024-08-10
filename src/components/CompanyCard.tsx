import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Company } from '../types/company';
import axios from 'axios';

interface CompanyCardProps {
  company: Company;
}

export function CompanyCard({ company }: CompanyCardProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);

  useEffect(() => {
    const generateSummary = async () => {
      if (!company.website) return;

      setIsLoadingSummary(true);
      try {
        const response = await axios.post('/api/generate-summary', {
          companyInfo: JSON.stringify(company),
          website: company.website
        });
        setSummary(response.data.summary);
      } catch (error) {
        console.error('Error generating summary:', error);
        setSummary('Failed to generate summary.');
      } finally {
        setIsLoadingSummary(false);
      }
    };

    generateSummary();
  }, [company]);

  return (
    <Card className="w-full mb-4">
      <CardHeader>
        <CardTitle>{company.organization_name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <strong>Summary:</strong>
          {isLoadingSummary ? (
            <p>Generating summary...</p>
          ) : (
            <p>{summary || 'No summary available.'}</p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p><strong>Total Funding:</strong> {company.total_funding_amount} {company.total_funding_amount_currency}</p>
            <p><strong>Funding Status:</strong> {company.funding_status}</p>
            <p><strong>Last Funding Type:</strong> {company.last_funding_type}</p>
            <p><strong>Last Funding Date:</strong> {company.last_funding_date}</p>
            <p><strong>Founded:</strong> {company.founded_date} ({company.founded_date_precision})</p>
            <p><strong>Employees:</strong> {company.number_of_employees}</p>
          </div>
          <div>
            <p><strong>Industry:</strong> {company.industries}</p>
            <p><strong>Location:</strong> {company.headquarters_location}</p>
            <p><strong>Website:</strong> <a href={company.website ?? ""} target="_blank" rel="noopener noreferrer">{company.website}</a></p>
            <p><strong>CB Rank:</strong> {company.cb_rank_company}</p>
            <p><strong>Founders:</strong> {company.founders}</p>
            <p><strong>Top Investors:</strong> {company.top_5_investors}</p>
          </div>
        </div>
        <div className="mt-4">
          <strong>Description:</strong>
          <p>{company.description}</p>
        </div>
      </CardContent>
    </Card>
  );
}