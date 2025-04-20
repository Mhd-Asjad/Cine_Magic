import React, { useState } from 'react'
import { Separator } from '@/Components/ui/separator'
import { Link } from 'react-router-dom'
import ShowSeats from './ShowSeats'
import LayoutCards from './LayoutCards'
import SeatCategory from './SeatCategory'
function SeatHome() {
    const [ activeComponent , setActiveComponent ] = useState('Details')

    const renderComponent = () => {
        switch (activeComponent) {
            case "Detail" :
                return <ShowSeats/>

            case "Layout":
                return <LayoutCards/>

            case "Category":
                return <SeatCategory/>

            default :
            return <ShowSeats/>
        }
    }
  return (
    <div>
        <div className='space-y-1' >
            <h4 className='text-sm font-medium leading-none pt-9' >Seat management</h4>
        </div>
        <Separator className="my-4" />
        <div className="flex h-5 items-center space-x-4 text-sm">
            <button onClick={() => setActiveComponent('Detail')} >Detail</button>
            <Separator orientation="vertical" />
            <button onClick={() => setActiveComponent('Layout')} >Layouts</button>
            <Separator orientation="vertical"/>
            <button onClick={() => setActiveComponent('Category')} >Category </button >
        </div>

        {renderComponent()}
    </div>
  )
}

export default SeatHome
