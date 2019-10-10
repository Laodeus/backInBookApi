const jsonWebToken = require("jsonwebtoken");

const Authverif = async (ctx, tocken, role) => {
  if (ctx.request.header.authorization) {
    const decoded = await jsonWebToken.verify(
      ctx.request.header.authorization,
      tocken
    );
    if (role.includes(decoded.role)) {
      return decoded.id;
    } else {
      throw new Error("unauthorised for " + role + " user");
    }
  } else {
    throw new Error("unauthorised, please login or sign up");
  }
};

module.exports = Authverif;
