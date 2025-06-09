import React from 'react'
import { TextField } from '@mui/material'

function SearchBar( { placeholder='search' , value , onChange}  ) {
  return (
    <div className='w-[50%]' >

        <div className='flex justify-center'>
          <TextField
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            variant='standard'
            fullWidth
            label='search'
            className='rounded-lg text-center'
          />
        </div>

    </div>
  )
}

export default SearchBar
