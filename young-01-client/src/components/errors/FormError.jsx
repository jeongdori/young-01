import { Typography } from "@mui/material";
import { useFormContext } from "react-hook-form";
import PropTypes from "prop-types";

const FormError = ({ name }) => {
  const {
    formState: { errors },
  } = useFormContext();
  // const ctx = useFormContext();
  // const errors = ctx?.formState?.errors || {};
  const message = errors[name]?.message;

  // errors[name]이 undefined일 경우, message는 undefined가 됨
  // errors[name]이 존재할 경우, message는 그 객체의 message 속성값이 됨
  return message ? (
    <Typography color="error" variant="body2">
      {message}
    </Typography>
  ) : null;
};

FormError.propTypes = {
  name: PropTypes.string.isRequired,
};

export default FormError;
