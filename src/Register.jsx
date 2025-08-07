import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles/Register.css";

const Register = ({ onClose }) => {
  // Form state management
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

  // UI state management
  const [isSubmitting, setIsSubmitting] = useState(false);
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
  const [showMatchValidation, setShowMatchValidation] = useState(false);
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });
  const [isFormValid, setIsFormValid] = useState(false);

  // Validate entire form whenever formData or errors change
  useEffect(() => {
    const hasErrors = Object.values(errors).some((error) => error !== "");
    const allFieldsFilled = Object.values(formData).every(
      (field) => field.trim() !== ""
    );
    setIsFormValid(!hasErrors && allFieldsFilled);
  }, [formData, errors]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts correcting
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);

  // Field validation logic
  const validateField = (name, value) => {
    const trimmedValue = value.trim();
    let error = "";

    switch (name) {
      case "firstName":
      case "lastName":
        if (!trimmedValue) {
          error = `${name === "firstName" ? "First" : "Last"} name is required`;
        } else if (trimmedValue.length < 2) {
          error = "Minimum 2 characters";
        } else if (trimmedValue.length > 30) {
          error = "Maximum 30 characters";
        } else if (!/^[a-zA-Z\s\-']+$/.test(trimmedValue)) {
          if (/[0-9]/.test(trimmedValue)) error = "Numbers not allowed";
          else if (/[!@#$%^&*]/.test(trimmedValue))
            error = "Special symbols not allowed";
          else error = "Only letters, spaces, hyphens, and apostrophes allowed";
        }
        break;

      case "age":
        const sanitizedAge = trimmedValue.replace(/\D/g, "");
        if (!trimmedValue) {
          error = "Age is required";
        } else if (sanitizedAge !== trimmedValue) {
          error = "Only numbers allowed";
        } else {
          const ageNum = parseInt(sanitizedAge, 10);
          if (ageNum < 18) error = "You must be at least 18 years old";
          else if (ageNum > 120) error = "Please enter a valid age";

          // Auto-format the age if valid
          if (!error && formData.age !== sanitizedAge) {
            setFormData((prev) => ({ ...prev, age: sanitizedAge }));
          }
        }
        break;

      case "email":
        if (!trimmedValue) {
          error = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedValue)) {
          error = "Please enter a valid email";
        } else if (trimmedValue.length > 254) {
          error = "Email too long (max 254 characters)";
        } else if (trimmedValue.endsWith(".")) {
          error = "Invalid email format";
        }
        break;

      case "address":
        const sanitizedAddress = trimmedValue
          .replace(/[<>"']/g, "")
          .replace(/\s{2,}/g, " ")
          .trim();

        if (!trimmedValue) {
          error = "Address is required";
        } else if (trimmedValue.length < 5) {
          error = "Address too short (min 5 characters)";
        } else if (trimmedValue.length > 200) {
          error = "Address too long (max 200 characters)";
        } else if (/[<>]/.test(trimmedValue)) {
          error = "Address contains invalid symbols";
        } else if (!/^[a-zA-Z0-9\s.,#\-()\/]+$/.test(trimmedValue)) {
          error = "Contains invalid characters";
        }

        // Auto-format address if valid
        if (!error && formData.address !== sanitizedAddress) {
          setFormData((prev) => ({ ...prev, address: sanitizedAddress }));
        }
        break;

      case "contactNumber":
        const sanitizedNumber = trimmedValue
          .replace(/[^\d+()\-\.\s]/g, "")
          .replace(/\s{2,}/g, " ")
          .trim();

        if (!trimmedValue) {
          error = "Phone number is required";
        } else if (!/^[\d+()\-\.\s]{6,20}$/.test(trimmedValue)) {
          error = "Invalid phone number format";
        } else if (!/\d{6,}/.test(trimmedValue.replace(/\D/g, ""))) {
          error = "Must contain at least 6 digits";
        } else if (trimmedValue.length > 20) {
          error = "Number too long (max 20 chars)";
        }

        // Auto-format number if valid
        if (!error && formData.contactNumber !== sanitizedNumber) {
          setFormData((prev) => ({ ...prev, contactNumber: sanitizedNumber }));
        }
        break;

      case "password":
        if (!trimmedValue) {
          error = "Password is required";
        } else if (trimmedValue.length < 8) {
          error = "Minimum 8 characters";
        } else if (!/[A-Z]/.test(trimmedValue)) {
          error = "At least 1 uppercase letter";
        } else if (!/[a-z]/.test(trimmedValue)) {
          error = "At least 1 lowercase letter";
        } else if (!/\d/.test(trimmedValue)) {
          error = "At least 1 number";
        } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(trimmedValue)) {
          error = "At least 1 special character";
        } else if (trimmedValue.length > 64) {
          error = "Maximum 64 characters";
        } else if (/(.)\1{3,}/.test(trimmedValue)) {
          error = "Too many repeating characters";
        }
        break;

      case "confirmPassword":
        if (!trimmedValue) {
          error = "Please confirm your password";
        } else if (trimmedValue !== formData.password) {
          error = "Passwords don't match";
        }
        break;
    }
    return error;
  };

  // Handle field blur (validate when leaving field)
  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));

    // Activate password match validation only for confirmPassword
    if (name === "confirmPassword") {
      setShowMatchValidation(true);
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    // Validate all fields before submission
    const newErrors = {};
    Object.entries(formData).forEach(([name, value]) => {
      newErrors[name] = validateField(name, value);
    });
    setErrors(newErrors);

    // Check if form is valid
    const isValid = Object.values(newErrors).every((error) => !error);
    if (!isValid) {
      setIsSubmitting(false); // Ensure button can be clicked again
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await axios.post(
        "http://localhost:5100/registration",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setRegistrationSuccess(true);
        setFormData({
          firstName: "",
          lastName: "",
          age: "",
          address: "",
          contactNumber: "",
          email: "",
          password: "",
          confirmPassword: "",
        });

        console.log("Registration successful", response.data);
        setTimeout(onClose, 2000); // Auto-close after success
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // Handle duplicate email error specifically
          if (error.response.data.name === "DuplicateError") {
            setErrors((prev) => ({
              ...prev,
              email: error.response.data.message,
            }));
          }
          // Handle other validation errors
          else if (error.response.data.details) {
            setErrors(error.response.data.details);
          }
          // Generic error from backend
          else {
            alert(error.response.data.message || "Registration failed");
          }
        } else {
          // Network error
          alert("Network error. Please try again.");
        }
      } else {
        // Unexpected error
        console.error("Unexpected error:", error);
        alert("An unexpected error occurred");
      }
    } finally {
      setIsSubmitting(false); // Always enable button
    }
  };

  if (registrationSuccess) {
    return (
      <div className="success-message">
        <h2>Registration Succesful</h2>
        <p>Your account has been created</p>
      </div>
    );
  }

  return (
    <>
      <div className="register-modal">
        <div className="register-modal-header">
          <h3>Register</h3>
          <button
            id="close-register-btn"
            aria-label="Close registration modal"
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        <div className="register-modal-body">
          <form noValidate onSubmit={handleSubmit}>
            {/* First Name Field */}
            <label htmlFor="firstName">First Name</label>
            <input
              id="firstName"
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={errors.firstName ? "input-error" : ""}
              aria-invalid={!!errors.firstName}
              aria-describedby={
                errors.firstName ? "firstName-error" : undefined
              }
            />
            <p
              id="firstName-error"
              className={`error-message ${!errors.firstName ? "empty" : ""}`}
            >
              {errors.firstName || "\u00A0"} {/* &nbsp; as fallback content */}
            </p>

            {/* Last Name Field */}
            <label htmlFor="lastName">Last Name</label>
            <input
              id="lastName"
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={errors.lastName ? "input-error" : ""}
              aria-invalid={!!errors.lastName}
              aria-describedby={errors.lastName ? "lastName-error" : undefined}
            />
            <p
              id="lastName-error"
              className={`error-message ${!errors.lastName ? "empty" : ""}`}
            >
              {errors.lastName || "\u00A0"} {/* &nbsp; as fallback content */}
            </p>

            {/* Age Field */}
            <label htmlFor="age">Age</label>
            <input
              id="age"
              type="text" // Using text to allow for better formatting
              inputMode="numeric" // Shows numeric keyboard on mobile
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={errors.age ? "input-error" : ""}
              aria-invalid={!!errors.age}
              aria-describedby={errors.age ? "age-error" : undefined}
            />
            <p
              id="age-error"
              className={`error-message ${!errors.age ? "empty" : ""}`}
            >
              {errors.age || "\u00A0"} {/* &nbsp; as fallback content */}
            </p>

            {/* Address Field */}
            <label htmlFor="address">Address</label>
            <textarea
              id="address"
              name="address"
              rows={4}
              value={formData.address}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={errors.address ? "input-error" : ""}
              aria-invalid={!!errors.address}
              aria-describedby={errors.address ? "address-error" : undefined}
            />
            <p
              id="address-error"
              className={`error-message ${!errors.address ? "empty" : ""}`}
            >
              {errors.address || "\u00A0"} {/* &nbsp; as fallback content */}
            </p>

            {/* Contact Number Field */}
            <label htmlFor="contactNumber">Contact #</label>
            <input
              id="contactNumber"
              type="tel"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={errors.contactNumber ? "input-error" : ""}
              aria-invalid={!!errors.contactNumber}
              aria-describedby={
                errors.contactNumber ? "contactNumber-error" : undefined
              }
            />
            <p
              id="contactNumber-error"
              className={`error-message ${
                !errors.contactNumber ? "empty" : ""
              }`}
            >
              {errors.contactNumber || "\u00A0"}{" "}
              {/* &nbsp; as fallback content */}
            </p>

            {/* Email Field */}
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={errors.email ? "input-error highlight-error" : ""}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            <p
              id="email-error"
              className={`error-message ${!errors.email ? "empty" : ""}`}
            >
              {errors.email || "\u00A0"} {/* &nbsp; as fallback content */}
            </p>

            {/* Password Field */}
            <label htmlFor="password">Password</label>
            <div className="password-input-container">
              <input
                id="password"
                type={showPassword.password ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={errors.password ? "input-error" : ""}
                aria-invalid={!!errors.password}
                aria-describedby="password-error"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => togglePasswordVisibility("password")} // Only toggles password field
                aria-label={
                  showPassword.password ? "Hide password" : "Show password"
                }
                tabIndex={-1}
              >
                {showPassword.password ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
            <p
              id="password-error"
              className={`error-message ${!errors.password ? "empty" : ""}`}
            >
              {errors.password || "\u00A0"}
            </p>

            {/* Confirm Password Field */}
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="confirm-password-input-container">
              <input
                id="confirmPassword"
                type={showPassword.confirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={(e) => {
                  handleInputChange(e);
                  if (!errors.confirmPassword) setShowMatchValidation(true);
                }}
                onBlur={(e) => {
                  handleBlur(e);
                  setConfirmPasswordTouched(true);
                }}
                className={errors.confirmPassword ? "input-error" : ""}
                aria-invalid={!!errors.confirmPassword}
                aria-describedby="confirmPassword-message"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => togglePasswordVisibility("confirmPassword")}
                aria-label={
                  showPassword.confirmPassword
                    ? "Hide password"
                    : "Show password"
                }
                tabIndex={-1}
              >
                {showPassword.confirmPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
            <p
              id="confirmPassword-message"
              className={
                errors.confirmPassword
                  ? "error-message"
                  : confirmPasswordTouched &&
                    formData.password !== formData.confirmPassword
                  ? "error-message"
                  : confirmPasswordTouched &&
                    formData.password === formData.confirmPassword
                  ? "password-match"
                  : "empty-message"
              }
            >
              {errors.confirmPassword
                ? errors.confirmPassword
                : confirmPasswordTouched
                ? formData.password === formData.confirmPassword
                  ? "✓ Passwords match"
                  : "✗ Passwords don't match"
                : "\u00A0"}
            </p>

            {/* Form Buttons */}
            <div className="form-btn">
              <button
                type="submit"
                id="submit-btn"
                disabled={isSubmitting}
                aria-busy={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="spinner" aria-hidden="true" />
                ) : (
                  "Submit"
                )}
              </button>
              <button id="cancel-btn" type="button" onClick={onClose}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="register-modal-overlay" onClick={onClose}></div>
    </>
  );
};

export default Register;
