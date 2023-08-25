import {ReactNode} from 'react';

export type RoutesParam = {
  Home: undefined;
  History: undefined;
  Information: undefined;
  Login: undefined;
  Profile: undefined;
  Register: undefined;
  Settings: undefined;
  SOSFire: {
    data: {
      id: number;
      code: string;
      name: string;
      created_at: string;
      updated_at: string;
      icon: ReactNode;
      navigate?: string;
    };
  };
  SOSGeneral: {
    data: {
      id: number;
      code: string;
      name: string;
      created_at: string;
      updated_at: string;
      icon: ReactNode;
      navigate?: string;
    };
  };
  SOSPublic: {
    data: {
      id: number;
      code: string;
      name: string;
      created_at: string;
      updated_at: string;
      icon: ReactNode;
      navigate?: string;
    };
  };
};
