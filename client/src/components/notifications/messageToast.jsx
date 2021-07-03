import { ToastContainer, toast } from 'react-toastify';

export const notifyMessage = async(messageDetail) => {
    toast(<div>
        <div>{messageDetail.sender}</div>
        <div>{messageDetail.message}</div>
    </div>, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
    });
}

const MessageToast = (props) => {
    return(
        <ToastContainer
            newestOnTop
            rtl={false}
            pauseOnFocusLoss={false}
        />
    )
}

export default MessageToast;

