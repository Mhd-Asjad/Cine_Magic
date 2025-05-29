import Footer from '@/Components/Footer/Footer';
import Nav from '@/Components/Navbar/Nav';
import axios from 'axios';
import { CloudDownload, Ticket, Tickets } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { AlertDialog, AlertDialogTrigger, AlertDialogCancel , AlertDialogAction , AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import ShowRefundStatus from './ShowRefundStatus';
import apiBooking from '@/Axios/Bookingapi';

function TicketView() {
  const { id } = useParams();
  const [ticketData, setTicketData] = useState([]);
  const [showDetails, setShowDetails] = useState([]);
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ refundInfo , setRefundInfo ] = useState(null);
  const [ open , setOpen ] = useState(false)
  const {toast} = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
      const fetchRefundInfo = async() => {

        try {
          const res = await apiBooking.get(`refund-info/${id}/`)
          setRefundInfo(res.data.refund_data)

        }catch(e){
          console.log(e , 'error while fetching cancel refund')
        }
      }
    const fetchQrCode = async() => {
      setLoading(true);

      try {
        const res = await apiBooking.get(`ticket/${id}/`);
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

    fetchRefundInfo()
    fetchQrCode();
    
    }, [id]);
    console.log(refundInfo , 'refund info')

  const convertMinutes = (minutes) => {
    const hours = Math.floor(minutes / 60)
    let mins = minutes % 60;
    mins = mins !== 0 ? `${mins}m` : '';
    return `${hours}hrs ${mins}`
  }

 
  const handleDownload = () => {
    const ticket = document.getElementById('ticket-section')

    html2canvas(ticket, { allowTaint: true, useCORS: true }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png")
      const qrCanvas = document.createElement('canvas');
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      let yOffset = pdfHeight + 10;
      const qrDataUrl = qrCanvas.toDataURL('image/png');
      if (ticketData.qrcode_img) {
        const qrImage = new Image();
        qrImage.crossOrigin = 'anonymous'; 
        qrImage.src = ticketData.qrcode_img;
  
        qrImage.onload = () => {
          qrCanvas.width = qrImage.width;
          qrCanvas.height = qrImage.height;
          const ctx = qrCanvas.getContext('2d');
          ctx.drawImage(qrImage, 0, 0);
  
          if (yOffset + 80 > pdf.internal.pageSize.getHeight()) {
            pdf.addPage();
            yOffset = 20;
          }
          
        }
      }

      pdf.addImage(qrDataUrl, 'PNG', 10, yOffset + 50, 80, 80);
      const linkText = 'click this to show ticket validation'
      const validationUrl = `http://localhost:5173/verify-ticket/${id}`

      pdf.textWithLink(linkText , 60 , yOffset + 20 , { url : validationUrl })
      pdf.save('ticket-screenshot.pdf')

    });
  };


  const handleCancelTicket = async(e) => {
    e.preventDefault()

    try {
      const res = await apiBooking.post(`cancel-ticket/${id}/`,
        {
          'refund_amount' : refundInfo.refund_amount
        }
      );
      toast({title : res.data.message})
      setOpen(false)
    }catch(e){
      toast({title : e?.response?.data?.error,
        variant : 'destructive'


      })
    }

    
  }
  console.log(ticketData.refund_status , 'ticket status')
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
          <h3 className="text-center text-2xl font-bold text-gray-800 mb-8">Your Movie Ticket  </h3>
            <div className='flex justify-end' >
      
            { !['cancelled', 'completed' , 'pending' , 'not_applicable'].includes(ticketData.refund_status) ? (
              <AlertDialog open={open} onOpenChange={setOpen}>
                  <AlertDialogTrigger asChild>
                      <button className='p-4 text-red-500 cursor-pointer' onClick={() => setOpen(true)}>
                          Would you like to cancel ticket?
                      </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                      <AlertDialogHeader>
                          <AlertDialogTitle>Confirm Cancellation</AlertDialogTitle>
                          <AlertDialogDescription className='mb-2'>
                              <div>
                                  <p className='text text-center text-red-500 font-bold'>⚠ Cancellation Policy</p>
                                  <p className='text-sm text-gray-500'>◉ Cancellation is only possible 2 hours before the showtime.</p>
                                  <p className='text-sm font-semibold'>Booking cancellation before show time 24hr</p>
                                  <p className='text-sm'>◉ 98% of the ticket amount will be refunded.</p>
                                  <p className='text-sm font-semibold'>Booking before show time gap between (24hr to 12hr)</p>
                                  <p className='text-sm'>◉ 75% of the ticket amount will be refunded.</p>
                                  <p className='text-sm font-semibold'>Booking before show time gap between (12hr to 2hr)</p>
                                  <p className='text-sm'>◉ 50% of the ticket amount will be refunded.</p>
                                  <p className='text-sm'>◉ No refund is applicable if the cancellation is made after the showtime.</p>
                              </div>
                              {refundInfo && (
                                  <>
                                      <p className="text-sm text-center font-bold text-gray-500 mt-2">Booking Details:</p>
                                      <p><strong>Booking ID:</strong> {refundInfo.booking_id}</p>
                                      <p><strong>Booking Amount:</strong> ₹{refundInfo.amount}</p>
                                      <p><strong>Refund %:</strong> {refundInfo.refund_percentage}</p>
                                      <p><strong>Refund Amount:</strong> ₹{refundInfo.refund_amount}</p>
                                      <p><strong>{refundInfo.hour_diff > 0 ? 'Hours Before Show' : 'refund status'}:</strong> {refundInfo.hour_diff > 0 ? `${refundInfo.hour_diff} hours` : `Not Applicable`}</p>
                                      {refundInfo.refund_percentage === 0 && <p className="text-red-500 mt-2">⚠ No refund is applicable as per refund policy.</p>}
                                  </>
                              )}
                          </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                          <div className='flex gap-2'>
                              <AlertDialogCancel className="outline">Close</AlertDialogCancel>
                              <Button className='bg-red-500 hover:bg-red-600' variant='destructive' onClick={handleCancelTicket}>
                                  Confirm
                              </Button>
                          </div>
                      </AlertDialogFooter>
                  </AlertDialogContent>
              </AlertDialog>
            ) : (

              <div className='flex items-center gap-2' >
              <div>
                {!open &&

                <button className='text-green-600 w-60 h-12' onClick={() => setOpen(prev => !prev)}>
                    Click to show Refund Status <Ticket className='inline' />


                </button>
                }
              <div className='mx-auto mb-5' >
                {open &&
                  <ShowRefundStatus refundId={refundInfo.id} openStatus={setOpen} />                    
                }
                
              </div>
            </div>
            </div>
            )}

            </div>
          <div className="relative bg-white shadow-2xl rounded-lg overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-3 bg-white flex">
              {[...Array(40)].map((_, i) => (
                <div key={i} className="flex-1">
                  <div className="h-3 w-2 mx-auto bg-gray-200 rounded-b-full"></div>
                </div>
              ))}
            </div>

            
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
            
          <div id='ticket-section'>
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
                  crossOrigin="anonymous"
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


          <div className='flex mb-3 p-3 justify-center' >

          <button
            onClick={handleDownload}
            className="border-dashed rounded-md border-2 border-gray-200 text-md py-2 px-2"
            >
            <CloudDownload size={18} className='inline' />  Download Ticket
          </button>

          </div>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}

export default TicketView;