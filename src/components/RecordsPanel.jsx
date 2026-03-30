function RecordsPanel({ title, count, subtitle, emptyMessage, isEmpty, children }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
          {count} total
        </span>
      </div>

      {subtitle && <p className="mt-2 text-sm text-slate-600">{subtitle}</p>}

      {isEmpty ? (
        <p className="mt-4 text-sm text-slate-600">{emptyMessage}</p>
      ) : (
        <div className="mt-4">{children}</div>
      )}
    </section>
  );
}

export default RecordsPanel;