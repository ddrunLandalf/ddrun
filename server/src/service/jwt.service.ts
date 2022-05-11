import { Provide } from '@midwayjs/decorator';
import { BaseService } from './base.service';
import { sign, verify } from 'jsonwebtoken';
interface VerifyResult {
  isExpried?: boolean;
  userId?: number;
  ip?: string;
}

@Provide()
export class JWTService extends BaseService {
  sign(data: string | object | Buffer) {
    const token = sign(data, this.config().jwt.privateKey, {
      expiresIn: this.config().jwt.expiresIn,
    });
    return token;
  }
  async verify(token: string): Promise<VerifyResult> {
    return new Promise(resolve => {
      verify(token, this.config().jwt.privateKey, (err, decoded) => {
        if (err) {
          if (err.name === 'TokenExpiredError') {
            resolve({ isExpried: true });
          } else {
            throw new Error(err.message);
          }
          // console.log(err);
        }
        resolve(decoded as any);
      });
    });
  }
}
