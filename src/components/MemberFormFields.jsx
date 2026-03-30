function MemberFormFields({ authUserId, onAuthUserIdChange, submitting }) {
  return (
    <div>
      <label htmlFor="member-auth-user-id" className="block text-sm font-medium text-cyan-100">
        Auth User ID
      </label>
      <input
        id="member-auth-user-id"
        type="text"
        value={authUserId}
        onChange={onAuthUserIdChange}
        placeholder="Enter auth user id"
        className="mt-1 w-full rounded-lg border border-cyan-600/40 bg-slate-950/40 px-3 py-2 text-sm text-white outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/40"
        disabled={submitting}
      />
    </div>
  );
}

export default MemberFormFields;
