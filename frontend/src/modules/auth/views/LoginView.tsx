import { Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface ILoginForm {
  email: string;
  password: string;
}

function LoginView() {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginForm>();
  const onSubmit: SubmitHandler<ILoginForm> = (values) => {
    console.log(values);
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col items-center gap-4"
    >
      <Typography variant="h4">{t("login.title")}</Typography>
      <TextField
        required
        fullWidth
        {...register("email")}
        type={"email"}
        size={"small"}
        label={t("auth:form.email.label")}
        placeholder={t("auth:form.email.placeholder")}
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        fullWidth
        {...register("password", {
          required: {
            value: true,
            message: t("errors.form.required", {
              field: t("auth:form.password.label"),
            }),
          },
          minLength: {
            value: 6,
            message: t(""),
          },
        })}
        error={!!errors.password}
        helperText={t(errors.password?.message)}
        type={"password"}
        size={"small"}
        label={t("auth:form.password.label")}
        placeholder={t("auth:form.password.placeholder")}
        InputLabelProps={{ shrink: true }}
      />
      <Button
        fullWidth
        variant="contained"
        type="submit"
        sx={{ marginTop: "8px" }}
      >
        {t("login.submit")}
      </Button>
    </form>
  );
}

export default LoginView;
