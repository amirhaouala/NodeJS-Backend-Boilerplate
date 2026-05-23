export const ErrUnauthenticated = new Parse.Error(
  'Oops! authentication is required, please try again'
);
export const ErrMissingParams = new Parse.Error(
  'Oops! missing parameters in payload, please try again'
);
export const ErrMissingPrivileges = new Parse.Error('Oops! missing privileges, please try again');
export const ErrRole = {
  NotThere: new Parse.Error('Oops! role is not there, please try again'),
};
