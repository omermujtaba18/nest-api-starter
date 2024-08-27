import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { HydratedDocument, ObjectId } from 'mongoose';

export type UserDocument = HydratedDocument<User> & {
  _id: ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

@Schema({ timestamps: true })
export class User {
  @Prop({
    required: true,
    index: true,
    lowercase: true,
    unique: true,
    trim: true,
  })
  email: string;

  @Prop({ default: null })
  password: string;

  @Prop({ default: null })
  googleId: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre<UserDocument>('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
