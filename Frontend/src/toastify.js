import {toast} from 'react-toastify'

export  const notify=(data)=>{
    if(data.success){
        toast.success(data.message);
    }
    else{
        toast.error(data.message);
    }
}