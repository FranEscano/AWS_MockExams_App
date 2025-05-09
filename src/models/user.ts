import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

// Define la interfaz para el documento de usuario
export interface IUser extends Document {
  username: string;
  password: string;
  verifyPassword(password: string): Promise<boolean>;
}

// Define el esquema de usuario
const UserSchema: Schema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

// Método para verificar la contraseña
UserSchema.methods.verifyPassword = async function(password: string): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

// Middleware para cifrar la contraseña antes de guardar el usuario
UserSchema.pre<IUser>('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

export const User = mongoose.model<IUser>('User', UserSchema);
