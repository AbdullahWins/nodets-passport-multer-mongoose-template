//src/utils/constants/static.constant.ts
export const staticProps = {
  default: {
    DEFAULT_IMAGE_PATH: "public/default/default.png",
    DEFAULT_DOCUMENT_PATH: "public/default/default.png",
    DEFAULT_SUPER_ADMIN: "super_admin",
  },

  cors: {
    CORS_BLOCKED: "CORS blocked for this origin!",
    CORS_ALLOWED: "CORS allowed for this origin!",
    CORS_BLOCKED_FOR_ORIGIN: "CORS blocked for origin",
    CORS_ALLOWED_FOR_ORIGIN: "CORS allowed for origin",
  },

  monitor: {
    FAILED_TO_FETCH_METRICS: "Failed to fetch metrics",
  },

  database: {
    CONNECTION_SUCCESS_PRIMARY: "Connected to primary database",
    CONNECTION_SUCCESS_SECONDARY: "Connected to secondary database",
    CONNECTION_ERROR_PRIMARY: "Error connecting to primary database",
    CONNECTION_ERROR_SECONDARY: "Error connecting to secondary database",
  },

  color: {
    RED: "#ff0000",
    GREEN: "#00ff00",
    BLUE: "#0000ff",
    YELLOW: "#ffff00",
    ORANGE: "#ffa500",
    PURPLE: "#800080",
    PINK: "#ffc0cb",
    BLACK: "#000000",
    WHITE: "#ffffff",
  },

  common: {
    LIMIT_EXCEEDED: "Too many requests! Please try again later.",
    TEXT_REQUIRED_FOR_QR_CODE: "Text is required for QR code generation",
    INVALID_DATA: "Invalid data!",
    SOMETHING_WENT_WRONG: "Something went wrong!",
    NOT_FOUND: "Not found!",
    NOT_CREATED: "Not created!",

    FILE_NOT_FOUND: "File not found!",
    FILE_RETRIEVED: "File retrieved successfully!",

    ALREADY_EXISTS: "Already exists!",
    NO_PASSWORD_SET: "No password set!",

    CREATED: "Created successfully!",
    FAILED_TO_CREATE: "Failed to create!",

    RETRIEVED: "Retrieved successfully!",
    FAILED_TO_RETRIEVE: "Failed to retrieve!",

    UPDATED: "Updated successfully!",
    FAILED_TO_UPDATE: "Failed to update!",

    DELETED: "Deleted successfully!",
    FAILED_TO_DELETE: "Failed to delete!",

    PASSWORD_UPDATED: "Password updated successfully!",
    PASSWORD_RESET: "Password reset successfully!",

    LOGGED_IN: "Logged in successfully!",
    LOGGED_OUT: "Logged out successfully!",

    INVALID_ID: "Invalid ID format!",
    INVALID_CREDENTIALS: "Invalid credentials!",
    INVALID_PASSWORD: "Invalid password!",

    FORBIDDEN: "Forbidden!",
    UNAUTHORIZED: "Unauthorized!",
    DATA_REQUIRED: "Data is required!",
    MISSING_REQUIRED_FIELDS: "Missing required fields!",

    MULTER_ERROR: "Multer error occured!",
    VALIDATION_ERROR: "Validation error!",
    INTERNAL_SERVER_ERROR: "Internal server error!",

    FILE_UPLOADED: "File uploaded successfully!",
    FAILED_TO_UPLOAD_FILE: "Failed to upload file!",
  },

  otp: {
    OTP_SENT: "OTP sent successfully!",
    OTP_VERIFIED: "OTP verified successfully!",
    OTP_INVALID: "Invalid OTP!",
    OTP_EXPIRED: "OTP expired!",
  },

  jwt: {
    INVALID_TOKEN: "Invalid token!",
    TOKEN_EXPIRED: "Token has expired!",
    TOKEN_NOT_ACTIVE: "Token not active!",
    TOKEN_VERIFIED: "Token verified successfully!",
    TOKEN_GENERATED: "Token generated successfully!",
    TOKEN_GENERATION_FAILED: "Failed to generate token!",
    TOKEN_REFRESHED: "Token refreshed successfully!",
    TOKEN_REVOKED: "Token revoked successfully!",
    TOKEN_NOT_FOUND: "Token not found!",
    INVALID_ROLE_IN_JWT: "Invalid role in JWT!",
    NO_ENTITY_FOUND: "No entity found for the given ID",
    JWT_STRATEGY_ERROR: "JWT Strategy - Error:",
  },

  cast: {
    INVALID_ID: "Passed id is invalid!",
    CAST_ERROR: "Cast Error occured!",
  },

  email: {
    EMAIL_SERVER_READY: "Mail server is ready",
    TEMPLATE_RENDER_ERROR: "Failed to render email template!",
    TEMPLATE_MISSING: "Missing required field: template.",
    SUBJECT_MISSING: "Missing required field: subject.",
    EMAIL_MISSING: "Missing required field: email.",
    EMAIL_NOT_SENT: "Failed to send email to user.",
  },
};
