function CreatePanel({ title, description, children, submitError, submitLabel, submitting, onSubmit }) {
  return (
    <section className="rounded-2xl bg-gradient-to-b from-slate-900 to-cyan-900 p-5 text-white shadow-lg">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-cyan-100/90">{description}</p>

      <form onSubmit={onSubmit} className="mt-4 space-y-4">
        {children}

        {submitError && <p className="text-sm text-rose-200">{submitError}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Creating..." : submitLabel}
        </button>
      </form>
    </section>
  );
}

export default CreatePanel;