import React from "react";
import { Modal, Box, Typography, Button, TextField } from "@mui/material";
import { Form, Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import service from "../../../service/service";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AxiosResponse } from "axios";
import ServiceItem from "../../../service/service";


const style: React.CSSProperties = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  backgroundColor: "background.paper", // Ensure "background.paper" is correctly defined
  border: "1px solid #000",
  boxShadow: "24px",
  padding: "16px",
  borderRadius: "8px",
};

interface ServiceItem {
  id?: number;
  name?: string;
  price?: number;
}

interface IndexProps {
  open: boolean;
  handleClose: () => void;
  item?: ServiceItem;
}

const validationSchema = Yup.object({
  name: Yup.string().required("Service name is required"),
  price: Yup.number()
    .typeError("Price must be a number")
    .required("Price is required")
    .positive("Price must be a positive number"),
});

const Index: React.FC<IndexProps> = ({ open, handleClose, item }) => {
  const initialValues: ServiceItem = {
    name: item?.name || "",
    price: item?.price || 0,
  };

  const handleSubmit = async (
    values: ServiceItem,
    { setSubmitting }: FormikHelpers<ServiceItem>
  ) => {
    try {
      let response: AxiosResponse<ServiceItem>;
      if (item && item.id) {
        // Update existing service item
        response = await service.update({ ...item, ...values });
        if (response.status === 200) {
          toast.success("Service updated successfully!");
        } else {
          throw new Error("Failed to update service");
        }
      } else {
        // Create new service item
        response = await service.create(values);
        if (response.status === 201) {
          toast.success("Service created successfully!");
        } else {
          throw new Error("Failed to create service");
        }
      }
      window.location.reload();
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while saving the service.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-title" variant="h6" component="h2">
            {item ? "Edit Service" : "Create Service"}
          </Typography>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({
              values,
              handleChange,
              touched,
              errors,
              handleBlur,
              isSubmitting,
            }) => (
              <Form id="submit" className="mt-6 space-y-4">
                <TextField
                  fullWidth
                  label="Service Name"
                  name="name"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.name}
                  type="text"
                  id="name"
                  required
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Price"
                  name="price"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.price}
                  type="number"
                  id="price"
                  required
                  error={touched.price && Boolean(errors.price)}
                  helperText={touched.price && errors.price}
                  margin="normal"
                />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 2,
                  }}
                >
                  <Button
                    onClick={handleClose}
                    variant="contained"
                    color="secondary"
                  >
                    Close
                  </Button>
                  <Button
                    variant="contained"
                    type="submit"
                    color="primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting" : "Save"}
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        </Box>
      </Modal>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
};

export default Index;
