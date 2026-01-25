import { registerSchema, loginSchema } from '../validators/authValidator';

describe('authValidator', () => {
  it('should pass valid register data', () => {
    const { error } = registerSchema.validate({
      name: 'Alice',
      surname: 'Smith',
      email: 'alice@example.com',
      password: '123456',
      roleId: '550e8400-e29b-41d4-a716-446655440000'
    });
    expect(error).toBeUndefined();
  });

  it('should fail invalid email on register', () => {
    const { error } = registerSchema.validate({
      name: 'Alice',
      surname: 'Smith',
      email: 'bad-email',
      password: '123456',
      roleId: '550e8400-e29b-41d4-a716-446655440000'
    });
    expect(error).toBeDefined();
  });

  it('should pass valid login data', () => {
    const { error } = loginSchema.validate({
      email: 'test@example.com',
      password: '123456'
    });
    expect(error).toBeUndefined();
  });

  it('should fail empty password on login', () => {
    const { error } = loginSchema.validate({
      email: 'test@example.com',
      password: ''
    });
    expect(error).toBeDefined();
  });
});
