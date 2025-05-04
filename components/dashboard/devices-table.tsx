"use client";

import { DataTable } from "@/components/dashboard/data-table";
import { formatNumber, formatPercentage } from "@/lib/utils";
import { Laptop, Smartphone, Tablet } from "lucide-react";

// Define the type for device data
export interface DeviceData {
  device: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

// Define the columns for the devices table
export const deviceColumns = [
  {
    accessorKey: "device" as keyof DeviceData,
    header: "Device",
    cell: (row: DeviceData) => {
      const device = row.device;
      const deviceName = getDeviceName(device);
      const DeviceIcon = getDeviceIcon(device);
      
      return (
        <div className="font-medium flex items-center gap-2">
          <DeviceIcon className="h-4 w-4" />
          <span>{deviceName}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "clicks" as keyof DeviceData,
    header: "Clicks",
    cell: (row: DeviceData) => formatNumber(row.clicks),
  },
  {
    accessorKey: "impressions" as keyof DeviceData,
    header: "Impressions",
    cell: (row: DeviceData) => formatNumber(row.impressions),
  },
  {
    accessorKey: "ctr" as keyof DeviceData,
    header: "CTR",
    cell: (row: DeviceData) => formatPercentage(row.ctr),
  },
  {
    accessorKey: "position" as keyof DeviceData,
    header: "Position",
    cell: (row: DeviceData) => {
      const position = row.position;
      return position.toFixed(1);
    },
  },
];

// Helper function to get device name from device code
function getDeviceName(deviceCode: string): string {
  const devices: Record<string, string> = {
    "DESKTOP": "Desktop",
    "MOBILE": "Mobile",
    "TABLET": "Tablet",
  };
  
  return devices[deviceCode.toUpperCase()] || deviceCode;
}

// Helper function to get device icon
function getDeviceIcon(deviceCode: string) {
  const deviceMap: Record<string, any> = {
    "DESKTOP": Laptop,
    "MOBILE": Smartphone,
    "TABLET": Tablet,
  };
  
  return deviceMap[deviceCode.toUpperCase()] || Laptop;
}

interface DevicesTableProps {
  data: DeviceData[];
  pageSize?: number;
}

export function DevicesTable({ data, pageSize = 10 }: DevicesTableProps) {
  return (
    <DataTable
      columns={deviceColumns}
      data={data}
      pageSize={pageSize}
      showPagination={true}
    />
  );
}
