import mongoose from 'mongoose';

// An interface that describes the properties
// that are required to create a new User
interface UserAttr {
  email: string;
  password: string;
}

// An interface that describes the properties
// that an User Model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttr): UserDoc;
}

// An interface that describes the properties
// that an User Document has
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

// Schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.statics.build = (attrs: UserAttr) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
