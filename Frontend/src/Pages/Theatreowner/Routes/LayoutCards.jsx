import React, { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/free-mode'
import { FreeMode, Pagination } from 'swiper/modules'
import { useSelector } from 'react-redux'
import seatsApi from '@/Axios/seatsapi'

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
        <div className="w-full flex items-center justify-center max-w-[500px] mt-7">

            <Swiper
                breakpoints={{
                    340: {
                        slidesPerView: 1.5,
                        spaceBetween: 15
                    },
                    700: {
                        slidesPerView: 2.5,
                        spaceBetween: 20
                    },
                    1024: {
                        slidesPerView: 3.5,
                        spaceBetween: 25
                    }
                }}
                freeMode={true}
                pagination={{ clickable: true }}
                modules={[FreeMode, Pagination]}
                className="max-w-full mx-auto"
            >
                {screenData.map((theatre) =>
                    theatre.screens.map((screen) => (
                        <SwiperSlide key={screen.id}>
                            <div className="bg-white shadow-md rounded-lg p-4 h-[250px] w-[315px] flex flex-col">
                                <div className="mb-2">
                                    <h3 className="text-lg font-bold">Screen {screen.screen_number}</h3>
                                    <p className="text-sm text-gray-600">Type: {screen.screen_type}</p>
                                </div>
                                
                                <p className="text-sm text-gray-600 mb-1">Layout Preview:</p>
                                <div className="border rounded-md p-2 flex-1 overflow-hidden flex items-center justify-center">
                                    {screen.layout && (
                                        <div
                                            className="grid gap-[2px] transform scale-[0.8] origin-center"
                                            style={{
                                                gridTemplateColumns: `repeat(${screen.layout.cols || 1}, 1fr)`,
                                            }}
                                        >
                                            {Array.from({
                                                length: (screen.layout.rows || 0) * (screen.layout.cols || 0),
                                            }).map((_, index) => {
                                                const row = Math.floor(index / screen.layout.cols)
                                                const col = index % screen.layout.cols
                                                return (
                                                    <div
                                                        key={index}
                                                        className="w-6 h-6 flex items-center justify-center bg-blue-200 text-xs rounded"
                                                    >
                                                        {String.fromCharCode(65 + row)}{col + 1}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </SwiperSlide>
                    ))
                )}
            </Swiper>
        </div>
    )
}

export default LayoutCards