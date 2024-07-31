import { Schema, model } from "mongoose";

import { IUser } from "./types";
import { UserSchema as Fields } from "./schema";

const UserSchema = new Schema<IUser>(Fields);

export default model<IUser>("User", UserSchema);
