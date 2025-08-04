import React, { useState } from "react";
import App from "./App";
import "./styles/Register.css";

const Register = ({ onClose }) => {
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

  const formHandleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleFormSubmit = (e) => {
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

    if (Object.values(newErrors).every((error) => !error)) {
      console.log("Form is valid, submitting...", formData);
      // Submit logic here
    }
  };

  const validateField = (name, value) => {
    let error = "";
    const sanitizedValue = value
      .trim()
      .replace(/[<>"';%(){}]/g, "")
      .replace(/\s{2,}/g, " ");
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
          // Regex for whole numbers
          error = "Age must be a whole number";
        } else if (parseInt(sanitizedValue) < 18) {
          error = "We don't allow minors to lease a stall";
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
        if (!sanitizedValue) {
          error = "Contact number is required";
        } else if (sanitizedValue.length < 7) {
          error = "Contact number should be at least 7 digits ";
        } else if (sanitizedValue.length > 15) {
          error = "Contact number too long (max 15 digits)";
        } else if (!/^[0-9+() -]+$/.test(sanitizedValue)) {
          error = "Only numbers, +, (), - and spaces allowed";
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
    }
    return error;
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  return (
    <>
      <div className="register-modal">
        <div className="register-modal-header">
          <h3>Register</h3>{" "}
          <p id="close-register-btn" onClick={onClose}>
            &times;
          </p>
        </div>
        <div className="register-modal-body">
          <form onSubmit={handleFormSubmit}>
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
            />
            <h6
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
            </h6>
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
            />
            <h6
              className="error-message"
              id="error-lastname"
              aria-live="assertive"
              style={{
                visibility:
                  touched.lastName && errors.lastName ? "visible" : "hidden",
                height: touched.firstName ? "auto" : "1rem",
              }}
            >
              {touched.lastName ? errors.lastName || " " : " "}
            </h6>
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
            />
            <h6
              className="error-message"
              id="error-age"
              aria-live="assertive"
              style={{
                visibility: touched.age && errors.age ? "visible" : "hidden",
                height: touched.age ? "auto" : "1rem",
              }}
            >
              {touched.age ? errors.age || " " : " "}
            </h6>
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
            />
            <h6
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
            </h6>
            <label htmlFor="contactNumber">Contact #</label>
            <input
              id="contactNumber"
              type="tel"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={formHandleChange}
              onBlur={handleBlur} // Add this
              className={
                touched.contactNumber && errors.contactNumber
                  ? "input-error"
                  : ""
              }
              aria-describedby="error-contactnumber"
              aria-invalid={!!errors.contactNumber}
            />
            <h6
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
            </h6>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={formHandleChange}
              onBlur={handleBlur} // Add this
              className={touched.email && errors.email ? "input-error" : ""}
              aria-describedby="error-email"
              aria-invalid={!!errors.email}
            />
            <h6
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
            </h6>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={formHandleChange}
              onBlur={handleBlur} // Add this
              className={
                touched.password && errors.password ? "input-error" : ""
              }
              aria-describedby="error-password"
              aria-invalid={!!errors.password}
            />
            <h6
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
            </h6>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={formHandleChange}
              onBlur={handleBlur} // Add this
              className={
                touched.confirmPassword && errors.confirmPassword
                  ? "input-error"
                  : ""
              }
              aria-describedby="error-password"
              aria-invalid={!!errors.password}
            />
            <h6
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
            </h6>
            <div className="form-btn">
              <button type="submit" id="submit-btn">
                Submit
              </button>
              <button id="cancel-btn" onClick={onClose}>
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
