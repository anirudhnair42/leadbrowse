'use client'

import React from 'react';
import { Company } from '../types/company';

interface FundingUpdatesProps {
  companies: Company[] | undefined;
  onSelectCompany: (company: Company) => void;
}

export default function FundingUpdates({ companies, onSelectCompany }: FundingUpdatesProps) {
  if (!companies || companies.length === 0) {
    return <div>No funding updates available. Try uploading some data!</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Recent Funding Updates</h2>
      <ul className="space-y-4">
        {companies.map((company) => (
          <li 
            key={company.id}
            className="p-4 border rounded hover:bg-gray-100 cursor-pointer"
            onClick={() => onSelectCompany(company)}
          >
            <h3 className="font-bold">{company.organization_name}</h3>
            <p>Raised: {company.total_funding_amount} {company.total_funding_amount_currency}</p>
            <p>Founded: {company.founded_date ? new Date(company.founded_date).toLocaleDateString() : 'N/A'}</p>
            <p>Type: {company.last_funding_type}</p>
            <p>Industries: {company.industries}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}