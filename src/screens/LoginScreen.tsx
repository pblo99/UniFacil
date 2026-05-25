import { useState } from 'react';
import { Eye, EyeOff, KeyRound, Mail } from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';
import logo from '../assets/logo.svg';

interface LoginScreenProps {
  onLogin: (identifier: string) => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [helperText, setHelperText] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!identifier.trim() || !password.trim()) {
      setError('Preencha RA ou e-mail e senha para continuar.');
      setHelperText('');
      return;
    }

    setError('');
    onLogin(identifier.trim());
  };

  const showPrototypeHint = (message: string) => {
    setHelperText(message);
    setError('');
  };

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col justify-center overflow-y-auto px-6 py-8">
      <div className="mx-auto w-full max-w-sm rounded-[28px] bg-white p-6 shadow-card">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-primary-light">
            <img src={logo} alt="Logo UniFácil" className="h-10 w-10" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-text-primary">UniFácil</h1>
            <p className="mt-1 text-sm text-text-secondary">Faça login para continuar</p>
          </div>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            id="login-identifier"
            label="RA ou e-mail"
            placeholder="Digite seu RA ou e-mail"
            value={identifier}
            onChange={(event) => setIdentifier(event.target.value)}
            autoComplete="username"
            icon={<Mail className="h-4 w-4" />}
            error={error ? ' ' : undefined}
          />
          <Input
            id="login-password"
            label="Senha"
            placeholder="Digite sua senha"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            icon={<KeyRound className="h-4 w-4" />}
            rightSlot={
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="rounded-full p-1 transition hover:bg-slate-100"
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
          />
          {error ? <p className="-mt-1 text-sm font-medium text-danger">{error}</p> : null}
          {helperText ? <p className="-mt-1 text-sm font-medium text-primary">{helperText}</p> : null}
          <Button fullWidth type="submit">
            Entrar
          </Button>
        </form>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => showPrototypeHint('No protótipo, basta preencher os campos para entrar.')}
            className="text-sm font-semibold text-primary transition hover:text-primary-dark"
          >
            Esqueci minha senha
          </button>
        </div>

        <div className="my-6 flex items-center gap-3 text-sm text-text-secondary">
          <span className="h-px flex-1 bg-border" />
          <span>ou</span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <button
          type="button"
          onClick={() => showPrototypeHint('Para esta apresentação, use qualquer RA ou e-mail com uma senha preenchida.')}
          className="w-full rounded-button border border-border px-4 py-3 text-sm font-semibold text-text-primary transition hover:border-primary/30 hover:text-primary"
        >
          Criar conta
        </button>
      </div>
    </div>
  );
}
