import { forgotPassword, login, resetPassword, signUp } from 'API/auth'
import { ILoginForm, IResetPasswordRequest, ISignUpForm } from 'interfaces/auth'
import { IUser } from 'interfaces/user'
import { makeAutoObservable } from 'mobx'
import omit from 'lodash/omit'
import RootStore from 'stores'
import { getUserById } from 'API/user'
import { PLATFORM } from 'enums/common'

// Utility functions for localStorage and sessionStorage
const getStorageItem = (key: string): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage?.getItem(key) || sessionStorage?.getItem(key);
  }
  return null;
};

const setStorageItem = (key: string, value: string, isRemember: boolean): void => {
  if (typeof window !== 'undefined') {
    if (isRemember) {
      localStorage?.setItem(key, value);
    } else {
      sessionStorage?.setItem(key, value);
    }
  }
};

const removeStorageItem = (key: string): void => {
  if (typeof window !== 'undefined') {
    localStorage?.removeItem(key);
    sessionStorage?.removeItem(key);
  }
};

export default class AuthStore {
  rootStore: RootStore;
  token: string = '';
  user: IUser = {} as IUser;
  isLogin: boolean = !!getStorageItem(`${PLATFORM.WEBSITE}Token`);

  constructor(rootStore: RootStore) {
    makeAutoObservable(this, { rootStore: false, token: false });
    this.rootStore = rootStore;
  }

  async getMyUser(platform: PLATFORM): Promise<void> {
    const userId = getStorageItem(`${platform}UserId`);
    if (userId) {
      const user = await getUserById(userId, platform);
      this.user = user;
      this.isLogin = true;
    }
  }

  async getUserById(platform: PLATFORM): Promise<void> {
    const userId = getStorageItem(`${platform}UserId`);
    if (userId) {
      const user = await getUserById(userId, platform);
      this.user = user;
      this.isLogin = true;
    }
  }

  async login(data: ILoginForm, platform: PLATFORM): Promise<void> {
    const { accessToken, user } = await login(omit(data, 'isRemember'));
    if (accessToken && user?._id) {
      setStorageItem(`${platform}UserId`, user._id, data.isRemember);
      setStorageItem(`${platform}Token`, accessToken, data.isRemember);
      this.token = accessToken;
      await this.getMyUser(platform);
    }
  }

  async signUp(data: ISignUpForm): Promise<void> {
    const { accessToken } = await signUp(data);
    if (accessToken) {
      const loginData = { email: data.email, password: data.password, isRemember: true };
      await this.login(loginData, PLATFORM.WEBSITE);
    }
  }

  async forgotPassword(email: string): Promise<void> {
    await forgotPassword(email);
  }

  async resetPassword(data: IResetPasswordRequest, token: string): Promise<void> {
    await resetPassword(data, token);
  }

  logout(platform: PLATFORM): void {
    this.isLogin = false;
    this.token = '';
    this.user = {} as IUser;
    removeStorageItem(`${platform}Token`);
    removeStorageItem(`${platform}UserId`);
  }
}
