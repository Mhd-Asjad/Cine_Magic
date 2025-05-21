import * as React from "react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"

function DatePicker() {
  const [fromDate, setFromDate] = React.useState(Date)

  return (
    <div className='flex gap-4' >

        <Popover>
            <PopoverTrigger asChild>
            <Button variant="outline" className="w-[200px] justify-start text-left font-normal">
                {fromDate ? format(fromDate, "PPP") : "From Date"}
            </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
            <Calendar
                mode="single"
                selected={fromDate}
                onSelect={setFromDate}
                initialFocus
            />
            </PopoverContent>
        </Popover>
        
      
    </div>
  )
}

export default DatePicker
