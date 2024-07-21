import { ClientTable } from "@/components/client-table";
import { ClientTypeTable } from "@/components/client-type-table";
import { CreateClientForm } from "@/components/create-client-form";
import DefaultLayout from "@/layouts/default";

export default function UsersPage() {
  return (
    <DefaultLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="lg:col-span-2">
          <CreateClientForm />
        </div>
        <div className="lg:col-span-1">
          <ClientTypeTable />
        </div>
        <div className="lg:col-span-3">
          <ClientTable />
        </div>
      </div>
    </DefaultLayout>
  );
}
