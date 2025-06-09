import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import seatsApi from '@/axios/seatsaApi'
import { useToast } from '@/hooks/use-toast'

function SeatCategory() {
  const ownerId = useSelector((state) => state.theatreOwner.theatreId)
  const [theatreScreen, setTheatreScreen] = useState([])
  const [seatCategorys, setseatCategorys] = useState([])
  const [seats, setSeats] = useState({})
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedScreen, setSelectedScreen] = useState(null)
  const [selectedSeats, setSelectedSeats] = useState([])
  const { toast } = useToast()

  useEffect(() => {
    const fetchScreens = async () => {
      try {
        const res = await seatsApi.get(`get-theatre-screen/${ownerId}/`)
        setTheatreScreen(res.data.screen_data)
      } catch (e) {
        console.log(e?.response?.error)
      }
    }

    const fetchCategory = async () => {
      try {
        const res = await seatsApi.get('get-seats-category/')
        setseatCategorys(res.data)
      } catch (e) {
        console.log(e)
      }
    }

    fetchCategory()
    fetchScreens()
  }, [])

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const res = await seatsApi.get(`screens/${selectedScreen}/seats/`)
        const organizedData = organizeByRow(res.data)
        setSeats(organizedData)
      } catch (e) {
        console.log('Failed to load seats. Please try again.')
        console.log(e)
      }
    }

    if (selectedScreen) fetchSeats()
  }, [selectedScreen])

  const organizeByRow = (seats) => {
    const rowMap = {}
    seats.forEach((seat) => {
      if (!rowMap[seat.row]) {
        rowMap[seat.row] = []
      }
      rowMap[seat.row].push(seat)
    })
    Object.values(rowMap).forEach((rowSeats) => {
      rowSeats.sort((a, b) => a.number - b.number)
    })
    return rowMap
  }

  const getSeatClass = (seat) => {
    if (selectedSeats.some((s) => s.id === seat.id)) {
      return 'bg-blue-500 outline-blue text-white cursor-not-allowed'
    }
    return 'bg-white text-blue cursor-not-allowed outline outline-1 outline-blue-600'
  }
  
  const toggleSeatSelection = (seat) => {
    setSelectedSeats((prev) => {
      const isSelected = prev.some((s) => s.id === seat.id)
      if (isSelected) {
        return prev.filter((s) => s.id !== seat.id)
      } else {
        return [
          ...prev,
          {
            ...seat,
            category_id: selectedCategory?.id,
            price: selectedCategory?.price,
            category_name: selectedCategory?.name,
          },
        ]
      }
    })
    }
    console.log(selectedSeats)

  const toggleRowSelection = (rowSeats) => {
    if (!selectedCategory) {
      toast({
        title: 'Please select a category before selecting a row',
        variant: 'destructive',
      })
      return
    }
    
    const allSelected = rowSeats.every((seat) =>
      selectedSeats.some((s) => s.id === seat.id)
    )

    setSelectedSeats((prev) => {
      if (allSelected) {
    
        return prev.filter((s) => !rowSeats.some((r) => r.id === s.id))
      } else {
    
        const newSeats = rowSeats
          .map((seat) => ({
            ...seat,
            category_id: selectedCategory.id,
            price: selectedCategory.price,
            category_name: selectedCategory.name,
          }))
          .filter((ns) => !prev.some((ps) => ps.id === ns.id))
        return [...prev, ...newSeats]
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedCategory || selectedSeats.length === 0) {
      toast({
        title: 'Try to select a category and at least one seat',
        variant: 'destructive',
      })
      return
    }

    const seatsid = selectedSeats.map((seat) => seat.id)
    console.log(seatsid , selectedCategory )
    const payload = {
      seats_ids: seatsid,
      category_id: selectedCategory.id,
    }

    try {
      const res = await seatsApi.post('update-seats-category/', payload)
      console.log('response' , res)
      toast({ title: res.data.message })
      setSelectedSeats([])
      setSelectedCategory(null)

      const updated = await seatsApi.get(`screens/${selectedScreen}/seats/`)
      setSeats(organizeByRow(updated.data))
      setSelectedScreen(null)
    } catch (e) {
      console.log(JSON.stringify(e , null , 2))
      toast({
        title: e.response?.data?.error || 'Submission failed',
        variant: 'destructive',
      })
    }
  }
  console.log(seats)
  return (
    <div className='p-8 border shadow-md mt-7 py-4 bg-gray-100'>
      <h2 className='text-1xl font-semibold'>Seats Category</h2>
      <form onSubmit={handleSubmit}>
        <div className='mt-6'>
          <div className='border rounded-lg px-4 py-2 focus:outline-none focus:ring-blue-300'>
            <select
              className='bg-none'
              value={selectedScreen || ''}
              onChange={(e) => setSelectedScreen(e.target.value)}
            >
              <option value=''>{ theatreScreen.length > 0 ? "Select a screen" : 'no available screen'}</option>
              {theatreScreen.map((screen) => (
                <option key={screen.id} value={screen.id}>
                  {screen.theatre?.name} - Screen {screen.screen_number}
                </option>
              ))}
            </select>
          </div>

          <div className='mt-5'>
            <label className='pl-4 font-semibold'>Category</label>
            <div className='flex flex-wrap gap-3 mt-2 justify-center'>
              {seatCategorys.map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat)}
                  className={`cursor-pointer px-4 py-2 rounded-lg border ${
                    selectedCategory?.id === cat.id
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white text-gray-700 border-gray-300'
                  }`}
                >
                  {cat.name} - ₹{cat.price}
                </div>
              ))}
            </div>

            {selectedScreen && (
              <div className='mt-5'>
                <div className='flex flex-wrap gap-2'>
                  {Object.entries(seats).map(([row, rowSeats]) => {
                    const isRowSelected = rowSeats.every((seat) =>
                      selectedSeats.some((s) => s.id === seat.id)
                    )

                    return (
                      <div
                        key={row}
                        className='flex justify-center w-full mb-4'
                      >
                        <button
                          type='button'
                          onClick={() => toggleRowSelection(rowSeats)}
                          className={`w-6 h-6 font-bold mr-2 rounded ${
                            isRowSelected
                              ? 'bg-blue-500 text-white'
                              : 'bg-white border'
                          }`}
                          title='Select entire row'
                        >
                          {row}
                        </button>

                        <div className='flex space-x-1'>
                          {rowSeats.map((seat) => (
                            seat?.label ? (


                              <button
                                type='button'
                                key={seat.id}
                                disabled={true }
                                title={`${seat.category_name || 'No Category'} - ₹${seat.price}`}
                                onClick={() =>
                                  toggleSeatSelection({
                                    ...seat,
                                    category_id: selectedCategory?.id,
                                    price: selectedCategory?.price,
                                    category_name: selectedCategory?.name,
                                  })
                                }
                                className={`w-6 h-6 rounded-sm  flex items-center justify-center text-xs ${getSeatClass(
                                  seat
                                )}`}
                              >
                                {seat.number}
                              </button>

                            ):(

                              <div key={seat.id} className="w-6 h-6"/>
                            )
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            <div className='flex justify-center'>
              <button
                type='submit'
                className='mt-5 py-2 px-4 rounded bg-gray-500 text-white'
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default SeatCategory
