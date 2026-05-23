import { ErrMissingParams, ErrRole } from '../constants/error.js';
import { StatusError, StatusOK } from '../constants/status.js';

Parse.Cloud.define('signUp', async request => {
  const {
    params: { username, password, roleName },
  } = request;
  if (!username || !password || !roleName) {
    return { status: StatusError, error: ErrMissingParams };
  }
  const roleQuery = new Parse.Query('_Role');
  const role = await roleQuery.equalTo({ name: roleName }).first({ useMasterKey: true });
  if (!role) {
    return { status: StatusError, error: ErrRole.NotThere };
  }
  const user = new Parse.User();
  const acl = new Parse.ACL();
  try {
    await user.signUp({ username, password }, { useMasterKey: true });
  } catch (error) {
    return { status: StatusError, error: error.message };
  }
  acl.setWriteAccess(user.id, false);
  acl.setReadAccess(user.id, true);
  user.setACL(acl);
  role.getUsers().add(user);
  await Promise.all([
    user.save(null, { useMasterKey: true }),
    role.save(null, { useMasterKey: true }),
  ]);
  return { status: StatusOK, user };
});

Parse.Cloud.define('newRole', async request => {
  const {
    params: { roleName },
  } = request;
  if (!roleName) {
    return { status: StatusError, error: ErrMissingParams };
  }
  const acl = new Parse.ACL();
  const role = new Parse.Role(roleName, acl);
  await role.save(null, { useMasterKey: true });
  return { status: StatusOK, role };
});
