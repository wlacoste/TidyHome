import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import {
  CompositeNavigationProp,
  NavigatorScreenParams,
} from '@react-navigation/native';
import { Producto } from './productos';

export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Start: undefined;
  Test: undefined;
  // Add other stack screens here
};

export type TabParamList = {
  Home: undefined;
  Items: undefined;
  Estado: undefined;
  Movimiento: undefined;
  Notas: undefined;
  Ajustes: NavigatorScreenParams<SettingsList>;
};
export type SettingsList = {
  SettingsMenu: undefined;
  Profile: undefined;
  Currency: undefined;
  Reminder: undefined;
  RegularPayments: undefined;
  MonthlyStartDate: undefined;
  Themes: undefined;
  HomePageSettings: undefined;
  Accounts: undefined;
  Budget: undefined;
  ExportData: undefined;
  Password: undefined;
  Comentarios: undefined;
  About: undefined;
};
export type ProductoList = {
  Producto: undefined;
  ProductoDetalle: { producto: Producto };
};

export type RootNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<RootStackParamList>,
  CompositeNavigationProp<
    NativeStackNavigationProp<ProductoList>,
    CompositeNavigationProp<
      BottomTabNavigationProp<TabParamList>,
      NativeStackNavigationProp<SettingsList>
    >
  >
>;
