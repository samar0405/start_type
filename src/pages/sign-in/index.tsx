import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveAccessToken } from "@token-service";
import { auth } from "@service";
import { ToastContainer, toast } from "react-toastify";
import { Formik, Form, Field, FieldProps } from "formik";
import * as Yup from "yup";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

interface FormValues {
  email: string;
  password: string;
}

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z]).{7,}$/,
      "Password must contain at least 7 characters, one uppercase and one lowercase letter"
    )
    .required("Password is required"),
});

const Index: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    try {
      const { data }: any = await auth.sign_in({
        email: values.email,
        password: values.password,
      });

      const { access_token } = data;
      if (access_token) {
        saveAccessToken("access_token", access_token);
        toast.success("Successfully signed in!");
        setTimeout(() => {
          navigate("/main");
        }, 1500);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to sign in. Please check your credentials.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="d-flex align-items-center justify-content-center min-vh-100">
        <div className="card p-5 shadow-sm">
          <h1 className="text-center mb-4">Login</h1>
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="d-flex flex-column gap-3">
                <Field name="email">
                  {({ field, meta }: FieldProps) => (
                    <div className="form-group">
                      <input
                        {...field}
                        type="email"
                        className={`form-control ${
                          meta.touched && meta.error ? "is-invalid" : ""
                        }`}
                        placeholder="Email"
                      />
                      {meta.touched && meta.error && (
                        <div className="invalid-feedback">{meta.error}</div>
                      )}
                    </div>
                  )}
                </Field>
                <Field name="password">
                  {({ field, meta }: FieldProps) => (
                    <div className="form-group position-relative">
                      <input
                        {...field}
                        type={showPassword ? "text" : "password"}
                        className={`form-control ${
                          meta.touched && meta.error ? "is-invalid" : ""
                        }`}
                        placeholder="Password"
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary position-absolute end-0 top-0 mt-1"
                        onClick={handleClickShowPassword}
                        style={{ border: "none", background: "none" }}
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                      {meta.touched && meta.error && (
                        <div className="invalid-feedback">{meta.error}</div>
                      )}
                    </div>
                  )}
                </Field>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  Sign In
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Index;
