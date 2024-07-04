import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';

export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Home: undefined;
  Test: undefined;
  // Add other stack screens here
};

export type TabParamList = {
  Home: undefined;
  Items: undefined;
  Estado: undefined;
  Movimiento: undefined;
  Notas: undefined;
  // Add other tab screens here
};

export type RootNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<RootStackParamList>,
  BottomTabNavigationProp<TabParamList>
>;
