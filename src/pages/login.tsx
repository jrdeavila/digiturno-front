import LoginForm from "@/components/login-form";
import useLoading from "@/hooks/use-loading";
import DefaultLayout from "@/layouts/default";
import { useEffect } from "react";

export default function LoginPage() {
  const { setLoading } = useLoading();
  useEffect(() => {
    setLoading(false);
  }, [setLoading]);
  return (
    <DefaultLayout className="min-h-screen w-full justify-center items-center flex">
      <LoginForm />
    </DefaultLayout>
  );
}

