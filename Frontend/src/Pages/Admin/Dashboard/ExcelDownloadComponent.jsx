import React, { useEffect, useState } from 'react';
import { Download, Calendar, Building, Filter, FileSpreadsheet, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import apiAdmin from '@/Axios/api';

const ExcelDownloadComponent = () => {
    const [isDownloading, setIsDownloading] = useState(false);
    const [theatres, setTheatres] = useState([]);
    const [downloadParams, setDownloadParams] = useState({
        startDate: '',
        endDate: '',
        theatreId: '',
        reportType: 'all'
    });


    useEffect(() => {

        const fetchActiveTheatres = async() => {
            try{
                const res = await apiAdmin.get('get-active-theatres/')
                console.log(res.data , 'response data')
                setTheatres(res.data)
            }catch(error){
                console.log('error fetching theatres' , error)
            }
        }
        fetchActiveTheatres()

    },[])



  const handleInputChange = (field, value) => {
    setDownloadParams(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const downloadExcelReport = async () => {
    setIsDownloading(true);
    
    try {
      // Build query parameters
      const params = new URLSearchParams();
      
      if (downloadParams.startDate) {
        params.append('start_date', downloadParams.startDate);
      }
      if (downloadParams.endDate) {
        params.append('end_date', downloadParams.endDate);
      }
      if (downloadParams.theatreId && downloadParams.theatreId !== 'all') {
        params.append('theatre_id', downloadParams.theatreId);
      }
      if (downloadParams.reportType) {
        params.append('report_type', downloadParams.reportType);
      }
      
      // Make API call to download Excel
      const response = await apiAdmin.get(`report-xldownload/?${params.toString()}`,{
        responseType : 'blob'
      });
      console.log('response', response.data );
      console.log('respone status', response.status);
    //   if (!response.ok) {
    //     throw new Error('Failed to download report');
    //   }
      
      // Get filename from response headers
      let filename = 'theatre_report.xlsx';
      const contentDisposition = response.headers['content-disposition'];
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }
      
      // Create blob and download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      alert('Report downloaded successfully!');
      
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download report. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const downloadQuickReport = async (reportType) => {
    setIsDownloading(true);
    
    try {
      const params = new URLSearchParams();
      params.append('report_type', reportType);
      
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
      
      params.append('start_date', startDate.toISOString().split('T')[0]);
      params.append('end_date', endDate.toISOString().split('T')[0]);
      
      const response = await apiAdmin.get(`report-xldownload/?${params.toString()}`,{
        responseType : 'blob'
      });
      
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = `${reportType}_report_${startDate.toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      alert(`${reportType} report downloaded successfully!`);
      
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download report. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  console.log(theatres , 'active theatres')

  return (
    <div className="space-y-6">
      {/* Quick Download Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" 
              onClick={() => downloadQuickReport('theatre_summary')}>
          <CardContent className="p-6 text-center">
            <FileSpreadsheet className="h-12 w-12 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Theatre Summary</h3>
            <p className="text-sm text-gray-600">Revenue, tickets, and performance by theatre</p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => downloadQuickReport('seat_analysis')}>
          <CardContent className="p-6 text-center">
            <FileSpreadsheet className="h-12 w-12 text-green-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Seat Category Analysis</h3>
            <p className="text-sm text-gray-600">Sales breakdown by seat categories</p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => downloadQuickReport('monthly_breakdown')}>
          <CardContent className="p-6 text-center">
            <FileSpreadsheet className="h-12 w-12 text-purple-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Monthly Breakdown</h3>
            <p className="text-sm text-gray-600">Month-wise performance analysis</p>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Download Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Custom Report Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="date"
                  value={downloadParams.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="date"
                  value={downloadParams.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Theatre
            </label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={downloadParams.theatreId}
                onChange={(e) => handleInputChange('theatreId', e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Theatres</option>
                {theatres.map((theatre) => (
                  <option key={theatre.id} value={theatre.id}>
                    {theatre.name} - {theatre.city}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Report Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report Type
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                { value: 'all', label: 'Complete Report' },
                { value: 'summary', label: 'Summary Only' },
                { value: 'detailed', label: 'Detailed View' },
                { value: 'financial', label: 'Financial Focus' }
              ].map((option) => (
                <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="reportType"
                    value={option.value}
                    checked={downloadParams.reportType === option.value}
                    onChange={(e) => handleInputChange('reportType', e.target.value)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Download Button */}
          <div className="pt-4">
            <button
              onClick={downloadExcelReport}
              disabled={isDownloading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-colors"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Generating Report...</span>
                </>
              ) : (
                <>
                  <Download className="h-5 w-5" />
                  <span>Download Custom Report</span>
                </>
              )}
            </button>
          </div>

          <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
            <p className="font-medium mb-1">📊 Report Includes:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Theatre-wise revenue and performance metrics</li>
              <li>Seat category breakdown with sales and pricing</li>
              <li>Monthly trends and comparative analysis</li>
              <li>Detailed booking information and customer data</li>
              <li>Summary dashboards and pivot tables</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExcelDownloadComponent;