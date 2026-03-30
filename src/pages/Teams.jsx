import TeamList from "../components/TeamList";
import PageHeader from "../components/PageHeader";

function Teams(){
  return(
    <div className="space-y-5">
      <PageHeader
        title="Teams"
        description="Select an organization, then create or manage its teams."
      />

      <TeamList />
    </div>
  )
}

export default Teams;