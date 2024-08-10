'use client'

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import FundingUpdates from '../../components/FundingUpdates';
import EmailComposer from '../../components/EmailComposer';
import CsvUpload from '../../components/CsvUpload';
import { Company } from '../../types/company';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('last_funding_date', { ascending: false })
        .limit(10);

      if (error) throw error;
      setCompanies(data || []);
    } catch (error) {
      console.error('Error fetching companies:', error);
      setError('Failed to fetch companies. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="p-4">
        <CsvUpload onUploadSuccess={fetchCompanies} />
      </div>
      <div className="flex flex-1">
        <div className="w-1/3 p-4 overflow-y-auto">
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <FundingUpdates 
              companies={companies} 
              onSelectCompany={setSelectedCompany}
            />
          )}
        </div>
        <div className="w-2/3 p-4 border-l overflow-y-auto">
          <EmailComposer selectedCompany={selectedCompany} />
        </div>
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  );
}