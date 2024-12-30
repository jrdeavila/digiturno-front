import LoginForm from "@/components/login-form";
import DefaultLayout from "@/layouts/default";

export default function LoginPage() {

  return (
    <DefaultLayout className="min-h-screen w-full justify-center items-center flex">
      <LoginForm />
    </DefaultLayout>
  );
}

