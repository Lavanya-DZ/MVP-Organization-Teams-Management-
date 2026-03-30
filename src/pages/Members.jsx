import MemberList from "../components/MemberList";
import PageHeader from "../components/PageHeader";

function Members(){
  return(
    <div className="space-y-5">
      <PageHeader
        title="Members"
        description="Select organization and team, then add members."
      />

      <MemberList />
    </div>
  )
}

export default Members;