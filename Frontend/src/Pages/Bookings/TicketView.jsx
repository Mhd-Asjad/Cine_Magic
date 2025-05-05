import Footer from '@/Components/Footer/Footer';
import Nav from '@/Components/Navbar/Nav';
import axios from 'axios';
import { format } from 'date-fns';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
function TicketView() {
  const { id } = useParams();
  const [ticketData, setTicketData] = useState([]);
  const [showDetails, setShowDetails] = useState([]);
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQrCode = async() => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:8000/booking/ticket/${id}/`);
        const { ticket_data, movie_details, seats } = res.data;
        setTicketData(ticket_data);
        setShowDetails(movie_details);
        setSeats(seats);
        setLoading(false);
      } catch(e) {
        console.log(e);
        setError(e?.response?.data?.error || 'An error occurred');
        setLoading(false);
      }
    };
    fetchQrCode();
  }, [id]);

  const convertMinutes = (minutes) => {
    const hours = Math.floor(minutes / 60)
    let mins = minutes % 60;
    mins = mins !== 0 ? `${mins}m` : '';
    return `${hours}hrs ${mins}`
  }

 
  const handleDownload = () => {
    const ticket = document.getElementById('ticket-section')

    html2canvas(ticket).then((canvas) => {
      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData , "png" , 0 , 0 , pdfWidth , pdfHeight);
      pdf.save('ticket.pdf')
    });
  };

  if (loading) {
    return (
      <div>
        <Nav />
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading your ticket...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Nav />
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <div className="text-center">
              <div className="w-16 h-16 text-red-500 mx-auto mb-2 flex items-center justify-center">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
              <p className="text-gray-600">{error}</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Nav/>
      <div className="min-h-screen py-12 bg-gradient-to-b from-gray-100 to-gray-200 flex justify-center items-center px-4">
        <div className="max-w-xl w-full mx-auto">
          <h3 className="text-center text-2xl font-bold text-gray-800 mb-8">Your Movie Ticket</h3>
          
          <div className="relative bg-white shadow-2xl rounded-lg overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-3 bg-white flex">
              {[...Array(40)].map((_, i) => (
                <div key={i} className="flex-1">
                  <div className="h-3 w-2 mx-auto bg-gray-200 rounded-b-full"></div>
                </div>
              ))}
            </div>

          <div id='ticket-section'>
            
            <div className="pt-4 pb-4 px-8 border-b border-dashed border-gray-300">
              <div className="flex justify-between items-start">
                <div className="space-y-1 flex-1">
                  <h1 className="font-bold text-2xl text-gray-800">{showDetails.title}</h1>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-blue-100 w-fit text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {showDetails.genre}
                    </span>
                    <span className="bg-blue-100 text-gray-700 text-xs font-medium px-2.5 py-0.5 rounded">
                      {showDetails.language}
                    </span>
                  </div>
                  <div className="mt-2 text-gray-700">
                    <p className='flex items-center gap-1' >Duration : {convertMinutes(showDetails.duration)}</p>
                    <p className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
                      {ticketData.theatre} {ticketData.screen_type} • Screen {ticketData.screen_number}
                    </p>
                  </div>
                </div>
                
                <div className="">
                  <div className="bg-gray-100 rounded-lg p-3">
                    <p className="text-sm text-gray-500">Tickets</p>
                    <p className="text-xl text-center font-bold">{seats.length}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="py-4 px-8 border-b border-dashed border-gray-300">
              <div className="flex justify-between">
                <div>
                  <h2 className="text-sm text-gray-500 uppercase">Date</h2>
                  <p className="font-medium">{ticketData.booking_time.split(' ')[0].replace(/:/g, '-')}</p>
                </div>
                  <div>
                    <h2 className="text-sm text-gray-500 uppercase">Seats</h2>
                        
                        <h2 className='font-medium' >{seats.join(' , ')}</h2>
                  </div>
                <div>
                  <h2 className="text-sm text-gray-500 uppercase">Booking ID</h2>
                  <p className="font-mono text-xs">{ticketData.booking_id}</p>
                </div>
              </div>
            </div>
            
            <div className="p-8 flex flex-col items-center">
              <div className="p-3 bg-white rounded-lg shadow-md">
                <img 
                  src={ticketData.qrcode_img}
                  alt="Ticket QR Code"
                  className="w-48 h-48 object-contain"
                />
              </div>
              <p className="text-sm text-gray-600 mt-4 text-center">
                Scan this QR code at the theater entrance
              </p>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Booked on: {ticketData.booking_time.replace(':', '-')}
              </p>
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 h-3 bg-white flex">
              {[...Array(40)].map((_, i) => (
                <div key={i} className="flex-1">
                  <div className="h-3 w-2 mx-auto bg-gray-200 rounded-t-full"></div>
                </div>
              ))}
            </div>
          </div>
          <div className='flex justify-end' >

          {/* <button
            onClick={handleDownload}
            className="px-4  py-2 bg-blue-500 text-white rounded"
          >
            Download Ticket
          </button> */}

          </div>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}

export default TicketView;