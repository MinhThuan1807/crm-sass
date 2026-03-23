import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { ROLES_KEY } from "../decorators/roles.decorator"
import { RoleType } from "../constants/role.constanst"

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {} // ← inject Reflector

  canActivate(context: ExecutionContext): boolean {
    // 1. Đọc metadata từ route
    const requiredRoles = this.reflector.getAllAndOverride<RoleType[]>(
      ROLES_KEY,
      [
        context.getHandler(), // metadata trên method
        context.getClass(),   // metadata trên class
      ]
    )

    // 2. Không có @Roles() → cho qua
    if (!requiredRoles) return true;

    // 3. Lấy user từ request
    const user = context.switchToHttp().getRequest().user;

    // 4. So sánh — user.role có nằm trong requiredRoles không?
    return requiredRoles.some((role) => user.role === role);
  }
}