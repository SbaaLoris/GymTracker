// RegisterPage — direct port of frontend/src/pages/RegisterPage.tsx

function RegisterPage({ navigate, auth }) {
  const [u, setU] = React.useState("");
  const [p1, setP1] = React.useState("");
  const [p2, setP2] = React.useState("");
  const [err, setErr] = React.useState(null);
  const [busy, setBusy] = React.useState(false);

  function submit(e) {
    e.preventDefault();
    setErr(null);
    if (u.trim().length < 3) return setErr("Username must be at least 3 characters long.");
    if (p1.length < 8)         return setErr("Password must be at least 8 characters long.");
    if (p1 !== p2)             return setErr("Passwords do not match.");
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      navigate("/login");
    }, 400);
  }

  return (
    <AuthLayout navigate={navigate}>
      <Card>
        <CardHeader className="card-header--center">
          <CardTitle className="card-title--xl">Create account</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="r-username">Username</FieldLabel>
                <Input id="r-username" placeholder="johndoe" value={u} onChange={e => setU(e.target.value)} required autoComplete="username"/>
              </Field>
              <Field>
                <FieldLabel htmlFor="r-password">Password</FieldLabel>
                <Input id="r-password" type="password" value={p1} onChange={e => setP1(e.target.value)} required autoComplete="new-password"/>
              </Field>
              <Field>
                <FieldLabel htmlFor="r-confirm">Confirm password</FieldLabel>
                <Input id="r-confirm" type="password" value={p2} onChange={e => setP2(e.target.value)} required autoComplete="new-password"/>
              </Field>
              {err && <p className="field-error">{err}</p>}
              <Field>
                <Button type="submit" className="btn--w-full" disabled={busy}>{busy ? "Creating account…" : "Create account"}</Button>
                <FieldDescription className="field-desc--center">
                  Already have an account? <a className="underline-link" onClick={() => navigate("/login")}>Log in</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}

Object.assign(window, { RegisterPage });
