import { Schema } from "mongoose";
import { IUser, sendMail } from "../../../utils";
import { GENDER, SYS_ROLE, USER_AGENT } from "../../../utils";

export const userSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      minlength: 2,
      maxlength: 20,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      minlength: 2,
      maxlength: 20,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: function () {
        if (this.userAgent == USER_AGENT.google) return false;
        return true;
      },
    },
    credentialUpdatedAt: Date,
    phoneNumber: String,
    role: {
      type: Number,
      enum: SYS_ROLE,
      default: SYS_ROLE.user,
    },
    gender: { type: Number, enum: GENDER, default: GENDER.male },
    userAgent: {
      type: Number,
      enum: USER_AGENT,
      default: USER_AGENT.local,
    },
    otp: { type: String },
    otpExpiryAt: { type: Date },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

userSchema
  .virtual("fullName")
  .get(function () {
    return this.firstName + " " + this.lastName;
  })
  .set(function (value: string) {
    const [fName, lName] = value.split(" ");
    this.firstName = fName as string;
    this.lastName = lName as string;
  });

userSchema.pre("save", async function (next) {
  if(this.userAgent != USER_AGENT.google && this.isNew == true)
  await sendMail({
    to: this.email,
    subject: "Confirm your email",
    html: `
      <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; background: #f9fafb; border-radius: 8px;">
        <h2 style="color: #333; margin-bottom: 10px;">Confirm Your Email</h2>
        <p style="font-size: 14px; color: #555; margin: 0 0 15px;">
          Use the following OTP to confirm your account:
        </p>
        <div style="display: inline-block; padding: 12px 20px; font-size: 20px; font-weight: bold; color: #fff; background: #06b6d4; border-radius: 6px; letter-spacing: 3px;">
          ${this.otp}
        </div>
      </div>
    `,
  });
});
