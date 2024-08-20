const HTTPError = require('http-errors');
const validator = require('validator');

const data = require('./userData');
const helper = require('./helper');

const auth = {
  register(name, email, password, password2) {
    if (!checkValidEmail(email)) {
      throw HTTPError(400, 'Email is not valid, or is already being used');
    }  
    if (password.length < 6) {
      throw HTTPError(400, 'Password length is less than 6 characters');
    }
    if (password != password2) {
      throw HTTPError(400, 'Passwords do not match');
    }
    email = email.toLowerCase();
    const users = data.getData();
    const token = generateToken();
    // Generate uId using the size of array users and default permission 2
    const user = {
      name: name,
      uId: users.length,
      email: email,
      password: helper.getHashOf(password + helper.SECRET),
      tokens: [token],
    };
    // Update data
    users.push(user);
    data.setData(users);
  
    return {
      token: helper.getHashOf(token + helper.ELEMENT),
      uId: user.uId
    };
  },
  
  login(email, password) {
    const user = checkEmailExists(email);
    const token = generateToken();
    if (!user) {
      throw HTTPError(400, 'Email does not belong to a user');
    }

    if (user.password != helper.getHashOf(password + helper.SECRET)) {
      throw HTTPError(400, 'Password is not correct');
    }

    return {
      token: helper.getHashOf(token + helper.ELEMENT),
    };
  },

  logout(token) {
    if (!checkValidToken(token)) {
      throw HTTPError(403, 'Invalid token');
    }
  
    const user = returnValidUser(token);
    user.tokens = user.tokens.filter(
      (temp) => helper.getHashOf(temp + helper.ELEMENT) !== token
    );
    updateUser(user.uId, user);
    return {};
  }
};

function checkValidEmail (email) {
  if (!validator.isEmail(email)) {
    return false;
  }
  if (checkEmailExists(email) != false) {
    return false;
  }
  return true;
}

function checkEmailExists(email) {
  const users = data.getData();
  for (const user of users) {
    if (user.email == email) {
      return user;
    }
  }
  return false;
}

function generateToken () {
  let isValidToken = false;
  let token = (Math.floor((Math.random() * 10000) + 1)).toString();
  while (!isValidToken) {
    // Generate another token
    if (checkValidToken(token)) {
      token = (Math.floor((Math.random() * 10000) + 1)).toString();
    } else {
      isValidToken = true;
    }
  }
  return token;
}

function checkValidToken(token) {
  const users = data.getData();
  for (const user of users) {
    for (const existToken of user.tokens) {
      if (helper.getHashOf(existToken + helper.ELEMENT) == token) {
        return true;
      }
    }
  }
  return false;
}

function returnValidUser(token) {
  const users = data.getData();
  for (const user of users) {
    for (const existToken of user.tokens) {
      if (helper.getHashOf(existToken + helper.ELEMENT) == token) {
        return user;
      }
    }
  }
  throw new Error('User does not exist from token');
}

function updateUser(uId, newUser) {
  const users = data.getData();
  for (var user of users) {
    if (user.uId == uId) {
      user = newUser;
    }
  }
  data.setData(data);
}

module.exports = auth;