const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: function requiredPassword() {
        return this.provider === "local";
      },
      minlength: 6
    },
    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local"
    },
    googleId: {
      type: String,
      index: true,
      sparse: true
    },
    avatar: {
      type: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
