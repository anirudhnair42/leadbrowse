export interface Company {
    id?: number; // This is typically added by the database
    organization_name: string;
    organization_name_url?: string | null;
    total_funding_amount?: number | null;
    total_funding_amount_currency?: string | null;
    total_funding_amount_usd?: number | null;
    last_funding_type?: string | null;
    founded_date?: string | null; // You might want to use Date if you're parsing this
    founded_date_precision?: string | null;
    number_of_employees?: string | null;
    full_description?: string | null;
    industries?: string | null;
    headquarters_location?: string | null;
    description?: string | null;
    cb_rank_company?: number | null;
    website?: string | null;
    last_funding_date?: string | null; // You might want to use Date if you're parsing this
    founders?: string | null;
    top_5_investors?: string | null;
    diversity_spotlight?: string | null;
    funding_status?: string | null;
    created_at?: string | null; // This might be added by Supabase automatically
  }
  
  export type CompanyCsvData = Omit<Company, 'id' | 'created_at'>;
  
  export type CreateCompany = Omit<Company, 'id' | 'created_at'>;
  
  export type UpdateCompany = Partial<CreateCompany>;