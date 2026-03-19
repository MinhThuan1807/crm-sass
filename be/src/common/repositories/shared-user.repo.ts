import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/common/services/prisma.service";
import { UserType } from "src/routes/auth/auth.model";
import { ROLE, RoleType } from "../constants/role.constanst";

@Injectable()
export class SharedUserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  // async findUnique(uniqueObject: { tenantId?: string , email: string }): Promise<UserType | null> {
  //   return this.prismaService.user.findUnique({
  //     where: {
  //       tenantId_email: {
  //         tenantId: uniqueObject.tenantId,
  //         email: uniqueObject.email,
  //       }
  //     }
  //   });
  // }

  async findSlug(slug: string) {
    return this.prismaService.tenant.findUnique({
      where: { slug },
    })
  }  
  async createTenantIncludeUser(payload: { companyName: string, slug: string } & { email: string, name: string, hashedPassword: string, role: RoleType }): Promise<UserType> {
     const tenant = await this.prismaService.tenant.create({
          data: {
            name: payload.companyName,
            slug: payload.slug,
            users: {
              create: {
                email: payload.email,
                name: payload.name,
                password: payload.hashedPassword,
                // role: 'ADMIN',
                role: payload.role,
              },
            },
          },
          include: { users: true },
        })
    return tenant.users[0];
  }
}