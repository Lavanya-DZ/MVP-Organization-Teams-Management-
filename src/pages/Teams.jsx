import TeamList from "../components/TeamList";

function Teams(){
  return(
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Teams</h2>
        <p className="mt-1 text-sm text-slate-600">Overview of team ownership and member counts.</p>
      </div>

      <TeamList />
    </div>
  )
}

export default Teams;