import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const defaultToastOptions = {
  position: toast.POSITION.TOP_RIGHT,
  autoClose: 3000, // 3 seconds, adjust as needed
};

const Toast = {
  success: (message) => {
    toast.success(message, {
      ...defaultToastOptions,
      style: { background: "#5cb85c", color: "#ffffff" }, // Green background
    });
  },
  error: (message) => {
    toast.error(message, {
      ...defaultToastOptions,
      style: { background: "#d9534f", color: "#ffffff" }, // Red background
    });
  },
  warning: (message) => {
    toast.warning(message, {
      ...defaultToastOptions,
      style: { background: "#292b2c", color: "#ffffff" }, // Orange background
    });
  },
};

const ToastComponent = () => {
  return <ToastContainer />;
};

export { Toast, ToastComponent };
