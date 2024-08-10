'use client'

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Company } from '../types/company';
import axios from 'axios';
import { CompanyCard } from './CompanyCard';

interface EmailComposerProps {
  selectedCompany: Company | null;
}

export default function EmailComposer({ selectedCompany }: EmailComposerProps) {
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (selectedCompany) {
      setEmailSubject(`Opportunity to work with ${selectedCompany.organization_name}`);
    }
  }, [selectedCompany]);

  const generateEmail = async () => {
    if (!selectedCompany || !selectedCompany.website) {
      alert('No company selected or website not available');
      return;
    }

    setIsGenerating(true);

    try {
      // Step 1: Scrape the website
      const scrapeResponse = await axios.post('/api/scrape-website', { url: selectedCompany.website });
      const websiteContent = scrapeResponse.data.text;

      // Step 2: Generate email using OpenAI
      const generateResponse = await axios.post('/api/generate-email', {
        companyInfo: JSON.stringify(selectedCompany),
        websiteContent
      });

      setEmailBody(generateResponse.data.email);
    } catch (error) {
      console.error('Error generating email:', error);
      alert('Failed to generate email. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!selectedCompany) {
    return <div>Select a company to compose an email.</div>;
  }

  return (
    <div className="space-y-4">
      <CompanyCard company={selectedCompany} />
      <h2 className="text-xl font-semibold">Compose Email</h2>
      <Input
        value={emailSubject}
        onChange={(e) => setEmailSubject(e.target.value)}
        placeholder="Subject"
        className="w-full p-2 border rounded"
      />
      <Textarea
        value={emailBody}
        onChange={(e) => setEmailBody(e.target.value)}
        rows={10}
        className="w-full p-2 border rounded"
      />
      <div className="flex space-x-2">
        <Button onClick={generateEmail} disabled={isGenerating}>
          {isGenerating ? 'Generating...' : 'Generate Email'}
        </Button>
        <Button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Send Email
        </Button>
      </div>
    </div>
  );
}