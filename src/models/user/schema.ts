export const UserSchema = {
  username: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v: string) {
        return /^\S+$/.test(v); // Valida se não contém espaços
      },
      message: (props: any) => `${props.value} is not a valid username! No spaces are allowed.`
    }
  },
  password: { type: String, required: true, minlength: 6, select: false },
  email: { type: String, unique: true, sparse: true, match: /.+@.+\..+/ },
  age: { type: Number, min: 12, max: 90 },
  phone: {
    type: String,
    validate: {
      validator: function (v: string) {
        return /\d{3}-\d{3}-\d{4}/.test(v);
      },
      message: (props: any) => `${props.value} is not a valid phone number!`
    }
  },
  active: { type: Boolean, default: true },
  refreshToken: { type: String, select: false },
  createdAt: { type: Date, immutable: true, default: Date.now },
}
