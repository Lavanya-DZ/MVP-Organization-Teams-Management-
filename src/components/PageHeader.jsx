function PageHeader({ title, description, actions, children }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
        {description && <p className="mt-1 text-sm text-slate-600">{description}</p>}
        {children}
      </div>
      {actions && <div>{actions}</div>}
    </div>
  );
}

export default PageHeader;