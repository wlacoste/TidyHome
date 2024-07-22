import {
  useNavigation,
  useNavigationState,
  useRoute,
} from '@react-navigation/native';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

const useIsTabScreen = () => {
  return useNavigationState(state => {
    // console.log(state);
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

// const useIsTabScreen = () => {
//   const navigation = useNavigation();
//   const route = useRoute();

//   // List of tab screens
//   const tabScreens = [
//     'Home',
//     'Items',
//     'Estado',
//     'Productos',
//     'Notas',
//     'Ajustes',
//   ];

//   // Function to check if the current route is a tab screen
//   const isTabScreen = (routeName: string) => {
//     return tabScreens.includes(routeName);
//   };

//   // Function to determine if the current route or any nested route is 'Productos'
//   const isProductosScreenOrNested = (currentRoute: any) => {
//     if (!currentRoute) {
//       return false;
//     }

//     let current = currentRoute;
//     while (current) {
//       if (current.name === 'Productos') {
//         return true;
//       }
//       current = current.state?.routes?.[current.state.index];
//     }
//     return false;
//   };

//   // Get current route name
//   const routeName = route.name;
//   console.log(routeName);

//   // Determine if the current route should show the FAB
//   const shouldShowFAB = () => {
//     return isTabScreen(routeName) && !isProductosScreenOrNested(route);
//   };

//   return shouldShowFAB();
// };

export default useIsTabScreen;
