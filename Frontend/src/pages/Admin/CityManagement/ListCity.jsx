import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, MapPin, Mail, Phone } from "lucide-react";

const TheatreDetailsTable = ({ theatreOwner }) => {
  const details = [
    {
      label: "Theatre Name",
      value: theatreOwner.theatreName || "Not Set",
      icon: <Building2 className="h-4 w-4 text-gray-500" />,
    },
    {
      label: "Location",
      value: theatreOwner.location || "Not Set",
      icon: <MapPin className="h-4 w-4 text-gray-500" />,
    },
    {
      label: "State",
      value: theatreOwner.state || "Not Set",
      icon: <MapPin className="h-4 w-4 text-gray-500" />,
    },
    {
      label: "Pincode",
      value: theatreOwner.pincode || "Not Set",
      icon: <Mail className="h-4 w-4 text-gray-500" />,
    },
  ];

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Theatre Details</CardTitle>
        <CardDescription>Overview of your theatre information</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>Property</TableHead>
              <TableHead>Details</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {details.map((detail, index) => (
              <TableRow key={index} className="hover:bg-gray-50">
                <TableCell className="w-12">{detail.icon}</TableCell>
                <TableCell className="font-medium">{detail.label}</TableCell>
                <TableCell>{detail.value}</TableCell>
                <TableCell className="text-right">
                  {detail.label === "Theatre Name" && (
                    <Badge 
                      className={`${getStatusColor(theatreOwner.ownership_status)}`}
                    >
                      {theatreOwner.ownership_status || "Not Set"}
                    </Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TheatreDetailsTable;