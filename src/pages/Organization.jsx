import OrganizationList from "../components/OrganizationList";
import PageHeader from "../components/PageHeader";

function Organization(){
  return(
    <div className="space-y-5">
      <PageHeader
        title="Organizations"
        description="Create and manage organizations to unlock teams and members."
      />

      <OrganizationList />
    </div>
  )
}

export default Organization;