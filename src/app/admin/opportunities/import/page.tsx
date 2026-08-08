import OpportunityImport from "@/components/admin/OpportunityImport";
export default function ImportOpportunitiesPage() {
  return (
    <div className="container mx-auto py-8 px-6">

      <div className="mb-8">

        <h1 className="text-3xl font-bold">
          Import Opportunities
        </h1>

        <p className="text-muted-foreground mt-2">
          Upload an Excel file to bulk import opportunities into CA Connect.
        </p>

      </div>

      <OpportunityImport />

    </div>
  );
}