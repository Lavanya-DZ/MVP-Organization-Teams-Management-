function AuthFormCard({ eyebrow, title, description, onSubmit, children }) {
  return (
    <form
      onSubmit={onSubmit}
      className="relative z-10 w-full max-w-md space-y-5 rounded-2xl border border-white/10 bg-white/10 p-8 text-white backdrop-blur-xl"
    >
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-cyan-300">{eyebrow}</p>
        <h2 className="mt-2 text-3xl font-semibold text-white">{title}</h2>
        <p className="mt-1 text-sm text-slate-300">{description}</p>
      </div>

      {children}
    </form>
  );
}

export default AuthFormCard;