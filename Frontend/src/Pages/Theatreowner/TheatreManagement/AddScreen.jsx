import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import TheatreApi from '@/axios/theatreapi';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updateOwnershipStatus } from '@/redux/features/Theatreownerslice';
import seatsApi from '@/axios/seatsaApi';
import { useToast } from '@/hooks/use-toast';
// import remove
function AddScreen() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {toast}  = useToast();
    const [layouts, setLayouts] = useState([]);
    const [screenCount, setScreenCount] = useState(0);
    const [selectedLayout, setSelectedLayout] = useState(null);
    const [ timeSlots, setTimeSlot ]  = useState([{ start_time : "" }])
    const [gapPositions, setGapPositions] = useState([]);
    const initialValue = {
        screen_number: '',
        capacity: '',
        screen_type: '',
        layout : ''
    };

    useEffect(() => {
        screenCounts();
        fetchLayouts();
    }, []);

    const fetchLayouts = async () => {
        try {
            const res = await seatsApi.get('seats-layout/');
            setLayouts(res.data);
        } catch (e) {
            console.error(e.response?.data);
        }
    };
    
    const screenCounts = async () => {
        try {
            const res = await TheatreApi.get(`/show-screens/?theatre_id=${id}`);
            setScreenCount(res.data.screen_count);
        } catch (e) {
            console.error(e.response?.data);
        }
    };

    const addTimeSlot = () => {

        const MIN_GAP_MINUTES = 180;

        const timesInMinutes = timeSlots
            .filter(slot => slot.start_time) 
            .map(slot => {
            const [hours, minutes] = slot.start_time.split(':').map(Number);
            return hours * 60 + minutes;
            });

        timesInMinutes.sort((a, b) => a - b);

        let isValid = true;
        for (let i = 0; i < timesInMinutes.length - 1; i++) {
            if (timesInMinutes[i + 1] - timesInMinutes[i] < MIN_GAP_MINUTES) {
            isValid = false;
            break;
            }
        }

        if (!isValid) {
            toast({title :'Please ensure all time slots are at least 3 hours apart.',
                variant : 'destructive'
            });
            return;
        }

        setTimeSlot([...timeSlots , {start_time : ""}]);
    };

    const toggleGap = (row, col) => {
        const label = `${String.fromCharCode(65+row,)}${col+1}`
        const exists = gapPositions.some(pos => pos.row === row && pos.col === col);
        if (exists) {
          setGapPositions(prev => prev.filter(pos => !(pos.row === row && pos.col === col)));
        } else {
          setGapPositions(prev => [...prev, { row , col , label }]);
        }
    };


    const removeTimeSlot = (index) => {
        const updatedSlots = timeSlots.filter((_, i) => i !== index)
        setTimeSlot(updatedSlots)
    }

    const handleTimeChange = (index , value) => {

        const updatedSlots = [...timeSlots]
        updatedSlots[index].start_time = value;
        setTimeSlot(updatedSlots)
    }

    const validation_schema = Yup.object({
        screen_number: Yup.number()
            .required('*Screen number is required')
            .positive('*Screen number must be positive'),
        screen_type: Yup.string().required('*enter screeen type'),
        layout : Yup.number().nullable()
                .required("*select a available layout or create")

    });


    const handleLayoutChange = (e, setFieldValue) => {
        const layoutId = e.target.value;
        if (layoutId) {
            const layout = layouts.find(l => l.id == layoutId);
            if (layout) {
                setSelectedLayout(layout);
                setFieldValue('capacity', layout.total_capacity);
            }
        } else {
            setSelectedLayout(null);
            setFieldValue('capacity', '');
        }
        setFieldValue('layout', layoutId);
    };
    

    const handleSubmit = async (values, { resetForm }) => {
        values.theatre = id;
        values.unselected_seats = gapPositions
        values.time_slots = timeSlots.filter(slot => slot.  start_time !== '') 
        try {

            await TheatreApi.post('add-screen/', values);
            resetForm();
            setTimeSlot([{start_time : ""}])
            toast({'title' : "Screen added successfully✅"});
            screenCount + 1 > 1
                ? navigate(`/theatre-owner/${id}/screens`)
                : navigate('/theatre-owner/theatre-confimation');
            dispatch(updateOwnershipStatus('success'));
        } catch (e) {
            toast({
                title : e.response?.data?.error,
                variant : 'destructive'
            })
        }
    };
    console.log(gapPositions)
    return (
        <div className="flex border shadow-md mt-7 py-4 bg-gray-100">
            <div className="p-10 py-8">
                <h2 className="text-center mb-7 pt-12 px-3 font-semibold text-3xl text-gray-500">
                    Add Screen Details  
                </h2>
                <Formik
                    initialValues={initialValue}
                    validationSchema={validation_schema}
                    onSubmit={handleSubmit}
                >
                    {({ setFieldValue }) => (
                        <Form>
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Screen Number
                                </label>
                                <Field
                                    type="number"
                                    name="screen_number"
                                    className="w-full border-gray-300 border rounded-lg px-4 py-2 focus:outline-none focus:ring-blue-300"
                                />
                                <ErrorMessage
                                    name="screen_number"
                                    component="div"
                                    className="text-red-500 text-sm mt-1"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-2 mt-2">
                                    Layout
                                </label>
                                <Field
                                    as="select"
                                    name="layout"
                                    className="w-full border-gray-300 border rounded-lg px-4 py-2 focus:outline-none focus:ring-blue-300"
                                    onChange={(e) => handleLayoutChange(e, setFieldValue)}
                                >
                                    <option value="">Select a layout</option>
                                    {layouts.map(layout => (
                                        <option key={layout.id} value={layout.id}>
                                            {layout.name} - ({layout.rows} X {layout.cols}) - {layout.total_capacity} seats
                                        </option>
                                    ))}
                                </Field>
                                <ErrorMessage
                                    name="layout"
                                    component="div"
                                    className="text-red-500 text-sm mt-1"
                                />
                                {selectedLayout && (
                                    <p className="text-sm text-gray-500 mt-1">
                                        Capacity is auto-calculated based on layout
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mt-2">
                                    Screen Capacity
                                </label>
                                <Field
                                    type="number"
                                    name="capacity"
                                    className="mt-3 w-full border-gray-300 border rounded-lg px-4 py-2 focus:outline-none focus:ring-blue-300"
                                    readOnly
                                />
                                <ErrorMessage
                                    name="capacity"
                                    component="div"
                                    className="text-red-500 text-sm mt-1"
                                />
                            </div>
                                
                            <div className='pt-2' >
                                <h3>Time Slots</h3>
                                {timeSlots.map((slot, index) => (
                                    <div key={index} style={{ display: "flex", alignItems: "center", marginBottom: "10px", marginTop : "10px" }}>
                                        <Field
                                            type="time"
                                            value={slot.start_time}
                                            onChange={(e) => handleTimeChange(index, e.target.value)}
                                            className="flex w-[37%]  mb-2 "
                                            required
                                        />
                                        {index > 0 && (
                                            <button className='pl-3' type="button" onClick={() => removeTimeSlot(index)}>Remove</button>
                                        )}

                                    </div>
                                ))}

                                <button className=' bg-blue-200 py-3 pl-2 pr-2 rounded font-bold' type='button' onClick={addTimeSlot} >+ Add timeSlot</button>
                            </div> 
                            <div>
                                <label className="block text-gray-700 font-medium mt-2">
                                    Screen Type
                                </label>
                                <Field
                                    type="text"
                                    name="screen_type"
                                    className="mt-3 w-full border-gray-300 border rounded-lg px-4 py-2 focus:outline-none focus:ring-blue-300"
                                />
                                <ErrorMessage
                                    name="screen_type"
                                    component="div"
                                    className="text-red-500 text-sm mt-1"
                                />
                            </div>
                  
                            <button
                                type="submit"
                                className="flex mx-auto mt-3 bg-blue-500 text-white px-4 py-2 rounded"
                            >
                                Submit
                            </button>
                        </Form>
                    )}
                </Formik>
            </div>
            {selectedLayout && (
                <div className="p-10 py-8">
                    <h3 className="text-xl text-gray-600 mb-7">Layout Preview</h3>
                    <div className="border p-4 rounded bg-white">
                        <div className="grid gap-1" style={{ 
                            gridTemplateColumns: `repeat(${selectedLayout.cols}, 1fr)`
                        }}>
                            {Array.from({ length: selectedLayout.rows * selectedLayout.cols }).map((_, index) => {
                                const row = Math.floor(index / selectedLayout.cols);
                                const col = index % selectedLayout.cols;
                                // const key = `${row}-${col}`
                                const isGap = gapPositions.some(pos => pos.row === row && pos.col === col );

                                return (
                                    <div 
                                     key={index}
                                     onClick={() => toggleGap(row , col)}
                                     className={`w-8 h-8 cursor-pointer flex items-center justify-center bg-blue-100 text-xs rounded
                                        ${isGap ? "bg-white border border-dashed text-white" : "bg-blue-100"}`}
                                        style={ isGap ? { paddingLeft : '12px' }:{}}
                                        
                                        >
                
                                    {!isGap && `${String.fromCharCode(65 + row)}${col + 1}`}
                                </div>
                                );
                            })}
                        </div>
                    </div>
                            <div className="mb-4 text-center p-2 bg-gray-200 rounded">Screen this way</div>
                    
                    
                </div>
                
                )}
                
        </div>
    );
}

export default AddScreen;
