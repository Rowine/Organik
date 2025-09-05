/**
 * Password utility functions
 */

export interface PasswordStrength {
  strength: number;
  text: string;
  color: string;
  width: string;
}

/**
 * Calculate password strength based on various criteria
 * @param password - The password to analyze
 * @returns Password strength information
 */
export const getPasswordStrength = (password: string): PasswordStrength => {
  if (password.length === 0) {
    return { strength: 0, text: "", color: "", width: "0%" };
  }

  if (password.length < 6) {
    return { strength: 1, text: "Weak", color: "bg-red-500", width: "25%" };
  }

  if (password.length < 8) {
    return { strength: 2, text: "Fair", color: "bg-yellow-500", width: "50%" };
  }

  // Check for complexity: lowercase, uppercase, and number
  if (password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)) {
    return {
      strength: 4,
      text: "Strong",
      color: "bg-green-500",
      width: "100%",
    };
  }

  return { strength: 3, text: "Good", color: "bg-blue-500", width: "75%" };
};

/**
 * Validate password requirements
 * @param password - The password to validate
 * @returns Array of validation errors (empty if valid)
 */
export const validatePasswordRequirements = (password: string): string[] => {
  const errors: string[] = [];

  if (password.length < 6) {
    errors.push("Password must be at least 6 characters long");
  }

  if (password.length < 8) {
    errors.push("Consider using at least 8 characters for better security");
  }

  if (!password.match(/[a-z]/)) {
    errors.push("Add lowercase letters for better security");
  }

  if (!password.match(/[A-Z]/)) {
    errors.push("Add uppercase letters for better security");
  }

  if (!password.match(/\d/)) {
    errors.push("Add numbers for better security");
  }

  if (!password.match(/[^a-zA-Z0-9]/)) {
    errors.push("Add special characters for better security");
  }

  return errors;
};

/**
 * Check if password meets minimum security requirements
 * @param password - The password to check
 * @returns True if password meets minimum requirements
 */
export const isPasswordSecure = (password: string): boolean => {
  return (
    password.length >= 6 &&
    password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/) !== null
  );
};

/**
 * Generate password strength color class for Tailwind CSS
 * @param strength - Password strength level (0-4)
 * @returns Tailwind CSS color class
 */
export const getPasswordStrengthColor = (strength: number): string => {
  switch (strength) {
    case 1:
      return "text-red-500";
    case 2:
      return "text-yellow-500";
    case 3:
      return "text-blue-500";
    case 4:
      return "text-green-500";
    default:
      return "text-gray-500";
  }
};

/**
 * Generate password strength background color class for Tailwind CSS
 * @param strength - Password strength level (0-4)
 * @returns Tailwind CSS background color class
 */
export const getPasswordStrengthBgColor = (strength: number): string => {
  switch (strength) {
    case 1:
      return "bg-red-500";
    case 2:
      return "bg-yellow-500";
    case 3:
      return "bg-blue-500";
    case 4:
      return "bg-green-500";
    default:
      return "bg-gray-500";
  }
};
