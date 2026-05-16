// Auth login screen — centered card, single column, "Welcome back".

function LoginView({ onLogin }) {
  const [u, setU] = React.useState("loris.sbaa");
  const [p, setP] = React.useState("");
  const [busy, setBusy] = React.useState(false);

  function submit(e) {
    e.preventDefault();
    setBusy(true);
    setTimeout(() => { setBusy(false); onLogin?.(u); }, 500);
  }

  return (
    <div className="mui-auth">
      <a className="mui-auth__logo"><Logo style={{ height: 28 }}/></a>
      <Card className="mui-auth__card">
        <CardBody>
          <div className="mui-auth__head">
            <h2 className="mui-h2" style={{ textAlign: 'center' }}>Welcome back</h2>
          </div>
          <form onSubmit={submit} className="mui-form">
            <Input label="Username" placeholder="johndoe" value={u} onChange={e => setU(e.target.value)}/>
            <Input label="Password" type="password" value={p} onChange={e => setP(e.target.value)}/>
            <Button type="submit" disabled={busy} className="mui-form__submit">{busy ? "Logging in…" : "Login"}</Button>
            <div className="mui-form__sub">Don't have an account? <a className="mui-underline">Sign up</a></div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}

Object.assign(window, { LoginView });
