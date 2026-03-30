import MemberList from "../components/MemberList";

function Members(){
  return(
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Members</h2>
        <p className="mt-1 text-sm text-slate-600">Track member roles and availability across teams.</p>
      </div>

      <MemberList />
    </div>
  )
}

export default Members;