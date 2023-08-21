import Link from "next/link";
import CenteredForm from "layouts/centered-form";
import ForgotPassword from "components/sample-forms/forgot-password";

const Index: React.FC = () => {
  return (
    <CenteredForm
      title="Olvidaste la contrasena?"
      subtitle="Por favor ingresa tu email para recuperar tu clave">
      <ForgotPassword />
      <div className="w-full mt-2">
        <span>
          <Link href="/login">
            <a className="text-blue-500">Volver al login</a>
          </Link>
        </span>
      </div>
    </CenteredForm>
  );
};

export default Index;
