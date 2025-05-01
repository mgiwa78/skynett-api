import { CustomRequest } from "@middleware/require-auth";
import { generateToken } from "@utils/jwt";
import { Request, Response } from "express";
import { AppDataSource } from "../config/ormconfig";
import { generateEmailContent } from "emails/partials";
import { User } from "@entities/user";
import { Customer } from "@entities/customer";
import { OtpVerification } from "../database/entities/otp-verification";
import { PasswordReset } from "../database/entities/pasword-reset";
import { Token } from "@entities/token";

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOne({ where: { email } });

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  if (!(await user.comparePassword(password))) {
    return res.status(400).json({ message: "Invalid credentials" });
  }
  const token = generateToken(user);
  return res.status(200).json({ token, user });
};

export const editUserProfile = async (req: CustomRequest, res: Response) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res
      .status(400)
      .json({ message: "First name, last name, and email are required" });
  }

  try {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id: req.user.id } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name;
    user.email = email;

    await userRepository.save(user);

    return res
      .status(200)
      .json({ message: "Profile updated successfully", user });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Something went wrong", error: err.message });
  }
};

export const getUserProfile = async (req: CustomRequest, res: Response) => {
  try {
    let user;
    const adminRepository = AppDataSource.getRepository(User);

    user = await adminRepository.findOne({
      where: { id: req.user.id },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Something went wrong", error: err.message });
  }
};

export const generateOtp = async (req: Request, res: Response) => {
  const { email } = req.body;

  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOne({ where: { email } });

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 5);

  const otpRepository = AppDataSource.getRepository(OtpVerification);
  const otpVerification = otpRepository.create({
    user,
    otpCode: otp,
    expiresAt,
  });
  await otpRepository.save(otpVerification);
  // await addSendOtpMailJob(user, otp);

  return res.status(200).json({ message: "OTP sent" });
};

export const generatePasswordResetToken = async (
  req: Request,
  res: Response
) => {
  const { email } = req.body;

  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOne({ where: { email } });

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const resetToken = Math.random().toString(36).substr(2);
  const expiresAt = new Date();

  expiresAt.setHours(expiresAt.getHours() + 1);

  const passwordResetRepository = AppDataSource.getRepository(PasswordReset);
  const passwordReset = passwordResetRepository.create({
    user,
    resetToken,
    expiresAt,
  });

  await passwordResetRepository.save(passwordReset);
  // await createResetPasswordEmailJob(user, resetToken);

  return res.status(200).json({ message: "Password reset email sent" });
};

export const resetPassword = async (req: Request, res: Response) => {
  const { resetToken, newPassword } = req.body;

  const passwordResetRepository = AppDataSource.getRepository(PasswordReset);
  const resetRecord = await passwordResetRepository.findOne({
    where: { resetToken, isUsed: false },
  });

  if (!resetRecord || resetRecord.expiresAt < new Date()) {
    return res.status(400).json({ message: "Invalid or expired reset token" });
  }

  resetRecord.user.password = newPassword;
  await resetRecord.user.hashPassword();
  resetRecord.isUsed = true;

  await passwordResetRepository.save(resetRecord);
  await AppDataSource.getRepository(User).save(resetRecord.user);

  return res.status(200).json({ message: "Password reset successfully" });
};

export const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  const tokenRepository = AppDataSource.getRepository(Token);
  const tokenRecord = await tokenRepository.findOne({
    where: { token: refreshToken },
  });

  if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
    return res
      .status(400)
      .json({ message: "Invalid or expired refresh token" });
  }

  const user = tokenRecord.user;
  const newAccessToken = generateToken(user);

  return res.status(200).json({ accessToken: newAccessToken });
};
