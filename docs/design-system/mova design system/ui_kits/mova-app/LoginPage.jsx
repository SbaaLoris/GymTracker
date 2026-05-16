// LoginPage — direct port of frontend/src/pages/LoginPage.tsx

function LoginPage({ navigate, auth }) {
  const [u, setU] = React.useState("");
  const [p, setP] = React.useState("");
  const [err, setErr] = React.useState(null);
  const [busy, setBusy] = React.useState(false);

  function submit(e) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      if (!u || !p) { setErr("Invalid credentials"); return; }
      auth.login({ username: u, role: u === "admin" ? "ADMIN" : "USER" });
      navigate("/exercises");
    }, 400);
  }

  return (
    <AuthLayout navigate={navigate}>
      <Card>
        <CardHeader className="card-header--center">
          <CardTitle className="card-title--xl">Welcome back</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <Input id="username" type="text" placeholder="johndoe" value={u} onChange={e => setU(e.target.value)} required/>
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input id="password" type="password" value={p} onChange={e => setP(e.target.value)} required/>
              </Field>
              {err && <p className="field-error">{err}</p>}
              <Field>
                <Button type="submit" className="btn--w-full" disabled={busy}>{busy ? "Logging in…" : "Login"}</Button>
                <FieldDescription className="field-desc--center">
                  Don't have an account? <a className="underline-link" onClick={() => navigate("/register")}>Sign up</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}

Object.assign(window, { LoginPage });
