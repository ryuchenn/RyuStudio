import { getFocusedRouteNameFromRoute, Route } from '@react-navigation/native';
import { createNavigationContainerRef } from '@react-navigation/native';

const hiddenTabScreens = ['Signin', 'Signup', 'EventDetail', 'EventCheckout', 'EventThankyou'];

export function getTabBarVisibility(route: Route<string>): { display: 'none' } | { height: number } {
  const currentRouteName = getFocusedRouteNameFromRoute(route) ?? '';

  if (hiddenTabScreens.includes(currentRouteName)) {
    return { display: 'none' }; // hidden the bottom of the navigation tab bar
  }

  return { height: 83 };
}

// For reset bottom tab
export const navigationRef = createNavigationContainerRef();

// For reset bottom tab
export function resetStackToTop(tabName: string, stackInitialRoute: string) {
  if (navigationRef.isReady()) {
    (navigationRef as any).navigate(tabName, {
      screen: stackInitialRoute,
      params: undefined,
    });
  }
}