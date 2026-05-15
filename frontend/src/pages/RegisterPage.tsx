import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ApiError } from '@/api/client'
import { registerUser } from '@/api/auth'
import { Logo } from "@/components/Logo"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export default function RegisterPage() {
    const navigate = useNavigate()

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setError(null)

        if (username.trim().length < 3) {
            setError('Username must be at least 3 characters long.')
            return
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters long.')
            return
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.')
            return
        }

        setIsSubmitting(true)

        try {
            await registerUser({
                username: username.trim(),
                password,
            })

            navigate('/login', {
                replace: true,
                state: {
                    message: 'Account created successfully. You can now log in.',
                },
            })
        } catch (err) {
            if (err instanceof ApiError && err.status === 409) {
                setError('This username is already taken.')
            } else {
                setError('Registration failed. Please check the backend and network connection.')
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
            <div className="flex w-full max-w-sm flex-col gap-6">
                <Link to="/" className="self-center">
                    <Logo className="h-8" />
                </Link>
                <Card>
                    <CardHeader className="text-center">
                        <CardTitle className="text-xl">Create account</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <FieldGroup>
                                <Field>
                                    <FieldLabel htmlFor="username">Username</FieldLabel>
                                    <Input
                                        id="username"
                                        placeholder="johndoe"
                                        value={username}
                                        onChange={(event) => setUsername(event.target.value)}
                                        autoComplete="username"
                                        required
                                    />
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="password">Password</FieldLabel>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={(event) => setPassword(event.target.value)}
                                        autoComplete="new-password"
                                        required
                                    />
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="confirmPassword">Confirm password</FieldLabel>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(event) => setConfirmPassword(event.target.value)}
                                        autoComplete="new-password"
                                        required
                                    />
                                </Field>

                                {error && (
                                    <p className="text-sm font-medium text-destructive text-center">
                                        {error}
                                    </p>
                                )}

                                <Field>
                                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                                        {isSubmitting ? 'Creating account…' : 'Create account'}
                                    </Button>
                                    <FieldDescription className="text-center">
                                        Already have an account? <Link to="/login" className="underline underline-offset-4">Log in</Link>
                                    </FieldDescription>
                                </Field>
                            </FieldGroup>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
