import React from "react";
import Header from "../Header";
import { X } from "lucide-react";
import ReactDOM from "react-dom";
type Props = {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  name: string;
}

const Modal = ({ children, isOpen, onClose, name }: Props) => {

  if (!isOpen) return null;



  return ReactDOM.createPortal(

    <div className="fixed inset-0 flex size-full items-start justify-center overflow-y-auto bg-gray-600/60 pt-16 pb-8 px-4">
      <div className="w-full max-w-2xl rounded-lg bg-white p-8 shadow-lg dark:bg-zinc-900">
        <Header
          name={name}
          buttonComponent={
            <button
              className="flex size-7 items-center justify-center rounded-full bg-blue-primary text-white hover:bg-emerald-300 bg-emerald-500"
              onClick={onClose}
            >
              <X size={20} />
            </button>
          }
          isSmallText
        />
        {children}
      </div>
    </div>,
    document.body,

  )
}

export default Modal
