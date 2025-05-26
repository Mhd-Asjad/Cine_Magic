import React, { useEffect, useState } from 'react';
import { Download, Calendar, Building, Filter, FileSpreadsheet, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import apiAdmin from '@/Axios/api';
import { useToast } from '@/hooks/use-toast';
const ExcelDownloadComponent = () => {
    const [isDownloading, setIsDownloading] = useState(false);
    const [theatres, setTheatres] = useState([]);
    const [downloadParams, setDownloadParams] = useState({
        startDate: '',
        endDate: '',
        theatreId: '',
        reportType: 'all'
    });
    const {toast} = useToast();

    console.log(downloadParams)

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
      
      const response = await apiAdmin.get(`report-xldownload/?${params.toString()}`,{
        responseType : 'blob'
      });
      console.log('response', response.data );
      console.log('respone status', response.status);

      let filename = `${downloadParams.reportType}.xlsx`;
      const contentDisposition = response.headers['content-disposition'];
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      
    } catch (error) {
      console.error('Download error:', error);
    } finally {
      toast({title :'Report downloaded successfully!'})
      setIsDownloading(false);  
    }
  };

  console.log(theatres , 'active theatres')

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="hover:shadow-lg transition-shadow" >
          <CardContent className="p-6 text-center">
            <FileSpreadsheet className="h-12 w-12 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Theatre Summary</h3>
            <p className="text-sm text-gray-600">Revenue, tickets, and performance by theatre</p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <FileSpreadsheet className="h-12 w-12 text-green-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Seat Category Analysis</h3>
            <p className="text-sm text-gray-600">Sales breakdown by seat categories</p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <FileSpreadsheet className="h-12 w-12 text-purple-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Monthly Breakdown</h3>
            <p className="text-sm text-gray-600">Month-wise performance analysis</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Custom Report Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report Type
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                { value: 'detailed_performance', label: 'Complete Report' },
                { value: 'theatre_summary', label: 'Summary Only' },
                { value : 'seat_analysis' , label : 'seat analysis' },
                { value : 'monthly_breakdown' , label : 'monthly breakdown' }
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

        </CardContent>
      </Card>
    </div>
  );
};

export default ExcelDownloadComponent;