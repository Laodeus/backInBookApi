const jsonWebToken = require("jsonwebtoken");


const Authverif = async (ctx, tocken, role) => {
  if(false){// pass it t false to have the possibilities to test with gaphiQL
  if (ctx.request.header.authorization) {
    const decoded = await jsonWebToken.verify(
      ctx.request.header.authorization,
      tocken
    );
    if (role.includes(decoded.role) || role == "all") {
      return decoded;
    } else {
      throw new Error("unauthorised for " + decoded.role + " role");
    }
  } else {
    throw new Error("unauthorised, please login or sign up");
  }
}else{}
};
module.exports = Authverif;
