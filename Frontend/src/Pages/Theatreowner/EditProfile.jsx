import React , {useState} from 'react'
import { SquarePen } from 'lucide-react'
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { 
  Sheet ,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger

} from '@/components/ui/sheet';
import { Input } from '@/Components/ui/input';
import { useSelector } from 'react-redux';
import TheatreApi from '@/Axios/theatreapi';
import { useDispatch } from 'react-redux';
import { setTheatreOwner } from '@/Redux/Features/Theatreownerslice';
import { useToast } from '@/hooks/use-toast';
function EditProfile() {
    const dispatch = useDispatch();
    const {toast} = useToast();
    const theatreOwner = useSelector((state) => state.theatreOwner);

    const [ open , setOpen ] = React.useState(false);
    const [ formData , setFormData ] = useState({
        theatre_name : theatreOwner.theatreName || '' ,
        location : theatreOwner.location ||  '' ,
        state : theatreOwner.state || '' ,
        pincode : theatreOwner.pincode|| ''
    })

    const handleChange = (e) => {
        const {name , value} = e.target
        setFormData(prev => ({
            ...prev ,
            [name] : value
        }));
    };

    console.log(formData)
    const handleSubmit = async(e) => {
        e.preventDefault()
        try {
            const res = await TheatreApi.put(`/update-profile/${theatreOwner.theatreId}/`,formData)
            console.log(res.data,'new_data')
            const {id , location , pincode , state , theatre_name} = res.data
            console.log(theatre_name)
            dispatch(setTheatreOwner({
               theatreId : id ,
               theatreName : theatre_name ,
                state : state ,
                location : location,
                pincode : pincode


            }
            ))
            toast({
                title : 'profile updated successfully'
            })
            setOpen(false)
        }catch(e){
            console.log(e)
        }

    }

  return (

    <Sheet open={open} onOpenChange={setOpen} >
        <SheetTrigger asChild>
        <Button variant="outline" onClick={() => setOpen(true) } >
            <SquarePen className='h-4 w-4 ' />
            Edit Profile
        </Button>
        </SheetTrigger>
        <SheetContent>
            <SheetHeader>
            <SheetTitle>Edit ownerprofile</SheetTitle>
            <SheetDescription>
                make changes your profile here , click save when your done.
            </SheetDescription>
            </SheetHeader>
            <form onSubmit={handleSubmit} >
                <div className='grid gap-4 py-4' >
                    <div className='grid grid-cols-4 items-center gap-4' >
                        <Label className='text-right' >
                            username
                        </Label>
                        <Input className='col-span-3' name='theatre_name' value={formData.theatre_name} onChange={handleChange} />
                    </div>
                    <div className='grid grid-cols-4 items-center gap-4' >
                        <Label className='text-right'>
                            location 
                        </Label>
                        <Input className="col-span-3" name="location" value={formData.location} onChange={handleChange} />
                    </div>
                    <div className='grid grid-cols-4 items-center gap-4' >
                        <Label className='text-right'>
                            state
                        </Label>
                        <Input className="col-span-3" name="state" value={formData.state} onChange={handleChange} />
                    </div>
                    <div className='grid grid-cols-4 items-center gap-4' >
                        <Label className='text-right'>
                            pincode 
                        </Label>
                        <Input className="col-span-3" name="pincode" value={formData.pincode} onChange={handleChange} />
                    </div>
                    <SheetFooter>
                        <Button type="submit" >
                            Save Changes
                        </Button>
                        <SheetClose asChild >
                            <Button variant='outline' >Cancel</Button>
                        </SheetClose>
                    </SheetFooter>
                </div>

            </form>
        </SheetContent>

    </Sheet>
    )
}

export default EditProfile
