import {
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { NullableType } from '../utils/types/nullable.type';
import { FilterUserDto, SortUserDto } from './dto/query-user.dto';
import { UserRepository } from './infrastructure/persistence/user.repository';
import { User } from './domain/user';
import bcrypt from 'bcryptjs';
import { FilesService } from '../files/files.service';
import { RoleEnum } from '../roles/roles.enum';
import { StatusEnum } from '../statuses/statuses.enum';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { FileType } from '../files/domain/file';
import { Role } from '../roles/domain/role';
import { Status } from '../statuses/domain/status';
import { UpdateUserDto } from './dto/update-user.dto';
import { ERROR_CODES } from '../common/constants/error-codes.constants'; // Importar códigos

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UserRepository,
    private readonly filesService: FilesService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Do not remove comment below.
    // <creating-property />

    let password: string | undefined = undefined;

    if (createUserDto.password) {
      const salt = await bcrypt.genSalt();
      password = await bcrypt.hash(createUserDto.password, salt);
    }

    let email: string | null = null;

    if (createUserDto.email) {
      const userObject = await this.usersRepository.findByEmail(
        createUserDto.email,
      );
      if (userObject) {
        throw new UnprocessableEntityException({
          code: ERROR_CODES.AUTH_DUPLICATE_EMAIL,
          message: 'El correo electrónico ya está registrado.',
          details: { field: 'email' },
        });
      }
      email = createUserDto.email;
    }

    // Validar que el username sea único
    const userByUsername = await this.usersRepository.findByUsername(
      createUserDto.username,
    );
    if (userByUsername) {
      throw new UnprocessableEntityException({
        code: ERROR_CODES.AUTH_DUPLICATE_USERNAME,
        message: 'El nombre de usuario ya está en uso.',
        details: { field: 'username' },
      });
    }

    let photo: FileType | null | undefined = undefined;

    if (createUserDto.photo?.id) {
      const fileObject = await this.filesService.findById(
        createUserDto.photo.id,
      );
      if (!fileObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            photo: 'imageNotExists',
          },
        });
      }
      photo = fileObject;
    } else if (createUserDto.photo === null) {
      photo = null;
    }

    let role: Role | undefined = undefined;

    if (createUserDto.role?.id) {
      const roleObject = Object.values(RoleEnum)
        .map(String)
        .includes(String(createUserDto.role.id));
      if (!roleObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            role: 'roleNotExists',
          },
        });
      }

      role = {
        id: createUserDto.role.id,
      };
    }

    let status: Status | undefined = undefined;

    if (createUserDto.status?.id) {
      const statusObject = Object.values(StatusEnum)
        .map(String)
        .includes(String(createUserDto.status.id));
      if (!statusObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            status: 'statusNotExists',
          },
        });
      }

      status = {
        id: createUserDto.status.id,
      };
    }

    // Convertir birthDate de string a Date si existe
    let birthDate: Date | null = null;
    if (createUserDto.birthDate) {
      birthDate = new Date(createUserDto.birthDate);
    }

    return this.usersRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      email: email,
      username: createUserDto.username,
      password: password,
      photo: photo,
      role: role,
      status: status,
      birthDate: birthDate,
      gender: createUserDto.gender || null,
      phoneNumber: createUserDto.phoneNumber || null,
      address: createUserDto.address || null,
      city: createUserDto.city || null,
      state: createUserDto.state || null,
      country: createUserDto.country || null,
      zipCode: createUserDto.zipCode || null,
      emergencyContact: createUserDto.emergencyContact || null,
    });
  }

  findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterUserDto | null;
    sortOptions?: SortUserDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<User[]> {
    return this.usersRepository.findManyWithPagination({
      filterOptions,
      sortOptions,
      paginationOptions,
    });
  }

  findById(id: User['id']): Promise<NullableType<User>> {
    return this.usersRepository.findById(id);
  }

  findByIds(ids: User['id'][]): Promise<User[]> {
    return this.usersRepository.findByIds(ids);
  }

  findByEmail(email: User['email']): Promise<NullableType<User>> {
    return this.usersRepository.findByEmail(email);
  }

  findByUsername(username: User['username']): Promise<NullableType<User>> {
    return this.usersRepository.findByUsername(username);
  }

  async update(
    id: User['id'],
    updateUserDto: UpdateUserDto,
  ): Promise<User | null> {
    // Do not remove comment below.
    // <updating-property />

    let password: string | undefined = undefined;

    if (updateUserDto.password) {
      const userObject = await this.usersRepository.findById(id);

      if (userObject && userObject?.password !== updateUserDto.password) {
        const salt = await bcrypt.genSalt();
        password = await bcrypt.hash(updateUserDto.password, salt);
      }
    }

    let email: string | null | undefined = undefined;

    if (updateUserDto.email) {
      const userObject = await this.usersRepository.findByEmail(
        updateUserDto.email,
      );

      if (userObject && userObject.id !== id) {
        throw new UnprocessableEntityException({
          code: ERROR_CODES.AUTH_DUPLICATE_EMAIL,
          message: 'El correo electrónico ya está registrado por otro usuario.',
          details: { field: 'email' },
        });
      }

      email = updateUserDto.email;
    } else if (updateUserDto.email === null) {
      email = null;
    }

    let username: string | undefined = undefined;

    if (updateUserDto.username) {
      const userObject = await this.usersRepository.findByUsername(
        updateUserDto.username,
      );

      if (userObject && userObject.id !== id) {
        throw new UnprocessableEntityException({
          code: ERROR_CODES.AUTH_DUPLICATE_USERNAME,
          message: 'El nombre de usuario ya está en uso por otro usuario.',
          details: { field: 'username' },
        });
      }

      username = updateUserDto.username;
    }

    let photo: FileType | null | undefined = undefined;

    if (updateUserDto.photo?.id) {
      const fileObject = await this.filesService.findById(
        updateUserDto.photo.id,
      );
      if (!fileObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            photo: 'imageNotExists',
          },
        });
      }
      photo = fileObject;
    } else if (updateUserDto.photo === null) {
      photo = null;
    }

    let role: Role | null | undefined = undefined;

    if (updateUserDto.role?.id) {
      const roleObject = Object.values(RoleEnum)
        .map(String)
        .includes(String(updateUserDto.role.id));
      if (!roleObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            role: 'roleNotExists',
          },
        });
      }

      role = {
        id: updateUserDto.role.id,
      };
    } else if (updateUserDto.role === null) {
      role = null;
    }

    let status: Status | undefined = undefined;

    if (updateUserDto.status?.id) {
      const statusObject = Object.values(StatusEnum)
        .map(String)
        .includes(String(updateUserDto.status.id));
      if (!statusObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            status: 'statusNotExists',
          },
        });
      }

      status = {
        id: updateUserDto.status.id,
      };
    }

    // Convertir birthDate de string a Date si existe
    let birthDate: Date | null | undefined = undefined;
    if (updateUserDto.birthDate) {
      birthDate = new Date(updateUserDto.birthDate);
    } else if (updateUserDto.birthDate === null) {
      birthDate = null;
    }

    const updatedUser = await this.usersRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      firstName: updateUserDto.firstName,
      lastName: updateUserDto.lastName,
      email: email,
      username: username,
      password: password,
      photo: photo,
      role: role,
      status: status,
      birthDate: birthDate,
      gender: updateUserDto.gender,
      phoneNumber: updateUserDto.phoneNumber,
      address: updateUserDto.address,
      city: updateUserDto.city,
      state: updateUserDto.state,
      country: updateUserDto.country,
      zipCode: updateUserDto.zipCode,
      emergencyContact: updateUserDto.emergencyContact,
    });

    return updatedUser;
  }

  async remove(id: User['id']): Promise<void> {
    await this.usersRepository.remove(id);
  }
}
