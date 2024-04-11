import { useRef } from "react";
import { useAuth } from "../auth";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const auth = useAuth();
  const refUser = useRef<HTMLInputElement>(null);
  const refPass = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  function handleAuth() {
    const userName = refUser.current!.value;
    const userPass = refPass.current!.value;
    if (userName && userPass) {
      auth.login(userName, userPass);
      navigate("/");
    }
  }

  return (
    <>
      <h2>Авторизация</h2>
      <div>
        <input placeholder="Имя пользователя" ref={refUser} />
      </div>
      <div>
        <input placeholder="Пароль" ref={refPass} type="password" />
      </div>
      <div>
        <button onClick={handleAuth}>Войти</button>
      </div>
    </>
  );
}
