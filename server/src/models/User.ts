import mongoose, { Schema, Document, model } from 'mongoose';
import bcrypt from 'bcryptjs';
import Post from './Post';
export interface IUser extends Document {
  username: string;
  password: string;
  email: string;
  avatar?: string;
  matchPassword: any;
  isVerified?: boolean;
  posts?: Array<object>;
}

const UserSchema: Schema = new Schema(
  {
    username: {
      type: String,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdGr3fTJlsjdAEiSCDznslzUJXqeI22hIB20aDOvQsf9Hz93yoOiLaxnlPEA&s',
    },
    posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    isVerified: 
      {
        type: Boolean,
        default: false,
      },
  },

  { collection: 'users', timestamps: true }
);

UserSchema.methods.matchPassword = async function (enteredPassword: string) {
  try {
    if (!this.password) {
      return false;
    }
    return await bcrypt.compare(enteredPassword, this.password);
  } catch (error) {
    console.error('Password comparison error:', error);
    return false;
  }
};

UserSchema.pre('save', async function (next) {
  try {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) {
      return next();
    }

    // Generate a salt with a cost factor of 10
    const salt = await bcrypt.genSalt(10);
    // Hash the password along with the new salt
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    console.error('Password hashing error:', error);
    next(error);
  }
});

const User = model<IUser>('User', UserSchema);
export default User;
