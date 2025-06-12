import { toast } from 'react-toastify';

export const notify = (data) => {
  const config = {
    autoClose: 1000, // 3 seconds
    pauseOnHover: true,
    draggable: true,
  };

  if (data.success) {
    toast.success(data.message, config);
  } else {
    toast.error(data.message, config);
  }
};
