import LoginForm from "@/components/login-form";
import DefaultLayout from "@/layouts/default";
import styled from "styled-components";

export default function LoginPage() {
  return (
    <DefaultLayout>
      <LoginFormContainer>
        <LoginForm />
      </LoginFormContainer>
    </DefaultLayout>
  );
}

const LoginFormContainer = styled.div`
  height: 100%;
  width: 100%;

  #card-login-form {
    width: 40rem;
    height: 20rem;
    margin: auto;
  }

  #card-login-form button {
    text-align: center;
    weight: 700;
  }
`;
