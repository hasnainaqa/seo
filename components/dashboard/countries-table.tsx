"use client";

import { DataTable } from "@/components/dashboard/data-table";
import { formatNumber, formatPercentage } from "@/lib/utils";
import { Globe } from "lucide-react";

// Define the type for country data
export interface CountryData {
  country: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

// Define the columns for the countries table
export const countryColumns = [
  {
    accessorKey: "country" as keyof CountryData,
    header: "Country",
    cell: (row: CountryData) => {
      const country = row.country;
      
      // Handle unknown country case
      if (country === "Unknown") {
        return (
          <div className="font-medium text-muted-foreground">
            Unknown country
          </div>
        );
      }
      
      // Get country name from code
      const countryName = getCountryName(country);
      
      return (
        <div className="font-medium flex items-center gap-2">
          <span className="fi fi-${country.toLowerCase()}"></span>
          {countryName}
        </div>
      );
    },
  },
  {
    accessorKey: "clicks" as keyof CountryData,
    header: "Clicks",
    cell: (row: CountryData) => formatNumber(row.clicks),
  },
  {
    accessorKey: "impressions" as keyof CountryData,
    header: "Impressions",
    cell: (row: CountryData) => formatNumber(row.impressions),
  },
  {
    accessorKey: "ctr" as keyof CountryData,
    header: "CTR",
    cell: (row: CountryData) => formatPercentage(row.ctr),
  },
  {
    accessorKey: "position" as keyof CountryData,
    header: "Position",
    cell: (row: CountryData) => {
      const position = row.position;
      return position.toFixed(1);
    },
  },
];

// Helper function to get country name from country code
function getCountryName(countryCode: string): string {
  const countries: Record<string, string> = {
    // ISO 3166-1 alpha-3 codes
    "usa": "United States",
    "gbr": "United Kingdom",
    "can": "Canada",
    "aus": "Australia",
    "deu": "Germany",
    "fra": "France",
    "ind": "India",
    "jpn": "Japan",
    "chn": "China",
    "bra": "Brazil",
    "esp": "Spain",
    "ita": "Italy",
    "nld": "Netherlands",
    "rus": "Russia",
    "mex": "Mexico",
    "kor": "South Korea",
    "swe": "Sweden",
    "nor": "Norway",
    "dnk": "Denmark",
    "fin": "Finland",
    "prt": "Portugal",
    "grc": "Greece",
    "tur": "Turkey",
    "zaf": "South Africa",
    "nzl": "New Zealand",
    "arg": "Argentina",
    "chl": "Chile",
    "col": "Colombia",
    "per": "Peru",
    "ven": "Venezuela",
    "brb": "Barbados",
    "jam": "Jamaica",
    "bhs": "Bahamas",
    "cub": "Cuba",
    "dom": "Dominican Republic",
    "hti": "Haiti",
    "pri": "Puerto Rico",
    "tto": "Trinidad and Tobago",
    
    // ISO 3166-1 alpha-2 codes (for compatibility)
    "us": "United States",
    "gb": "United Kingdom",
    "ca": "Canada",
    "au": "Australia",
    "de": "Germany",
    "fr": "France",
    "in": "India",
    "jp": "Japan",
    "cn": "China",
    "br": "Brazil",
    "es": "Spain",
    "it": "Italy",
    "nl": "Netherlands",
    "ru": "Russia",
    "mx": "Mexico",
    "kr": "South Korea",
    "se": "Sweden",
    "no": "Norway",
    "dk": "Denmark",
    "fi": "Finland",
    "pt": "Portugal",
    "gr": "Greece",
    "tr": "Turkey",
    "za": "South Africa",
    "nz": "New Zealand",
    "ar": "Argentina",
    "cl": "Chile",
    "co": "Colombia",
    "pe": "Peru",
    "ve": "Venezuela",
    "bb": "Barbados",
    "jm": "Jamaica",
    "bs": "Bahamas",
    "cu": "Cuba",
    "do": "Dominican Republic",
    "ht": "Haiti",
    "pr": "Puerto Rico",
    "tt": "Trinidad and Tobago",
  };
  
  // Return the country name if found, otherwise return the country code
  return countries[countryCode.toLowerCase()] || countryCode;
}

interface CountriesTableProps {
  data: CountryData[];
  pageSize?: number;
}

export function CountriesTable({ data, pageSize = 10 }: CountriesTableProps) {
  // Show empty state if no data
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <Globe className="h-8 w-8 text-muted-foreground mb-2" />
        <h3 className="text-lg font-medium">No country data available</h3>
        <p className="text-sm text-muted-foreground">
          Try adjusting your date range to see more data.
        </p>
      </div>
    );
  }
  
  return (
    <DataTable
      columns={countryColumns}
      data={data}
      pageSize={pageSize}
      showPagination={true}
    />
  );
}
