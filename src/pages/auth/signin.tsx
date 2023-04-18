import Layout from "layouts/centered";
import CenteredForm from "layouts/centered-form";

import {signIn} from "next-auth/react";
import {useRouter} from "next/router";
import {FormEventHandler, useState} from "react";

const SignIn: React.FC = () => {
  const [userInfo, setUserInfo] = useState({username: "", password: ""});
  const router = useRouter();

  const handeSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      username: userInfo.username,
      password: userInfo.password,
      redirect: false,
    });

    if (res?.ok) {
      router.replace("/dashboard");
    }
  };

  return (
    <Layout>
      <CenteredForm
        title="Login"
        subtitle="Please enter your username and password to login">
        <>
          <form onSubmit={handeSubmit}>
            <input
              value={userInfo.username}
              onChange={({target}) => {
                setUserInfo({...userInfo, username: target.value});
              }}
              type="text"
              placeholder="username"
            />
            <input
              value={userInfo.password}
              onChange={({target}) => {
                setUserInfo({...userInfo, password: target.value});
              }}
              type="password"
              placeholder="********"
            />
            <input type="submit" value="Login" />
          </form>
        </>
      </CenteredForm>
    </Layout>
  );
};

export default SignIn;
