/* eslint-disable class-methods-use-this */
class Validator {
  checkName(name) {
    if (name.length > 15 || name.trim().length === 0) {
      return false;
    }
    return true;
  }

  checkEmail(email) {
    const emailRegex = /^\w{2,}@{1}\w{2,}\.{1}[A-Za-z]{2,}$/g;
    if (!emailRegex.test(email)) {
      return false;
    }
    return true;
  }

  checkCount(count) {
    if (count < 0) {
      return false;
    }
    return true;
  }

  checkPrice(price) {
    if (price <= 0) {
      return false;
    }
    return true;
  }
}

export {
  Validator,
};
