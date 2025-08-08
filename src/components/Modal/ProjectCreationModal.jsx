import { useState } from "react";
import { Modal, ModalDialog, DialogTitle, DialogContent } from "@mui/joy";
import { Button, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useSnackbar } from "notistack";
import api from "../../api/axios";
import { useUser } from "../../context/UserContext";

// Validation schema using Yup
const ProjectSchema = Yup.object().shape({
  projectName: Yup.string().required("Project Name is required"),
  projectDescription: Yup.string().required("Project Description is required"),
});

export default function ProjectCreationModal({
  open,
  onClose,
  onProjectCreated,
}) {
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { refreshUser } = useUser();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(ProjectSchema),
  });

  const onSubmit = async (data) => {
    handleCreation(data);
  };

  const handleCreation = async (values) => {
    setLoading(true);
    try {
      const response = await api.post("/projects/create", {
        title: values.projectName,
        description: values.projectDescription,
      });
      const createdProject = response.data.id;
      onProjectCreated(createdProject);
      if (response.status === 200) {
        enqueueSnackbar("Project Created Successfully!", {
          variant: "success",
        });
      }
      reset();
      onClose();
    } catch (error) {
      enqueueSnackbar("An unexpected error occurred. Please try again.", {
        variant: "error",
      });
    } finally {
      refreshUser();
      setLoading(false);
    }
  };

  return (
    <Modal keepMounted open={open} onClose={onClose}>
      <ModalDialog>
        <DialogTitle className="justify-center">Create New Project</DialogTitle>
        <DialogContent>
          <form className="py-3" onSubmit={handleSubmit(onSubmit)}>
            <TextField
              label="Project Name"
              {...register("projectName")}
              error={!!errors.projectName}
              helperText={errors.projectName?.message}
              required
              fullWidth
            />
            <TextField
              label="Project Description"
              {...register("projectDescription")}
              error={!!errors.projectDescription}
              helperText={errors.projectDescription?.message}
              required
              fullWidth
              margin="normal"
            />
            <Button
              type="submit"
              disabled={isSubmitting || loading}
              fullWidth
              variant="contained"
              color="primary"
              className="!bg-primary-green"
            >
              {loading ? "Creating..." : "Create"}
            </Button>
          </form>
        </DialogContent>
      </ModalDialog>
    </Modal>
  );
}
