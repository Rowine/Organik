import { useState, useCallback } from "react";
import { ValidationError } from "../types/errors";

// Form field configuration
export interface FormFieldConfig {
  initialValue: string | number | boolean;
  required?: boolean;
  validate?: (value: string) => string | null;
}

// Form configuration
export interface FormConfig {
  [fieldName: string]: FormFieldConfig;
}

// Form state
export interface FormState {
  values: Record<string, any>;
  errors: Record<string, ValidationError>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
}

// Hook return type
export interface UseFormStateReturn {
  // State
  values: Record<string, any>;
  errors: Record<string, ValidationError>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isValid: boolean;

  // Actions
  setValue: (field: string, value: any) => void;
  setError: (field: string, error: ValidationError | null) => void;
  setTouched: (field: string, touched?: boolean) => void;
  setSubmitting: (submitting: boolean) => void;

  // Form handlers
  handleChange: (
    field: string
  ) => (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  handleBlur: (field: string) => () => void;
  handleSubmit: (
    onSubmit: (values: Record<string, any>) => void | Promise<void>
  ) => (e: React.FormEvent) => void;

  // Utilities
  reset: () => void;
  validateField: (field: string) => boolean;
  validateForm: () => boolean;
  getFieldError: (field: string) => ValidationError | null;
  hasFieldError: (field: string) => boolean;
}

/**
 * Custom hook for managing form state with validation
 *
 * @param config - Form field configuration
 * @returns Form state and handlers
 *
 * @example
 * ```typescript
 * const form = useFormState({
 *   email: {
 *     initialValue: '',
 *     required: true,
 *     validate: (value) => !value.includes('@') ? 'Invalid email' : null
 *   },
 *   password: {
 *     initialValue: '',
 *     required: true,
 *     validate: (value) => value.length < 6 ? 'Password too short' : null
 *   }
 * })
 *
 * return (
 *   <form onSubmit={form.handleSubmit(handleLogin)}>
 *     <input
 *       value={form.values.email}
 *       onChange={form.handleChange('email')}
 *       onBlur={form.handleBlur('email')}
 *     />
 *     {form.hasFieldError('email') && (
 *       <span>{form.getFieldError('email')?.message}</span>
 *     )}
 *   </form>
 * )
 * ```
 */
export const useFormState = (config: FormConfig): UseFormStateReturn => {
  // Initialize form state
  const initialValues = Object.keys(config).reduce((acc, key) => {
    acc[key] = config[key].initialValue;
    return acc;
  }, {} as Record<string, any>);

  const [values, setValues] = useState<Record<string, any>>(initialValues);
  const [errors, setErrors] = useState<Record<string, ValidationError>>({});
  const [touched, setTouchedState] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate a single field
  const validateField = useCallback(
    (field: string): boolean => {
      const fieldConfig = config[field];
      if (!fieldConfig) return true;

      const value = values[field];
      let error: ValidationError | null = null;

      // Check required
      if (
        fieldConfig.required &&
        (!value || (typeof value === "string" && !value.trim()))
      ) {
        error = {
          message: `${
            field.charAt(0).toUpperCase() + field.slice(1)
          } is required`,
          field,
          code: "VALIDATION_ERROR",
          timestamp: new Date().toISOString(),
        };
      }
      // Run custom validation
      else if (fieldConfig.validate && typeof value === "string") {
        const validationError = fieldConfig.validate(value);
        if (validationError) {
          error = {
            message: validationError,
            field,
            code: "VALIDATION_ERROR",
            timestamp: new Date().toISOString(),
          };
        }
      }

      setErrors((prev) => {
        const newErrors = { ...prev };
        if (error) {
          newErrors[field] = error;
        } else {
          delete newErrors[field];
        }
        return newErrors;
      });

      return !error;
    },
    [config, values]
  );

  // Validate entire form
  const validateForm = useCallback((): boolean => {
    const fieldNames = Object.keys(config);
    const results = fieldNames.map((field) => validateField(field));
    return results.every((result) => result);
  }, [config, validateField]);

  // Check if form is valid
  const isValid =
    Object.keys(errors).length === 0 ||
    Object.values(errors).every((error) => !error);

  // Set field value
  const setValue = useCallback(
    (field: string, value: any) => {
      setValues((prev) => ({ ...prev, [field]: value }));

      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    },
    [errors]
  );

  // Set field error
  const setError = useCallback(
    (field: string, error: ValidationError | null) => {
      setErrors((prev) => {
        const newErrors = { ...prev };
        if (error) {
          newErrors[field] = error;
        } else {
          delete newErrors[field];
        }
        return newErrors;
      });
    },
    []
  );

  // Set field touched state
  const setTouched = useCallback(
    (field: string, touchedValue: boolean = true) => {
      setTouchedState((prev) => ({ ...prev, [field]: touchedValue }));
    },
    []
  );

  // Set submitting state
  const setSubmitting = useCallback((submitting: boolean) => {
    setIsSubmitting(submitting);
  }, []);

  // Handle input change
  const handleChange = useCallback(
    (field: string) =>
      (
        e: React.ChangeEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
      ) => {
        const value =
          e.target.type === "checkbox"
            ? (e.target as HTMLInputElement).checked
            : e.target.value;

        setValue(field, value);
      },
    [setValue]
  );

  // Handle input blur
  const handleBlur = useCallback(
    (field: string) => () => {
      setTouched(field, true);
      validateField(field);
    },
    [setTouched, validateField]
  );

  // Handle form submit
  const handleSubmit = useCallback(
    (onSubmit: (values: Record<string, any>) => void | Promise<void>) =>
      async (e: React.FormEvent) => {
        e.preventDefault();

        // Mark all fields as touched
        const allTouched = Object.keys(config).reduce((acc, key) => {
          acc[key] = true;
          return acc;
        }, {} as Record<string, boolean>);
        setTouchedState(allTouched);

        // Validate form
        const isFormValid = validateForm();
        if (!isFormValid) return;

        setIsSubmitting(true);

        try {
          await onSubmit(values);
        } finally {
          setIsSubmitting(false);
        }
      },
    [config, values, validateForm]
  );

  // Reset form
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouchedState({});
    setIsSubmitting(false);
  }, [initialValues]);

  // Get field error
  const getFieldError = useCallback(
    (field: string): ValidationError | null => {
      return errors[field] || null;
    },
    [errors]
  );

  // Check if field has error
  const hasFieldError = useCallback(
    (field: string): boolean => {
      return !!(errors[field] && touched[field]);
    },
    [errors, touched]
  );

  return {
    // State
    values,
    errors,
    touched,
    isSubmitting,
    isValid,

    // Actions
    setValue,
    setError,
    setTouched,
    setSubmitting,

    // Form handlers
    handleChange,
    handleBlur,
    handleSubmit,

    // Utilities
    reset,
    validateField,
    validateForm,
    getFieldError,
    hasFieldError,
  };
};

// Built-in validation helpers
export const validators = {
  required:
    (message = "This field is required") =>
    (value: string) =>
      !value || !value.trim() ? message : null,

  email:
    (message = "Invalid email address") =>
    (value: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return !emailRegex.test(value) ? message : null;
    },

  minLength: (min: number, message?: string) => (value: string) => {
    const msg = message || `Must be at least ${min} characters`;
    return value.length < min ? msg : null;
  },

  maxLength: (max: number, message?: string) => (value: string) => {
    const msg = message || `Must be no more than ${max} characters`;
    return value.length > max ? msg : null;
  },

  password:
    (message = "Password must be at least 6 characters") =>
    (value: string) =>
      value.length < 6 ? message : null,

  confirmPassword:
    (password: string, message = "Passwords do not match") =>
    (value: string) =>
      value !== password ? message : null,

  numeric:
    (message = "Must be a number") =>
    (value: string) =>
      isNaN(Number(value)) ? message : null,

  positive:
    (message = "Must be a positive number") =>
    (value: string) => {
      const num = Number(value);
      return isNaN(num) || num <= 0 ? message : null;
    },
};
