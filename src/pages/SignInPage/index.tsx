import {Button, Input} from "@components";
import {useAppDispatch} from "@hooks";
import {setUserTokens} from "@redux/sessionSlice";
import {SessionService} from "@services";
import {useState} from "react";
import {Link} from "react-router-dom";

function SignInPage() {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useAppDispatch();

  const signIn = () => {
    SessionService.signInAsync({
      username_or_email: usernameOrEmail,
      password
    }).then((data) => {
      dispatch(setUserTokens(data));
    });
  }

  return (
    <div style={{
      flex: 1,
      display: 'flex'
    }}>

      <div style={{flex: 1, backgroundColor: '#FFFFFF', display: 'flex', flexDirection: 'column'}}>
      </div>
      <div style={{width: 428, justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column'}}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          width: 300,
          rowGap: 16
        }}>
          <Input
            type="text"
            value={usernameOrEmail}
            placeholder="Tên đăng nhập hoặc email"
            onChange={(e) => setUsernameOrEmail(e.target.value)}/>

          <Input
            type="password"
            value={password}
            placeholder="Mật khẩu"
            onChange={(e) => setPassword(e.target.value)}/>

          <Link to={'/'} style={{textAlign: 'right'}}>Quên mật khẩu?</Link>

          <Button variant="primary" onClick={signIn}>Sign In</Button>
        </div>
      </div>
    </div>
  )
}

export default SignInPage;
