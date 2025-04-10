import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import ms from 'ms';
import crypto from 'crypto';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';
import { AuthEmailLoginDto } from './dto/auth-email-login.dto';
import { AuthUpdateDto } from './dto/auth-update.dto';
import { AuthRegisterLoginDto } from './dto/auth-register-login.dto';
import { NullableType } from '../utils/types/nullable.type';
import { LoginResponseDto } from './dto/login-response.dto';
import { ConfigService } from '@nestjs/config';
import { JwtRefreshPayloadType } from './strategies/types/jwt-refresh-payload.type';
import { JwtPayloadType } from './strategies/types/jwt-payload.type';
import { UsersService } from '../users/users.service';
import { AllConfigType } from '../config/config.type';
import { MailService } from '../mail/mail.service';
import { RoleEnum } from '../roles/roles.enum';
import { Session } from '../session/domain/session';
import { SessionService } from '../session/session.service';
import { StatusEnum } from '../statuses/statuses.enum';
import { User } from '../users/domain/user';
import { ERROR_CODES } from '../common/constants/error-codes.constants'; // Importar códigos

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private sessionService: SessionService,
    private mailService: MailService,
    private configService: ConfigService<AllConfigType>,
  ) {}

  async validateLogin(loginDto: AuthEmailLoginDto): Promise<LoginResponseDto> {
    let user: NullableType<User> = null;

    // Si se proporciona username, buscamos por username
    if (loginDto.username) {
      user = await this.usersService.findByUsername(loginDto.username);
    }

    // Si no se encontró por username y se proporcionó email, buscamos por email
    if (!user && loginDto.email) {
      user = await this.usersService.findByEmail(loginDto.email);
    }

    if (!user) {
      throw new UnprocessableEntityException({
        code: ERROR_CODES.AUTH_INVALID_CREDENTIALS,
        message: 'Usuario o contraseña incorrectos.',
      });
    }

    if (!user.password) {
      // Podría ser un error interno si se espera que siempre haya contraseña
      // O un error específico si es un estado válido pero no permite login
      throw new UnprocessableEntityException({
        code: ERROR_CODES.AUTH_ACCOUNT_INACTIVE, // O un código más apropiado
        message: 'La cuenta no tiene una contraseña configurada.',
      });
    }

    const isValidPassword = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isValidPassword) {
      throw new UnprocessableEntityException({
        code: ERROR_CODES.AUTH_INCORRECT_PASSWORD,
        message: 'La contraseña es incorrecta.',
      });
    }

    const hash = crypto
      .createHash('sha256')
      .update(randomStringGenerator())
      .digest('hex');

    const session = await this.sessionService.create({
      user,
      hash,
    });

    const { token, refreshToken, tokenExpires } = await this.getTokensData({
      id: user.id,
      role: user.role,
      sessionId: session.id,
      hash,
    });

    return {
      refreshToken,
      token,
      tokenExpires,
      user,
    };
  }

  async register(dto: AuthRegisterLoginDto): Promise<void> {
    const user = await this.usersService.create({
      ...dto,
      email: dto.email,
      role: {
        id: RoleEnum.user,
      },
      status: {
        id: StatusEnum.inactive,
      },
    });

    const hash = await this.jwtService.signAsync(
      {
        confirmEmailUserId: user.id,
      },
      {
        secret: this.configService.get('auth.confirmEmailSecret', {
          infer: true,
        }),
        expiresIn: this.configService.get('auth.confirmEmailExpires', {
          infer: true,
        }),
      },
    );

    if (dto.email) {
      await this.mailService.userSignUp({
        to: dto.email,
        data: {
          hash,
        },
      });
    } else {
      await this.usersService.update(user.id, {
        status: {
          id: StatusEnum.active,
        },
      });
    }
  }

  async confirmEmail(hash: string): Promise<void> {
    let userId: User['id'];

    try {
      const jwtData = await this.jwtService.verifyAsync<{
        confirmEmailUserId: User['id'];
      }>(hash, {
        secret: this.configService.getOrThrow('auth.confirmEmailSecret', {
          infer: true,
        }),
      });

      userId = jwtData.confirmEmailUserId;
    } catch {
      throw new UnprocessableEntityException({
        code: ERROR_CODES.AUTH_INVALID_HASH,
        message: 'El enlace de confirmación es inválido o ha expirado.',
      });
    }

    const user = await this.usersService.findById(userId);

    // Considerar si el estado diferente a inactivo debe ser otro error (ej. AUTH_EMAIL_ALREADY_CONFIRMED)
    if (
      !user ||
      user?.status?.id?.toString() !== StatusEnum.inactive.toString()
    ) {
      throw new NotFoundException({
        code: ERROR_CODES.USER_NOT_FOUND, // O un código más específico como AUTH_CONFIRMATION_LINK_INVALID
        message: 'Usuario no encontrado o el enlace ya no es válido.',
      });
    }

    user.status = {
      id: StatusEnum.active,
    };

    await this.usersService.update(user.id, user);
  }

  async confirmNewEmail(hash: string): Promise<void> {
    let userId: User['id'];
    let newEmail: User['email'];

    try {
      const jwtData = await this.jwtService.verifyAsync<{
        confirmEmailUserId: User['id'];
        newEmail: User['email'];
      }>(hash, {
        secret: this.configService.getOrThrow('auth.confirmEmailSecret', {
          infer: true,
        }),
      });

      userId = jwtData.confirmEmailUserId;
      newEmail = jwtData.newEmail;
    } catch {
      throw new UnprocessableEntityException({
        code: ERROR_CODES.AUTH_INVALID_HASH,
        message:
          'El enlace de confirmación de nuevo correo es inválido o ha expirado.',
      });
    }

    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new NotFoundException({
        code: ERROR_CODES.USER_NOT_FOUND,
        message: 'Usuario asociado al enlace no encontrado.',
      });
    }

    user.email = newEmail;
    user.status = {
      id: StatusEnum.active,
    };

    await this.usersService.update(user.id, user);
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      // Aunque el usuario no exista, por seguridad, podríamos no revelarlo explícitamente.
      // Pero para seguir el patrón, lanzamos el error.
      throw new NotFoundException({
        // Cambiado a NotFoundException para ser más semántico
        code: ERROR_CODES.USER_NOT_FOUND,
        message: 'No se encontró un usuario con ese correo electrónico.',
      });
    }

    const tokenExpiresIn = this.configService.getOrThrow('auth.forgotExpires', {
      infer: true,
    });

    const tokenExpires = Date.now() + ms(tokenExpiresIn);

    const hash = await this.jwtService.signAsync(
      {
        forgotUserId: user.id,
      },
      {
        secret: this.configService.getOrThrow('auth.forgotSecret', {
          infer: true,
        }),
        expiresIn: tokenExpiresIn,
      },
    );

    await this.mailService.forgotPassword({
      to: email,
      data: {
        hash,
        tokenExpires,
      },
    });
  }

  async resetPassword(hash: string, password: string): Promise<void> {
    let userId: User['id'];

    try {
      const jwtData = await this.jwtService.verifyAsync<{
        forgotUserId: User['id'];
      }>(hash, {
        secret: this.configService.getOrThrow('auth.forgotSecret', {
          infer: true,
        }),
      });

      userId = jwtData.forgotUserId;
    } catch {
      throw new UnprocessableEntityException({
        code: ERROR_CODES.AUTH_INVALID_HASH,
        message:
          'El enlace para restablecer la contraseña es inválido o ha expirado.',
      });
    }

    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new NotFoundException({
        // Cambiado a NotFoundException
        code: ERROR_CODES.USER_NOT_FOUND,
        message: 'Usuario asociado al enlace no encontrado.',
      });
    }

    user.password = password;

    await this.sessionService.deleteByUserId({
      userId: user.id,
    });

    await this.usersService.update(user.id, user);
  }

  async me(userJwtPayload: JwtPayloadType): Promise<NullableType<User>> {
    return this.usersService.findById(userJwtPayload.id);
  }

  async update(
    userJwtPayload: JwtPayloadType,
    userDto: AuthUpdateDto,
  ): Promise<NullableType<User>> {
    const currentUser = await this.usersService.findById(userJwtPayload.id);

    if (!currentUser) {
      // Esto no debería ocurrir si el token es válido, pero por si acaso.
      throw new NotFoundException({
        code: ERROR_CODES.USER_NOT_FOUND,
        message: 'Usuario actual no encontrado.',
      });
    }

    const userToUpdate = { ...currentUser };

    if (userDto.firstName !== undefined)
      userToUpdate.firstName = userDto.firstName;
    if (userDto.lastName !== undefined)
      userToUpdate.lastName = userDto.lastName;
    if (userDto.email !== undefined) userToUpdate.email = userDto.email;
    if (userDto.password !== undefined)
      userToUpdate.password = userDto.password;
    if (userDto.photo !== undefined) userToUpdate.photo = userDto.photo;
    if (userDto.birthDate !== undefined)
      userToUpdate.birthDate = userDto.birthDate
        ? new Date(userDto.birthDate)
        : null;
    if (userDto.gender !== undefined) userToUpdate.gender = userDto.gender;
    if (userDto.phoneNumber !== undefined)
      userToUpdate.phoneNumber = userDto.phoneNumber;
    if (userDto.address !== undefined) userToUpdate.address = userDto.address;
    if (userDto.city !== undefined) userToUpdate.city = userDto.city;
    if (userDto.state !== undefined) userToUpdate.state = userDto.state;
    if (userDto.country !== undefined) userToUpdate.country = userDto.country;
    if (userDto.zipCode !== undefined) userToUpdate.zipCode = userDto.zipCode;
    if (userDto.emergencyContact !== undefined)
      userToUpdate.emergencyContact = userDto.emergencyContact;

    if (userDto.password) {
      if (!userDto.oldPassword) {
        throw new UnprocessableEntityException({
          code: ERROR_CODES.AUTH_MISSING_OLD_PASSWORD,
          message:
            'Se requiere la contraseña anterior para establecer una nueva.',
          details: { field: 'oldPassword' },
        });
      }

      if (!currentUser.password) {
        // Caso raro: el usuario no tiene contraseña pero intenta cambiarla.
        throw new UnprocessableEntityException({
          code: ERROR_CODES.AUTH_INCORRECT_OLD_PASSWORD, // O un código más específico
          message: 'La cuenta actual no tiene una contraseña configurada.',
          details: { field: 'oldPassword' },
        });
      }

      const isValidOldPassword = await bcrypt.compare(
        userDto.oldPassword,
        currentUser.password,
      );

      if (!isValidOldPassword) {
        throw new UnprocessableEntityException({
          code: ERROR_CODES.AUTH_INCORRECT_OLD_PASSWORD,
          message: 'La contraseña anterior es incorrecta.',
          details: { field: 'oldPassword' },
        });
      } else {
        await this.sessionService.deleteByUserIdWithExclude({
          userId: currentUser.id,
          excludeSessionId: userJwtPayload.sessionId,
        });
      }
    }

    if (userDto.email && userDto.email !== currentUser.email) {
      const userByEmail = await this.usersService.findByEmail(userDto.email);

      if (userByEmail && userByEmail.id !== currentUser.id) {
        throw new UnprocessableEntityException({
          // Podría ser ConflictException(409) también
          code: ERROR_CODES.AUTH_DUPLICATE_EMAIL,
          message: 'El correo electrónico ya está registrado por otro usuario.',
          details: { field: 'email' },
        });
      }

      const hash = await this.jwtService.signAsync(
        {
          confirmEmailUserId: currentUser.id,
          newEmail: userDto.email,
        },
        {
          secret: this.configService.getOrThrow('auth.confirmEmailSecret', {
            infer: true,
          }),
          expiresIn: this.configService.getOrThrow('auth.confirmEmailExpires', {
            infer: true,
          }),
        },
      );

      await this.mailService.confirmNewEmail({
        to: userDto.email,
        data: {
          hash,
        },
      });

      // No actualizamos el email aquí, se actualizará cuando el usuario confirme el email
      userToUpdate.email = currentUser.email;
    }

    // Creamos un objeto con solo las propiedades que queremos actualizar
    const updateData: Partial<User> = {
      firstName: userToUpdate.firstName,
      lastName: userToUpdate.lastName,
      password: userToUpdate.password,
      photo: userToUpdate.photo,
      birthDate: userToUpdate.birthDate,
      gender: userToUpdate.gender,
      phoneNumber: userToUpdate.phoneNumber,
      address: userToUpdate.address,
      city: userToUpdate.city,
      state: userToUpdate.state,
      country: userToUpdate.country,
      zipCode: userToUpdate.zipCode,
      email: userToUpdate.email,
      emergencyContact: userToUpdate.emergencyContact,
    };

    return this.usersService.update(userJwtPayload.id, updateData);
  }

  async refreshToken(
    data: Pick<JwtRefreshPayloadType, 'sessionId' | 'hash'>,
  ): Promise<Omit<LoginResponseDto, 'user'>> {
    const session = await this.sessionService.findById(data.sessionId);

    if (!session) {
      throw new UnauthorizedException({
        code: ERROR_CODES.AUTH_SESSION_EXPIRED_OR_INVALID,
        message: 'La sesión ha expirado o es inválida.',
      });
    }

    if (session.hash !== data.hash) {
      // Podría indicar un intento de reutilización de refresh token o manipulación
      await this.sessionService.deleteById(session.id); // Invalidar la sesión comprometida
      throw new UnauthorizedException({
        code: ERROR_CODES.AUTH_SESSION_EXPIRED_OR_INVALID,
        message: 'Token de refresco inválido.',
      });
    }

    const hash = crypto
      .createHash('sha256')
      .update(randomStringGenerator())
      .digest('hex');

    const user = await this.usersService.findById(session.user.id);

    if (!user?.role) {
      // El usuario asociado a la sesión ya no existe o no tiene rol
      await this.sessionService.deleteById(session.id); // Limpiar sesión huérfana
      throw new UnauthorizedException({
        code: ERROR_CODES.AUTH_UNAUTHORIZED, // O USER_NOT_FOUND si se prefiere
        message: 'Usuario asociado a la sesión no válido.',
      });
    }

    await this.sessionService.update(session.id, {
      hash,
    });

    const { token, refreshToken, tokenExpires } = await this.getTokensData({
      id: session.user.id,
      role: {
        id: user.role.id,
      },
      sessionId: session.id,
      hash,
    });

    return {
      token,
      refreshToken,
      tokenExpires,
    };
  }

  async softDelete(user: User): Promise<void> {
    await this.usersService.remove(user.id);
  }

  async logout(data: Pick<JwtRefreshPayloadType, 'sessionId'>) {
    return this.sessionService.deleteById(data.sessionId);
  }

  private async getTokensData(data: {
    id: User['id'];
    role: User['role'];
    sessionId: Session['id'];
    hash: Session['hash'];
  }) {
    const tokenExpiresIn = this.configService.getOrThrow('auth.expires', {
      infer: true,
    });

    const tokenExpires = Date.now() + ms(tokenExpiresIn);

    const [token, refreshToken] = await Promise.all([
      await this.jwtService.signAsync(
        {
          id: data.id,
          role: data.role,
          sessionId: data.sessionId,
        },
        {
          secret: this.configService.getOrThrow('auth.secret', { infer: true }),
          expiresIn: tokenExpiresIn,
        },
      ),
      await this.jwtService.signAsync(
        {
          sessionId: data.sessionId,
          hash: data.hash,
        },
        {
          secret: this.configService.getOrThrow('auth.refreshSecret', {
            infer: true,
          }),
          expiresIn: this.configService.getOrThrow('auth.refreshExpires', {
            infer: true,
          }),
        },
      ),
    ]);

    return {
      token,
      refreshToken,
      tokenExpires,
    };
  }
}
