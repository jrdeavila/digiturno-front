import BodyReception from "@/components/BodyReception";
import DefaultLayout from "@/layouts/default";
import "bootstrap/dist/css/bootstrap.min.css";

export default function ReceptorPage() {
  return (
    <DefaultLayout className="overflow-y-auto pb-10">
      <BodyReception />
    </DefaultLayout>
  );
}
