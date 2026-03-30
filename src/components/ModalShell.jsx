function ModalShell({ onClose, disableClose, children }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4"
      onClick={() => {
        if (!disableClose) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-md" onClick={(event) => event.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

export default ModalShell;