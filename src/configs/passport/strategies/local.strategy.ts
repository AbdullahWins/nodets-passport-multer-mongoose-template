//src/configs/passport/strategies/local.strategy.ts
import { Strategy as LocalStrategy } from "passport-local";
import { IConfigureLocalStrategy } from "../../../interfaces";
import { compareString } from "../../../services";
import { staticProps } from "../../../utils";

export const configureLocalStrategy: IConfigureLocalStrategy = (model) => {
  return new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const entity = await model.findOne({ email }).select("+password");
        if (!entity)
          return done(null, false, { message: staticProps.common.NOT_FOUND });
        if (!entity.password)
          return done(null, false, {
            message: staticProps.common.NO_PASSWORD_SET,
          });

        const isPasswordValid = await compareString(password, entity.password);
        if (!isPasswordValid)
          return done(null, false, {
            message: staticProps.common.INVALID_PASSWORD,
          });

        return done(null, entity);
      } catch (error) {
        return done(error, false);
      }
    }
  );
};
