import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import {
  CompositeNavigationProp,
  NavigatorScreenParams,
} from '@react-navigation/native';

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
  Settings: NavigatorScreenParams<SettingsList>;
  // Add other tab screens here
};
export type SettingsList = {
  SettingsMenu: undefined;
  Profile: undefined;
  Currency: undefined;
  Reminder: undefined;
  RegularPayments: undefined;
  MonthlyStartDate: undefined;
  Themes: undefined;
  FontSize: undefined;
  HomePageSettings: undefined;
  Accounts: undefined;
  Budget: undefined;
  ExportData: undefined;
  Password: undefined;
};

export type RootNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<RootStackParamList>,
  CompositeNavigationProp<
    BottomTabNavigationProp<TabParamList>,
    NativeStackNavigationProp<SettingsList>
  >
>;
