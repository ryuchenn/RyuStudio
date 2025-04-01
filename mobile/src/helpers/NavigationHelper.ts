import { getFocusedRouteNameFromRoute, Route } from '@react-navigation/native';

const hiddenTabScreens = ['Signin', 'Signup', 'EventDetail', 'EventCheckout', 'EventThankyou'];

export function getTabBarVisibility(route: Route<string>): { display: 'none' } | { height: number } {
  const currentRouteName = getFocusedRouteNameFromRoute(route) ?? '';

  if (hiddenTabScreens.includes(currentRouteName)) {
    return { display: 'none' }; // hidden the bottom of the navigation tab bar
  }

  return { height: 83 };
}

