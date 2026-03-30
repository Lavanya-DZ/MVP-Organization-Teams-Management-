function ModalCloseButton({ onClose, disabled }) {
  return (
    <div className="flex justify-end">
      <button
        type="button"
        onClick={onClose}
        disabled={disabled}
        className="rounded-md border border-cyan-200/40 px-2 py-1 text-xs font-medium text-cyan-100 hover:bg-cyan-100/10"
      >
        Close
      </button>
    </div>
  );
}

export default ModalCloseButton;