import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from "../services/api";

export const AuthContext = createContext({} as AuthContextData);

type AuthProvider = {
  children: ReactNode;
}

type User = {
  id: string;
  login: string;
  name: string;
  avatar_url: string;
}

type AuthContextData = {
  user: User | null;
  singInUrl: string;
  singOut: () => void;
}

type AuthResponse = {
  token: string;
  user: {
    id: string;
    name: string;
    avatar_url: string;
    login: string;
  }
}

export function AuthProvider(props: AuthProvider) {

  const [user, setUser] = useState<User | null>(null);


  const singInUrl = `https://github.com/login/oauth/authorize?scop=user&client_id=8f8abb5cb8c94761eae6`;

  async function singIn(githubCode: string) {
    const response = await api.post<AuthResponse>('authenticate', {
      code: githubCode
    });


    const { token, user } = response.data;

    localStorage.setItem('@socialheat:token', token);

    api.defaults.headers.common.authorization = `Bearer ${token}`;

    setUser(user);

  }

  function singOut() {
    localStorage.removeItem('@socialheat:token');
    setUser(null);
  }

  useEffect(() => {
    const token = localStorage.getItem('@socialheat:token');

    if (token) {

      // Toda requisição que for feita com o token, será autenticado
      api.defaults.headers.common.authorization = `Bearer ${token}`;

      api.get<User>('profile').then(response => {
        setUser(response.data);
      })
    }
  }, [])

  useEffect(() => {
    const url = window.location.href;
    const hasGithubCode = url.includes('?code=');

    if (hasGithubCode) {
      const [urlWithoutCode, githubCode] = url.split('?code=');
      window.history.pushState({}, '', urlWithoutCode);

      singIn(githubCode);

    }
  }, [])

  return (
    <AuthContext.Provider value={{ singInUrl, user, singOut }}>
      {props.children}
    </AuthContext.Provider>
  );
}