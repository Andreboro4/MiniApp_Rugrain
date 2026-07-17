import { useStore } from '../store/useStore';

export function useAuth() {
  const { user, loggedIn, guest, authLoading } = useStore();
  return { user, isLoggedIn: loggedIn, isGuest: guest, isLoading: authLoading };
}
