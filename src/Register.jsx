import React, { useState } from "react";
import "./styles/Register.css";

const Register = ({ onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    address: "",
    contactNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    age: "",
    address: "",
    contactNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    age: false,
    address: false,
    contactNumber: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const sanitizeInput = (value) => {
    return value
      .trim()
      .replace(/[<>"';%(){}]/g, "")
      .replace(/\s{2,}/g, " ");
  };

  const formHandleChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = sanitizeInput(value);

    setFormData((prev) => ({
      ...prev,
      [name]: sanitizedValue,
    }));

    // Only validate if the field has been touched
    if (touched[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, sanitizedValue),
      }));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      newErrors[key] = validateField(key, formData[key]);
    });
    setErrors(newErrors);

    // Check if form is valid
    const isValid = Object.values(newErrors).every((error) => !error);

    if (!isValid) {
      setSubmitError("Please fix all errors before submitting.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Here you would typically make an API call
      console.log("Form submitted:", formData);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Handle successful submission
      // You might want to redirect or show a success message
      onClose(); // Close the modal after successful submission
    } catch (error) {
      setSubmitError("An error occurred during submission. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateField = (name, value) => {
    let error = "";
    const sanitizedValue = sanitizeInput(value);

    switch (name) {
      case "firstName":
      case "lastName":
        if (!sanitizedValue) {
          error = "This field is required";
        } else if (sanitizedValue.length < 2) {
          error = "Must be at least 2 characters";
        } else if (sanitizedValue.length > 30) {
          error = "Maximum 30 characters allowed";
        } else if (!/^[\p{L}\s'-]+$/u.test(sanitizedValue)) {
          error = "Only letters, spaces, hyphens, and apostrophes allowed";
        }
        break;

      case "age":
        if (!sanitizedValue) {
          error = "This field is required";
        } else if (!/^\d+$/.test(sanitizedValue)) {
          error = "Age must be a whole number";
        } else {
          const ageNum = parseInt(sanitizedValue, 10);
          if (ageNum < 18) error = "Minimum age is 18";
          else if (ageNum > 120) error = "Please enter a valid age";
        }
        break;
      case "address":
        if (!sanitizedValue) {
          error = "Address is required";
        } else if (sanitizedValue.length < 5) {
          error = "Address too short (min 5 characters)";
        } else if (sanitizedValue.length > 100) {
          error = "Address too long (max 100 characters)";
        }
        break;
      case "contactNumber":
        const cleanNumber = sanitizedValue.replace(/[^0-9]/g, "");
        if (!sanitizedValue) {
          error = "Contact number is required";
        } else if (cleanNumber.length < 7) {
          error = "Must contain at least 7 digits";
        } else if (cleanNumber.length > 15) {
          error = "Maximum 15 digits allowed";
        } else if (/([+()-])\1/.test(sanitizedValue)) {
          error = "Invalid character sequence";
        }
        break;
      case "email":
        if (!sanitizedValue) {
          error = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sanitizedValue)) {
          error = "Please enter a valid email address";
        }
        break;
      case "password":
        if (!sanitizedValue) {
          error = "Password is required";
        } else if (sanitizedValue.length < 8) {
          error = "Password must be at least 8 characters";
        } else if (!/[A-Z]/.test(sanitizedValue)) {
          error = "Password must contain at least one uppercase letter";
        } else if (!/[0-9]/.test(sanitizedValue)) {
          error = "Password must contain at least one number";
        }
        break;

      case "confirmPassword":
        if (!sanitizedValue) {
          error = "Please confirm your password";
        } else if (sanitizedValue !== formData.password) {
          error = "Passwords do not match";
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <>
      <div className="register-modal">
        <div className="register-modal-header">
          <h3>Register</h3>
          <button
            id="close-register-btn"
            onClick={!isSubmitting ? onClose : undefined}
            aria-label="Close registration modal"
            disabled={isSubmitting}
          >
            &times;
          </button>
        </div>
        <div className="register-modal-body">
          {submitError && (
            <div className="error-message" role="alert">
              {submitError}
            </div>
          )}
          <form onSubmit={handleFormSubmit} noValidate>
            <label htmlFor="firstName">First Name</label>
            <input
              id="firstName"
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={formHandleChange}
              onBlur={handleBlur}
              className={
                touched.firstName && errors.firstName ? "input-error" : ""
              }
              aria-describedby="error-firstname"
              aria-invalid={!!errors.firstName}
              disabled={isSubmitting}
            />
            <div
              className="error-message"
              id="error-firstname"
              aria-live="assertive"
              style={{
                visibility:
                  touched.firstName && errors.firstName ? "visible" : "hidden",
                height: touched.firstName ? "auto" : "1rem",
              }}
            >
              {touched.firstName ? errors.firstName || " " : " "}
            </div>

            <label htmlFor="lastName">Last Name</label>
            <input
              id="lastName"
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={formHandleChange}
              onBlur={handleBlur}
              className={
                touched.lastName && errors.lastName ? "input-error" : ""
              }
              aria-describedby="error-lastname"
              aria-invalid={!!errors.lastName}
              disabled={isSubmitting}
            />
            <div
              className="error-message"
              id="error-lastname"
              aria-live="assertive"
              style={{
                visibility:
                  touched.lastName && errors.lastName ? "visible" : "hidden",
                height: touched.lastName ? "auto" : "1rem",
              }}
            >
              {touched.lastName ? errors.lastName || " " : " "}
            </div>

            <label htmlFor="age">Age</label>
            <input
              id="age"
              type="number"
              pattern="[0-9]*"
              name="age"
              value={formData.age}
              onChange={formHandleChange}
              onBlur={handleBlur}
              className={touched.age && errors.age ? "input-error" : ""}
              aria-describedby="error-age"
              aria-invalid={!!errors.age}
              disabled={isSubmitting}
            />
            <div
              className="error-message"
              id="error-age"
              aria-live="assertive"
              style={{
                visibility: touched.age && errors.age ? "visible" : "hidden",
                height: touched.age ? "auto" : "1rem",
              }}
            >
              {touched.age ? errors.age || " " : " "}
            </div>

            <label htmlFor="address">Address</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={formHandleChange}
              rows={4}
              onBlur={handleBlur}
              className={touched.address && errors.address ? "input-error" : ""}
              aria-describedby="error-address"
              aria-invalid={!!errors.address}
              disabled={isSubmitting}
            />
            <div
              className="error-message"
              id="error-address"
              aria-live="assertive"
              style={{
                visibility:
                  touched.address && errors.address ? "visible" : "hidden",
                height: touched.address ? "auto" : "1rem",
              }}
            >
              {touched.address ? errors.address || " " : " "}
            </div>

            <label htmlFor="contactNumber">Contact #</label>
            <input
              id="contactNumber"
              type="tel"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={formHandleChange}
              onBlur={handleBlur}
              className={
                touched.contactNumber && errors.contactNumber
                  ? "input-error"
                  : ""
              }
              aria-describedby="error-contactnumber"
              aria-invalid={!!errors.contactNumber}
              disabled={isSubmitting}
            />
            <div
              className="error-message"
              id="error-contactnumber"
              aria-live="assertive"
              style={{
                visibility:
                  touched.contactNumber && errors.contactNumber
                    ? "visible"
                    : "hidden",
                height: touched.contactNumber ? "auto" : "1rem",
              }}
            >
              {touched.contactNumber ? errors.contactNumber || " " : " "}
            </div>

            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={formHandleChange}
              onBlur={handleBlur}
              className={touched.email && errors.email ? "input-error" : ""}
              aria-describedby="error-email"
              aria-invalid={!!errors.email}
              disabled={isSubmitting}
            />
            <div
              className="error-message"
              id="error-email"
              aria-live="assertive"
              style={{
                visibility:
                  touched.email && errors.email ? "visible" : "hidden",
                height: touched.email ? "auto" : "1rem",
              }}
            >
              {touched.email ? errors.email || " " : " "}
            </div>

            <label htmlFor="password">Password</label>
            <div className="password-input-container">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Must be 8+ characters with 1 uppercase letter and 1 number"
                value={formData.password}
                onChange={formHandleChange}
                onBlur={handleBlur}
                className={
                  touched.password && errors.password ? "input-error" : ""
                }
                aria-describedby="error-password"
                aria-invalid={!!errors.password}
                disabled={isSubmitting}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Hide password" : "Show password"}
                disabled={isSubmitting}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
            <div
              className="error-message"
              id="error-password"
              aria-live="assertive"
              style={{
                visibility:
                  touched.password && errors.password ? "visible" : "hidden",
                height: touched.password ? "auto" : "1rem",
              }}
            >
              {touched.password ? errors.password || " " : " "}
            </div>

            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="confirm-password-input-container">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Re-type password"
                value={formData.confirmPassword}
                onChange={formHandleChange}
                onBlur={handleBlur}
                className={
                  touched.confirmPassword && errors.confirmPassword
                    ? "input-error"
                    : ""
                }
                aria-describedby="error-confirm-password"
                aria-invalid={!!errors.confirmPassword}
                disabled={isSubmitting}
              />
              <button
                type="button"
                className="confirm-password-toggle"
                onClick={toggleConfirmPasswordVisibility}
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
                disabled={isSubmitting}
              >
                {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
            <div
              className="error-message"
              id="error-confirm-password"
              aria-live="assertive"
              style={{
                visibility:
                  touched.confirmPassword && errors.confirmPassword
                    ? "visible"
                    : "hidden",
                height: touched.confirmPassword ? "auto" : "1rem",
              }}
            >
              {touched.confirmPassword ? errors.confirmPassword || " " : " "}
            </div>

            <div className="form-btn">
              <button
                type="submit"
                id="submit-btn"
                disabled={isSubmitting}
                aria-busy={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="submit-content">
                    Submitting...
                    <span className="submit-spinner"></span>
                  </span>
                ) : (
                  "Submit"
                )}
              </button>
              <button
                id="cancel-btn"
                onClick={onClose}
                type="button"
                disabled={isSubmitting}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
      <div
        className="register-modal-overlay"
        onClick={!isSubmitting ? onClose : undefined}
      ></div>
    </>
  );
};

export default Register;
