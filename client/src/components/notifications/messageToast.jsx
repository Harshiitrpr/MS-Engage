import { ToastContainer, toast } from 'react-toastify';

export const toastMessage = async(messageDetail) => {
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

const messageToast = (props) => {
    const {chatBoxVisible, messageDetail} = props;

    return(
        <ToastContainer
            newestOnTop
            rtl={false}
            pauseOnFocusLoss={false}
        />
    )
}

export default messageToast;

