import Link from "next/link";
import Layout from "layouts/centered";
import CenteredForm from "layouts/centered-form";
import Login from "components/sample-forms/login";
import SocialMedia from "components/login-1/social-media";

const Index: React.FC = () => {
  return (
    <Layout>
      <CenteredForm
        title="Login"
        subtitle="Please enter your username and password to login">
        <Login />
        <div className="w-full mt-3 mb-6">
          <SocialMedia />
        </div>
        <div className="flex flex-row w-full">
          <span className="text-secondary mr-1">New user?</span>
          <span>
            <Link legacyBehavior href="/create-account">
              <a className="text-blue-500">Create account here</a>
            </Link>
          </span>
        </div>
        <div className="w-full">
          <span>
            <Link legacyBehavior href="/forgot-password">
              <a className="text-blue-500">Forgot password?</a>
            </Link>
          </span>
        </div>
      </CenteredForm>
    </Layout>
  );
};

export default Index;
