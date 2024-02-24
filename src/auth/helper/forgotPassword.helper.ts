import jwt from 'jsonwebtoken';
import { EHTTPS_RESPONSE_CODE } from '../../store/enums/HTTP_Response_Code/responseCode.enum';
import { CustomError } from '../../store/error/customError';
import { createAuthDbConnection } from '../../DB/authConnection';

export class PasswordResetHelper {
    static async resetPassword({ emailId, phoneNumber }) {
      try {
        const { success, authDBModels } = createAuthDbConnection();
        if (!success) {
          throw new Error('Unable to connect to Auth db');
        }
  
        const searchFilter = emailId ? { emailId } : phoneNumber ? { phoneNumber } : null;
  
        const user = await authDBModels.User.findOne(searchFilter).lean();
        if (!user) {
          throw new CustomError('User not found', EHTTPS_RESPONSE_CODE.NOT_FOUND);
        }
  
        // Creating JWT token
        const userInfo = {
          _id: user._id.toString(),
          Name: user.Name,
          emailId: user.emailId,
          roleToken: user.roleToken,
          points: user.points,
          github: user.github
        };
  
        const bearerToken = jwt.sign(userInfo, user.firebaseToken, {
          expiresIn: '10m', // Token expires in 10 minutes
        });
  
        return {
            user,
          bearerToken,
        };
      } catch (error) {
        throw error;
      }
    }
  }
  