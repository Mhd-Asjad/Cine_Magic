import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import seatsApi from '@/axios/seatsaApi'
import { RockingChair } from 'lucide-react'
function LayoutCards() {
    const owner_id = useSelector((state) => state.theatreOwner.theatreId)
    const [screenData, setScreen] = useState([])

    useEffect(() => {
        const fetchScreenData = async () => {
            try {
                const res = await seatsApi.get(`screen-layout/${owner_id}/`)
                setScreen(res.data)
            } catch (e) {
                console.log(e)
            }
        }

        fetchScreenData()
    }, [])

    return (
        <div className="w-full flex items-center justify-center mt-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 max-w-[900px] w-full px-10">

                    
            {screenData.some(theatre =>
                theatre.screens.some(screen => screen.layout)
            ) ? (
                screenData.map((theatre) =>
                    theatre.screens
                        .filter((screen) => screen.layout)
                        .map((screen) => (
                            <div key={screen.id} className="bg-white rounded-xl shadow-md p-4">
                                <h3 className="text-lg font-semibold mb-2">
                                    {`${theatre.theatre_name} (Screen: ${screen.screen_number})`}
                                </h3>
                                <p className="text-sm text-gray-600">Rows: {screen.layout.rows}</p>
                                <p className="text-sm text-gray-600">Seats per Row: {screen.layout.cols}</p>

                                <div className="mt-3 border rounded p-2 bg-gray-50 max-h-64 overflow-auto">
                                    <div
                                        className="grid gap-1"
                                        style={{
                                            gridTemplateColumns: `repeat(${screen.layout.cols || 1}, 1fr)`,
                                        }}
                                    >
                                        {Array.from({
                                            length: (screen.layout.rows || 0) * (screen.layout.cols || 0),
                                        }).map((_, index) => {
                                            const row = Math.floor(index / screen.layout.cols);
                                            const col = index % screen.layout.cols;
                                            return (
                                                <div
                                                    key={index}
                                                    className="w-7 h-7 flex items-center justify-center bg-blue-200 text-xs rounded"
                                                >
                                                    {String.fromCharCode(65 + row)}
                                                    {col + 1}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            <div className='flex justify-center ' >
                                <button className='py-3 px-1 font-semibold mt-4 border-dashed border-2 '>
                                    edit Layoutout <RockingChair className='inline' />
                                </button>

                            </div>
                            </div>
                        ))
                )
            ) : (
                <p className="text-center text-gray-500">No Screen Layouts</p>
            )}
            </div>
        </div>
    )
}

export default LayoutCards
