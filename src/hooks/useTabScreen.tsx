import {
  useNavigation,
  useNavigationState,
  useRoute,
} from '@react-navigation/native';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

const useIsTabScreen = () => {
  return useNavigationState(state => {
    const route = state.routes[state.index];
    const routeName = getFocusedRouteNameFromRoute(route) ?? route.name;
    const tabScreens = [
      'Home',
      'Items',
      'Estado',
      'Productos',
      'Notas',
      'Start',
    ];
    return tabScreens.includes(routeName);
  });
};

export default useIsTabScreen;
