function ModalLayout({ children, isOpen, handleModal }) {
    
  return (
    <div onClick={handleModal} className={`fixed inset-0 flex justify-center items-center z-50 bg-black/70 transition-all  duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
      <div onClick={(e) => e.stopPropagation()} className={`transition-all duration-300 ${isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}>
        {children}
      </div>
    </div>
  );
}

export default ModalLayout;
