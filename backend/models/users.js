import mongoose from "mongoose";

const usersSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    googleId: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true, //remove empty spaces from beginning and last email
    },
    password: {
      type: String,
      // Password is required only if googleId is not present
      /* have to do this coz google auth don't need password field.if present throws error. not needed
      coz google handles auth in it's own in google windows. but email field is required*/
      required: function() {
        return !this.googleId;
      },
    },
    refreshToken: {
      type: String,
    },
    role: {
      type: String,
      required: true,
      enum: ["user", "admin"],
      default: "user",
    },
    authProvider: {
      type: String,
      enum: ['jwt', 'google'],
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    photo: {
      type: String,
    },
    verificationCode: String,
    verificationCodeExpiresAt: Date,

    verificationCodeAttempts: {
      type: Number,
      default: 0,
    },
    lockVerificationCodeUntil: Date,

    verificationResendAttempts: { type: Number, default: 0 }, // Tracking resend at
    lockVerificationResendUntil: Date,

    resetPasswordAttempts: { type: Number, default: 0 },
    lockresetPasswordUntil: Date,

    loginAttempts: { type: Number, default: 0 },
    lockLoginUntil: Date,
  },
  {
    timestamps: true,
  }
);

//no unique in above email coz of gmail used in jwt.unique for both authProvider done here.
usersSchema.index({ email: 1, authProvider: 1 }, { unique: true });
const Users = mongoose.model("Users", usersSchema);
export default Users;
