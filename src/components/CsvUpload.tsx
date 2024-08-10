'use client'

import { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { supabase } from '../lib/supabase';
import Papa from 'papaparse';
import { CompanyCsvData } from '../types/company';

interface CsvUploadProps {
  onUploadSuccess: () => void;
}

const columnNameMap: { [key: string]: keyof CompanyCsvData } = {
  "Organization Name": "organization_name",
  "Organization Name URL": "organization_name_url",
  "Total Funding Amount": "total_funding_amount",
  "Total Funding Amount Currency": "total_funding_amount_currency",
  "Total Funding Amount (in USD)": "total_funding_amount_usd",
  "Last Funding Type": "last_funding_type",
  "Founded Date": "founded_date",
  "Founded Date Precision": "founded_date_precision",
  "Number of Employees": "number_of_employees",
  "Full Description": "full_description",
  "Industries": "industries",
  "Headquarters Location": "headquarters_location",
  "Description": "description",
  "CB Rank (Company)": "cb_rank_company",
  "Website": "website",
  "Last Funding Date": "last_funding_date",
  "Founders": "founders",
  "Top 5 Investors": "top_5_investors",
  "Diversity Spotlight": "diversity_spotlight",
  "Funding Status": "funding_status"
};

export default function CsvUpload({ onUploadSuccess }: CsvUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    Papa.parse(file, {
      complete: async (results) => {
        const headers = results.data[0] as string[];
        const rows = results.data.slice(1) as string[][];

        const data = rows.map(row => {
          let obj: Partial<CompanyCsvData> = {};
          headers.forEach((header, index) => {
            const key = columnNameMap[header.trim()];
            if (key) {
              let value = row[index]?.trim();
              if (value === '' || value.toLowerCase() === 'null') {
                obj[key] = null;
              } else if (['total_funding_amount', 'total_funding_amount_usd', 'cb_rank_company'].includes(key)) {
                obj[key] = value ? parseFloat(value.replace(/[^0-9.-]+/g,"")) : null;
              } else {
                obj[key] = value;
              }
            }
          });
          return obj;
        });

        try {
          const { data: insertedData, error } = await supabase
            .from('companies')
            .insert(data);

          if (error) throw error;
          console.log('Data inserted successfully', insertedData);
          onUploadSuccess();
        } catch (error) {
          console.error('Error inserting data:', error);
          // You can add an error message here
        } finally {
          setUploading(false);
          setFile(null);
        }
      },
      header: false,
      skipEmptyLines: true
    });
  };

  return (
    <div className="flex items-center space-x-4">
      <Input type="file" accept=".csv" onChange={handleFileChange} />
      <Button onClick={handleUpload} disabled={!file || uploading}>
        {uploading ? 'Uploading...' : 'Upload CSV'}
      </Button>
    </div>
  );
}