import { Typography } from '@mui/material';
import { useFormContext, FieldValues, FieldError } from 'react-hook-form';
import PropTypes from 'prop-types';

interface FormErrorProps {
    name: string;
}

const FormError = ({ name }: FormErrorProps) => {
    const {
        formState: { errors },
    } = useFormContext<FieldValues>();
    // const ctx = useFormContext();
    // const errors = ctx?.formState?.errors || {};

    const fieldError = errors[name] as FieldError | undefined;
    const message = fieldError?.message;

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
